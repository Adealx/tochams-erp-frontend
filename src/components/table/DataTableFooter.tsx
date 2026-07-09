"use client";

import Pagination from "./Pagination";

import { DataTableFooterProps } from "./types";

export default function DataTableFooter({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  footer,
}: DataTableFooterProps) {

  return (

    <>

      <div
        className="
          border-t
          border-slate-200
          bg-white
          px-6
          py-5
        "
      >

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />

      </div>

      {footer && (

        <div
          className="
            border-t
            border-slate-200
            bg-slate-50
            px-6
            py-4
          "
        >

          {footer}

        </div>

      )}

    </>

  );

}