import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900",
    secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
    destructive: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
    outline: "text-slate-800 border border-slate-200 dark:text-slate-100 dark:border-slate-700",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}
