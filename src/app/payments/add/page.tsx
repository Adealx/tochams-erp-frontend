"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getInvoices } from "@/services/invoiceService";
import { createPayment } from "@/services/paymentService";

export default function AddPayment() {

  const router = useRouter();

  const [invoices, setInvoices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    invoice: "",
    amount_paid: "",
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await createPayment(formData);

      toast.success("Payment recorded successfully");

      router.push("/payments");

    } catch (error: any) {

      console.error(error);

      alert(
        JSON.stringify(
          error.response?.data || "Failed to record payment"
        )
      );
    }
  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Record Payment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >

        <select
          name="invoice"
          value={formData.invoice}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >

          <option value="">
            Select Invoice
          </option>

          {invoices.map((invoice) => (

            <option
              key={invoice.id}
              value={invoice.id}
            >
              {invoice.invoice_number}
              {" - "}
              ₦{invoice.amount}
            </option>

          ))}

        </select>

        <input
          type="number"
          name="amount_paid"
          value={formData.amount_paid}
          onChange={handleChange}
          placeholder="Amount Paid"
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Save Payment
        </button>

      </form>

    </div>
  );
}