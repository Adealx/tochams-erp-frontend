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

interface Props {
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
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

      <StatCard
        title="Customers"
        value={stats.customers}
        icon={<Users size={26} />}
      />

      <StatCard
        title="Products"
        value={stats.products}
        icon={<Package size={26} />}
      />

      <StatCard
        title="Sales Orders"
        value={stats.orders}
        icon={<ShoppingCart size={26} />}
      />

      <StatCard
        title="Invoices"
        value={stats.invoices}
        icon={<FileText size={26} />}
      />

      <StatCard
        title="Pending Orders"
        value={stats.pendingOrders}
        icon={<Clock3 size={26} />}
        variant="warning"
      />

      <StatCard
        title="Low Stock"
        value={stats.lowStock}
        icon={<AlertTriangle size={26} />}
        variant="danger"
      />

      <StatCard
        title="Payments"
        value={`₦${stats.payments.toLocaleString()}`}
        icon={<CreditCard size={26} />}
        variant="success"
      />

    </div>
  );
}