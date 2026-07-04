import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700",

    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200",

    success:
      "bg-emerald-600 text-white hover:bg-emerald-700",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    outline:
      "border border-slate-300 bg-white hover:bg-slate-50",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",

    md: "h-11 px-5 text-sm",

    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={twMerge(
        clsx(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full"
        ),
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}