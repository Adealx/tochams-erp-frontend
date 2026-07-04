import { ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  variant = "default",
  className,
}: StatCardProps) {
  const iconColors = {
    default: "bg-blue-100 text-blue-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
        ),
        className
      )}
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {change !== undefined && (
            <div className="mt-4 flex items-center gap-2">

              {change >= 0 ? (
                <ArrowUpRight
                  size={16}
                  className="text-emerald-600"
                />
              ) : (
                <ArrowDownRight
                  size={16}
                  className="text-red-600"
                />
              )}

              <span
                className={
                  change >= 0
                    ? "text-sm font-medium text-emerald-600"
                    : "text-sm font-medium text-red-600"
                }
              >
                {Math.abs(change)}%
              </span>

              {changeLabel && (
                <span className="text-sm text-slate-500">
                  {changeLabel}
                </span>
              )}

            </div>
          )}

        </div>

        <div
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            iconColors[variant]
          )}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}