"use client";

import { useEffect, useState } from "react";
import {
    getSalesReport,
    SalesReport,
} from "@/services/reportService";

export default function SalesSummary() {
    const [report, setReport] = useState<SalesReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadReport() {
            try {
                const data = await getSalesReport();
                setReport(data);
            } catch {
                setError("Failed to load Sales Report");
            } finally {
                setLoading(false);
            }
        }

        loadReport();
    }, []);

    const money = (value: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(value);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                Loading Sales Report...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
                {error}
            </div>
        );
    }

    if (!report) return null;

    const cards = [
        {
            title: "Total Sales",
            value: money(report.total_sales),
        },
        {
            title: "Orders",
            value: report.total_orders,
        },
        {
            title: "Average Sale",
            value: money(report.average_sale),
        },
        {
            title: "Paid Invoices",
            value: report.paid_invoices,
        },
        {
            title: "Pending Invoices",
            value: report.pending_invoices,
        },
        {
            title: "Outstanding Amount",
            value: money(report.outstanding_amount),
        },
    ];

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
                Sales Report
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl shadow p-5"
                    >
                        <p className="text-gray-500 text-sm">
                            {card.title}
                        </p>

                        <h3 className="text-2xl font-bold mt-2">
                            {card.value}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
}