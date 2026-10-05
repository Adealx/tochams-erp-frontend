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
      "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",

    success:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",

    warning:
      "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",

    danger:
      "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",

    info:
      "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",

    secondary:
      "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  };

  const sizes = {

    sm: "px-2 py-0.5 text-[11px]",

    md: "px-2.5 py-1 text-xs",
  };

  return (

    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 font-semibold",
          rounded
            ? "rounded-full"
            : "rounded-md",
          variants[variant],
          sizes[size]
        ),
        className
      )}
    >

      <span
        className="
          h-1.5
          w-1.5
          rounded-full
          bg-current
          opacity-70
        "
      />

      {children}

    </span>

  );
}