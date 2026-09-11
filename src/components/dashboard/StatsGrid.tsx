"use client";

import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  FileText,
  ShoppingCart,
  Users,
  WalletCards,
  Clock3,
} from "lucide-react";

interface StatsGridProps {
  stats: {
    customers: number;
    products: number;
    orders: number;
    invoices: number;
    payments: number;
    outstanding: number;
    pendingOrders: number;
    lowStock: number;
  };
}

function MetricCard({
  label,
  value,
  description,
  icon,
  tone,
  alert = false,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  tone: "blue" | "cyan" | "violet" | "emerald" | "amber" | "red";
  alert?: boolean;
}) {
  const tones = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      accent: "bg-blue-500",
    },
    cyan: {
      icon: "bg-cyan-50 text-cyan-600",
      accent: "bg-cyan-500",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      accent: "bg-violet-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-500",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      accent: "bg-amber-500",
    },
    red: {
      icon: "bg-red-50 text-red-600",
      accent: "bg-red-500",
    },
  };

  const selected = tones[tone];

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[20px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-[0_7px_25px_rgba(15,23,42,0.045)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)]
      "
    >
      <div
        className={`
          absolute
          left-0
          top-0
          h-full
          w-[3px]
          ${selected.accent}
          opacity-70
        `}
      />

      <div className="flex items-start justify-between">

        <div>

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.13em]
              text-slate-400
            "
          >
            {label}
          </p>

          <p
            className="
              mt-3
              text-2xl
              font-black
              tracking-[-0.035em]
              text-slate-950
            "
          >
            {value}
          </p>

        </div>

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            ${selected.icon}
          `}
        >
          {icon}
        </div>

      </div>

      <div className="mt-4 flex items-center justify-between">

        <p className="text-[11px] text-slate-500">
          {description}
        </p>

        {alert && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600">
            <AlertTriangle size={11} />
            Attention
          </span>
        )}

      </div>
    </div>
  );
}

export default function StatsGrid({
  stats,
}: StatsGridProps) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >

      <MetricCard
        label="Customers"
        value={stats.customers}
        description="Registered customers"
        icon={<Users size={19} />}
        tone="blue"
      />

      <MetricCard
        label="Products"
        value={stats.products}
        description="Products in catalogue"
        icon={<Boxes size={19} />}
        tone="cyan"
      />

      <MetricCard
        label="Sales Orders"
        value={stats.orders}
        description="Orders received"
        icon={<ShoppingCart size={19} />}
        tone="violet"
      />

      <MetricCard
        label="Invoices"
        value={stats.invoices}
        description="Invoices generated"
        icon={<FileText size={19} />}
        tone="emerald"
      />

      <MetricCard
        label="Pending Orders"
        value={stats.pendingOrders}
        description="Awaiting approval"
        icon={<Clock3 size={19} />}
        tone="amber"
        alert={stats.pendingOrders > 0}
      />

      <MetricCard
        label="Low Stock"
        value={stats.lowStock}
        description="Products below minimum"
        icon={<AlertTriangle size={19} />}
        tone="red"
        alert={stats.lowStock > 0}
      />

      <MetricCard
        label="Payments"
        value={`₦${Number(stats.payments || 0).toLocaleString("en-NG")}`}
        description="Payments received"
        icon={<WalletCards size={19} />}
        tone="emerald"
      />

      <MetricCard
        label="Receivables"
        value={`₦${Number(stats.outstanding || 0).toLocaleString("en-NG")}`}
        description="Customer balances"
        icon={<ClipboardList size={19} />}
        tone="amber"
      />

    </div>
  );
}