import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconCheck, IconCheckIndeterminate } from "#/assets/icons";
import type { UiSize } from "#/types";
import { Icon } from "#components/Icon";
import { cn } from "#lib/classname";
import Style from "./checkbox.module.scss";

export type CheckboxState = boolean | "mixed";
export type CheckboxSize = UiSize;

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "checked" | "defaultChecked" | "size" | "type"
> & {
  checked?: CheckboxState;
  defaultChecked?: CheckboxState;
  label?: ReactNode;
  size?: CheckboxSize;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      defaultChecked = false,
      label,
      size = "md",
      className,
      onChange,
      ...props
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState<CheckboxState>(defaultChecked);
    const currentChecked = isControlled ? checked : uncontrolledChecked;
    const isMixed = currentChecked === "mixed";

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = isMixed;
      }
    }, [isMixed]);

    function setInputRef(input: HTMLInputElement | null) {
      inputRef.current = input;

      if (typeof ref === "function") {
        ref(input);
      } else if (ref) {
        ref.current = input;
      }
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      if (!isControlled) {
        setUncontrolledChecked(event.currentTarget.checked);
      }

      onChange?.(event);
    }

    const icon = isMixed ? IconCheckIndeterminate : IconCheck;

    const wrapperClassName = cn(
      Style["checkbox-wrapper"],
      Style[size],
      className,
    );

    const shouldShowIcon = currentChecked === true || isMixed;

    return (
      <label className={wrapperClassName}>
        <span className={Style["checkbox-control"]}>
          <input
            {...props}
            ref={setInputRef}
            type="checkbox"
            className={Style.checkbox}
            checked={currentChecked === true}
            aria-checked={isMixed ? "mixed" : currentChecked}
            onChange={handleChange}
          />
          {shouldShowIcon && (
            <Icon
              svg={icon}
              size={size}
              className={Style["checkbox-icon"]}
              aria-hidden="true"
            />
          )}
        </span>
        {label !== undefined && <span className={Style.label}>{label}</span>}
      </label>
    );
  },
);
