"use client";

import {
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  FileWarning,
} from "lucide-react";

interface InvoiceStatusChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    background: string;
    icon: React.ReactNode;
  }
> = {
  Paid: {
    color: "#10B981",
    background: "bg-emerald-50",
    icon: <CheckCircle2 size={15} />,
  },

  Pending: {
    color: "#F59E0B",
    background: "bg-amber-50",
    icon: <Clock3 size={15} />,
  },

  "Partially Paid": {
    color: "#3B82F6",
    background: "bg-blue-50",
    icon: <CircleDollarSign size={15} />,
  },

  Overdue: {
    color: "#EF4444",
    background: "bg-red-50",
    icon: <FileWarning size={15} />,
  },
};

export default function InvoiceStatusChart({
  data,
}: InvoiceStatusChartProps) {
  const total = data.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );

  let currentAngle = 0;

  const segments = data.map((item) => {
    const value = Number(item.value || 0);

    const percentage =
      total > 0
        ? (value / total) * 100
        : 0;

    const start = currentAngle;

    currentAngle += percentage;

    return {
      ...item,
      percentage,
      start,
      end: currentAngle,
    };
  });

  function polarToCartesian(
    cx: number,
    cy: number,
    radius: number,
    angle: number
  ) {
    const radians =
      ((angle - 90) * Math.PI) / 180;

    return {
      x: cx + radius * Math.cos(radians),
      y: cy + radius * Math.sin(radians),
    };
  }

  function describeArc(
    startAngle: number,
    endAngle: number
  ) {
    const start = polarToCartesian(
      50,
      50,
      38,
      endAngle
    );

    const end = polarToCartesian(
      50,
      50,
      38,
      startAngle
    );

    const largeArcFlag =
      endAngle - startAngle <= 180
        ? "0"
        : "1";

    return [
      `M ${start.x} ${start.y}`,
      `A 38 38 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    ].join(" ");
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.05)]
      "
    >

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

        <div>

          <div className="flex items-center gap-2">

            <div className="h-6 w-1 rounded-full bg-blue-600" />

            <h3 className="text-sm font-black text-slate-900">
              Invoice Status
            </h3>

          </div>

          <p className="mt-1 text-[11px] text-slate-500">
            Distribution by payment status
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
            bg-blue-50
            text-blue-600
          "
        >
          <CircleDollarSign size={17} />
        </div>

      </div>

      {/* Body */}

      <div className="grid min-h-[290px] grid-cols-1 items-center gap-5 p-5 sm:grid-cols-2">

        {/* Donut */}

        <div className="relative mx-auto flex h-[190px] w-[190px] items-center justify-center">

          <svg
            viewBox="0 0 100 100"
            className="h-full w-full -rotate-0"
          >

            {/* Background ring */}

            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="9"
            />

            {segments.map((segment) => {

              if (segment.value <= 0) {
                return null;
              }

              return (
                <path
                  key={segment.name}
                  d={describeArc(
                    segment.start,
                    segment.end
                  )}
                  fill="none"
                  stroke={
                    STATUS_CONFIG[
                      segment.name
                    ]?.color || "#64748B"
                  }
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              );
            })}

          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-3xl font-black tracking-tight text-slate-950">
              {total}
            </span>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total invoices
            </span>

          </div>

        </div>

        {/* Legend */}

        <div className="space-y-3">

          {segments.map((item) => {

            const config =
              STATUS_CONFIG[item.name];

            return (
              <div
                key={item.name}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-slate-100
                  bg-slate-50/70
                  px-3
                  py-2.5
                "
              >

                <div className="flex items-center gap-2.5">

                  <div
                    className={`
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      ${config?.background || "bg-slate-100"}
                    `}
                    style={{
                      color:
                        config?.color ||
                        "#64748B",
                    }}
                  >
                    {config?.icon}
                  </div>

                  <div>

                    <p className="text-[11px] font-bold text-slate-700">
                      {item.name}
                    </p>

                    <p className="text-[9px] text-slate-400">
                      {item.value} invoice
                      {item.value === 1 ? "" : "s"}
                    </p>

                  </div>

                </div>

                <span className="text-xs font-black text-slate-900">
                  {total > 0
                    ? `${Math.round(
                        item.value /
                          total *
                          100
                      )}%`
                    : "0%"}
                </span>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}