"use client";

import { useState } from "react";

import AppShell from "@/components/layout/AppShell";

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
    <AppShell
      title="Reports"
      subtitle="Business intelligence, financial performance and operational analytics across TOCHAMS ERP."
      breadcrumbs={[
        {
          label: "Analytics",
          href: "/reports",
        },
        {
          label: "Reports",
        },
      ]}
    >
      {/* =====================================================
          REPORTING HEADER
      ====================================================== */}

      <ReportHeader />

      {/* =====================================================
          REPORT FILTERS
      ====================================================== */}

      <section>
        <ReportFilters />
      </section>

      {/* =====================================================
          REPORT WORKSPACE
      ====================================================== */}

      <section
        className="
          grid
          grid-cols-1
          gap-6
          lg:grid-cols-12
        "
      >
        {/* ===================================================
            REPORT NAVIGATION
        ==================================================== */}

        <aside
          className="
            lg:col-span-3
            xl:col-span-3
          "
        >
          <ReportSidebar
            active={activeReport}
            onSelect={setActiveReport}
          />
        </aside>

        {/* ===================================================
            REPORT CONTENT
        ==================================================== */}

        <main
          className="
            min-w-0
            space-y-6
            lg:col-span-9
            xl:col-span-9
          "
        >
          <ReportContent
            active={activeReport}
          />

          <ReportCharts />

          <ReportTable />
        </main>
      </section>
    </AppShell>
  );
}