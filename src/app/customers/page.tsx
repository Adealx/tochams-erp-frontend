"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import TableToolbar from "@/components/table/TableToolbar";
import TableLoading from "@/components/table/TableLoading";
import DataTable, {
  Column,
} from "@/components/table/DataTable";

import { getCustomers } from "@/services/customerService";

interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Customer>[] = [
    {
      key: "name",
      title: "Customer",
      sortable: true,
      render: (customer) => (
        <Link
          href={`/customers/${customer.id}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {customer.name}
        </Link>
      ),
    },
    {
      key: "company",
      title: "Company",
      sortable: true,
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
    },
    {
      key: "phone",
      title: "Phone",
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <AppShell
        title="Customers"
        subtitle="Manage customer records"
      >
        <TableLoading />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Customers"
      subtitle="Manage customer records"
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Customers",
        },
      ]}
      actions={[
        {
          label: "New Customer",
          href: "/customers/add",
        },
      ]}
    >
      <TableToolbar />

      <DataTable<Customer>
        columns={columns}
        data={customers}
      />
    </AppShell>
  );
}