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

  const [loading, setLoading] =
    useState(true);

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
        productsResponse.data;

      const storeValue =
        products.reduce(
          (sum: number, product: any) =>
            sum +
            Number(product.stock_value || 0),
          0
        );

      const potentialSalesValue =
        products.reduce(
          (sum: number, product: any) =>
            sum +
            Number(
              product.potential_sales_value || 0
            ),
          0
        );

      const potentialProfit =
        products.reduce(
          (sum: number, product: any) =>
            sum +
            Number(
              product.potential_profit || 0
            ),
          0
        );  
      
      const alerts = products.filter(
        (product: any) =>
          product.stock_quantity <= 10
      );

      setLowStock(alerts);

      const orders =
        ordersResponse.data;

      console.log(
        "Customers:",
        customers
      );

      console.log(
        "Invoices:",
        invoices
      );

      console.log(
        "Payments:",
        payments
      );

      console.log(
        "Products:",
        products
      );

      console.log(
        "Orders:",
        orders
      );

      console.log(
        "Low Stock:",
        alerts
      );

      setLowStock(alerts);

      const totalPayments =
        payments.reduce(
          (
            sum: number,
            payment: any
          ) =>
            sum +
            Number(
              payment.amount_paid
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
              invoice.amount
            ),
          0
        );

      const pendingOrders =
        orders.filter(
          (order: any) =>
            order.status ===
            "Pending"
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
        customers: customers.length,
        products: products.length,
        orders: orders.length,
        invoices: invoices.length,
        payments: totalPayments,
        outstanding:
          totalInvoices - totalPayments,
        pendingOrders,
        lowStock: alerts.length,

        storeValue,
        potentialSalesValue,
        potentialProfit,
      });

    } catch (error: any) {
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
  <div className="min-h-screen bg-gray-50 p-8">

    <div className="mb-8">

      <h1 className="text-5xl font-bold text-slate-800">
        TOCHAMS ERP
      </h1>

      <p className="text-slate-500 mt-2">
        Enterprise Resource Planning &
        Accounts Receivable Management
      </p>

    </div>

    <div
      className="
      bg-gradient-to-r
      from-blue-700
      via-indigo-700
      to-purple-700
      text-white
      p-8
      rounded-3xl
      shadow-xl
      mb-8
    "
    >

      <h2 className="text-3xl font-bold">
        Executive Dashboard
      </h2>

      <p className="mt-3 opacity-90">
        Monitor Sales, Inventory,
        Customers, Invoices and
        Payments in Real Time.
      </p>

    </div>

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
          title="Outstanding"
          value={`₦${stats.outstanding.toLocaleString()}`}
        />
        
        <Card
          title="Store Value"
          value={`₦${stats.storeValue.toLocaleString()}`}
        />

        <Card
          title="Sales Value"
          value={`₦${stats.potentialSalesValue.toLocaleString()}`}
        />

        <Card
          title="Potential Profit"
          value={`₦${stats.potentialProfit.toLocaleString()}`}
        />

      </div>

      <div
        className="
        bg-white
        rounded-3xl
        shadow-lg
        border
        border-red-100
        p-6
        mt-8
      "
      >

        <div className="flex items-center gap-3 mb-4">

          <span className="text-3xl">
            ⚠️
          </span>

          <h2 className="text-2xl font-bold text-red-600">
            Low Stock Alerts
          </h2>

        </div>

        {lowStock.length === 0 ? (

          <div
            className="
            bg-green-50
            text-green-700
            p-4
            rounded-xl
          "
          >
            All products are adequately stocked.
          </div>

        ) : (

          <div className="space-y-3">

            {lowStock.map(
              (product: any) => (

                <div
                  key={product.id}
                  className="
                  flex
                  justify-between
                  bg-red-50
                  p-4
                  rounded-xl
                  "
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

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Invoice Status
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
                  (
                    entry,
                    index
                  ) => (

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

  const icons: Record<string,string> = {
    Customers: "👥",
    Products: "📦",
    "Sales Orders": "🛒",
    Invoices: "📄",
    "Pending Orders": "⏳",
    "Low Stock": "⚠️",
    "Payments Received": "💰",
    Outstanding: "📊",
    
    "Store Value": "🏬",
    "Sales Value": "📈",
    "Potential Profit": "💵",
  };

  return (

    <div
      className="
      bg-white
      rounded-3xl
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      p-6
      border
      border-slate-100
      "
    >

      <div className="flex justify-between">

        <div>

          <p className="text-slate-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="text-5xl">
          {icons[title]}
        </div>

      </div>

    </div>

  );
}