"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShoppingCart,
} from "lucide-react";

interface OrdersOverviewChartProps {
  totalOrders: number;
  pendingOrders: number;
}

export default function OrdersOverviewChart({
  totalOrders,
  pendingOrders,
}: OrdersOverviewChartProps) {
  const completedOrders = Math.max(
    totalOrders - pendingOrders,
    0
  );

  const completionRate =
    totalOrders > 0
      ? Math.round(
          (completedOrders / totalOrders) * 100
        )
      : 0;

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.05)]
      "
    >

      {/* Decorative gradient */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-blue-100/50
          blur-3xl
        "
      />

      {/* Header */}

      <div className="relative z-10 flex items-center justify-between border-b border-slate-100 px-5 py-5">

        <div>

          <div className="flex items-center gap-2">

            <div className="h-6 w-1 rounded-full bg-violet-500" />

            <h3 className="text-sm font-black text-slate-900">
              Orders Overview
            </h3>

          </div>

          <p className="mt-1 text-[11px] text-slate-500">
            Current order fulfillment performance
          </p>

        </div>

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-violet-50
            text-violet-600
          "
        >
          <ShoppingCart size={17} />
        </div>

      </div>

      {/* Body */}

      <div className="relative z-10 p-6">

        {/* Main KPI */}

        <div className="flex items-end justify-between">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Completion Rate
            </p>

            <p className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950">
              {completionRate}%
            </p>

          </div>

          <div className="text-right">

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </p>

            <p className="mt-1 text-xl font-black text-slate-900">
              {totalOrders}
            </p>

          </div>

        </div>

        {/* Progress */}

        <div className="mt-6">

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-cyan-400
                transition-all
                duration-700
              "
              style={{
                width: `${completionRate}%`,
              }}
            />

          </div>

        </div>

        {/* Status cards */}

        <div className="mt-7 grid grid-cols-2 gap-3">

          <div
            className="
              rounded-2xl
              border
              border-emerald-100
              bg-emerald-50/60
              p-4
            "
          >

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={16}
                className="text-emerald-600"
              />

              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Processed
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {completedOrders}
            </p>

          </div>

          <div
            className="
              rounded-2xl
              border
              border-amber-100
              bg-amber-50/60
              p-4
            "
          >

            <div className="flex items-center gap-2">

              <Clock3
                size={16}
                className="text-amber-600"
              />

              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Pending
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {pendingOrders}
            </p>

          </div>

        </div>

        {/* Pipeline */}

        <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

          <span className="text-[10px] font-bold text-slate-500">
            Order pipeline
          </span>

          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600">

            Received

            <ArrowRight size={12} />

            Fulfillment

            <ArrowRight size={12} />

            Completed

          </div>

        </div>

      </div>

    </div>
  );
}