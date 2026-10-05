"use client";

import Link from "next/link";
import {
  ArrowRight,
  Plus,
} from "lucide-react";

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
  if (!actions.length) {
    return null;
  }

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-2.5
      "
      aria-label="Quick actions"
    >
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="
            group
            inline-flex
            items-center
            gap-2.5
            rounded-xl
            border
            border-indigo-500
            bg-indigo-600
            px-3.5
            py-2.5
            text-xs
            font-semibold
            text-white
            shadow-[0_6px_18px_rgba(79,70,229,0.18)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-indigo-700
            hover:shadow-[0_10px_24px_rgba(79,70,229,0.24)]
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500/30
            focus:ring-offset-2
            active:translate-y-0
            sm:text-sm
          "
        >
          {/* Icon */}

          <span
            className="
              grid
              h-6
              w-6
              shrink-0
              place-items-center
              rounded-lg
              bg-white/15
              transition-colors
              duration-200
              group-hover:bg-white/20
            "
          >
            <Plus
              size={15}
              strokeWidth={2.5}
            />
          </span>

          {/* Label */}

          <span className="whitespace-nowrap">
            {action.label}
          </span>

          {/* Arrow */}

          <ArrowRight
            size={14}
            strokeWidth={2}
            className="
              -ml-0.5
              opacity-0
              transition-all
              duration-200
              group-hover:translate-x-0.5
              group-hover:opacity-100
            "
          />
        </Link>
      ))}
    </div>
  );
}