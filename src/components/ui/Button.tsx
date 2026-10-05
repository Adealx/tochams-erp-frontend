import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {

  children: ReactNode;

  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "outline"
    | "ghost";

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

  const base = `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-lg
    font-semibold
    whitespace-nowrap
    transition-all
    duration-150
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500/20
    disabled:pointer-events-none
    disabled:opacity-50
  `;

  const variants = {

    primary: `
      bg-blue-600
      text-white
      shadow-sm
      hover:bg-blue-700
      active:bg-blue-800
    `,

    secondary: `
      bg-slate-100
      text-slate-700
      border
      border-slate-200
      hover:bg-slate-200
    `,

    success: `
      bg-emerald-600
      text-white
      shadow-sm
      hover:bg-emerald-700
    `,

    danger: `
      bg-red-600
      text-white
      shadow-sm
      hover:bg-red-700
    `,

    outline: `
      bg-white
      text-slate-700
      border
      border-slate-300
      hover:bg-slate-50
      hover:border-slate-400
    `,

    ghost: `
      bg-transparent
      text-slate-600
      hover:bg-slate-100
      hover:text-slate-900
    `,
  };

  const sizes = {

    sm: `
      h-8
      px-3
      text-xs
    `,

    md: `
      h-9
      px-4
      text-sm
    `,

    lg: `
      h-10
      px-5
      text-sm
    `,
  };

  return (

    <button

      {...props}

      disabled={disabled || loading}

      className={twMerge(
        clsx(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )
      )}

    >

      {loading ? (

        <>
          <span
            className="
              h-3.5
              w-3.5
              animate-spin
              rounded-full
              border-2
              border-white/40
              border-t-white
            "
          />

          Please wait...
        </>

      ) : children}

    </button>

  );
}