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
  // Load everything in parallel
  const [
    customers,
    invoices,
    payments,
    productsResponse,
    ordersResponse,
  ] = await Promise.all([
    getCustomers(),
    getInvoices(),
    getPayments(),
    api.get("/products/"),
    api.get("/orders/"),
  ]);

  const products = productsResponse.data;
  const orders = ordersResponse.data;

  // Financial calculations
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
      sum + Number(payment.amount_paid),
    0
  );

  const totalInvoices = invoices.reduce(
    (sum: number, invoice: any) =>
      sum + Number(invoice.amount),
    0
  );

  const alerts = products.filter(
    (product: any) =>
      product.stock_quantity <= 10
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