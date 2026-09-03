"use client";

import clsx from "clsx";

import DataTableHeader from "./DataTableHeader";
import DataTableBody from "./DataTableBody";
import DataTableToolbar from "./DataTableToolbar";
import DataTableFooter from "./DataTableFooter";

import useDataTable from "./hooks/useDataTable";

import {
  DataTableProps,
  Column,
} from "./types";

import {
  columnSizes,
} from "./constants";

/* ===========================================
   DEFAULT COLUMN SIZES
=========================================== */

export default function DataTable<
  T extends Record<string, any>
>({
  columns,
  data,
  rowKey,

  loading = false,

  searchable = true,

  selectable = true,

  striped = true,

  hover = true,

  searchPlaceholder = "Search records...",

  toolbar,

  footer,

  emptyMessage = "No records found.",

  pageSize = 10,

  className,
}: DataTableProps<T>) {

  const table = useDataTable(
    data,
    pageSize,
    rowKey
  );

  const allSelected =
    table.paginatedData.length > 0 &&
    table.selectedRows.length ===
      table.rowIds.length;

  /* ===========================================
     APPLY DEFAULT COLUMN WIDTHS
  =========================================== */

  const normalizedColumns = columns.map(
    (column) => {

      if (column.width || column.minWidth) {
        return column;
      }

      if (column.size) {
        return {
          ...column,
          minWidth:
            columnSizes[column.size],
        };
      }

      return {
        ...column,
        minWidth:
          columnSizes.md,
      };
    }
  );

  return (

    <div
      className={clsx(

        "overflow-hidden",

        "rounded-[20px]",

        "border",

        "border-slate-200",

        "bg-white",

        "shadow-[0_6px_20px_rgba(15,23,42,.035)]",

        className

      )}
    >

      {/* ================= Toolbar ================= */}

      <DataTableToolbar
        searchable={searchable}
        search={table.search}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={table.setSearch}
        recordCount={
          table.filteredData.length
        }
        toolbar={toolbar}
      />

      {/* ================= Table ================= */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <DataTableHeader
            columns={normalizedColumns}
            sortKey={table.sortKey}
            ascending={table.ascending}
            checked={allSelected}
            selectable={selectable}
            onToggleAll={table.toggleAll}
            onSort={table.toggleSort}
          />

          <DataTableBody
            columns={normalizedColumns}
            data={table.paginatedData}
            rowKey={rowKey}
            loading={loading}
            selectable={selectable}
            striped={striped}
            hover={hover}
            emptyMessage={emptyMessage}
            selectedRows={
              table.selectedRows
            }
            onToggleRow={
              table.toggleRow
            }
          />

        </table>

      </div>

      {/* ================= Footer ================= */}

      <DataTableFooter
        currentPage={
          table.currentPage
        }
        totalPages={
          table.totalPages
        }
        pageSize={pageSize}
        totalRecords={
          table.filteredData.length
        }
        currentRecords={
          table.paginatedData.length
        }
        onPageChange={
          table.setCurrentPage
        }
        footer={footer}
      />

    </div>

  );

}

export type { Column };
