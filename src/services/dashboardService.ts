import api from "@/services/api";
import { getCustomers } from "@/services/customerService";
import { getInvoices } from "@/services/invoiceService";
import { getPayments } from "@/services/paymentService";

export interface DashboardStats {
  customers: number;
  products: number;
  orders: number;
  invoices: number;
  payments: number;
  outstanding: number;
  pendingOrders: number;
  lowStock: number;
  storeValue: number;
  potentialSalesValue: number;
  potentialProfit: number;
}

export interface InvoiceChartItem {
  name: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStats;
  invoiceChart: InvoiceChartItem[];
  lowStock: any[];
  orders: any[];
  customers: any[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const results = await Promise.allSettled([
    getCustomers(),
    getInvoices(),
    getPayments(),
    api.get("/products/"),
    api.get("/orders/"),
  ]);

  // Customers
  const customers =
    results[0].status === "fulfilled"
      ? results[0].value
      : [];

  if (results[0].status === "rejected") {
    console.error("Customers API failed:", results[0].reason);
  }

  // Invoices
  const invoices =
    results[1].status === "fulfilled"
      ? results[1].value
      : [];

  if (results[1].status === "rejected") {
    console.error("Invoices API failed:", results[1].reason);
  }

  // Payments
  const payments =
    results[2].status === "fulfilled"
      ? results[2].value
      : [];

  if (results[2].status === "rejected") {
    console.error("Payments API failed:", results[2].reason);
  }

  // Products
  const products =
    results[3].status === "fulfilled"
      ? results[3].value.data
      : [];

  if (results[3].status === "rejected") {
    console.error("Products API failed:", results[3].reason);
  }

  // Orders
  const orders =
    results[4].status === "fulfilled"
      ? results[4].value.data
      : [];

  if (results[4].status === "rejected") {
    console.error("Orders API failed:", results[4].reason);
  }

  // ==========================
  // Financial Calculations
  // ==========================

  const storeValue = products.reduce(
    (sum: number, product: any) =>
      sum + Number(product.stock_value || 0),
    0
  );

  const potentialSalesValue = products.reduce(
    (sum: number, product: any) =>
      sum + Number(product.potential_sales_value || 0),
    0
  );

  const potentialProfit = products.reduce(
    (sum: number, product: any) =>
      sum + Number(product.potential_profit || 0),
    0
  );

  const totalPayments = payments.reduce(
    (sum: number, payment: any) =>
      sum + Number(payment.amount_paid || 0),
    0
  );

  const totalInvoices = invoices.reduce(
    (sum: number, invoice: any) =>
      sum + Number(invoice.amount || 0),
    0
  );

  const alerts = products.filter(
    (product: any) =>
      Number(product.stock_quantity) <= 10
  );

  const pendingOrders = orders.filter(
    (order: any) =>
      order.status === "Pending"
  ).length;

  const invoiceChart: InvoiceChartItem[] = [
    {
      name: "Paid",
      value: invoices.filter(
        (invoice: any) =>
          invoice.invoice_status === "Paid"
      ).length,
    },
    {
      name: "Pending",
      value: invoices.filter(
        (invoice: any) =>
          invoice.invoice_status === "Pending"
      ).length,
    },
    {
      name: "Partially Paid",
      value: invoices.filter(
        (invoice: any) =>
          invoice.invoice_status === "Partially Paid"
      ).length,
    },
    {
      name: "Overdue",
      value: invoices.filter(
        (invoice: any) =>
          invoice.invoice_status === "Overdue"
      ).length,
    },
  ];

  return {
    stats: {
      customers: customers.length,
      products: products.length,
      orders: orders.length,
      invoices: invoices.length,
      payments: totalPayments,
      outstanding: totalInvoices - totalPayments,
      pendingOrders,
      lowStock: alerts.length,
      storeValue,
      potentialSalesValue,
      potentialProfit,
    },

    invoiceChart,

    lowStock: alerts,

    orders,

    customers,
  };
}