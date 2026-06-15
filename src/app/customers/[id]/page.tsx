"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCustomer } from "@/services/customerService";

export default function CustomerDetail() {

  const params = useParams();

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadCustomer();
    }
  }, [params.id]);

  const loadCustomer = async () => {
    try {

      const data = await getCustomer(
        Number(params.id)
      );

      setCustomer(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading customer...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8">
        Customer not found
      </div>
    );
  }

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Customer Details
      </h1>

      <div className="bg-white rounded-lg shadow p-6">

        {/* Customer Information */}

        <div className="space-y-3">

          <p>
            <strong>Name:</strong> {customer.name}
          </p>

          <p>
            <strong>Email:</strong> {customer.email}
          </p>

          <p>
            <strong>Phone:</strong> {customer.phone}
          </p>

          <p>
            <strong>Company:</strong> {customer.company}
          </p>

          <p>
            <strong>Address:</strong> {customer.address}
          </p>

        </div>

        <hr className="my-6" />

        {/* Account Summary */}

        <h2 className="text-2xl font-bold mb-4">
          Account Summary
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Total Invoiced:</strong>{" "}
            ₦{Number(customer.total_invoiced).toLocaleString()}
          </p>

          <p>
            <strong>Total Paid:</strong>{" "}
            ₦{Number(customer.total_paid).toLocaleString()}
          </p>

          <p>
            <strong>Outstanding Balance:</strong>{" "}
            ₦{Number(customer.outstanding_balance).toLocaleString()}
          </p>

        </div>

        <hr className="my-6" />

        {/* Customer Invoices */}

        <h2 className="text-2xl font-bold mb-4">
          Customer Invoices
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  Invoice Number
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Balance Due
                </th>

              </tr>

            </thead>

            <tbody>

              {customer.invoices?.map((invoice: any) => (

                <tr
                  key={invoice.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {invoice.invoice_number}
                  </td>

                  <td className="p-3">
                    ₦{Number(invoice.amount).toLocaleString()}
                  </td>

                  <td className="p-3">
                    {invoice.invoice_status}
                  </td>

                  <td className="p-3">
                    ₦{Number(invoice.balance_due).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}