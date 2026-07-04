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
            bg-blue-600
            px-4
            py-2
            text-white
            shadow-sm
            hover:bg-blue-700
            transition
          "
        >
          <Plus size={18} />

          {action.label}

        </Link>
      ))}

    </div>
  );
}