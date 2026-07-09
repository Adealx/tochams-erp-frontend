"use client";

import {
  Search,
  RotateCcw,
  Filter,
} from "lucide-react";

interface ProcurementFiltersProps {
  search?: string;
  vendor?: string;
  status?: string;

  onSearchChange?: (
    value: string
  ) => void;

  onVendorChange?: (
    value: string
  ) => void;

  onStatusChange?: (
    value: string
  ) => void;

  onReset?: () => void;
}

export default function ProcurementFilters({
  search = "",
  vendor = "",
  status = "",

  onSearchChange,
  onVendorChange,
  onStatusChange,

  onReset,
}: ProcurementFiltersProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        p-6
      "
    >
      {/* Header */}

      <div className="flex items-center gap-3 mb-6">

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-blue-50
            text-blue-600
          "
        >
          <Filter size={20} />
        </div>

        <div>

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
            "
          >
            Filters
          </h3>

          <p className="text-sm text-slate-500">
            Search and filter purchase orders
          </p>

        </div>

      </div>

      {/* Filters */}

      <div
        className="
          grid
          gap-5

          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            value={search}
            placeholder="Search PO..."
            onChange={(e) =>
              onSearchChange?.(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              py-3
              pl-11
              pr-4
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>

        {/* Vendor */}

        <select
          value={vendor}
          onChange={(e) =>
            onVendorChange?.(
              e.target.value
            )
          }
          className="
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >
          <option value="">
            All Vendors
          </option>

          <option value="vendor1">
            Vendor One
          </option>

          <option value="vendor2">
            Vendor Two
          </option>

          <option value="vendor3">
            Vendor Three
          </option>

        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            onStatusChange?.(
              e.target.value
            )
          }
          className="
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >
          <option value="">
            All Status
          </option>

          <option value="Draft">
            Draft
          </option>

          <option value="Submitted">
            Submitted
          </option>

          <option value="Approved">
            Approved
          </option>

          <option value="Rejected">
            Rejected
          </option>

        </select>

        {/* Reset */}

        <button
          onClick={onReset}
          className="
            flex
            items-center
            justify-center
            gap-2

            rounded-xl

            border
            border-slate-300

            bg-white

            px-5
            py-3

            font-medium

            text-slate-700

            transition

            hover:bg-slate-100
          "
        >
          <RotateCcw size={18} />

          Reset Filters

        </button>

      </div>

    </div>
  );
}