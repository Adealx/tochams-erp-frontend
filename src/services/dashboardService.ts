import api from "@/services/api";

import { getCustomers } from "@/services/customerService";
import { getInvoices } from "@/services/invoiceService";
import { getPayments } from "@/services/paymentService";


// ============================================================
// TYPES
// ============================================================


export interface FinancialOverview {
  scope: "company" | "sales_rep";
  role: "management" | "sales_rep";

  revenue: number;
  paid: number;
  cogs: number;
  gross_profit: number;
  expenses: number;
  net_profit: number;
  outstanding: number;
}


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

  revenue: number;
  paid: number;
  cogs: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;

  financialScope: "company" | "sales_rep";
  financialRole: "management" | "sales_rep";
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


// ============================================================
// DASHBOARD SERVICE
// ============================================================


export async function getDashboardData(): Promise<DashboardData> {

  const results = await Promise.allSettled([

    getCustomers(),

    getInvoices(),

    getPayments(),

    api.get("/products/"),

    api.get("/orders/"),

    // --------------------------------------------------------
    // ROLE-AWARE FINANCIAL OVERVIEW
    //
    // Management:
    //     Company-wide financial information
    //
    // Sales Representative:
    //     Personal revenue, payments and receivables
    // --------------------------------------------------------

    api.get<FinancialOverview>(
      "/dashboard/financial-overview/"
    ),

  ]);


  // ==========================================================
  // CUSTOMERS
  // ==========================================================

  const customers =
    results[0].status === "fulfilled"
      ? results[0].value
      : [];


  if (results[0].status === "rejected") {
    console.error(
      "Customers API failed:",
      results[0].reason
    );
  }


  // ==========================================================
  // INVOICES
  // ==========================================================

  const invoices =
    results[1].status === "fulfilled"
      ? results[1].value
      : [];


  if (results[1].status === "rejected") {
    console.error(
      "Invoices API failed:",
      results[1].reason
    );
  }


  // ==========================================================
  // PAYMENTS
  // ==========================================================

  const payments =
    results[2].status === "fulfilled"
      ? results[2].value
      : [];


  if (results[2].status === "rejected") {
    console.error(
      "Payments API failed:",
      results[2].reason
    );
  }


  // ==========================================================
  // PRODUCTS
  // ==========================================================

  const products =
    results[3].status === "fulfilled"
      ? results[3].value.data
      : [];


  if (results[3].status === "rejected") {
    console.error(
      "Products API failed:",
      results[3].reason
    );
  }


  // ==========================================================
  // ORDERS
  // ==========================================================

  const orders =
    results[4].status === "fulfilled"
      ? results[4].value.data
      : [];


  if (results[4].status === "rejected") {
    console.error(
      "Orders API failed:",
      results[4].reason
    );
  }


  // ==========================================================
  // FINANCIAL OVERVIEW
  // ==========================================================

  const financial =
    results[5].status === "fulfilled"
      ? results[5].value.data
      : null;


  if (results[5].status === "rejected") {
    console.error(
      "Financial Overview API failed:",
      results[5].reason
    );
  }


  // ==========================================================
  // INVENTORY VALUES
  // ==========================================================

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


  // ==========================================================
  // PAYMENTS / RECEIVABLES
  // ==========================================================

  const totalPayments = payments.reduce(
    (sum: number, payment: any) =>
      sum + Number(payment.amount_paid || 0),
    0
  );


  const outstanding = financial
    ? Number(financial.outstanding || 0)
    : invoices.reduce(
        (sum: number, invoice: any) =>
          sum + Number(invoice.balance_due || 0),
        0
      );


  // ==========================================================
  // PAID
  //
  // Financial endpoint is now the source of truth.
  //
  // Fallback to payment API if the financial endpoint
  // is unavailable.
  // ==========================================================

  const paid = financial
    ? Number(financial.paid || 0)
    : totalPayments;


  // ==========================================================
  // LOW STOCK
  // ==========================================================

  const alerts = products.filter(
    (product: any) =>
      Number(product.stock_quantity) <= 10
  );


  // ==========================================================
  // PENDING ORDERS
  // ==========================================================

  const pendingOrders = orders.filter(
    (order: any) =>
      order.status === "Pending"
  ).length;


  // ==========================================================
  // INVOICE STATUS
  // ==========================================================

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


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    stats: {

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

      outstanding,

      pendingOrders,

      lowStock:
        alerts.length,

      storeValue,

      potentialSalesValue,

      potentialProfit,

      // ------------------------------------------------------
      // ACCOUNTING SOURCE OF TRUTH
      // ------------------------------------------------------

      revenue:
        financial
          ? Number(financial.revenue || 0)
          : 0,

      paid,

      cogs:
        financial
          ? Number(financial.cogs || 0)
          : 0,

      grossProfit:
        financial
          ? Number(financial.gross_profit || 0)
          : 0,

      expenses:
        financial
          ? Number(financial.expenses || 0)
          : 0,

      netProfit:
        financial
          ? Number(financial.net_profit || 0)
          : 0,

      financialScope:
        financial?.scope || "company",

      financialRole:
        financial?.role || "management",

    },

    invoiceChart,

    lowStock:
      alerts,

    orders,

    customers,

  };
}