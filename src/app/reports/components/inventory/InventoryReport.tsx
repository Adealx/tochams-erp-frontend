"use client";

import { useEffect, useState } from "react";
import {
    Package,
    Boxes,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Warehouse,
    DollarSign,
    Trophy,
} from "lucide-react";

import ReportCard from "../ReportCard";

import {
    getInventoryReport,
} from "@/services/reportService";

import type {
    InventoryReportData,
} from "@/services/reportService";

export default function InventoryReport() {

    const [report, setReport] =
        useState<InventoryReportData | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    async function loadReport() {
        try {
            const data = await getInventoryReport();
            setReport(data);
        } catch (error) {
            console.error("Failed to load inventory report:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="text-center">
                    <Warehouse
                        size={50}
                        className="mx-auto text-blue-600 animate-pulse"
                    />

                    <p className="mt-4 text-lg text-gray-500">
                        Loading Inventory Report...
                    </p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="text-center">

                    <AlertTriangle
                        size={50}
                        className="mx-auto text-red-500"
                    />

                    <h2 className="mt-4 text-xl font-semibold">
                        Failed to load Inventory Report
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Please refresh the page and try again.
                    </p>

                </div>
            </div>
        );
    }

    return (

        <div className="space-y-10">

            {/* Header */}

            <div className="border-b pb-5">

                <h2 className="text-3xl font-bold text-gray-900">
                    Inventory Report
                </h2>

                <p className="mt-2 text-gray-500">
                    Real-time inventory performance and warehouse statistics.
                </p>

            </div>

            {/* KPI Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                <ReportCard
                    title="Total Products"
                    value={report.total_products}
                    subtitle="Registered products"
                    icon={<Package size={28} />}
                />

                <ReportCard
                    title="Inventory Value"
                    value={`₦${Number(report.inventory_value).toLocaleString()}`}
                    subtitle="Current inventory value"
                    icon={<DollarSign size={28} />}
                />

                <ReportCard
                    title="Low Stock"
                    value={report.low_stock_items}
                    subtitle="Below reorder level"
                    icon={<AlertTriangle size={28} />}
                />

                <ReportCard
                    title="Out of Stock"
                    value={report.out_of_stock}
                    subtitle="Requires immediate restocking"
                    icon={<Boxes size={28} />}
                />

                <ReportCard
                    title="Stock In"
                    value={report.stock_in}
                    subtitle="Incoming inventory"
                    icon={<TrendingUp size={28} />}
                />

                <ReportCard
                    title="Stock Out"
                    value={report.stock_out}
                    subtitle="Outgoing inventory"
                    icon={<TrendingDown size={28} />}
                />

                <ReportCard
                    title="Average Stock"
                    value={Number(report.average_stock).toFixed(2)}
                    subtitle="Average quantity per product"
                    icon={<Warehouse size={28} />}
                />

                <ReportCard
                    title="Highest Value Product"
                    value={report.highest_value_product?.name ?? "-"}
                    subtitle={
                        report.highest_value_product
                            ? `SKU: ${report.highest_value_product.sku} • Qty: ${report.highest_value_product.quantity}`
                            : "No inventory available"
                    }
                    icon={<Trophy size={28} />}
                />

            </div>

            {/* Charts Placeholder */}

            <div className="bg-white rounded-2xl border shadow-sm p-10 min-h-[350px] flex items-center justify-center">

                <div className="text-center">

                    <Warehouse
                        size={48}
                        className="mx-auto text-blue-500"
                    />

                    <h3 className="mt-4 text-xl font-semibold text-gray-700">
                        Inventory Analytics
                    </h3>

                    <p className="mt-2 text-gray-500">
                        Inventory Value by Category and Stock Movement charts
                        will appear here.
                    </p>

                </div>

            </div>

            {/* Tables Placeholder */}

            <div className="bg-white rounded-2xl border shadow-sm p-10 min-h-[350px] flex items-center justify-center">

                <div className="text-center">

                    <Package
                        size={48}
                        className="mx-auto text-green-500"
                    />

                    <h3 className="mt-4 text-xl font-semibold text-gray-700">
                        Inventory Tables
                    </h3>

                    <p className="mt-2 text-gray-500">
                        Low Stock Products, Top Inventory Products and Recently
                        Restocked Products will appear here.
                    </p>

                </div>

            </div>

        </div>

    );
}