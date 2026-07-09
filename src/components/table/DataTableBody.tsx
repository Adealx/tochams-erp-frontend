"use client";

import { memo } from "react";
import clsx from "clsx";

import EmptyState from "./EmptyState";
import LoadingRows from "./LoadingRows";

import { DataTableBodyProps } from "./types";
import { getRowId } from "./utils/getRowId";

function DataTableBody<
  T extends Record<string, any>
>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "No records found.",
  selectable = true,
  striped = true,
  hover = true,
  selectedRows,
  onToggleRow,
}: DataTableBodyProps<T>) {

  const visibleColumns = columns.filter(
    (column) => !column.hidden
  );

  /* ===========================
     LOADING
  =========================== */

  if (loading) {
    return (
      <tbody>
        <LoadingRows
          columns={
            visibleColumns.length +
            (selectable ? 1 : 0)
          }
        />
      </tbody>
    );
  }

  /* ===========================
     EMPTY
  =========================== */

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={
              visibleColumns.length +
              (selectable ? 1 : 0)
            }
          >
            <EmptyState
              description={emptyMessage}
            />
          </td>
        </tr>
      </tbody>
    );
  }

  /* ===========================
     BODY
  =========================== */

  return (
    <tbody>

      {data.map((row, rowIndex) => {

        const id = getRowId(
          row,
          rowIndex,
          rowKey
        );

        const selected =
          selectedRows.includes(id);

        return (

          <tr
            key={String(id)}
            className={clsx(

              "border-b",

              "border-slate-200",

              striped &&
                rowIndex % 2 !== 0 &&
                "bg-slate-50",

              hover &&
                "hover:bg-slate-50",

              selected &&
                "bg-blue-50"

            )}
          >

            {/* Checkbox */}

            {selectable && (

              <td
                className="
                  w-14
                  px-5
                  py-4
                  text-center
                "
              >

                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() =>
                    onToggleRow(id)
                  }
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

              </td>

            )}

            {/* Data Cells */}

            {visibleColumns.map(
              (column, columnIndex) => (

                <td
                  key={`${String(column.key)}-${columnIndex}`}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                  className={clsx(

                    "px-8",

                    "py-4",

                    "align-middle",

                    "text-sm",

                    "text-slate-700",

                    "whitespace-nowrap",

                    "overflow-hidden",

                    "text-ellipsis",

                    column.align ===
                      "center" &&
                      "text-center",

                    column.align ===
                      "right" &&
                      "text-right",

                    column.className,

                    column.cellClassName

                  )}
                >

                  {column.render
                    ? column.render(
                        row,
                        rowIndex
                      )
                    : String(
                        row[
                          column.key as keyof T
                        ] ?? ""
                      )}

                </td>

              )
            )}

          </tr>

        );

      })}

    </tbody>
  );
}

export default memo(
  DataTableBody
) as typeof DataTableBody;