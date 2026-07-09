"use client";

import StatCard from "@/components/cards/StatCard";

import {
  Users,
  Package,
  ShoppingCart,
  FileText,
  Clock3,
  AlertTriangle,
  CreditCard,
} from "lucide-react";

interface StatsGridProps {
  stats: {
    customers: number;
    products: number;
    orders: number;
    invoices: number;
    pendingOrders: number;
    lowStock: number;
    payments: number;
  };
}

export default function StatsGrid({
  stats,
}: StatsGridProps) {
  return (
    <section className="space-y-5">

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Operations Overview
        </h2>

        <p className="text-sm text-slate-500">
          Live operational performance
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-7
        "
      >

        <StatCard
          title="Customers"
          value={stats.customers}
          icon={<Users size={20} />}
          color="blue"
          description="Registered"
        />

        <StatCard
          title="Products"
          value={stats.products}
          icon={<Package size={20} />}
          color="cyan"
          description="Available"
        />

        <StatCard
          title="Sales Orders"
          value={stats.orders}
          icon={<ShoppingCart size={20} />}
          color="purple"
          description="Received"
        />

        <StatCard
          title="Invoices"
          value={stats.invoices}
          icon={<FileText size={20} />}
          color="green"
          description="Generated"
        />

        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<Clock3 size={20} />}
          color="amber"
          trend="Attention"
          trendDirection="neutral"
          description="Awaiting approval"
        />

        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon={<AlertTriangle size={20} />}
          color="red"
          badge="Critical"
          trend="Restock"
          trendDirection="down"
          description="Below minimum"
        />

        <StatCard
          title="Payments"
          value={`₦${stats.payments.toLocaleString()}`}
          icon={<CreditCard size={20} />}
          color="green"
          trend="+18%"
          trendDirection="up"
          description="Received"
        />

      </div>

    </section>
  );
}