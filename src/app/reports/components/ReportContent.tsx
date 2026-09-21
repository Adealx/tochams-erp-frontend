"use client";

import ReportSummaryCards from "./ReportSummaryCards";
import SalesSummary from "./SalesSummary";
import InventoryReport from "./inventory/InventoryReport";

export type ReportType =
  | "executive"
  | "sales"
  | "inventory"
  | "procurement"
  | "finance"
  | "customers"
  | "vendors"
  | "employees"
  | "audit";

interface ReportContentProps {
  active: ReportType;
}

function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        p-8
        shadow-[0_4px_18px_rgba(15,23,42,0.035)]
      "
    >
      <h2 className="text-lg font-black tracking-tight text-slate-950">
        {title}
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
        <p className="text-xs font-semibold text-slate-500">
          Report module coming next
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          The reporting workspace is ready for this module.
        </p>
      </div>
    </div>
  );
}

export default function ReportContent({
  active,
}: ReportContentProps) {
  switch (active) {
    case "executive":
      return <ReportSummaryCards />;

    case "sales":
      return <SalesSummary />;

    case "inventory":
      return <InventoryReport />;

    case "procurement":
      return (
        <Placeholder
          title="Procurement Report"
          description="Review purchasing activity, supplier commitments, purchase orders and procurement performance."
        />
      );

    case "finance":
      return (
        <Placeholder
          title="Finance Report"
          description="Review financial performance, expenses, cash movement and accounting activity."
        />
      );

    case "customers":
      return (
        <Placeholder
          title="Customer Report"
          description="Review customer activity, purchasing behaviour, outstanding balances and customer performance."
        />
      );

    case "vendors":
      return (
        <Placeholder
          title="Vendor Report"
          description="Review supplier activity, procurement history and vendor performance."
        />
      );

    case "employees":
      return (
        <Placeholder
          title="Employee Report"
          description="Review workforce activity, attendance and employee-related operational information."
        />
      );

    case "audit":
      return (
        <Placeholder
          title="Audit Report"
          description="Review important system activity and traceability information across the ERP."
        />
      );

    default:
      return <ReportSummaryCards />;
  }
}