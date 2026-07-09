"use client";

import SearchInput from "@/components/ui/SearchInput";

import {
  DataTableToolbarProps,
} from "./types";


export default function DataTableToolbar({
  searchable = true,
  searchPlaceholder = "Search records...",
  search,
  onSearchChange,
  recordCount,
  toolbar,
}: DataTableToolbarProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        border-b
        border-slate-200
        bg-white
        p-6

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      {/* Left */}

      <div
        className="
          flex
          flex-1
          items-center
          gap-4
        "
      >
        {searchable && (
          <div className="w-full max-w-md">
            <SearchInput
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              onClear={() =>
                onSearchChange("")
              }
            />
          </div>
        )}
      </div>

      {/* Right */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-end
          gap-3
        "
      >
        {toolbar}

        <span
          className="
            whitespace-nowrap
            rounded-xl
            bg-slate-100
            px-4
            py-2
            text-sm
            font-medium
            text-slate-600
          "
        >
          {recordCount} Records
        </span>
      </div>
    </div>
  );
}