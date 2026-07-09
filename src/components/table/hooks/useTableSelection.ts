"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getRowId } from "../utils/getRowId";

export default function useTableSelection<
  T extends Record<string, any>
>(
  rows: T[],
  rowKey?:
    | keyof T
    | ((row: T) => string | number)
) {

  const [
    selectedRows,
    setSelectedRows,
  ] = useState<
    (string | number)[]
  >([]);

  const rowIds =
    useMemo(() =>

      rows.map((
        row,
        index
      ) =>
        getRowId(
          row,
          index,
          rowKey
        )
      ),

    [
      rows,
      rowKey,
    ]);

  useEffect(() => {

    setSelectedRows((prev) =>

      prev.filter((id) =>

        rowIds.includes(id)

      )

    );

  }, [
    rowIds,
  ]);

  const toggleRow = (
    id: string | number
  ) => {

    setSelectedRows(
      (prev) =>

        prev.includes(id)

          ? prev.filter(
              (item) =>
                item !== id
            )

          : [
              ...prev,
              id,
            ]

    );

  };

  const toggleAll = () => {

    if (

      selectedRows.length ===
      rowIds.length

    ) {

      setSelectedRows([]);

    } else {

      setSelectedRows(
        rowIds
      );

    }

  };

  return {

    selectedRows,

    toggleRow,

    toggleAll,

    rowIds,

  };

}