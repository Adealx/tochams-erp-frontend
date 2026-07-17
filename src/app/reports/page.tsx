"use client";

import { useState } from "react";

import ReportHeader from "./components/ReportHeader";
import ReportSidebar from "./components/ReportSidebar";
import ReportFilters from "./components/ReportFilters";
import ReportCharts from "./components/ReportCharts";
import ReportTable from "./components/ReportTable";

import ReportContent, {
    ReportType,
} from "./components/ReportContent";

export default function ReportsPage() {

    const [activeReport, setActiveReport] =
        useState<ReportType>("executive");

    return (

        <div className="min-h-screen bg-gray-50 p-6">

            <ReportHeader />

            <section className="mt-8">
                <ReportFilters />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">

                <aside className="lg:col-span-3">

                    <ReportSidebar
                        active={activeReport}
                        onSelect={setActiveReport}
                    />

                </aside>

                <main className="lg:col-span-9 space-y-6">

                    <ReportContent
                        active={activeReport}
                    />

                    <ReportCharts />

                    <ReportTable />

                </main>

            </section>

        </div>

    );

}