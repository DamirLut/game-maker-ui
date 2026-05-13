import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { UiSize } from "#/types";
import { cn } from "#lib/classname";
import Style from "./button.module.scss";

export type ButtonSize = UiSize;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: ButtonSize;
};

export function Button({
  children,
  leftIcon,
  rightIcon,
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const buttonClassName = cn(Style.button, Style[size], className);
  return (
    <button className={buttonClassName} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
