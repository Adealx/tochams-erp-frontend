import {
  getExpenses,
  Expense,
} from "@/services/expenseService";

import {
  getInvoices,
} from "@/services/invoiceService";

// ============================================================
// TRANSACTION TYPE
// ============================================================

export type TransactionType =
  | "Sale"
  | "Expense";

// ============================================================
// TRACKER TRANSACTION
// ============================================================

export interface TrackerTransaction {
  id: string;

  sourceId: number;

  type: TransactionType;

  date: string;

  reference: string;

  party: string;

  description: string;

  amount: number;

  status: string;

  account: string;

  paymentMethod: string;

  journalReference: string | null;

  sourcePath: string;
}

// ============================================================
// INVOICE SHAPE
// ============================================================

interface InvoiceRecord {
  id: number;

  invoice_number?: string;

  amount?: number | string;

  balance_due?: number | string;

  invoice_status?: string;

  status?: string;

  date?: string;

  invoice_date?: string;

  created_at?: string;

  due_date?: string;

  description?: string;

  customer?: any;

  customer_name?: string;

  customer_detail?: {
    name?: string;
    company?: string;
  };

  sales_order?: any;

  sales_order_number?: string;

  order_number?: string;

  payment_method?: string;

  journal_reference?: string | null;

  journal?: {
    reference?: string;
  };
}

// ============================================================
// HELPERS
// ============================================================

function toNumber(
  value: unknown
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getCustomerName(
  invoice: InvoiceRecord
): string {
  if (
    typeof invoice.customer === "object" &&
    invoice.customer !== null
  ) {
    return (
      invoice.customer.name ||
      invoice.customer.company ||
      `Customer #${invoice.customer.id || invoice.id}`
    );
  }

  if (
    invoice.customer_name
  ) {
    return invoice.customer_name;
  }

  if (
    invoice.customer_detail?.name
  ) {
    return invoice.customer_detail.name;
  }

  if (
    invoice.customer_detail?.company
  ) {
    return invoice.customer_detail.company;
  }

  if (
    typeof invoice.customer === "string"
  ) {
    return invoice.customer;
  }

  if (
    typeof invoice.customer === "number"
  ) {
    return `Customer #${invoice.customer}`;
  }

  return "Customer";
}

function getInvoiceDate(
  invoice: InvoiceRecord
): string {
  return (
    invoice.date ||
    invoice.invoice_date ||
    invoice.created_at ||
    invoice.due_date ||
    ""
  );
}

function getInvoiceStatus(
  invoice: InvoiceRecord
): string {
  return (
    invoice.invoice_status ||
    invoice.status ||
    "Pending"
  );
}

function getInvoiceReference(
  invoice: InvoiceRecord
): string {
  return (
    invoice.invoice_number ||
    `INV-${invoice.id}`
  );
}

function getInvoiceDescription(
  invoice: InvoiceRecord
): string {
  if (invoice.description) {
    return invoice.description;
  }

  if (
    invoice.sales_order_number
  ) {
    return `Sales order ${invoice.sales_order_number}`;
  }

  if (
    invoice.order_number
  ) {
    return `Sales order ${invoice.order_number}`;
  }

  if (
    typeof invoice.sales_order === "object" &&
    invoice.sales_order !== null
  ) {
    return (
      invoice.sales_order.order_number
        ? `Sales order ${invoice.sales_order.order_number}`
        : "Customer sale"
    );
  }

  if (
    typeof invoice.sales_order === "string"
  ) {
    return `Sales order ${invoice.sales_order}`;
  }

  return "Customer sale";
}

// ============================================================
// SALES NORMALIZATION
// ============================================================

function normalizeInvoice(
  invoice: InvoiceRecord
): TrackerTransaction {
  return {
    id: `sale-${invoice.id}`,

    sourceId: invoice.id,

    type: "Sale",

    date: getInvoiceDate(invoice),

    reference: getInvoiceReference(invoice),

    party: getCustomerName(invoice),

    description:
      getInvoiceDescription(invoice),

    amount: toNumber(invoice.amount),

    status: getInvoiceStatus(invoice),

    account: "Sales Revenue",

    paymentMethod:
      invoice.payment_method ||
      "—",

    journalReference:
      invoice.journal_reference ||
      invoice.journal?.reference ||
      null,

    sourcePath:
      `/invoices/${invoice.id}`,
  };
}

// ============================================================
// EXPENSE NORMALIZATION
// ============================================================

function normalizeExpense(
  expense: Expense
): TrackerTransaction {
  return {
    id: `expense-${expense.id}`,

    sourceId: expense.id,

    type: "Expense",

    date: expense.date,

    reference:
      expense.expense_number ||
      `EXP-${expense.id}`,

    party:
      expense.supplier_detail?.company_name ||
      "Internal Expense",

    description:
      expense.description ||
      "Expense",

    amount:
      toNumber(expense.amount),

    status:
      expense.status,

    account:
      expense.expense_account_detail?.name ||
      "Expense",

    paymentMethod:
      expense.payment_method,

    journalReference:
      expense.journal_reference,

    sourcePath:
      `/expenses/${expense.id}`,
  };
}

// ============================================================
// GET TRANSACTIONS
// ============================================================

export async function getTransactionTrackerData(): Promise<
  TrackerTransaction[]
> {
  const [
    invoicesResult,
    expensesResult,
  ] = await Promise.allSettled([
    getInvoices(),
    getExpenses(),
  ]);

  const transactions: TrackerTransaction[] = [];

  // ----------------------------------------------------------
  // SALES
  // ----------------------------------------------------------

  if (
    invoicesResult.status ===
    "fulfilled"
  ) {
    const invoices =
      Array.isArray(
        invoicesResult.value
      )
        ? invoicesResult.value
        : [];

    invoices.forEach(
      (invoice: InvoiceRecord) => {
        transactions.push(
          normalizeInvoice(invoice)
        );
      }
    );
  } else {
    console.error(
      "Failed to load invoices:",
      invoicesResult.reason
    );
  }

  // ----------------------------------------------------------
  // EXPENSES
  // ----------------------------------------------------------

  if (
    expensesResult.status ===
    "fulfilled"
  ) {
    const expenses =
      Array.isArray(
        expensesResult.value
      )
        ? expensesResult.value
        : [];

    expenses.forEach(
      (expense: Expense) => {
        transactions.push(
          normalizeExpense(expense)
        );
      }
    );
  } else {
    console.error(
      "Failed to load expenses:",
      expensesResult.reason
    );
  }

  // ----------------------------------------------------------
  // SORT NEWEST FIRST
  // ----------------------------------------------------------

  transactions.sort((a, b) => {
    const dateA = new Date(
      a.date || 0
    ).getTime();

    const dateB = new Date(
      b.date || 0
    ).getTime();

    return dateB - dateA;
  });

  return transactions;
}