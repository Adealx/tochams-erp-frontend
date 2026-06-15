"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCustomers } from "@/services/customerService";
import { createInvoice } from "@/services/invoiceService";

export default function AddInvoice() {

  const router = useRouter();

  const [customers, setCustomers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    customer: "",
    invoice_number: "",
    amount: "",
    due_date: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const handleChange = (
    e: any
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: any
  ) => {

    e.preventDefault();

    try {

      await createInvoice(formData);

      alert("Invoice created successfully");

      router.push("/invoices");

    } catch (error) {

      console.log("API ERROR:", error.response?.data);

      alert(JSON.stringify(error.response?.data));
    }
  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Create Invoice
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >

        <select
          name="customer"
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >

          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (

            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.name}
            </option>

          ))}

        </select>

        <input
          type="text"
          name="invoice_number"
          placeholder="Invoice Number"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="due_date"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Save Invoice
        </button>

      </form>

    </div>
  );
}