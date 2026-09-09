import api from "./api";

// ============================================================
// ACCOUNT
// ============================================================

export interface ExpenseAccount {
  id: number;
  code: string;
  name: string;
  account_type: string;
}


// ============================================================
// SUPPLIER
// ============================================================

export interface ExpenseSupplier {
  id: number;
  vendor_code: string;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
}


// ============================================================
// EXPENSE STATUS
// ============================================================

export type ExpenseStatus =
  | "draft"
  | "posted"
  | "cancelled";


// ============================================================
// PAYMENT METHOD
// ============================================================

export type ExpensePaymentMethod =
  | "cash"
  | "bank"
  | "credit";


// ============================================================
// EXPENSE
// ============================================================

export interface Expense {
  id: number;

  // ----------------------------------------------------------
  // Identification
  // ----------------------------------------------------------

  expense_number: string;
  reference: string;

  // ----------------------------------------------------------
  // Expense details
  // ----------------------------------------------------------

  date: string;
  description: string;
  amount: string;

  // ----------------------------------------------------------
  // Expense account
  // ----------------------------------------------------------

  expense_account: number;
  expense_account_detail: ExpenseAccount;

  // ----------------------------------------------------------
  // Supplier
  // ----------------------------------------------------------

  supplier: number | null;
  supplier_detail: ExpenseSupplier | null;

  // ----------------------------------------------------------
  // Payment account
  // ----------------------------------------------------------

  payment_account: number | null;
  payment_account_detail: ExpenseAccount | null;

  // ----------------------------------------------------------
  // Payment method
  // ----------------------------------------------------------

  payment_method: ExpensePaymentMethod;

  // ----------------------------------------------------------
  // Status
  // ----------------------------------------------------------

  status: ExpenseStatus;

  // ----------------------------------------------------------
  // Accounting
  // ----------------------------------------------------------

  journal: number | null;
  journal_reference: string | null;

  // ----------------------------------------------------------
  // User
  // ----------------------------------------------------------

  created_by: number | null;
  created_by_name: string | null;

  // ----------------------------------------------------------
  // Timestamps
  // ----------------------------------------------------------

  created_at: string;
  updated_at: string;
}


// ============================================================
// CREATE EXPENSE DATA
// ============================================================

export interface CreateExpenseData {
  date: string;

  expense_account: number;

  supplier?: number | null;

  payment_account?: number | null;

  amount: number;

  payment_method: ExpensePaymentMethod;

  reference?: string;

  description?: string;
}


// ============================================================
// POST EXPENSE RESPONSE
// ============================================================

export interface PostExpenseResponse {
  message: string;

  expense: Expense;

  journal: {
    id: number;
    reference: string;
    status: string;
  };
}


// ============================================================
// CANCEL EXPENSE RESPONSE
// ============================================================

export interface CancelExpenseResponse {
  message: string;

  expense: Expense;

  original_journal: {
    id: number;
    reference: string;
    status: string;
  };

  reversal_journal: {
    id: number;
    reference: string;
    status: string;
  };
}


// ============================================================
// GET EXPENSES
// ============================================================

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await api.get(
    "/accounting/expenses/"
  );

  return response.data;
};


// ============================================================
// GET SINGLE EXPENSE
// ============================================================

export const getExpense = async (
  expenseId: number
): Promise<Expense> => {
  const response = await api.get(
    `/accounting/expenses/${expenseId}/`
  );

  return response.data;
};


// ============================================================
// CREATE EXPENSE
// ============================================================

export const createExpense = async (
  expenseData: CreateExpenseData
): Promise<Expense> => {
  const response = await api.post(
    "/accounting/expenses/",
    expenseData
  );

  return response.data;
};


// ============================================================
// POST EXPENSE
// ============================================================

export const postExpense = async (
  expenseId: number
): Promise<PostExpenseResponse> => {
  const response = await api.post(
    `/accounting/expenses/${expenseId}/post/`
  );

  return response.data;
};


// ============================================================
// CANCEL EXPENSE
// ============================================================

export const cancelExpense = async (
  expenseId: number
): Promise<CancelExpenseResponse> => {
  const response = await api.post(
    `/accounting/expenses/${expenseId}/cancel/`
  );

  return response.data;
};