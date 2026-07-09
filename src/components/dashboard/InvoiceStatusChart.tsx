"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FilePieChart,
} from "lucide-react";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
];

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

export default function InvoiceStatusChart({
  data,
}: Props) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        overflow-hidden
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

            Invoice Status

          </h2>

          <p className="text-sm text-slate-500">

            Distribution by payment status

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
            bg-blue-50
            text-blue-600
          "
        >
          <FilePieChart size={20} />
        </div>

      </div>

      {/* Chart */}

      <div className="h-[320px] w-full min-w-0 px-4">

        <ResponsiveContainer
          width="100%"
          height={280}
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Footer */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          px-6
          py-4
        "
      >

        <span className="text-sm text-slate-500">

          Total Invoices

        </span>

        <span className="font-bold text-slate-900">

          {total}

        </span>

      </div>

    </div>
  );
}