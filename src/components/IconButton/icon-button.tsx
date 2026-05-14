import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { UiSize } from "#/types";
import { cn } from "#lib/classname";
import Style from "./icon-button.module.scss";

export type IconButtonSize = UiSize;
export type IconButtonVariant = "solid" | "ghost";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  "aria-label": string;
  icon: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

export function IconButton({
  icon,
  size = "md",
  variant = "solid",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(Style.button, Style[size], Style[variant], className)}
      {...props}
    >
      {icon}
    </button>
  );
}
