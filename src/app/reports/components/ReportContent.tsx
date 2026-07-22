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

function Placeholder({ title }: { title: string }) {
    return (
        <div className="bg-white rounded-xl shadow p-8">

            <h2 className="text-2xl font-bold">
                {title}
            </h2>

            <p className="mt-3 text-gray-500">
                This report will be implemented next.
            </p>

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
                <Placeholder title="Procurement Report" />
            );

        case "finance":
            return (
                <Placeholder title="Finance Report" />
            );

        case "customers":
            return (
                <Placeholder title="Customer Report" />
            );

        case "vendors":
            return (
                <Placeholder title="Vendor Report" />
            );

        case "employees":
            return (
                <Placeholder title="Employee Report" />
            );

        case "audit":
            return (
                <Placeholder title="Audit Report" />
            );

        default:
            return <ReportSummaryCards />;
    }
}