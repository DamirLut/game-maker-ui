import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { UiSize } from "#/types";
import { cn } from "#lib/classname";
import Style from "./icon-button.module.scss";

export type IconButtonSize = UiSize;

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  "aria-label": string;
  icon: ReactNode;
  size?: IconButtonSize;
};

export function IconButton({
  icon,
  size = "md",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button className={cn(Style.button, Style[size], className)} {...props}>
      {icon}
    </button>
  );
}
