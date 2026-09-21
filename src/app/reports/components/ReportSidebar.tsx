"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardCheck,
  FileBarChart,
  Package,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Users,
  WalletCards,
} from "lucide-react";

import type { ReportType } from "./ReportContent";

interface ReportSidebarProps {
  active: ReportType;
  onSelect: (report: ReportType) => void;
}

const reports: {
  id: ReportType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "executive",
    label: "Executive Summary",
    description: "Business overview",
    icon: BarChart3,
  },
  {
    id: "sales",
    label: "Sales Report",
    description: "Revenue & sales",
    icon: ShoppingCart,
  },
  {
    id: "inventory",
    label: "Inventory Report",
    description: "Stock & valuation",
    icon: Package,
  },
  {
    id: "procurement",
    label: "Procurement Report",
    description: "Purchasing activity",
    icon: ClipboardCheck,
  },
  {
    id: "finance",
    label: "Finance Report",
    description: "Financial performance",
    icon: WalletCards,
  },
  {
    id: "customers",
    label: "Customer Report",
    description: "Customer activity",
    icon: Users,
  },
  {
    id: "vendors",
    label: "Vendor Report",
    description: "Supplier performance",
    icon: BriefcaseBusiness,
  },
  {
    id: "employees",
    label: "Employee Report",
    description: "Workforce analytics",
    icon: Receipt,
  },
  {
    id: "audit",
    label: "Audit Report",
    description: "System activity",
    icon: ShieldCheck,
  },
];

export default function ReportSidebar({
  active,
  onSelect,
}: ReportSidebarProps) {
  return (
    <aside
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        shadow-[0_4px_18px_rgba(15,23,42,0.035)]
      "
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileBarChart size={17} />
          </div>

          <div>
            <h2 className="text-sm font-black text-slate-950">
              Report Library
            </h2>

            <p className="text-[10px] text-slate-400">
              Select a reporting module
            </p>
          </div>
        </div>
      </div>

      {/* Reports */}
      <nav className="space-y-1 p-3">
        {reports.map((report) => {
          const Icon = report.icon;
          const selected = active === report.id;

          return (
            <button
              key={report.id}
              type="button"
              onClick={() => onSelect(report.id)}
              className={[
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
                selected
                  ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              ].join(" ")}
            >
              {selected && (
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-600" />
              )}

              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition",
                  selected
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-50 text-slate-400 group-hover:text-blue-500",
                ].join(" ")}
              >
                <Icon size={15} strokeWidth={1.9} />
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={[
                    "block truncate text-xs",
                    selected
                      ? "font-bold"
                      : "font-semibold",
                  ].join(" ")}
                >
                  {report.label}
                </span>

                <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                  {report.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}