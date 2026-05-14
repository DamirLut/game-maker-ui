import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { useWindowContext, Window } from "./window";

function dispatchPointer(
  target: EventTarget,
  type: string,
  clientX: number,
  clientY: number,
) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      button: 0,
      buttons: 1,
      clientX,
      clientY,
    }),
  );
}

async function waitForFrame() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

async function waitForAnimation() {
  await new Promise((resolve) => setTimeout(resolve, 220));
}

function ContextProbe() {
  const context = useWindowContext();

  return (
    <button type="button" onClick={() => context.setCollapsed(true)}>
      Collapse from context
    </button>
  );
}

function InvalidContextProbe() {
  useWindowContext();
  return null;
}

describe("Window", () => {
  it("passes root div attributes and size props", async () => {
    const { container } = await render(
      <Window
        id="window-root"
        className="custom-window"
        data-testid="window-root"
        width={360}
        height={240}
        minWidth={280}
        minHeight={120}
        style={{ color: "rgb(255, 0, 0)" }}
      >
        <Window.Header title="Window" />
        <Window.Body>Body</Window.Body>
      </Window>,
    );

    const root = container.firstElementChild as HTMLElement;

    expect(root.id).toBe("window-root");
    expect(root.dataset.testid).toBe("window-root");
    expect(root.className).toContain("custom-window");
    expect(root.style.width).toBe("360px");
    expect(root.style.height).toBe("240px");
    expect(root.style.minWidth).toBe("280px");
    expect(root.style.minHeight).toBe("120px");
    expect(root.style.color).toBe("rgb(255, 0, 0)");
  });

  it("renders ReactNode title and passes header/body attributes", async () => {
    const { container } = await render(
      <Window>
        <Window.Header
          data-testid="window-header"
          title={<span data-testid="title-node">Node title</span>}
        />
        <Window.Body data-testid="window-body">Body content</Window.Body>
      </Window>,
    );

    expect(
      container.querySelector('[data-testid="title-node"]')?.textContent,
    ).toBe("Node title");
    expect(container.querySelector('[data-testid="window-header"]')).not.toBe(
      null,
    );
    expect(container.querySelector('[data-testid="window-body"]')).not.toBe(
      null,
    );
  });

  it("wires title id to aria-labelledby", async () => {
    const { container } = await render(
      <Window
        role="dialog"
        aria-labelledby="custom-window-title"
        titleId="custom-window-title"
      >
        <Window.Header title="Accessible title" />
        <Window.Body>Body content</Window.Body>
      </Window>,
    );
    const root = container.firstElementChild as HTMLElement;
    const title = container.querySelector("#custom-window-title");

    expect(root.getAttribute("aria-labelledby")).toBe("custom-window-title");
    expect(title?.textContent).toBe("Accessible title");
  });

  it("collapses in uncontrolled mode", async () => {
    const screen = await render(
      <Window>
        <Window.Header title="Window" collapsible />
        <Window.Body data-testid="window-body">Body</Window.Body>
      </Window>,
    );
    const body = screen.container.querySelector(
      '[data-testid="window-body"]',
    ) as HTMLElement;

    expect(body.dataset.collapsed).toBe(undefined);

    await screen.getByRole("button", { name: "Collapse window" }).click();

    expect(body.dataset.collapsed).toBe("true");
    expect(body.getAttribute("aria-hidden")).toBe("true");
    expect(body.getAttribute("inert")).toBe("");
  });

  it("exposes collapsed state through aria-expanded", async () => {
    const screen = await render(
      <Window>
        <Window.Header title="Window" collapsible />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const collapseButton = screen.getByRole("button", {
      name: "Collapse window",
    });

    await expect
      .element(collapseButton)
      .toHaveAttribute("aria-expanded", "true");

    await collapseButton.click();

    await expect
      .element(screen.getByRole("button", { name: "Expand window" }))
      .toHaveAttribute("aria-expanded", "false");
  });

  it("uses controlled collapse state", async () => {
    const onCollapsedChange = vi.fn();
    const screen = await render(
      <Window collapsed={false} onCollapsedChange={onCollapsedChange}>
        <Window.Header title="Window" collapsible />
        <Window.Body data-testid="window-body">Body</Window.Body>
      </Window>,
    );
    const body = screen.container.querySelector(
      '[data-testid="window-body"]',
    ) as HTMLElement;

    await screen.getByRole("button", { name: "Collapse window" }).click();

    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(body.dataset.collapsed).toBe(undefined);

    await screen.rerender(
      <Window collapsed onCollapsedChange={onCollapsedChange}>
        <Window.Header title="Window" collapsible />
        <Window.Body data-testid="window-body">Body</Window.Body>
      </Window>,
    );

    expect(body.dataset.collapsed).toBe("true");
  });

  it("calls onClose from close button", async () => {
    const onClose = vi.fn();
    const screen = await render(
      <Window>
        <Window.Header title="Window" closable onClose={onClose} />
        <Window.Body>Body</Window.Body>
      </Window>,
    );

    await screen.getByRole("button", { name: "Close window" }).click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("exposes collapse control through context", async () => {
    const screen = await render(
      <Window>
        <Window.Header title="Window" />
        <Window.Body data-testid="window-body">
          <ContextProbe />
        </Window.Body>
      </Window>,
    );
    const body = screen.container.querySelector(
      '[data-testid="window-body"]',
    ) as HTMLElement;

    await screen.getByRole("button", { name: "Collapse from context" }).click();

    expect(body.dataset.collapsed).toBe("true");
  });

  it("sets height constraints to header height while collapsed", async () => {
    const screen = await render(
      <Window height={240} minHeight={180}>
        <Window.Header title="Window" collapsible />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = screen.container.firstElementChild as HTMLElement;

    expect(root.style.height).toBe("240px");
    expect(root.style.minHeight).toBe("180px");

    await screen.getByRole("button", { name: "Collapse window" }).click();
    await waitForAnimation();

    expect(getComputedStyle(root).height).toBe("28px");
    expect(getComputedStyle(root).minHeight).toBe("28px");
  });

  it("overrides resized inline height while collapsed", async () => {
    const screen = await render(
      <Window resizable>
        <Window.Header title="Window" collapsible />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = screen.container.firstElementChild as HTMLElement;

    root.style.height = "420px";

    await screen.getByRole("button", { name: "Collapse window" }).click();
    await waitForAnimation();

    expect(getComputedStyle(root).height).toBe("28px");
  });

  it("disables native resize while collapsed", async () => {
    const screen = await render(
      <Window resizable>
        <Window.Header title="Window" collapsible />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = screen.container.firstElementChild as HTMLElement;

    expect(getComputedStyle(root).resize).toBe("both");

    await screen.getByRole("button", { name: "Collapse window" }).click();
    await waitForFrame();

    expect(getComputedStyle(root).resize).toBe("none");
  });

  it("keeps collapsed minimum height equal to header height", async () => {
    const screen = await render(
      <Window defaultCollapsed>
        <Window.Header title="Window" collapsible data-testid="window-header" />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = screen.container.firstElementChild as HTMLElement;
    const header = screen.container.querySelector(
      '[data-testid="window-header"]',
    ) as HTMLElement;

    expect(getComputedStyle(root).minHeight).toBe(
      getComputedStyle(header).minHeight,
    );
  });

  it("marks the latest interacted window as active and raises it", async () => {
    const screen = await render(
      <div>
        <Window data-testid="first-window">
          <Window.Header title="First" data-testid="first-header" />
          <Window.Body>First body</Window.Body>
        </Window>
        <Window data-testid="second-window">
          <Window.Header title="Second" data-testid="second-header" />
          <Window.Body>Second body</Window.Body>
        </Window>
      </div>,
    );
    const firstWindow = screen.container.querySelector(
      '[data-testid="first-window"]',
    ) as HTMLElement;
    const secondWindow = screen.container.querySelector(
      '[data-testid="second-window"]',
    ) as HTMLElement;
    const firstHeader = screen.container.querySelector(
      '[data-testid="first-header"]',
    ) as HTMLElement;
    const secondHeader = screen.container.querySelector(
      '[data-testid="second-header"]',
    ) as HTMLElement;

    dispatchPointer(firstHeader, "pointerdown", 10, 10);
    await waitForFrame();

    expect(firstWindow.className).toContain("active");
    expect(secondWindow.className).not.toContain("active");
    expect(getComputedStyle(firstWindow).zIndex).toBe("1");

    dispatchPointer(secondHeader, "pointerdown", 10, 10);
    await waitForFrame();

    expect(firstWindow.className).not.toContain("active");
    expect(secondWindow.className).toContain("active");
    expect(getComputedStyle(secondWindow).zIndex).toBe("1");
  });

  it("deactivates when pointer down happens outside the window", async () => {
    const screen = await render(
      <Window data-testid="window-root">
        <Window.Header title="Window" data-testid="window-header" />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = screen.container.querySelector(
      '[data-testid="window-root"]',
    ) as HTMLElement;
    const header = screen.container.querySelector(
      '[data-testid="window-header"]',
    ) as HTMLElement;

    dispatchPointer(header, "pointerdown", 10, 10);
    await waitForFrame();

    expect(root.className).toContain("active");

    dispatchPointer(document.body, "pointerdown", 10, 10);
    await waitForFrame();

    expect(root.className).not.toContain("active");
  });

  it("throws when context hook is used outside Window", async () => {
    await expect(render(<InvalidContextProbe />)).rejects.toThrow(
      "useWindowContext must be used inside Window.",
    );
  });

  it("enables native resize on demand", async () => {
    const { container } = await render(
      <Window resizable>
        <Window.Header title="Window" />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = container.firstElementChild as HTMLElement;

    expect(getComputedStyle(root).resize).toBe("both");
  });

  it("limits touch-action none to draggable header", async () => {
    const { container } = await render(
      <Window draggable>
        <Window.Header title="Window" data-testid="window-header" />
        <Window.Body data-testid="window-body">Body</Window.Body>
      </Window>,
    );
    const root = container.firstElementChild as HTMLElement;
    const header = container.querySelector(
      '[data-testid="window-header"]',
    ) as HTMLElement;
    const body = container.querySelector(
      '[data-testid="window-body"]',
    ) as HTMLElement;

    expect(getComputedStyle(root).touchAction).not.toBe("none");
    expect(getComputedStyle(header).touchAction).toBe("none");
    expect(getComputedStyle(body).touchAction).not.toBe("none");
  });

  it("does not move when draggable is disabled", async () => {
    const { container } = await render(
      <Window>
        <Window.Header title="Window" data-testid="window-header" />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = container.firstElementChild as HTMLElement;
    const header = container.querySelector(
      '[data-testid="window-header"]',
    ) as HTMLElement;

    dispatchPointer(header, "pointerdown", 10, 10);
    dispatchPointer(document, "pointermove", 40, 35);
    dispatchPointer(document, "pointerup", 40, 35);

    expect(root.style.transform).toBe("translate(0px, 0px)");
  });

  it("moves in uncontrolled draggable mode", async () => {
    const { container } = await render(
      <Window draggable>
        <Window.Header title="Window" data-testid="window-header" />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = container.firstElementChild as HTMLElement;
    const header = container.querySelector(
      '[data-testid="window-header"]',
    ) as HTMLElement;

    dispatchPointer(header, "pointerdown", 10, 10);
    await waitForFrame();
    dispatchPointer(document, "pointermove", 40, 35);
    dispatchPointer(document, "pointerup", 40, 35);
    await waitForFrame();
    await waitForFrame();

    expect(root.style.transform).toBe("translate(30px, 25px)");
  });

  it("reports position changes in controlled draggable mode", async () => {
    const onPositionChange = vi.fn();
    const { container } = await render(
      <Window
        draggable
        position={{ x: 5, y: 7 }}
        onPositionChange={onPositionChange}
      >
        <Window.Header title="Window" data-testid="window-header" />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = container.firstElementChild as HTMLElement;
    const header = container.querySelector(
      '[data-testid="window-header"]',
    ) as HTMLElement;

    dispatchPointer(header, "pointerdown", 10, 10);
    await waitForFrame();
    dispatchPointer(document, "pointermove", 40, 35);
    dispatchPointer(document, "pointerup", 40, 35);
    await waitForFrame();

    expect(onPositionChange).toHaveBeenCalledWith({ x: 35, y: 32 });
    expect(root.style.transform).toBe("translate(5px, 7px)");
  });

  it("does not start drag from header controls", async () => {
    const { container } = await render(
      <Window draggable>
        <Window.Header title="Window" data-testid="window-header" closable />
        <Window.Body>Body</Window.Body>
      </Window>,
    );
    const root = container.firstElementChild as HTMLElement;
    const closeButton = container.querySelector(
      'button[aria-label="Close window"]',
    ) as HTMLElement;

    dispatchPointer(closeButton, "pointerdown", 10, 10);
    dispatchPointer(document, "pointermove", 40, 35);
    dispatchPointer(document, "pointerup", 40, 35);

    expect(root.style.transform).toBe("translate(0px, 0px)");
  });
});
