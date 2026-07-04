"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboardService";

import FinancialOverview from "@/components/dashboard/FinancialOverview";
import StatsGrid from "@/components/dashboard/StatsGrid";
import InvoiceStatusChart from "@/components/dashboard/InvoiceStatusChart";
import OrdersOverviewChart from "@/components/dashboard/OrdersOverviewChart";
import LowStockCard from "@/components/dashboard/LowStockCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import RecentCustomers from "@/components/dashboard/RecentCustomers";
import AppShell from "@/components/layout/AppShell";

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    invoices: 0,
    payments: 0,
    outstanding: 0,
    pendingOrders: 0,
    lowStock: 0,

    storeValue: 0,
    potentialSalesValue: 0,
    potentialProfit: 0,
  });

  const [invoiceChart, setInvoiceChart] =
    useState<any[]>([]);

  const [lowStock, setLowStock] =
    useState<any[]>([]);

  const [orders, setOrders] =
    useState<any[]>([]);

  const [customers, setCustomers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dashboard = await getDashboardData();

      setStats(dashboard.stats);
      setInvoiceChart(dashboard.invoiceChart);
      setLowStock(dashboard.lowStock);
      setOrders(dashboard.orders);
      setCustomers(dashboard.customers);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading Dashboard...
      </div>
    );
  }

  return (

  <AppShell
      title="Dashboard"
      subtitle="Enterprise Resource Planning Overview"
  >

    <FinancialOverview stats={stats} />

    <StatsGrid stats={stats} />

    <LowStockCard
        products={lowStock}
    />

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <InvoiceStatusChart
          data={invoiceChart}
        />

        <OrdersOverviewChart
          totalOrders={stats.orders}
          pendingOrders={stats.pendingOrders}
        />

      </div>
      
      <div className="grid lg:grid-cols-2 gap-6 mt-8">

    <RecentOrders
        orders={orders}
    />

    <RecentCustomers
        customers={customers}
    />

</div>

</AppShell>
  );
}