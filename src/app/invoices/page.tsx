"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getInvoices } from "@/services/invoiceService";

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading invoices...
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Invoices
        </h1>

        <Link
          href="/invoices/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Invoice
        </Link>

      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Paid</th>
              <th className="p-3 text-left">Balance</th>
              <th className="p-3 text-left">Status</th>
            </tr>

          </thead>

          <tbody>

            {invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-3">

                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {invoice.invoice_number}
                  </Link>

                </td>

                <td className="p-3">
                  ₦{Number(invoice.amount).toLocaleString()}
                </td>

                <td className="p-3">
                  {invoice.due_date}
                </td>

                <td className="p-3">
                  ₦{Number(invoice.total_paid || 0).toLocaleString()}
                </td>

                <td className="p-3">
                  ₦{Number(invoice.balance_due || 0).toLocaleString()}
                </td>

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded text-white ${
                      invoice.invoice_status === "Paid"
                        ? "bg-green-500"
                        : invoice.status === "Overdue"
                        ? "bg-red-500"
                        : invoice.status === "Partially Paid"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {invoice.invoice_status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}