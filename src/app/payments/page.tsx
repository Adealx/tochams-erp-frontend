"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
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

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      invoice: "",
      amount_paid: "",
      payment_method: "Bank Transfer",
    });

  useEffect(() => {

    loadInvoices();

  }, []);

  const loadInvoices = async () => {

    try {

      const response =
        await api.get("/invoices/");

      const unpaidInvoices =
        response.data.filter(
          (invoice: Invoice) =>
            Number(invoice.balance_due) > 0
        );

      setInvoices(
        unpaidInvoices
      );

    } catch (error) {

      console.error(
        "Failed to load invoices",
        error
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });
  };

  const selectedInvoice =
    invoices.find(
      invoice =>
        invoice.id ===
        Number(
          formData.invoice
        )
    );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      await createPayment({

        invoice: Number(
          formData.invoice
        ),

        amount_paid:
          Number(
            formData.amount_paid
          ),

        payment_method:
          formData.payment_method,

      });

      alert(
        "Payment recorded successfully"
      );

      window.location.href =
        "/payments";

    } catch (error: any) {

      console.error(error);

      alert(
        JSON.stringify(
          error.response?.data
        )
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">

        Record Payment

      </h1>

      <div className="bg-white p-6 rounded shadow">

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <select
            name="invoice"
            value={formData.invoice}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          >

            <option value="">

              Select Invoice

            </option>

            {invoices.map(
              (invoice) => (

                <option
                  key={invoice.id}
                  value={invoice.id}
                >

                  {invoice.invoice_number}
                  {" - "}
                  {invoice.customer_name}

                </option>

              )
            )}

          </select>

          {selectedInvoice && (

            <div className="bg-gray-100 p-4 rounded">

              <p>

                <strong>
                  Invoice:
                </strong>

                {" "}

                {
                  selectedInvoice.invoice_number
                }

              </p>

              <p>

                <strong>
                  Customer:
                </strong>

                {" "}

                {
                  selectedInvoice.customer_name
                }

              </p>

              <p>

                <strong>
                  Amount:
                </strong>

                {" "}

                ₦

                {Number(
                  selectedInvoice.amount
                ).toLocaleString()}

              </p>

              <p>

                <strong>
                  Balance Due:
                </strong>

                {" "}

                ₦

                {Number(
                  selectedInvoice.balance_due
                ).toLocaleString()}

              </p>

            </div>

          )}

          <input
            type="number"
            name="amount_paid"
            placeholder="Amount Paid"
            value={
              formData.amount_paid
            }
            onChange={
              handleChange
            }
            className="border p-3 rounded w-full"
            required
          />

          <select
            name="payment_method"
            value={
              formData.payment_method
            }
            onChange={
              handleChange
            }
            className="border p-3 rounded w-full"
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

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded w-full"
          >

            {loading
              ? "Saving..."
              : "Record Payment"}

          </button>

        </form>

      </div>

    </div>
  );
}