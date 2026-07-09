"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      {/* Left */}
      <div className="flex items-start gap-4">

        {icon && (
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-700
              shadow-sm
              border
              border-blue-100
              shrink-0
            "
          >
            {icon}
          </div>
        )}

        <div>

          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            {title}
          </h1>

          {description && (
            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              {description}
            </p>
          )}

        </div>

      </div>

      {/* Right */}

      {actions && (
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-start
            gap-3
            lg:justify-end
          "
        >
          {actions}
        </div>
      )}

    </div>
  );
}