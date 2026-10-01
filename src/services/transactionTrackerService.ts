import { getExpenses, Expense } from "@/services/expenseService";
import { getInvoices } from "@/services/invoiceService";

export type TransactionType = "Sale" | "Expense";

export interface TrackerTransaction {
  id: string;
  sourceId: number;
  type: TransactionType;

  date: string;
  reference: string;
  party: string;
  salesperson: string;
  description: string;

  account: string;
  paymentAccount: string;
  paymentMethod: string;

  amount: number;
  totalPaid: number;
  balanceDue: number;

  paymentDate: string | null;

  status: string;
  journalReference: string | null;

  sourcePath: string;
}

/* =========================================================
   TYPES
========================================================= */

interface InvoicePayment {
  id?: number;
  amount_paid?: number | string;
  payment_method?: string;
  payment_date?: string;
  status?: string;
}

interface InvoiceItem {
  id?: number;
  product?: number;
  product_name?: string;
  quantity?: number | string;
  retail_price?: number | string;
  total_price?: number | string;
}

interface InvoiceRecord {
  id: number;
  invoice_number?: string;

  amount?: number | string;
  total_paid?: number | string;
  balance_due?: number | string;

  status?: string;
  invoice_status?: string;

  due_date?: string;
  created_at?: string;
  invoice_date?: string;
  date?: string;

  customer?: unknown;
  customer_name?: string;

  created_by?: unknown;

  items?: InvoiceItem[];
  payments?: InvoicePayment[];

  payment_method?: string;

  journal_reference?: string | null;
}

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function isValidDate(value: unknown): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(String(value));

  return !Number.isNaN(date.getTime());
}

/* =========================================================
   CUSTOMER
========================================================= */

function getCustomerName(
  invoice: InvoiceRecord
): string {
  if (invoice.customer_name) {
    return invoice.customer_name;
  }

  if (
    typeof invoice.customer === "object" &&
    invoice.customer !== null
  ) {
    const customer =
      invoice.customer as Record<string, unknown>;

    if (typeof customer.name === "string") {
      return customer.name;
    }

    if (typeof customer.company_name === "string") {
      return customer.company_name;
    }

    if (typeof customer.company === "string") {
      return customer.company;
    }

    if (customer.id) {
      return `Customer #${customer.id}`;
    }
  }

  if (typeof invoice.customer === "string") {
    return invoice.customer;
  }

  if (typeof invoice.customer === "number") {
    return `Customer #${invoice.customer}`;
  }

  return "Customer";
}

/* =========================================================
   SALESPERSON
========================================================= */

function getSalesperson(
  invoice: InvoiceRecord
): string {
  const creator = invoice.created_by;

  if (
    typeof creator === "object" &&
    creator !== null
  ) {
    const user =
      creator as Record<string, unknown>;

    if (typeof user.full_name === "string") {
      return user.full_name;
    }

    if (typeof user.name === "string") {
      return user.name;
    }

    if (typeof user.username === "string") {
      return user.username;
    }

    if (typeof user.email === "string") {
      return user.email;
    }

    if (user.id) {
      return `User #${user.id}`;
    }
  }

  if (typeof creator === "string") {
    return creator;
  }

  if (typeof creator === "number") {
    return `User #${creator}`;
  }

  return "—";
}

/* =========================================================
   INVOICE DATE
========================================================= */

function getInvoiceDate(
  invoice: InvoiceRecord
): string {
  return (
    invoice.invoice_date ||
    invoice.date ||
    invoice.created_at ||
    invoice.due_date ||
    ""
  );
}

/* =========================================================
   INVOICE REFERENCE
========================================================= */

function getInvoiceReference(
  invoice: InvoiceRecord
): string {
  return (
    invoice.invoice_number ||
    `INV-${invoice.id}`
  );
}

/* =========================================================
   INVOICE STATUS
========================================================= */

function getInvoiceStatus(
  invoice: InvoiceRecord
): string {
  return (
    invoice.invoice_status ||
    invoice.status ||
    "Pending"
  );
}

/* =========================================================
   PAYMENTS
========================================================= */

function getPostedPayments(
  invoice: InvoiceRecord
): InvoicePayment[] {
  const payments = invoice.payments || [];

  return payments.filter((payment) => {
    const amount = toNumber(
      payment.amount_paid
    );

    if (amount <= 0) {
      return false;
    }

    if (
      payment.status &&
      payment.status.toLowerCase() === "cancelled"
    ) {
      return false;
    }

    return true;
  });
}

/* =========================================================
   PAYMENT METHOD
========================================================= */

function getPaymentMethod(
  invoice: InvoiceRecord
): string {
  const payments =
    getPostedPayments(invoice);

  if (payments.length === 0) {
    return "—";
  }

  const methods = payments
    .map((payment) => payment.payment_method)
    .filter(
      (method): method is string =>
        Boolean(method)
    );

  const uniqueMethods =
    Array.from(new Set(methods));

  return uniqueMethods.length > 0
    ? uniqueMethods.join(", ")
    : "—";
}

/* =========================================================
   PAYMENT DATE
========================================================= */

function getPaymentDate(
  invoice: InvoiceRecord
): string | null {
  const payments =
    getPostedPayments(invoice);

  const validPayments =
    payments.filter((payment) =>
      isValidDate(
        payment.payment_date
      )
    );

  if (validPayments.length === 0) {
    return null;
  }

  validPayments.sort((a, b) => {
    const dateA = new Date(
      a.payment_date || ""
    ).getTime();

    const dateB = new Date(
      b.payment_date || ""
    ).getTime();

    return dateB - dateA;
  });

  return (
    validPayments[0]?.payment_date ||
    null
  );
}

/* =========================================================
   TOTAL PAID
========================================================= */

function getTotalPaid(
  invoice: InvoiceRecord
): number {
  if (
    invoice.total_paid !== undefined &&
    invoice.total_paid !== null
  ) {
    return toNumber(
      invoice.total_paid
    );
  }

  const payments =
    getPostedPayments(invoice);

  return payments.reduce(
    (total, payment) => {
      return (
        total +
        toNumber(payment.amount_paid)
      );
    },
    0
  );
}

/* =========================================================
   BALANCE DUE
========================================================= */

function getBalanceDue(
  invoice: InvoiceRecord,
  amount: number,
  totalPaid: number
): number {
  if (
    invoice.balance_due !== undefined &&
    invoice.balance_due !== null
  ) {
    return Math.max(
      toNumber(invoice.balance_due),
      0
    );
  }

  return Math.max(
    amount - totalPaid,
    0
  );
}

/* =========================================================
   DESCRIPTION
========================================================= */

function getInvoiceDescription(
  invoice: InvoiceRecord
): string {
  const items =
    invoice.items || [];

  if (items.length === 0) {
    return "Customer Sale";
  }

  const names = items
    .map(
      (item) =>
        item.product_name
    )
    .filter(
      (name): name is string =>
        Boolean(name)
    );

  if (names.length === 0) {
    return "Customer Sale";
  }

  if (names.length === 1) {
    return names[0];
  }

  const remaining =
    names.length - 1;

  return `${names[0]} + ${remaining} other ${
    remaining === 1
      ? "item"
      : "items"
  }`;
}

/* =========================================================
   NORMALIZE SALE
========================================================= */

function normalizeInvoice(
  invoice: InvoiceRecord
): TrackerTransaction {
  const amount =
    toNumber(invoice.amount);

  const totalPaid =
    getTotalPaid(invoice);

  const balanceDue =
    getBalanceDue(
      invoice,
      amount,
      totalPaid
    );

  return {
    id: `sale-${invoice.id}`,

    sourceId: invoice.id,

    type: "Sale",

    date:
      getInvoiceDate(invoice),

    reference:
      getInvoiceReference(invoice),

    party:
      getCustomerName(invoice),

    salesperson:
      getSalesperson(invoice),

    description:
      getInvoiceDescription(invoice),

    account:
      "Sales Revenue",

    /*
     * The current invoice API does not expose
     * the accounting payment account.
     */
    paymentAccount:
      "—",

    paymentMethod:
      getPaymentMethod(invoice),

    amount,

    totalPaid,

    balanceDue,

    paymentDate:
      getPaymentDate(invoice),

    status:
      getInvoiceStatus(invoice),

    journalReference:
      invoice.journal_reference ||
      null,

    sourcePath:
      `/invoices/${invoice.id}`,
  };
}

/* =========================================================
   EXPENSE
========================================================= */

function normalizeExpense(
  expense: Expense
): TrackerTransaction {
  const expenseData =
    expense as Expense & {
      supplier_detail?: {
        company_name?: string;
      } | null;

      expense_account_detail?: {
        name?: string;
        code?: string;
      } | null;

      payment_account_detail?: {
        name?: string;
        code?: string;
      } | null;

      created_by_name?: string;

      journal_reference?: string | null;

      created_at?: string;
    };

  const amount =
    toNumber(expenseData.amount);

  return {
    id:
      `expense-${expenseData.id}`,

    sourceId:
      expenseData.id,

    type:
      "Expense",

    date:
      expenseData.date ||
      expenseData.created_at ||
      "",

    reference:
      expenseData.expense_number ||
      `EXP-${expenseData.id}`,

    party:
      expenseData
        .supplier_detail
        ?.company_name ||
      "Internal Expense",

    salesperson:
      expenseData.created_by_name ||
      "—",

    description:
      expenseData.description ||
      "Expense",

    account:
      expenseData
        .expense_account_detail
        ?.name ||
      expenseData
        .expense_account_detail
        ?.code ||
      "Expense",

    paymentAccount:
      expenseData
        .payment_account_detail
        ?.name ||
      expenseData
        .payment_account_detail
        ?.code ||
      "—",

    paymentMethod:
      expenseData.payment_method ||
      "—",

    amount,

    totalPaid:
      amount,

    balanceDue:
      0,

    paymentDate:
      expenseData.date ||
      null,

    status:
      expenseData.status ||
      "Pending",

    journalReference:
      expenseData.journal_reference ||
      null,

    sourcePath:
      `/expenses/${expenseData.id}`,
  };
}

/* =========================================================
   MAIN FUNCTION
========================================================= */

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

  const transactions: TrackerTransaction[] =
    [];

  /* -----------------------------
     INVOICES
  ----------------------------- */

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

    invoices.forEach((invoice) => {
      transactions.push(
        normalizeInvoice(
          invoice as InvoiceRecord
        )
      );
    });
  } else {
    console.error(
      "Failed to load invoices:",
      invoicesResult.reason
    );
  }

  /* -----------------------------
     EXPENSES
  ----------------------------- */

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

    expenses.forEach((expense) => {
      transactions.push(
        normalizeExpense(
          expense
        )
      );
    });
  } else {
    console.error(
      "Failed to load expenses:",
      expensesResult.reason
    );
  }

  /* -----------------------------
     SORT NEWEST FIRST
  ----------------------------- */

  transactions.sort((a, b) => {
    const dateA =
      isValidDate(a.date)
        ? new Date(a.date).getTime()
        : 0;

    const dateB =
      isValidDate(b.date)
        ? new Date(b.date).getTime()
        : 0;

    return dateB - dateA;
  });

  return transactions;
}

/* =========================================================
   EXCEL-STYLE CALCULATIONS
========================================================= */

export function calculateTotalSales(
  transactions: TrackerTransaction[]
): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === "Sale"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );
}

export function calculateTotalExpenses(
  transactions: TrackerTransaction[]
): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === "Expense"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );
}

export function calculateNetMovement(
  transactions: TrackerTransaction[]
): number {
  const totalSales =
    calculateTotalSales(
      transactions
    );

  const totalExpenses =
    calculateTotalExpenses(
      transactions
    );

  return (
    totalSales -
    totalExpenses
  );
}

export function calculateTotalPaid(
  transactions: TrackerTransaction[]
): number {
  return transactions.reduce(
    (total, transaction) =>
      total + transaction.totalPaid,
    0
  );
}

export function calculateTotalOutstanding(
  transactions: TrackerTransaction[]
): number {
  return transactions.reduce(
    (total, transaction) =>
      total + transaction.balanceDue,
    0
  );
}

export function calculateTransactionCount(
  transactions: TrackerTransaction[]
): number {
  return transactions.length;
}

export function calculateRegisterTotal(
  transactions: TrackerTransaction[]
): number {
  return transactions.reduce(
    (total, transaction) =>
      total + transaction.amount,
    0
  );
}

/* =========================================================
   PERCENTAGES
========================================================= */

export function calculateSalesPercentage(
  transaction: TrackerTransaction,
  transactions: TrackerTransaction[]
): number {
  if (
    transaction.type !== "Sale"
  ) {
    return 0;
  }

  const totalSales =
    calculateTotalSales(
      transactions
    );

  if (totalSales === 0) {
    return 0;
  }

  return (
    transaction.amount /
    totalSales
  ) * 100;
}

export function calculatePaymentPercentage(
  transaction: TrackerTransaction
): number {
  if (
    transaction.amount <= 0
  ) {
    return 0;
  }

  return (
    transaction.totalPaid /
    transaction.amount
  ) * 100;
}