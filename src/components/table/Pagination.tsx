"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Button from "@/components/ui/Button";

import { PaginationProps } from "./types";

export default function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: PaginationProps) {

  const start =
    totalRecords === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const end =
    Math.min(
      start + pageSize - 1,
      totalRecords
    );

  return (

    <div
      className="
        flex
        flex-col
        gap-4

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >

      {/* Records */}

      <p className="text-sm text-slate-500">

        Showing

        <span className="font-semibold text-slate-900">

          {" "}
          {start}-{end}

        </span>

        {" "}of{" "}

        <span className="font-semibold text-slate-900">

          {totalRecords}

        </span>

        {" "}records

      </p>

      {/* Navigation */}

      <div className="flex items-center gap-2">

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
        >

          <ChevronLeft size={16} />

        </Button>

        <div
          className="
            rounded-xl
            bg-blue-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
          "
        >

          {currentPage}

        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(currentPage + 1)
          }
        >

          <ChevronRight size={16} />

        </Button>

      </div>

    </div>

  );

}