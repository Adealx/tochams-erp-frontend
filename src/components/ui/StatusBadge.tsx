"use client";

import clsx from "clsx";

interface StatusBadgeProps {
  status: string;
}

const styles: Record<string, string> = {

  Draft:
    "bg-slate-100 text-slate-700 ring-slate-200",

  Submitted:
    "bg-blue-50 text-blue-700 ring-blue-200",

  "Pending Approval":
    "bg-amber-50 text-amber-700 ring-amber-200",

  Approved:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",

  Ordered:
    "bg-violet-50 text-violet-700 ring-violet-200",

  Received:
    "bg-cyan-50 text-cyan-700 ring-cyan-200",

  Rejected:
    "bg-red-50 text-red-700 ring-red-200",

  Completed:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",

  Pending:
    "bg-amber-50 text-amber-700 ring-amber-200",

  Cancelled:
    "bg-red-50 text-red-700 ring-red-200",

  Overdue:
    "bg-red-50 text-red-700 ring-red-200",

  Paid:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",

  Partial:
    "bg-amber-50 text-amber-700 ring-amber-200",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {

  return (

    <span
      className={clsx(
        `
          inline-flex
          items-center
          gap-1.5
          rounded-full
          px-2.5
          py-1
          text-[11px]
          font-semibold
          ring-1
          ring-inset
        `,
        styles[status] ??
          "bg-slate-100 text-slate-600 ring-slate-200"
      )}
    >

      <span
        className="
          h-1.5
          w-1.5
          rounded-full
          bg-current
          opacity-70
        "
      />

      {status}

    </span>

  );
}