"use client";

import {
  InputHTMLAttributes,
} from "react";

import clsx from "clsx";

import {
  Search,
  X,
} from "lucide-react";

interface SearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {

  onClear?: () => void;
}

export default function SearchInput({

  className,

  value,

  onClear,

  ...props

}: SearchInputProps) {

  const hasValue =
    typeof value === "string" &&
    value.length > 0;

  return (

    <div className="relative w-full">

      <Search
        size={16}
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input

        {...props}

        value={value}

        className={clsx(
          `
            h-9
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            pl-9
            pr-9
            text-sm
            text-slate-800
            placeholder:text-slate-400
            transition
            focus:border-blue-500
            focus:ring-3
            focus:ring-blue-500/10
          `,
          className
        )}

      />

      {hasValue && onClear && (

        <button

          type="button"

          onClick={onClear}

          className="
            absolute
            right-2
            top-1/2
            -translate-y-1/2
            rounded-md
            p-1
            text-slate-400
            hover:bg-slate-100
            hover:text-slate-700
          "
        >

          <X size={14} />

        </button>

      )}

    </div>

  );
}