"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { createPayment } from "@/services/paymentService";
import toast from "react-hot-toast";
import AppShell from "@/components/layout/AppShell";

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
      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Invoice
            </label>

            <select
              name="invoice"
              value={formData.invoice}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                rounded-xl
                border
                border-blue-200
                bg-blue-50
                p-5
              "
            >
              <h3 className="mb-4 text-lg font-semibold text-blue-900">
                Invoice Details
              </h3>

              <div className="grid gap-3 md:grid-cols-2">
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
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Amount Paid
            </label>

            <input
              type="number"
              name="amount_paid"
              placeholder="Enter amount paid"
              value={formData.amount_paid}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Payment Method
            </label>

            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
              rounded-lg
              bg-green-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-green-700
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
    </AppShell>
  );
}