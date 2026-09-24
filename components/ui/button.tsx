import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClass = {
      default: "primary-button",
      secondary: "secondary-button",
      outline: "secondary-button",
      ghost: "ghost-button",
      danger: "danger-button",
      link: "link-button",
    }[variant];

    const sizeClass = {
      default: "",
      sm: "compact",
      lg: "min-h-[46px] px-6 text-base",
      icon: "icon-button",
    }[size];

    return (
      <button
        ref={ref}
        className={cn(variantClass, sizeClass, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
