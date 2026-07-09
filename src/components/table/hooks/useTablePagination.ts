"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

export default function useTablePagination<
  T
>(
  data: T[],
  pageSize = 10
) {

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        data.length /
        pageSize
      )
    );

  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      );

    }

  }, [
    currentPage,
    totalPages,
  ]);

  const paginatedData =
    useMemo(() => {

      const start =
        (
          currentPage - 1
        ) * pageSize;

      return data.slice(
        start,
        start + pageSize
      );

    }, [
      data,
      currentPage,
      pageSize,
    ]);

  return {

    currentPage,

    setCurrentPage,

    totalPages,

    paginatedData,

    pageSize,

  };

}