"use client";

import StatCard from "@/components/cards/StatCard";

import {
  FileEdit,
  Send,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ProcurementStatsProps {
  stats?: {
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
}

export default function ProcurementStats({
  stats = {
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
  },
}: ProcurementStatsProps) {
  return (
    <div
      className="
        grid
        gap-6

        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      <StatCard
        title="Draft Orders"
        value={stats.draft}
        icon={<FileEdit size={22} />}
        color="amber"
        description="Purchase orders awaiting submission."
      />

      <StatCard
        title="Submitted"
        value={stats.submitted}
        icon={<Send size={22} />}
        color="blue"
        description="Orders pending management review."
      />

      <StatCard
        title="Approved"
        value={stats.approved}
        icon={<CheckCircle2 size={22} />}
        color="green"
        trend="+12%"
        trendDirection="up"
        description="Approved purchase orders."
      />

      <StatCard
        title="Rejected"
        value={stats.rejected}
        icon={<XCircle size={22} />}
        color="red"
        trend="Needs Review"
        trendDirection="down"
        description="Purchase orders requiring correction."
      />
    </div>
  );
}