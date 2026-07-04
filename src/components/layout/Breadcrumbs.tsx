"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumbs({
  items,
}: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500">

      <Home size={16} />

      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
        >
          <ChevronRight size={15} />

          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-blue-600 transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-900">
              {item.label}
            </span>
          )}
        </div>
      ))}

    </nav>
  );
}