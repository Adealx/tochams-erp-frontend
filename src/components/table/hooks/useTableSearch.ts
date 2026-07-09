"use client";

import { useMemo, useState } from "react";

export default function useTableSearch<
  T extends Record<string, any>
>(
  data: T[]
) {
  const [search, setSearch] =
    useState("");

  const filteredData = useMemo(() => {

    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {

      return data;

    }

    return data.filter((row) =>

      Object.values(row).some((value) => {

        if (
          value === null ||
          value === undefined
        ) {
          return false;
        }

        if (
          typeof value === "object"
        ) {
          return false;
        }

        return String(value)
          .toLowerCase()
          .includes(keyword);

      })

    );

  }, [
    data,
    search,
  ]);

  return {

    search,

    setSearch,

    filteredData,

  };

}