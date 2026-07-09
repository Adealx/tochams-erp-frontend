"use client";

import AppShell from "@/components/layout/AppShell";

import ProcurementHeader from "../components/ProcurementHeader";
import ProcurementStats from "../components/ProcurementStats";
import ProcurementForm from "../components/forms/ProcurementForm";
import ProcurementTimeline from "./ProcurementTimeline";

export default function ProcurementPage() {
  return (
    <AppShell
      title="Procurement Management"
      subtitle="Create, approve and monitor procurement requests from a single workspace."
    >
      {/* Header */}
      <ProcurementHeader />

      {/* Statistics */}
      <ProcurementStats />

      {/* Main Content */}
      <div className="grid gap-8 xl:grid-cols-4">

        {/* Form + Table */}
        <div className="xl:col-span-3">
          <ProcurementForm />
        </div>

        {/* Workflow */}
        <div className="xl:col-span-1">
          <ProcurementTimeline />
        </div>

      </div>

    </AppShell>
  );
}