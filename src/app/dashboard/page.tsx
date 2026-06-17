"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import { getCustomers } from "@/services/customerService";
import { getInvoices } from "@/services/invoiceService";
import { getPayments } from "@/services/paymentService";

const COLORS = [
  "#22c55e",
  "#eab308",
  "#3b82f6",
  "#ef4444",
];

export default function Dashboard() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      customers: 0,
      products: 0,
      orders: 0,
      invoices: 0,
      payments: 0,
      outstanding: 0,
      pendingOrders: 0,
      lowStock: 0,
    });

  const [invoiceChart, setInvoiceChart] =
    useState<any[]>([]);

  const [lowStockProducts, setLowStockProducts] =
    useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const customers =
        await getCustomers();

      const invoices =
        await getInvoices();

      const payments =
        await getPayments();

      const productsResponse =
        await api.get("/products/");

      const ordersResponse =
        await api.get("/orders/");

      const products =
        Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];

      const orders =
        Array.isArray(ordersResponse.data)
          ? ordersResponse.data
          : [];

      const lowStock =
        products.filter(
          (product: any) =>
            product.stock_quantity <= 10
        );

      setLowStockProducts(
        lowStock
      );

      const totalPayments =
        payments.reduce(
          (
            sum: number,
            payment: any
          ) =>
            sum +
            Number(
              payment.amount_paid || 0
            ),
          0
        );

      const totalInvoices =
        invoices.reduce(
          (
            sum: number,
            invoice: any
          ) =>
            sum +
            Number(
              invoice.amount || 0
            ),
          0
        );

      const pendingOrders =
        orders.filter(
          (order: any) =>
            order.status === "Pending"
        ).length;

      const invoiceStatusData = [
        {
          name: "Paid",
          value: invoices.filter(
            (invoice: any) =>
              invoice.invoice_status ===
              "Paid"
          ).length,
        },

        {
          name: "Pending",
          value: invoices.filter(
            (invoice: any) =>
              invoice.invoice_status ===
              "Pending"
          ).length,
        },

        {
          name: "Partially Paid",
          value: invoices.filter(
            (invoice: any) =>
              invoice.invoice_status ===
              "Partially Paid"
          ).length,
        },

        {
          name: "Overdue",
          value: invoices.filter(
            (invoice: any) =>
              invoice.invoice_status ===
              "Overdue"
          ).length,
        },
      ];

      setInvoiceChart(
        invoiceStatusData
      );

      setStats({
        customers:
          customers.length,

        products:
          products.length,

        orders:
          orders.length,

        invoices:
          invoices.length,

        payments:
          totalPayments,

        outstanding:
          totalInvoices -
          totalPayments,

        pendingOrders,

        lowStock:
          lowStock.length,
      });

    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

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
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        ARP Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <Card
          title="Customers"
          value={stats.customers}
        />

        <Card
          title="Products"
          value={stats.products}
        />

        <Card
          title="Sales Orders"
          value={stats.orders}
        />

        <Card
          title="Invoices"
          value={stats.invoices}
        />

        <Card
          title="Pending Orders"
          value={stats.pendingOrders}
        />

        <Card
          title="Low Stock"
          value={stats.lowStock}
        />

        <Card
          title="Payments Received"
          value={`₦${stats.payments.toLocaleString()}`}
        />

        <Card
          title="Outstanding Receivables"
          value={`₦${stats.outstanding.toLocaleString()}`}
        />

      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-8">

        <h2 className="text-xl font-bold text-red-600 mb-4">
          ⚠ Low Stock Alerts
        </h2>

        {lowStockProducts.length === 0 ? (

          <p className="text-green-600">
            All products are adequately stocked.
          </p>

        ) : (

          <div className="space-y-3">

            {lowStockProducts.map(
              (product: any) => (

                <div
                  key={product.id}
                  className="flex justify-between border-b pb-2"
                >

                  <span>
                    {product.name}
                  </span>

                  <span className="font-bold text-red-600">
                    {product.stock_quantity}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Invoice Status Breakdown
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={invoiceChart}
                dataKey="value"
                outerRadius={100}
                label
              >

                {invoiceChart.map(
                  (_, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Orders Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={[
                {
                  name: "Orders",
                  total:
                    stats.orders,
                },
                {
                  name: "Pending",
                  total:
                    stats.pendingOrders,
                },
              ]}
            >

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="total"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h3 className="text-gray-500 mb-2">
        {title}
      </h3>

      <p className="text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}