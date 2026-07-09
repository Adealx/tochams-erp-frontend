"use client";

import { FileSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;

  description?: string;
}

export default function EmptyState({
  title = "No Records Found",
  description = "There are currently no records to display.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <div
        className="
          mb-6
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-slate-100
        "
      >
        <FileSearch
          size={36}
          className="text-slate-400"
        />
      </div>

      <h3
        className="
          text-xl
          font-semibold
          text-slate-800
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          max-w-md
          text-center
          text-slate-500
        "
      >
        {description}
      </p>

    </div>
  );
}