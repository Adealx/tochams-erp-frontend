import { ReactNode } from "react";
import type {
  ColumnSize,
} from "./constants";
/* ============================================================
   COLUMN TYPES
============================================================ */

export type ColumnAlign =
  | "left"
  | "center"
  | "right";

/* ============================================================
   COLUMN
============================================================ */

export interface Column<
  T extends Record<string, any>
> {
  key: keyof T | string;

  title: string;

  sortable?: boolean;

  hidden?: boolean;

  render?: (
    row: T,
    index: number
  ) => ReactNode;

  headerRender?: () => ReactNode;

  /* ---------- Layout ---------- */

  size?: ColumnSize;

  width?: number | string;

  minWidth?: number | string;

  maxWidth?: number | string;

  align?: ColumnAlign;

  /* ---------- Styling ---------- */

  className?: string;

  headerClassName?: string;

  cellClassName?: string;
}

/* ============================================================
   DATA TABLE
============================================================ */

export interface DataTableProps<
  T extends Record<string, any>
> {
  columns: Column<T>[];

  data: T[];

  rowKey?:
    | keyof T
    | ((row: T) => string | number);

  loading?: boolean;

  searchable?: boolean;

  selectable?: boolean;

  striped?: boolean;

  hover?: boolean;

  searchPlaceholder?: string;

  toolbar?: ReactNode;

  footer?: ReactNode;

  emptyMessage?: string;

  pageSize?: number;

  className?: string;
}

/* ============================================================
   TOOLBAR
============================================================ */

export interface DataTableToolbarProps {
  searchable?: boolean;

  searchPlaceholder?: string;

  search: string;

  onSearchChange: (
    value: string
  ) => void;

  recordCount: number;

  toolbar?: ReactNode;
}

/* ============================================================
   HEADER
============================================================ */

export interface DataTableHeaderProps<
  T extends Record<string, any>
> {
  columns: Column<T>[];

  sortKey: keyof T | string | null;

  ascending: boolean;

  checked: boolean;

  selectable?: boolean;

  onToggleAll: () => void;

  onSort: (
    key: keyof T | string
  ) => void;
}

/* ============================================================
   BODY
============================================================ */

export interface DataTableBodyProps<
  T extends Record<string, any>
> {
  columns: Column<T>[];

  data: T[];

  rowKey?:
    | keyof T
    | ((row: T) => string | number);

  loading?: boolean;

  selectable?: boolean;

  striped?: boolean;

  hover?: boolean;

  emptyMessage?: string;

  selectedRows: (
    | string
    | number
  )[];

  onToggleRow: (
    id: string | number
  ) => void;
}

/* ============================================================
   PAGINATION
============================================================ */

export interface PaginationProps {
  currentPage: number;

  totalPages: number;

  totalRecords: number;

  pageSize: number;

  onPageChange: (
    page: number
  ) => void;
}

/* ============================================================
   FOOTER
============================================================ */

export interface DataTableFooterProps {
  currentPage: number;

  totalPages: number;

  pageSize: number;

  totalRecords: number;

  currentRecords: number;

  onPageChange: (
    page: number
  ) => void;

  footer?: ReactNode;
}

/* ============================================================
   EMPTY STATE
============================================================ */

export interface EmptyStateProps {
  title?: string;

  description?: string;
}

/* ============================================================
   LOADING ROWS
============================================================ */

export interface LoadingRowsProps {
  columns: number;

  rows?: number;
}