"use client";

import clsx from "clsx";

interface StatusBadgeProps {
  status: string;
}

const styles: Record<
  string,
  string
> = {
  Draft:
    "bg-slate-100 text-slate-700",

  Submitted:
    "bg-blue-100 text-blue-700",

  "Pending Approval":
    "bg-amber-100 text-amber-700",

  Approved:
    "bg-emerald-100 text-emerald-700",

  Ordered:
    "bg-purple-100 text-purple-700",

  Received:
    "bg-green-100 text-green-700",

  Rejected:
    "bg-red-100 text-red-700",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles[status] ??
          "bg-slate-100 text-slate-700"
      )}
    >
      {status}
    </span>
  );
}