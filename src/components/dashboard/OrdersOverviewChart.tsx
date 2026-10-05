"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShoppingCart,
  TrendingUp,
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
        rounded-[20px]
        border
        border-slate-200
        bg-white
        shadow-[0_6px_24px_rgba(15,23,42,0.045)]
      "
    >
      {/* DECORATIVE GLOW */}

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

      {/* HEADER */}

      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          px-5
          py-4
        "
      >
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-1 rounded-full bg-violet-500" />

            <h3 className="text-sm font-black text-slate-950">
              Orders Overview
            </h3>
          </div>

          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Current order fulfillment performance
          </p>
        </div>

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-violet-50
            text-violet-600
          "
        >
          <ShoppingCart size={15} />
        </div>
      </div>

      {/* BODY */}

      <div className="relative z-10 px-5 py-5">
        {/* MAIN KPI */}

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-slate-400
                "
              >
                Completion rate
              </p>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-emerald-50
                  px-2
                  py-0.5
                  text-[8px]
                  font-black
                  text-emerald-600
                "
              >
                <TrendingUp size={9} />
                Healthy
              </span>
            </div>

            <p
              className="
                mt-2
                text-[2.25rem]
                font-black
                tracking-[-0.055em]
                text-slate-950
              "
            >
              {completionRate}%
            </p>
          </div>

          <div className="text-right">
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              Total orders
            </p>

            <p
              className="
                mt-1
                text-xl
                font-black
                tracking-tight
                text-slate-900
              "
            >
              {totalOrders}
            </p>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold text-slate-400">
              Fulfillment progress
            </span>

            <span className="text-[9px] font-black text-blue-600">
              {completedOrders} / {totalOrders}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
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

        {/* STATUS */}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div
            className="
              rounded-xl
              border
              border-emerald-100
              bg-emerald-50/60
              px-4
              py-3
            "
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={14}
                className="text-emerald-600"
              />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-wider
                  text-emerald-700
                "
              >
                Processed
              </span>
            </div>

            <p
              className="
                mt-2
                text-xl
                font-black
                text-slate-900
              "
            >
              {completedOrders}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-amber-100
              bg-amber-50/60
              px-4
              py-3
            "
          >
            <div className="flex items-center gap-2">
              <Clock3
                size={14}
                className="text-amber-600"
              />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-wider
                  text-amber-700
                "
              >
                Pending
              </span>
            </div>

            <p
              className="
                mt-2
                text-xl
                font-black
                text-slate-900
              "
            >
              {pendingOrders}
            </p>
          </div>
        </div>

        {/* PIPELINE */}

        <div
          className="
            mt-4
            flex
            flex-wrap
            items-center
            justify-between
            gap-2
            rounded-xl
            border
            border-slate-100
            bg-slate-50
            px-3
            py-2.5
          "
        >
          <span
            className="
              text-[9px]
              font-bold
              text-slate-400
            "
          >
            Order pipeline
          </span>

          <div
            className="
              flex
              items-center
              gap-1.5
              text-[8px]
              font-black
              text-blue-600
            "
          >
            <span>Received</span>

            <ArrowRight size={10} />

            <span>Fulfillment</span>

            <ArrowRight size={10} />

            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}