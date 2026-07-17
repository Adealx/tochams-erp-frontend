"use client";

type ReportType =
    | "executive"
    | "sales"
    | "inventory"
    | "procurement"
    | "finance"
    | "customers"
    | "vendors"
    | "employees"
    | "audit";

interface ReportSidebarProps {
    active: ReportType;
    onSelect: (report: ReportType) => void;
}

const reports: {
    id: ReportType;
    label: string;
}[] = [
    {
        id: "executive",
        label: "Executive Summary",
    },
    {
        id: "sales",
        label: "Sales Report",
    },
    {
        id: "inventory",
        label: "Inventory Report",
    },
    {
        id: "procurement",
        label: "Procurement Report",
    },
    {
        id: "finance",
        label: "Finance Report",
    },
    {
        id: "customers",
        label: "Customer Report",
    },
    {
        id: "vendors",
        label: "Vendor Report",
    },
    {
        id: "employees",
        label: "Employee Report",
    },
    {
        id: "audit",
        label: "Audit Report",
    },
];

export default function ReportSidebar({
    active,
    onSelect,
}: ReportSidebarProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5">

            <h2 className="text-lg font-bold mb-5">
                Reports
            </h2>

            <nav className="space-y-2">

                {reports.map((report) => (

                    <button
                        key={report.id}
                        onClick={() => onSelect(report.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200

                        ${
                            active === report.id
                                ? "bg-blue-600 text-white font-semibold shadow"
                                : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                        {report.label}
                    </button>

                ))}

            </nav>

        </div>
    );
}