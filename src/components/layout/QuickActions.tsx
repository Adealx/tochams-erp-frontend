"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface Action {
  label: string;
  href: string;
}

interface QuickActionsProps {
  actions: Action[];
}

export default function QuickActions({
  actions,
}: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">

      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-indigo-600
            px-4 py-2.5
            text-white
            shadow-[0_8px_18px_rgba(79,70,229,.22)]
            hover:bg-indigo-700 hover:-translate-y-px
            transition-all
          "
        >
          <Plus size={18} />

          {action.label}

        </Link>
      ))}

    </div>
  );
}
