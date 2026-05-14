import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  createContext,
  type ForwardRefExoticComponent,
  forwardRef,
  type PointerEvent,
  type ReactNode,
  type RefAttributes,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconClose } from "#/assets/icons";
import { Icon } from "#components/Icon";
import { IconButton } from "#components/IconButton";
import { cn } from "#lib/classname";
import Style from "./window.module.scss";

export type WindowPosition = {
  x: number;
  y: number;
};

export type WindowProps = ComponentPropsWithoutRef<"div"> & {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  draggable?: boolean;
  position?: WindowPosition;
  defaultPosition?: WindowPosition;
  onPositionChange?: (position: WindowPosition) => void;
  resizable?: boolean;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  minWidth?: CSSProperties["minWidth"];
  minHeight?: CSSProperties["minHeight"];
  titleId?: string;
};

export type WindowHeaderProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "title"
> & {
  title?: ReactNode;
  collapsible?: boolean;
  closable?: boolean;
  onClose?: () => void;
};

export type WindowBodyProps = ComponentPropsWithoutRef<"div">;

type WindowContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  draggable: boolean;
  resizable: boolean;
  position: WindowPosition;
  setPosition: (position: WindowPosition) => void;
  titleId: string;
  onHeaderPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
};

type WindowComponent = ForwardRefExoticComponent<
  WindowProps & RefAttributes<HTMLDivElement>
> & {
  Header: ForwardRefExoticComponent<
    WindowHeaderProps & RefAttributes<HTMLDivElement>
  >;
  Body: ForwardRefExoticComponent<
    WindowBodyProps & RefAttributes<HTMLDivElement>
  >;
};

const WindowContext = createContext<WindowContextValue | null>(null);

export function useWindowContext() {
  const context = useContext(WindowContext);

  if (!context) {
    throw new Error("useWindowContext must be used inside Window.");
  }

  return context;
}

function isInteractiveDragTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      "button, a, input, textarea, select, [data-window-drag-ignore]",
    ),
  );
}

const WindowRoot = forwardRef<HTMLDivElement, WindowProps>(function WindowRoot(
  {
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    draggable = false,
    position,
    defaultPosition: initialPosition = { x: 0, y: 0 },
    onPositionChange,
    resizable = false,
    width,
    height,
    minWidth,
    minHeight,
    titleId,
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const isCollapsedControlled = collapsed !== undefined;
  const isPositionControlled = position !== undefined;
  const reactId = useId();
  const windowId = useRef(reactId);
  const resolvedTitleId = titleId ?? `${reactId}-title`;
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState(defaultCollapsed);
  const [uncontrolledPosition, setUncontrolledPosition] = useState(
    () => initialPosition,
  );
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(false);
  const currentPositionRef = useRef<WindowPosition>(initialPosition);
  const rafRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<WindowPosition | null>(null);
  const cleanupDragRef = useRef<(() => void) | null>(null);
  const currentCollapsed = isCollapsedControlled
    ? collapsed
    : uncontrolledCollapsed;
  const currentPosition = isPositionControlled
    ? position
    : uncontrolledPosition;
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: WindowPosition;
  } | null>(null);

  activeRef.current = active;
  currentPositionRef.current = currentPosition;

  useEffect(() => {
    function handleDocumentPointerDown(event: Event) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setActive(false);
      }
    }

    function handleWindowActivate(event: Event) {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const isActive = event.detail === windowId.current;
      activeRef.current = isActive;
      setActive(isActive);
    }

    window.addEventListener("pointerdown", handleDocumentPointerDown, true);
    window.addEventListener("gmui-window-activate", handleWindowActivate);

    return () => {
      window.removeEventListener(
        "pointerdown",
        handleDocumentPointerDown,
        true,
      );
      window.removeEventListener("gmui-window-activate", handleWindowActivate);
    };
  }, []);

  useEffect(() => {
    return () => {
      cleanupDragRef.current?.();

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  function setRootRef(node: HTMLDivElement | null) {
    rootRef.current = node;

    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }

  const activateWindow = useCallback(() => {
    if (activeRef.current) {
      return;
    }

    activeRef.current = true;
    setActive(true);
    window.dispatchEvent(
      new CustomEvent("gmui-window-activate", { detail: windowId.current }),
    );
  }, []);

  const setCollapsedState = useCallback(
    (nextCollapsed: boolean) => {
      if (!isCollapsedControlled) {
        setUncontrolledCollapsed(nextCollapsed);
      }

      onCollapsedChange?.(nextCollapsed);
    },
    [isCollapsedControlled, onCollapsedChange],
  );

  const setPositionState = useCallback(
    (nextPosition: WindowPosition) => {
      if (!isPositionControlled) {
        setUncontrolledPosition(nextPosition);
      }

      onPositionChange?.(nextPosition);
    },
    [isPositionControlled, onPositionChange],
  );

  const schedulePositionUpdate = useCallback(
    (nextPosition: WindowPosition) => {
      pendingPositionRef.current = nextPosition;

      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        if (pendingPositionRef.current) {
          setPositionState(pendingPositionRef.current);
          pendingPositionRef.current = null;
        }
      });
    },
    [setPositionState],
  );

  const handleHeaderPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        !draggable ||
        event.button !== 0 ||
        isInteractiveDragTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      cleanupDragRef.current?.();
      dragState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: currentPositionRef.current,
      };

      function handlePointerMove(event: globalThis.PointerEvent) {
        const currentDrag = dragState.current;

        if (!currentDrag || event.pointerId !== currentDrag.pointerId) {
          return;
        }

        schedulePositionUpdate({
          x: currentDrag.origin.x + event.clientX - currentDrag.startX,
          y: currentDrag.origin.y + event.clientY - currentDrag.startY,
        });
      }

      function cleanupDrag() {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", cleanupDrag);
        document.removeEventListener("pointercancel", cleanupDrag);
        dragState.current = null;
        cleanupDragRef.current = null;
      }

      cleanupDragRef.current = cleanupDrag;
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", cleanupDrag);
      document.addEventListener("pointercancel", cleanupDrag);
    },
    [draggable, schedulePositionUpdate],
  );

  const context = useMemo<WindowContextValue>(() => {
    return {
      collapsed: currentCollapsed,
      setCollapsed: setCollapsedState,
      draggable,
      resizable: resizable && !currentCollapsed,
      position: currentPosition,
      setPosition: setPositionState,
      titleId: resolvedTitleId,
      onHeaderPointerDown: handleHeaderPointerDown,
    };
  }, [
    currentCollapsed,
    currentPosition,
    draggable,
    handleHeaderPointerDown,
    resizable,
    resolvedTitleId,
    setCollapsedState,
    setPositionState,
  ]);

  const canResize = resizable && !currentCollapsed;
  const windowStyle: CSSProperties = {
    width,
    height,
    minWidth,
    minHeight,
    ...style,
    transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)${
      style?.transform ? ` ${style.transform}` : ""
    }`,
  };

  return (
    <WindowContext.Provider value={context}>
      <div
        {...props}
        ref={setRootRef}
        className={cn(
          Style.window,
          canResize && Style.resizable,
          draggable && Style.draggable,
          active && Style.active,
          currentCollapsed && Style.collapsed,
          className,
        )}
        style={windowStyle}
        onPointerDownCapture={activateWindow}
      >
        {children}
      </div>
    </WindowContext.Provider>
  );
});

const WindowHeader = forwardRef<HTMLDivElement, WindowHeaderProps>(
  function WindowHeader(
    {
      title,
      collapsible = false,
      closable = false,
      onClose,
      className,
      children,
      onPointerDown,
      ...props
    },
    ref,
  ) {
    const context = useWindowContext();

    function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
      onPointerDown?.(event);

      if (!event.defaultPrevented) {
        context.onHeaderPointerDown(event);
      }
    }

    return (
      <div
        {...props}
        ref={ref}
        className={cn(Style.header, className)}
        onPointerDown={handlePointerDown}
      >
        <div className={Style.title}>
          {collapsible && (
            <IconButton
              aria-label={
                context.collapsed ? "Expand window" : "Collapse window"
              }
              aria-expanded={!context.collapsed}
              size="sm"
              variant="ghost"
              icon={<span className={Style["collapse-icon"]} />}
              onClick={() => context.setCollapsed(!context.collapsed)}
              data-window-drag-ignore
            />
          )}
          {title !== undefined && (
            <div id={context.titleId} className={Style["title-content"]}>
              {title}
            </div>
          )}
          {children}
        </div>
        {closable && (
          <IconButton
            aria-label="Close window"
            size="sm"
            variant="ghost"
            icon={<Icon svg={IconClose} size="sm" aria-hidden="true" />}
            onClick={onClose}
            data-window-drag-ignore
          />
        )}
      </div>
    );
  },
);

const WindowBody = forwardRef<HTMLDivElement, WindowBodyProps>(
  function WindowBody({ className, children, ...props }, ref) {
    const context = useWindowContext();

    return (
      <div
        {...props}
        ref={ref}
        className={cn(Style.body, className)}
        aria-hidden={context.collapsed}
        data-collapsed={context.collapsed ? "true" : undefined}
        inert={context.collapsed ? true : undefined}
      >
        <div className={Style["body-content"]}>{children}</div>
      </div>
    );
  },
);

export const Window = WindowRoot as WindowComponent;

Window.Header = WindowHeader;
Window.Body = WindowBody;
