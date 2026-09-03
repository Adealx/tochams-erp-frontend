"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { createPayment } from "@/services/paymentService";
import toast from "react-hot-toast";
import AppShell from "@/components/layout/AppShell";
import { CreditCard, Landmark, ReceiptText } from "lucide-react";

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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    invoice: "",
    amount_paid: "",
    payment_method: "Bank Transfer",
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await api.get("/invoices/");

      const unpaidInvoices = response.data.filter(
        (invoice: Invoice) => Number(invoice.balance_due) > 0
      );

      setInvoices(unpaidInvoices);
    } catch (error) {
      console.error("Failed to load invoices", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectedInvoice = invoices.find(
    (invoice) => invoice.id === Number(formData.invoice)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await createPayment({
        invoice: Number(formData.invoice),
        amount_paid: Number(formData.amount_paid),
        payment_method: formData.payment_method,
      });

      toast.success("Payment recorded successfully");

      window.location.href = "/payments";
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to record payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Record Payment"
      subtitle="Record customer payments against outstanding invoices."
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
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.5fr_.85fr]">
      <div className="rounded-[20px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)] sm:p-7">
        <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CreditCard size={19} /></span><div><h2 className="font-semibold text-slate-900">Payment details</h2><p className="mt-0.5 text-sm text-slate-500">Select an invoice and record the amount received.</p></div></div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Invoice
            </label>

            <select
              name="invoice"
              value={formData.invoice}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              required
            >
              <option value="">Select Invoice</option>

              {invoices.map((invoice) => (
                <option
                  key={invoice.id}
                  value={invoice.id}
                >
                  {invoice.invoice_number} - {invoice.customer_name}
                </option>
              ))}
            </select>
          </div>

          {selectedInvoice && (
            <div
              className="
                rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5
              "
            >
              <h3 className="mb-4 text-sm font-bold text-indigo-950">
                Invoice Details
              </h3>

              <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>
                  <span className="font-semibold">
                    Invoice:
                  </span>{" "}
                  {selectedInvoice.invoice_number}
                </p>

                <p>
                  <span className="font-semibold">
                    Customer:
                  </span>{" "}
                  {selectedInvoice.customer_name}
                </p>

                <p>
                  <span className="font-semibold">
                    Invoice Amount:
                  </span>{" "}
                  ₦
                  {Number(
                    selectedInvoice.amount
                  ).toLocaleString()}
                </p>

                <p>
                  <span className="font-semibold">
                    Balance Due:
                  </span>{" "}
                  ₦
                  {Number(
                    selectedInvoice.balance_due
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Amount Paid
            </label>

            <input
              type="number"
              name="amount_paid"
              placeholder="Enter amount paid"
              value={formData.amount_paid}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Payment Method
            </label>

            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">
                Bank Transfer
              </option>
              <option value="POS">POS</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl bg-emerald-600 px-6 py-3
              font-semibold
              text-white
              transition
              hover:bg-emerald-700 hover:-translate-y-px
              disabled:cursor-not-allowed
              disabled:bg-green-300
            "
          >
            {loading
              ? "Recording Payment..."
              : "Record Payment"}
          </button>
        </form>
      </div>
      <aside className="h-fit rounded-[20px] border border-slate-200/90 bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,.035)]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600"><Landmark size={19} /></span><h2 className="mt-5 font-semibold text-slate-900">Good to know</h2><p className="mt-2 text-sm leading-6 text-slate-500">Payments are applied to the selected invoice and update its outstanding balance automatically.</p><div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600"><div className="flex items-center gap-2 font-medium"><ReceiptText size={16} className="text-indigo-500" />Keep your receipt reference</div><p className="mt-2 leading-5 text-slate-500">Use the same payment method shown on your bank receipt for easier reconciliation.</p></div></aside>
      </div>
    </AppShell>
  );
}
