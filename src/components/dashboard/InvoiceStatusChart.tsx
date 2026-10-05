"use client";

import type { ReactNode } from "react";

import {
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  FileWarning,
  ArrowUpRight,
} from "lucide-react";

interface InvoiceStatusChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

interface StatusConfig {
  color: string;
  background: string;
  icon: ReactNode;
  label: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  Paid: {
    color: "#10B981",
    background: "bg-emerald-50",
    icon: <CheckCircle2 size={14} />,
    label: "Paid",
  },

  Pending: {
    color: "#F59E0B",
    background: "bg-amber-50",
    icon: <Clock3 size={14} />,
    label: "Pending",
  },

  "Partially Paid": {
    color: "#3B82F6",
    background: "bg-blue-50",
    icon: <CircleDollarSign size={14} />,
    label: "Partially Paid",
  },

  Overdue: {
    color: "#EF4444",
    background: "bg-red-50",
    icon: <FileWarning size={14} />,
    label: "Overdue",
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
      value,
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
      x:
        cx +
        radius *
          Math.cos(radians),

      y:
        cy +
        radius *
          Math.sin(radians),
    };
  }

  function describeArc(
    startAngle: number,
    endAngle: number
  ) {
    const start =
      polarToCartesian(
        50,
        50,
        38,
        endAngle
      );

    const end =
      polarToCartesian(
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
        rounded-[20px]
        border
        border-slate-200
        bg-white
        shadow-[0_6px_24px_rgba(15,23,42,0.045)]
      "
    >
      {/* HEADER */}

      <div
        className="
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
            <div className="h-6 w-1 rounded-full bg-blue-600" />

            <h3 className="text-sm font-black text-slate-950">
              Invoice Status
            </h3>
          </div>

          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Distribution by payment status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="
              hidden
              rounded-full
              border
              border-slate-200
              bg-slate-50
              px-2.5
              py-1
              text-[9px]
              font-bold
              text-slate-500
              sm:inline-flex
            "
          >
            {total} invoices
          </span>

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-blue-50
              text-blue-600
            "
          >
            <CircleDollarSign size={15} />
          </div>
        </div>
      </div>

      {/* BODY */}

      <div
        className="
          grid
          grid-cols-1
          items-center
          gap-5
          px-5
          py-5
          sm:grid-cols-[190px_1fr]
        "
      >
        {/* DONUT */}

        <div className="flex justify-center">
          <div className="relative h-[175px] w-[175px]">
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full"
            >
              {/* Background */}

              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="9"
              />

              {/* Segments */}

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
                      ]?.color ||
                      "#64748B"
                    }
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Center */}

            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
              "
            >
              <span
                className="
                  text-3xl
                  font-black
                  tracking-[-0.05em]
                  text-slate-950
                "
              >
                {total}
              </span>

              <span
                className="
                  mt-0.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-slate-400
                "
              >
                Total invoices
              </span>
            </div>
          </div>
        </div>

        {/* LEGEND */}

        <div className="space-y-2">
          {segments.map((item) => {
            const config =
              STATUS_CONFIG[item.name];

            const percentage =
              total > 0
                ? Math.round(
                    (item.value / total) * 100
                  )
                : 0;

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
                  transition-colors
                  hover:bg-slate-50
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
                    <p
                      className="
                        text-[10px]
                        font-bold
                        text-slate-700
                      "
                    >
                      {item.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        font-medium
                        text-slate-400
                      "
                    >
                      {item.value} invoice
                      {item.value === 1
                        ? ""
                        : "s"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-slate-200 sm:block">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          config?.color ||
                          "#64748B",
                      }}
                    />
                  </div>

                  <span
                    className="
                      min-w-[32px]
                      text-right
                      text-[10px]
                      font-black
                      text-slate-900
                    "
                  >
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          bg-slate-50/50
          px-5
          py-3
        "
      >
        <span className="text-[9px] font-semibold text-slate-400">
          Payment distribution
        </span>

        <span
          className="
            flex
            items-center
            gap-1
            text-[9px]
            font-bold
            text-blue-600
          "
        >
          Invoice intelligence
          <ArrowUpRight size={11} />
        </span>
      </div>
    </div>
  );
}