"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

import {
  ShoppingCart,
} from "lucide-react";

interface Props {
  totalOrders: number;
  pendingOrders: number;
}

export default function OrdersOverviewChart({
  totalOrders,
  pendingOrders,
}: Props) {
  const completedOrders =
    Math.max(totalOrders - pendingOrders, 0);

  const chartData = [
    {
      name: "Completed",
      value: completedOrders,
      color: "#22c55e",
    },
    {
      name: "Pending",
      value: pendingOrders,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      className="
        overflow-hidden
        rounded-[20px]
        border
        border-slate-200
        bg-white
        shadow-[0_6px_20px_rgba(15,23,42,.035)]
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          px-6
          py-5
        "
      >
        <div>

          <h2 className="text-lg font-bold text-slate-900">
            Orders Overview
          </h2>

          <p className="text-sm text-slate-500">
            Current order fulfillment status
          </p>

        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-purple-50
            text-purple-600
          "
        >
          <ShoppingCart size={20} />
        </div>

      </div>

      {/* Chart */}

      <div className="h-[320px] w-full min-w-0 px-5 py-4">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "#f8fafc",
              }}
            />

            <Bar
              dataKey="value"
              radius={[10, 10, 0, 0]}
              maxBarSize={70}
            >

              {chartData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={entry.color}
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* Footer */}

      <div
        className="
          grid
          grid-cols-2
          border-t
          border-slate-100
        "
      >

        <div className="px-6 py-4">

          <p className="text-sm text-slate-500">
            Total Orders
          </p>

          <h3 className="mt-1 text-2xl font-bold text-slate-900">
            {totalOrders}
          </h3>

        </div>

        <div
          className="
            border-l
            border-slate-100
            px-6
            py-4
          "
        >

          <p className="text-sm text-slate-500">
            Pending
          </p>

          <h3 className="mt-1 text-2xl font-bold text-amber-600">
            {pendingOrders}
          </h3>

        </div>

      </div>

    </div>
  );
}
