"use client";

import AppShell from "@/components/layout/AppShell";

import ProcurementForm from "./components/forms/ProcurementForm";

export default function ProcurementPage() {
  return (
    <AppShell
      title="Procurement"
      subtitle="Create, manage and approve purchase orders."
    >
      <ProcurementForm />
    </AppShell>
  );
}