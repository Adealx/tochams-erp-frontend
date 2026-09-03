"use client";

import { ReactNode } from "react";
import clsx from "clsx";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import {
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;

  icon?: ReactNode;

  description?: string;

  trend?: string;

  trendLabel?: string;

  trendDirection?:
    | "up"
    | "down"
    | "neutral";

  color?:
    | "blue"
    | "green"
    | "amber"
    | "red"
    | "purple"
    | "cyan";

  badge?: string;

  loading?: boolean;

  footer?: ReactNode;

  onClick?: () => void;

  className?: string;
}

const colors = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
  },

  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
  },

  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
  },

  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
  },

  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-100",
  },

  cyan: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-100",
  },
};

export default function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  trendLabel = "vs last period",
  trendDirection = "neutral",
  color = "blue",
  badge,
  loading = false,
  footer,
  onClick,
  className,
}: StatCardProps) {
  const style = colors[color];

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
      ? TrendingDown
      : Minus;

  return (
    <Card
      padding="sm"
      className={clsx(
        `
        rounded-[20px]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_16px_32px_rgba(15,23,42,.09)]
        `,
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex-1 min-w-0">

          <div className="flex items-center gap-2">

            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">

              {title}

            </h3>

            {badge && (

              <Badge>

                {badge}

              </Badge>

            )}

          </div>

          {loading ? (

            <div className="mt-3 h-8 w-28 animate-pulse rounded bg-slate-200" />

          ) : (

            <h2 className="mt-2 text-[1.7rem] font-bold tracking-[-0.035em] text-slate-950">

              {value}

            </h2>

          )}

          {description && (

            <p className="mt-2 text-sm text-slate-500 line-clamp-2">

              {description}

            </p>

          )}

        </div>

        {icon && (

          <div
            className={clsx(
              `
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              `,
              style.bg,
              style.border,
              style.text
            )}
          >

            {icon}

          </div>

        )}

      </div>

      {trend && (

        <div className="mt-4 flex items-center gap-2">

          <TrendIcon
            size={16}
            className={clsx(
              trendDirection === "up" &&
                "text-emerald-600",

              trendDirection === "down" &&
                "text-red-600",

              trendDirection === "neutral" &&
                "text-slate-500"
            )}
          />

          <span
            className={clsx(
              "text-sm font-semibold",

              trendDirection === "up" &&
                "text-emerald-600",

              trendDirection === "down" &&
                "text-red-600",

              trendDirection === "neutral" &&
                "text-slate-600"
            )}
          >

            {trend}

          </span>

          <span className="text-xs text-slate-400">

            {trendLabel}

          </span>

        </div>

      )}

      {footer && (

        <div className="mt-4 border-t border-slate-200 pt-4">

          {footer}

        </div>

      )}

    </Card>
  );
}
