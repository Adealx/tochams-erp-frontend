"use client";

import { InputHTMLAttributes } from "react";
import clsx from "clsx";
import { Search, X } from "lucide-react";

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
    typeof value === "string" && value.length > 0;

  return (
    <div className="relative w-full">

      {/* Search Icon */}

      <Search
        size={18}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        value={value}
        {...props}
        className={clsx(
          `
          h-11
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          pl-11
          pr-11
          text-sm
          text-slate-700
          placeholder:text-slate-400
          outline-none
          transition-all
          duration-200
          focus:border-blue-600
          focus:ring-4
          focus:ring-blue-100
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
            right-3
            top-1/2
            -translate-y-1/2
            rounded-md
            p-1
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
        >

          <X size={16} />

        </button>

      )}

    </div>
  );
}