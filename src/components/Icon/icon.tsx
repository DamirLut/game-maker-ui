import type { ComponentType, SVGProps } from "react";
import type { UiSize } from "#/types";
import { cn } from "#lib/classname";
import Style from "./icon.module.scss";

export type IconSize = UiSize;

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  svg: ComponentType<SVGProps<SVGSVGElement>>;
  size?: IconSize;
};

export function Icon({
  svg: Svg,
  size = "md",
  className,
  ...props
}: IconProps) {
  return <Svg className={cn(Style.icon, Style[size], className)} {...props} />;
}
