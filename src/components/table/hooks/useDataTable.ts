"use client";

import { useEffect } from "react";

import useTableSearch from "./useTableSearch";
import useTableSorting from "./useTableSorting";
import useTablePagination from "./useTablePagination";
import useTableSelection from "./useTableSelection";

export default function useDataTable<
  T extends Record<string, any>
>(
  data: T[],
  pageSize: number = 10,
  rowKey?:
    | keyof T
    | ((row: T) => string | number)
) {

  /* ==========================================================
     SEARCH
  ========================================================== */

  const {
    search,
    setSearch,
    filteredData,
  } = useTableSearch(data);

  /* ==========================================================
     SORTING
  ========================================================== */

  const {
    sortedData,
    sortKey,
    ascending,
    toggleSort,
  } = useTableSorting(filteredData);

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const {
    paginatedData,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useTablePagination(
    sortedData,
    pageSize
  );

  /* ==========================================================
     SELECTION
  ========================================================== */

  const {
    selectedRows,
    toggleRow,
    toggleAll,
    rowIds,
  } = useTableSelection(
    paginatedData,
    rowKey
  );

  /* ==========================================================
     RESET PAGE ON SEARCH
  ========================================================== */

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    setCurrentPage,
  ]);

  /* ==========================================================
     RESET PAGE ON SORT
  ========================================================== */

  useEffect(() => {

    setCurrentPage(1);

  }, [
    sortKey,
    ascending,
    setCurrentPage,
  ]);

  /* ==========================================================
     RETURN
  ========================================================== */

  return {

    /* Search */

    search,
    setSearch,

    /* Sorting */

    sortKey,
    ascending,
    toggleSort,

    /* Pagination */

    currentPage,
    totalPages,
    setCurrentPage,

    /* Selection */

    selectedRows,
    toggleRow,
    toggleAll,
    rowIds,

    /* Data */

    filteredData,
    sortedData,
    paginatedData,

  };

}