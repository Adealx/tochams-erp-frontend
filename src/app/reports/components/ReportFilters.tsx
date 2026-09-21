"use client";

import {
  CalendarDays,
  Download,
  Filter,
} from "lucide-react";

export default function ReportFilters() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        p-4
        shadow-[0_4px_18px_rgba(15,23,42,0.035)]
        sm:p-5
      "
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Filter label */}
        <div className="flex items-center gap-2 lg:mr-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Filter size={15} />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900">
              Report Filters
            </p>

            <p className="text-[10px] text-slate-400">
              Configure reporting period
            </p>
          </div>
        </div>

        {/* Period */}
        <div className="relative min-w-0 flex-1">
          <CalendarDays
            size={14}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <select
            defaultValue="Today"
            className="
              w-full
              appearance-none
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-9
              py-2.5
              text-xs
              font-semibold
              text-slate-700
              outline-none
              transition
              focus:border-blue-400
              focus:bg-white
              focus:ring-2
              focus:ring-blue-500/10
            "
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Department */}
        <div className="min-w-0 flex-1">
          <select
            defaultValue="All Departments"
            className="
              w-full
              appearance-none
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-3
              py-2.5
              text-xs
              font-semibold
              text-slate-700
              outline-none
              transition
              focus:border-blue-400
              focus:bg-white
              focus:ring-2
              focus:ring-blue-500/10
            "
          >
            <option>All Departments</option>
          </select>
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={() => window.print()}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-950
            px-4
            py-2.5
            text-xs
            font-bold
            text-white
            shadow-sm
            transition
            hover:bg-slate-800
            focus:outline-none
            focus:ring-2
            focus:ring-slate-950/20
          "
        >
          <Download size={14} />
          Export / Print
        </button>
      </div>
    </div>
  );
}