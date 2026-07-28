"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getInvoices } from "@/services/invoiceService";
import AppShell from "@/components/layout/AppShell";

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
    } catch (error: any) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
  return (
    <AppShell
      title="Invoices"
      subtitle="Manage customer invoices and payment status."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Invoices" },
      ]}
    >
      <div>Loading invoices...</div>
    </AppShell>
  );
}

  return (
  <AppShell
    title="Invoices"
    subtitle="Manage customer invoices and payment status."
    breadcrumbs={[
      { label: "Dashboard", href: "/dashboard" },
      { label: "Invoices" },
    ]}
  >
    <div className="flex justify-between items-center">

      <Link
        href="/invoices/add"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Invoice
      </Link>

    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>
            <th className="p-4 text-left">Invoice No</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Due Date</th>
            <th className="p-4 text-left">Paid</th>
            <th className="p-4 text-left">Balance</th>
            <th className="p-4 text-left">Status</th>
          </tr>

        </thead>

        <tbody>

          {invoices.map((invoice) => (

            <tr
              key={invoice.id}
              className="border-b hover:bg-slate-50"
            >

              <td className="p-4">

                <Link
                  href={`/invoices/${invoice.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {invoice.invoice_number}
                </Link>

              </td>

              <td className="p-4">
                ₦{Number(invoice.amount).toLocaleString()}
              </td>

              <td className="p-4">
                {invoice.due_date}
              </td>

              <td className="p-4">
                ₦{Number(invoice.total_paid || 0).toLocaleString()}
              </td>

              <td className="p-4">
                ₦{Number(invoice.balance_due || 0).toLocaleString()}
              </td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    invoice.invoice_status === "Paid"
                      ? "bg-green-600"
                      : invoice.invoice_status === "Overdue"
                      ? "bg-red-600"
                      : invoice.invoice_status === "Partially Paid"
                      ? "bg-blue-600"
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

  </AppShell>
)};