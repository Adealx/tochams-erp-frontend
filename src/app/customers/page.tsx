"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customerService";

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error: any) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Customers
        </h1>

        <Link
          href="/customers/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Customer
        </Link>

      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
            </tr>

          </thead>

          <tbody>

            {customers.map((customer) => (

              <tr
                key={customer.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-3">

                  <Link
                    href={`/customers/${customer.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {customer.name}
                  </Link>

                </td>

                <td className="p-3">
                  {customer.company}
                </td>

                <td className="p-3">
                  {customer.email}
                </td>

                <td className="p-3">
                  {customer.phone}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}