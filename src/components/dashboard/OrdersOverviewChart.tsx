"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  totalOrders: number;
  pendingOrders: number;
}

export default function OrdersOverviewChart({
  totalOrders,
  pendingOrders,
}: Props) {

  const chartData = [
    {
      name: "Orders",
      total: totalOrders,
    },
    {
      name: "Pending",
      total: pendingOrders,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Orders Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={chartData}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="total" radius={[6,6,0,0]} />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}