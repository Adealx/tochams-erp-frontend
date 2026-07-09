"use client";

import { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;

  description?: string;

  children: ReactNode;

  action?: ReactNode;
}

export default function DashboardSection({
  title,
  description,
  children,
  action,
}: DashboardSectionProps) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-200
          px-8
          py-6

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>

          <h2
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              {description}
            </p>
          )}

        </div>

        {action}

      </div>

      {/* Body */}

      <div className="p-8">

        {children}

      </div>

    </section>
  );
}