"use client";

import clsx from "clsx";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

import { DataTableHeaderProps } from "./types";

export default function DataTableHeader<
  T extends Record<string, any>
>({
  columns,
  sortKey,
  ascending,
  checked,
  selectable = true,
  onToggleAll,
  onSort,
}: DataTableHeaderProps<T>) {

  const visibleColumns = columns.filter(
    (column) => !column.hidden
  );

  return (
    <thead
      className="
        sticky
        top-0
        z-10
        bg-slate-50
      "
    >
      <tr className="border-b border-slate-200">

        {/* ===============================
            SELECT ALL
        ================================ */}

        {selectable && (
          <th
            className="
              w-14
              px-5
              py-4
              text-center
              bg-slate-50
            "
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={onToggleAll}
              className="
                h-4
                w-4
                rounded
                border-slate-300
                text-blue-600
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </th>
        )}

        {/* ===============================
            HEADERS
        ================================ */}

        {visibleColumns.map((column) => {

          const active =
            sortKey === column.key;

          return (

            <th
              key={String(column.key)}
              style={{
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
              }}
              className={clsx(

                "px-8",

                "py-4",

                "text-sm",

                "font-semibold",

                "tracking-wide",

                "text-slate-600",

                "bg-slate-50",

                "whitespace-nowrap",

                column.align === "center" &&
                  "text-center",

                column.align === "right" &&
                  "text-right",

                column.headerClassName

              )}
            >

              {column.sortable ? (

                <button
                  type="button"
                  onClick={() =>
                    onSort(
                      column.key as keyof T
                    )
                  }
                  className={clsx(

                    "inline-flex",

                    "items-center",

                    "gap-2",

                    "transition-colors",

                    "duration-200",

                    active
                      ? "text-blue-600"
                      : "hover:text-blue-600"

                  )}
                >

                  {column.headerRender
                    ? column.headerRender()
                    : column.title}

                  {active ? (

                    ascending ? (

                      <ArrowUp
                        size={16}
                        strokeWidth={2.5}
                      />

                    ) : (

                      <ArrowDown
                        size={16}
                        strokeWidth={2.5}
                      />

                    )

                  ) : (

                    <ArrowUpDown
                      size={15}
                      className="
                        opacity-40
                      "
                    />

                  )}

                </button>

              ) : (

                <div
                  className={clsx(

                    column.align === "center" &&
                      "text-center",

                    column.align === "right" &&
                      "text-right"

                  )}
                >
                  {column.headerRender
                    ? column.headerRender()
                    : column.title}
                </div>

              )}

            </th>

          );

        })}

      </tr>

    </thead>
  );

}