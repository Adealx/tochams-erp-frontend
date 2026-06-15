"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";
import { useRouter } from "next/navigation";

interface InvoiceItem {
  id: number;
  product_name: string;
  quantity: number;
  retail_price: string;
  total_price: string;
}

interface Payment {
  id: number;
  amount_paid: string;
  payment_date: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  amount: string;
  total_paid: string;
  balance_due: string;
  invoice_status: string;
  due_date: string;
  created_at: string;

  items: InvoiceItem[];
  payments: Payment[];
}

export default function InvoiceDetailPage() {

  const router = useRouter();

  const params = useParams();

  const [invoice, setInvoice] =
    useState<Invoice | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (params?.id) {
      loadInvoice();
    }

  }, [params]);

  const loadInvoice = async () => {

    try {

      const response =
        await api.get(
          `/invoices/${params.id}/detail/`
        );

      setInvoice(
        response.data
      );

    } catch (error) {

      console.error(
        "Invoice Detail Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  if (loading) {

    return (
      <div className="p-8">
        Loading Invoice...
      </div>
    );
  }

  if (!invoice) {

    return (
      <div className="p-8">
        Invoice not found.
      </div>
    );
  }

  return (

    <div className="p-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Invoice Details
        </h1>

      </div>

      {/* Invoice Summary */}

      <div className="bg-white shadow rounded p-6">

        <div className="grid grid-cols-2 gap-6">

          <div>

            <p>
              <strong>
                Invoice Number:
              </strong>
            </p>

            <p>
              {invoice.invoice_number}
            </p>

          </div>

          <div>

            <p>
              <strong>
                Customer:
              </strong>
            </p>

            <p>
              {invoice.customer_name}
            </p>

          </div>

          <div>

            <p>
              <strong>
                Invoice Amount:
              </strong>
            </p>

            <p>
              ₦
              {Number(
                invoice.amount
              ).toLocaleString()}
            </p>

          </div>

          <div>

            <p>
              <strong>
                Total Paid:
              </strong>
            </p>

            <p>
              ₦
              {Number(
                invoice.total_paid
              ).toLocaleString()}
            </p>

          </div>

          <div>

            <p>
              <strong>
                Balance Due:
              </strong>
            </p>

            <p>
              ₦
              {Number(
                invoice.balance_due
              ).toLocaleString()}
            </p>

          </div>

          <div>

            <p>
              <strong>
                Status:
              </strong>
            </p>

            <div className="mt-2">

              <span
                className={`px-3 py-1 rounded text-white ${
                  invoice.invoice_status === "Paid"
                    ? "bg-green-600"
                    : invoice.invoice_status === "Partially Paid"
                    ? "bg-yellow-500"
                    : invoice.invoice_status === "Overdue"
                    ? "bg-red-600"
                    : "bg-blue-600"
                }`}
              >
                {invoice.invoice_status}
              </span>

            </div>

          </div>

          <div>

            <p>
              <strong>
                Due Date:
              </strong>
            </p>

            <p>
              {invoice.due_date}
            </p>

          </div>

          <div>

            <p>
              <strong>
                Created:
              </strong>
            </p>

            <p>
              {new Date(
                invoice.created_at
              ).toLocaleDateString()}
            </p>

          </div>

        </div>

      </div>

      {/* Action Buttons */}

      <div className="flex gap-3 mt-6 mb-6">

        <button
          onClick={() => {

            document.title =
              invoice.invoice_number;

            window.print();

          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Print Invoice
        </button>

        <button
          onClick={() =>
            router.push( 
              `/payments/add?invoice=${invoice.id}`
            )  
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Record Payment
        </button>
        
        <button
          onClick={() => {

            document.title =
              invoice.invoice_number;

            window.print();

          }}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>

        <button
          onClick={() =>
            history.back()
          }
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>

      </div>

      {/* Invoice Items */}

      <div className="bg-white shadow rounded p-6 mt-6">

        <h2 className="text-xl font-bold mb-4">
          Invoice Items
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-2">
                Product
              </th>

              <th className="text-left p-2">
                Quantity
              </th>

              <th className="text-left p-2">
                Unit Price
              </th>

              <th className="text-left p-2">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {invoice.items?.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="p-2">
                  {item.product_name}
                </td>

                <td className="p-2">
                  {item.quantity}
                </td>

                <td className="p-2">
                  ₦{Number(
                    item.retail_price
                  ).toLocaleString()}
                </td>

                <td className="p-2">
                  ₦{Number(
                    item.total_price
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Payment History */}

      <div className="bg-white shadow rounded p-6 mt-6">

        <h2 className="text-xl font-bold mb-4">
          Payment History
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-2">
                Payment Date
              </th>

              <th className="text-left p-2">
                Amount Paid
              </th>

            </tr>

          </thead>

          <tbody>

            {invoice.payments?.map((payment) => (

              <tr
                key={payment.id}
                className="border-b"
              >

                <td className="p-2">
                  {payment.payment_date}
                </td>

                <td className="p-2">
                  ₦{Number(
                    payment.amount_paid
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

            {invoice.payments?.length === 0 && (

              <tr>

                <td
                  colSpan={2}
                  className="p-4 text-center text-gray-500"
                >
                  No payments recorded
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}