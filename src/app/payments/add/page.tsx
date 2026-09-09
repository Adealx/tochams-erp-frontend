"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Landmark,
  ReceiptText,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { getInvoices } from "@/services/invoiceService";
import { createPayment } from "@/services/paymentService";

interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  amount: string;
  balance_due: string;
  total_paid: string;
  invoice_status: string;
  status: string;
}

export default function AddPaymentPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  const [formData, setFormData] = useState({
    invoice: "",
    amount_paid: "",
    payment_method: "Bank Transfer",
  });

  // ============================================================
  // LOAD OUTSTANDING INVOICES
  // ============================================================

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoadingInvoices(true);

      const data = await getInvoices();

      const unpaidInvoices = data.filter(
        (invoice: Invoice) =>
          Number(invoice.balance_due) > 0
      );

      setInvoices(unpaidInvoices);
    } catch (error) {
      console.error(
        "Failed to load invoices:",
        error
      );

      toast.error(
        "Unable to load outstanding invoices."
      );
    } finally {
      setLoadingInvoices(false);
    }
  };

  // ============================================================
  // SELECTED INVOICE
  // ============================================================

  const selectedInvoice = useMemo(
    () =>
      invoices.find(
        (invoice) =>
          invoice.id === Number(formData.invoice)
      ),
    [invoices, formData.invoice]
  );

  // ============================================================
  // PAYMENT CALCULATIONS
  // ============================================================

  const enteredAmount = Number(
    formData.amount_paid || 0
  );

  const outstandingBalance = selectedInvoice
    ? Number(selectedInvoice.balance_due)
    : 0;

  const exceedsBalance =
    selectedInvoice !== undefined &&
    enteredAmount > outstandingBalance;

  const remainingBalance = selectedInvoice
    ? Math.max(
        outstandingBalance - enteredAmount,
        0
      )
    : 0;

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // ============================================================
  // SUBMIT PAYMENT
  // ============================================================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!selectedInvoice) {
      toast.error("Please select an invoice.");
      return;
    }

    if (enteredAmount <= 0) {
      toast.error(
        "Payment amount must be greater than zero."
      );
      return;
    }

    if (exceedsBalance) {
      toast.error(
        "Payment cannot exceed the outstanding invoice balance."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await createPayment({
        invoice: selectedInvoice.id,
        amount_paid: enteredAmount,
        payment_method: formData.payment_method,
      });

      toast.success(
        `Payment ${
          response?.payment?.payment_number || ""
        } recorded successfully.`
      );

      router.push("/payments");
    } catch (error: any) {
      console.error(
        "Failed to record payment:",
        error
      );

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to record payment.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <AppShell
      title="Record Payment"
      subtitle="Record a customer payment against an outstanding invoice."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Payments",
          href: "/payments",
        },
        {
          label: "Record Payment",
        },
      ]}
      actions={[
        {
          label: "Back to Payments",
          href: "/payments",
        },
      ]}
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.5fr_.85fr]">

        {/* =====================================================
            PAYMENT FORM
        ====================================================== */}

        <div className="rounded-[20px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)] sm:p-7">

          <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">

            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard size={19} />
            </span>

            <div>
              <h2 className="font-semibold text-slate-900">
                Payment details
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Select an invoice and record the amount received.
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =================================================
                INVOICE
            ================================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Invoice
              </label>

              <select
                name="invoice"
                value={formData.invoice}
                onChange={handleChange}
                disabled={
                  loadingInvoices || loading
                }
                required
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
              >
                <option value="">
                  {loadingInvoices
                    ? "Loading invoices..."
                    : "Select Invoice"}
                </option>

                {invoices.map((invoice) => (
                  <option
                    key={invoice.id}
                    value={invoice.id}
                  >
                    {invoice.invoice_number} —{" "}
                    {invoice.customer_name} — ₦
                    {Number(
                      invoice.balance_due
                    ).toLocaleString()}
                    {" due"}
                  </option>
                ))}
              </select>

              {!loadingInvoices &&
                invoices.length === 0 && (
                  <p className="mt-2 flex items-center gap-2 text-xs text-amber-600">
                    <AlertCircle size={14} />

                    There are no invoices with
                    outstanding balances.
                  </p>
                )}
            </div>

            {/* =================================================
                INVOICE DETAILS
            ================================================== */}

            {selectedInvoice && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">

                <h3 className="mb-4 text-sm font-bold text-indigo-950">
                  Invoice Details
                </h3>

                <div className="grid gap-4 text-sm md:grid-cols-2">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Invoice
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {selectedInvoice.invoice_number}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {selectedInvoice.customer_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Invoice Amount
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      ₦
                      {Number(
                        selectedInvoice.amount
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Outstanding
                    </p>

                    <p className="mt-1 font-bold text-indigo-700">
                      ₦
                      {Number(
                        selectedInvoice.balance_due
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                AMOUNT PAID
            ================================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Amount Paid
              </label>

              <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ₦
                </span>

                <input
                  type="number"
                  name="amount_paid"
                  min="0.01"
                  step="0.01"
                  value={formData.amount_paid}
                  onChange={handleChange}
                  placeholder="Enter amount paid"
                  disabled={
                    !selectedInvoice || loading
                  }
                  required
                  className={`h-11 w-full rounded-xl border bg-white pl-8 pr-3 text-sm text-slate-700 outline-none transition focus:ring-4 ${
                    exceedsBalance
                      ? "border-red-300 focus:border-red-300 focus:ring-red-100"
                      : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100"
                  } disabled:bg-slate-50`}
                />

              </div>

              {selectedInvoice && (
                <div className="mt-2 flex justify-between text-xs">

                  <span className="text-slate-500">
                    Maximum payment:
                  </span>

                  <span className="font-semibold text-slate-700">
                    ₦
                    {outstandingBalance.toLocaleString(
                      "en-NG",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>

                </div>
              )}

              {exceedsBalance && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  Amount exceeds the outstanding
                  invoice balance.
                </p>
              )}
            </div>

            {/* =================================================
                PAYMENT METHOD
            ================================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Payment Method
              </label>

              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                disabled={loading}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
              >
                <option value="Cash">
                  Cash
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="POS">
                  POS
                </option>

                <option value="Cheque">
                  Cheque
                </option>
              </select>
            </div>

            {/* =================================================
                REMAINING BALANCE PREVIEW
            ================================================== */}

            {selectedInvoice &&
              enteredAmount > 0 &&
              !exceedsBalance && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-emerald-800">
                      Remaining invoice balance
                    </span>

                    <strong className="text-emerald-900">
                      ₦
                      {remainingBalance.toLocaleString(
                        "en-NG",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </strong>

                  </div>

                </div>
              )}

            {/* =================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={
                loading ||
                loadingInvoices ||
                !selectedInvoice ||
                exceedsBalance
              }
              className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-px hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {loading
                ? "Recording Payment..."
                : "Record Payment"}
            </button>

          </form>
        </div>

        {/* =====================================================
            INFORMATION PANEL
        ====================================================== */}

        <aside className="h-fit rounded-[20px] border border-slate-200/90 bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <Landmark size={19} />
          </span>

          <h2 className="mt-5 font-semibold text-slate-900">
            Payment & Accounting
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Payments are posted against the selected
            invoice and automatically update its
            Accounts Receivable balance.
          </p>

          <div className="mt-5 border-t border-slate-100 pt-4">

            <div className="flex items-center gap-2 font-medium text-slate-700">

              <ReceiptText
                size={16}
                className="text-indigo-500"
              />

              Accounting entry

            </div>

            <p className="mt-2 text-sm leading-5 text-slate-500">
              A posted customer payment creates a
              Bank debit and Accounts Receivable
              credit.
            </p>

          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">

            <div className="flex items-center gap-2 font-medium text-slate-700">

              <AlertCircle
                size={16}
                className="text-amber-500"
              />

              Important

            </div>

            <p className="mt-2 text-sm leading-5 text-slate-500">
              Cancelled payments are reversed through
              accounting and cannot be reposted.
            </p>

          </div>

          <button
            type="button"
            onClick={() => router.push("/payments")}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={15} />
            Back to Payments
          </button>

        </aside>

      </div>
    </AppShell>
  );
}