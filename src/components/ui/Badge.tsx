import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "secondary";
  size?: "sm" | "md";
  rounded?: boolean;
  className?: string;
}

export default function Badge({
  children,
  variant = "secondary",
  size = "md",
  rounded = true,
  className,
}: BadgeProps) {
  const variants = {
    primary:
      "bg-blue-100 text-blue-700 border border-blue-200",

    success:
      "bg-emerald-100 text-emerald-700 border border-emerald-200",

    warning:
      "bg-amber-100 text-amber-700 border border-amber-200",

    danger:
      "bg-red-100 text-red-700 border border-red-200",

    info:
      "bg-cyan-100 text-cyan-700 border border-cyan-200",

    secondary:
      "bg-slate-100 text-slate-700 border border-slate-200",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",

    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center font-medium",
          rounded ? "rounded-full" : "rounded-lg",
          variants[variant],
          sizes[size]
        ),
        className
      )}
    >
      {children}
    </span>
  );
}