"use client";

import {
  useMemo,
  useState,
} from "react";

export default function useTableSorting<
  T extends Record<string, any>
>(
  data: T[]
) {

  /* ==========================================
     STATE
  ========================================== */

  const [sortKey, setSortKey] =
    useState<keyof T | string | null>(
      null
    );

  const [ascending, setAscending] =
    useState(true);

  /* ==========================================
     SORT
  ========================================== */

  const toggleSort = (
    key: keyof T | string
  ) => {

    if (sortKey === key) {

      setAscending((prev) => !prev);

    } else {

      setSortKey(key);

      setAscending(true);

    }

  };

  /* ==========================================
     SORTED DATA
  ========================================== */

  const sortedData = useMemo(() => {

    if (!sortKey) {

      return data;

    }

    const sorted = [...data];

    sorted.sort((a, b) => {

      const aValue =
        a[
          sortKey as keyof T
        ];

      const bValue =
        b[
          sortKey as keyof T
        ];

      /* -----------------------------
         NULLS
      ------------------------------ */

      if (
        aValue == null &&
        bValue == null
      )
        return 0;

      if (aValue == null)
        return 1;

      if (bValue == null)
        return -1;

      /* -----------------------------
         NUMBERS
      ------------------------------ */

      if (
        typeof aValue ===
          "number" &&
        typeof bValue ===
          "number"
      ) {

        return ascending
          ? aValue - bValue
          : bValue - aValue;

      }

      /* -----------------------------
         DATES
      ------------------------------ */

      const aDate = Date.parse(
        String(aValue)
      );

      const bDate = Date.parse(
        String(bValue)
      );

      if (
        !isNaN(aDate) &&
        !isNaN(bDate)
      ) {

        return ascending
          ? aDate - bDate
          : bDate - aDate;

      }

      /* -----------------------------
         BOOLEANS
      ------------------------------ */

      if (
        typeof aValue ===
          "boolean" &&
        typeof bValue ===
          "boolean"
      ) {

        return ascending
          ? Number(aValue) -
              Number(bValue)
          : Number(bValue) -
              Number(aValue);

      }

      /* -----------------------------
         STRINGS
      ------------------------------ */

      const comparison =
        String(aValue).localeCompare(
          String(bValue),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        );

      return ascending
        ? comparison
        : -comparison;

    });

    return sorted;

  }, [
    data,
    sortKey,
    ascending,
  ]);

  /* ==========================================
     RETURN
  ========================================== */

  return {

    sortedData,

    sortKey,

    ascending,

    toggleSort,

    setSortKey,

    setAscending,

  };

}