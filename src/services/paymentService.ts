import api from "./api";

export interface JournalLine {
  id: number;
  account_id: number;
  account_code: string;
  account_name: string;
  account_type: string;
  debit: string;
  credit: string;
  description: string;
}

export interface Payment {
  id: number;
  payment_number: string | null;

  invoice: number;
  invoice_number: string;
  customer_name: string;

  amount_paid: string;
  payment_method: string;
  payment_date: string;

  status: "Posted" | "Cancelled";

  journal: number | null;
  journal_reference: string | null;
  journal_status: "posted" | "reversed" | null;

  balance_due: string;

  created_by: number | null;
  created_at: string;

  cancellation_reason: string;
  cancelled_by: number | null;
  cancelled_by_name: string | null;
  cancelled_at: string | null;
}

export interface PaymentDetail extends Payment {
  journal_lines: JournalLine[];
}

export interface CreatePaymentData {
  invoice: number;
  amount_paid: number;
  payment_method: string;
}

export interface CancelPaymentResponse {
  message: string;
  payment: Payment;
  reversal_reference: string;
  cancellation_reason: string;
}

export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get("/payments/");
  return response.data;
};

export const getPayment = async (
  paymentId: number
): Promise<PaymentDetail> => {
  const response = await api.get(
    `/payments/${paymentId}/`
  );

  return response.data;
};

export const createPayment = async (
  paymentData: CreatePaymentData
) => {
  const response = await api.post(
    "/payments/",
    paymentData
  );

  return response.data;
};

export const cancelPayment = async (
  paymentId: number,
  reason: string
): Promise<CancelPaymentResponse> => {
  const response = await api.post(
    `/payments/${paymentId}/cancel/`,
    {
      reason,
    }
  );

  return response.data;
};