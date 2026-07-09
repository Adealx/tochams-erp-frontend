"use client";

import {
  Plus,
  Download,
  RefreshCw,
} from "lucide-react";

interface ProcurementHeaderProps {
  onCreate?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export default function ProcurementHeader({
  onCreate,
  onRefresh,
  onExport,
}: ProcurementHeaderProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-6

        rounded-3xl
        border
        border-slate-200
        bg-white
        p-8
        shadow-sm

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      {/* Left */}

      <div>

        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-widest
            text-blue-600
          "
        >
          Procurement Management
        </p>

        <h2
          className="
            mt-2
            text-3xl
            font-bold
            text-slate-900
          "
        >
          Purchase Orders
        </h2>

        <p
          className="
            mt-3
            max-w-2xl
            text-slate-500
            leading-7
          "
        >
          Create, approve and manage purchase orders,
          vendor procurement and inventory replenishment
          from one place.
        </p>

      </div>

      {/* Right */}

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >

        <button
          onClick={onRefresh}
          className="
            flex
            items-center
            gap-2

            rounded-xl
            border
            border-slate-300

            px-5
            py-3

            font-medium

            text-slate-700

            transition

            hover:bg-slate-100
          "
        >
          <RefreshCw size={18} />

          Refresh

        </button>

        <button
          onClick={onExport}
          className="
            flex
            items-center
            gap-2

            rounded-xl

            border
            border-slate-300

            px-5
            py-3

            font-medium

            text-slate-700

            transition

            hover:bg-slate-100
          "
        >
          <Download size={18} />

          Export

        </button>

        <button
          onClick={onCreate}
          className="
            flex
            items-center
            gap-2

            rounded-xl

            bg-blue-600

            px-6
            py-3

            font-semibold

            text-white

            shadow-md

            transition

            hover:bg-blue-700
          "
        >
          <Plus size={18} />

          New Purchase Order

        </button>

      </div>

    </div>
  );
}