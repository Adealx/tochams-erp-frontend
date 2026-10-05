"use client";

import Link from "next/link";
import {
  ChevronRight,
  Home,
} from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({
  items,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="
        flex
        min-w-0
        items-center
        overflow-hidden
        text-sm
      "
    >
      <ol
        className="
          flex
          min-w-0
          items-center
          gap-1
        "
      >
        {/* Home */}

        <li className="flex shrink-0 items-center">
          <Link
            href="/dashboard"
            aria-label="Dashboard"
            className="
              group
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition-all
              duration-200
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <Home
              size={15}
              strokeWidth={2}
              className="
                transition-transform
                duration-200
                group-hover:scale-105
              "
            />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="
                flex
                min-w-0
                items-center
              "
            >
              {/* Separator */}

              <ChevronRight
                size={14}
                strokeWidth={1.8}
                className="
                  mx-1
                  shrink-0
                  text-slate-300
                "
              />

              {/* Breadcrumb */}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="
                    max-w-[180px]
                    truncate
                    rounded-md
                    px-1.5
                    py-1
                    text-xs
                    font-medium
                    text-slate-500
                    transition-colors
                    duration-200
                    hover:bg-slate-100
                    hover:text-blue-600
                    sm:max-w-[220px]
                  "
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={
                    isLast ? "page" : undefined
                  }
                  className="
                    max-w-[220px]
                    truncate
                    rounded-md
                    px-1.5
                    py-1
                    text-xs
                    font-semibold
                    text-slate-800
                    sm:max-w-[300px]
                  "
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}