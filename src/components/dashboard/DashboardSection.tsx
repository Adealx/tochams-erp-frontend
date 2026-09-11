"use client";

import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;

  /**
   * Optional accent used to visually identify
   * the dashboard section.
   */
  accent?: "blue" | "cyan" | "violet" | "emerald" | "amber" | "red";
}

export default function DashboardSection({
  title,
  description,
  children,
  action,
  accent = "blue",
}: DashboardSectionProps) {
  const accentStyles = {
    blue: {
      bar: "bg-blue-600",
      icon: "bg-blue-50 text-blue-600",
    },

    cyan: {
      bar: "bg-cyan-500",
      icon: "bg-cyan-50 text-cyan-600",
    },

    violet: {
      bar: "bg-violet-500",
      icon: "bg-violet-50 text-violet-600",
    },

    emerald: {
      bar: "bg-emerald-500",
      icon: "bg-emerald-50 text-emerald-600",
    },

    amber: {
      bar: "bg-amber-500",
      icon: "bg-amber-50 text-amber-600",
    },

    red: {
      bar: "bg-red-500",
      icon: "bg-red-50 text-red-600",
    },
  };

  const selectedAccent = accentStyles[accent];

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
        transition-all
        duration-300
        hover:shadow-[0_12px_36px_rgba(15,23,42,0.065)]
      "
    >

      {/* =====================================================
          ACCENT LINE
      ====================================================== */}

      <div
        className={`
          absolute
          left-0
          top-0
          h-full
          w-[3px]
          ${selectedAccent.bar}
        `}
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-100
          px-5
          py-5

          sm:px-6

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* Title */}

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div
              className={`
                h-7
                w-1
                rounded-full
                ${selectedAccent.bar}
              `}
            />

            <h2
              className="
                text-sm
                font-black
                tracking-[-0.01em]
                text-slate-950
              "
            >
              {title}
            </h2>

          </div>

          {description && (
            <p
              className="
                mt-1.5
                pl-4
                text-[11px]
                leading-5
                text-slate-500
              "
            >
              {description}
            </p>
          )}

        </div>

        {/* Optional action */}

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}

      </div>

      {/* =====================================================
          BODY
      ====================================================== */}

      <div className="p-5 sm:p-6">

        {children}

      </div>

    </section>
  );
}