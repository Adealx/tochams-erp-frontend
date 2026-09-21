import { ReactNode } from "react";

interface ReportCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
}

export default function ReportCard({
  title,
  value,
  subtitle,
  icon,
}: ReportCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-[0_4px_18px_rgba(15,23,42,0.035)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-8
          -top-8
          h-20
          w-20
          rounded-full
          bg-blue-500/[0.035]
          blur-2xl
        "
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1.5 truncate text-[11px] text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
              transition
              group-hover:bg-blue-100
            "
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}