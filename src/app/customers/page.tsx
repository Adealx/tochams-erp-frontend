"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Users,
  Building2,
  Mail,
  Phone,
  Eye,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
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
  address?: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCustomers = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getCustomers();

      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name?.toLowerCase().includes(query) ||
        customer.company?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const columns: Column<Customer>[] = [
    {
      key: "name",
      title: "Customer",
      sortable: true,
      render: (customer) => (
        <Link
          href={`/customers/${customer.id}`}
          className="group flex items-center gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
            {customer.name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800 group-hover:text-blue-600">
              {customer.name || "Unnamed Customer"}
            </p>

            <p className="text-xs text-slate-400">
              Customer #{customer.id}
            </p>
          </div>
        </Link>
      ),
    },

    {
      key: "company",
      title: "Company",
      sortable: true,
      render: (customer) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Building2 size={15} className="text-slate-400" />

          <span>
            {customer.company || "Individual"}
          </span>
        </div>
      ),
    },

    {
      key: "email",
      title: "Email",
      sortable: true,
      render: (customer) => (
        <div className="flex items-center gap-2">
          <Mail size={15} className="text-slate-400" />

          <span className="truncate text-slate-600">
            {customer.email || "—"}
          </span>
        </div>
      ),
    },

    {
      key: "phone",
      title: "Phone",
      sortable: true,
      render: (customer) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Phone size={15} className="text-slate-400" />

          <span>
            {customer.phone || "—"}
          </span>
        </div>
      ),
    },

    {
      key: "id",
      title: "Action",
      render: (customer) => (
        <Link
          href={`/customers/${customer.id}`}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2
            text-xs
            font-semibold
            text-slate-700
            transition
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600
          "
        >
          <Eye size={15} />
          View
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <AppShell
        title="Customers"
        subtitle="Manage customer records and relationships"
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Customers",
          },
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          </div>

          <TableLoading />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Customers"
      subtitle="Manage customer records, contacts and account activity"
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
      <div className="space-y-6">

        {/* Summary Cards */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Customers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {customers.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Registered customer accounts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Business Customers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {
                    customers.filter(
                      (customer) =>
                        customer.company?.trim()
                    ).length
                  }
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Customers linked to companies
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Building2 size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Showing
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {filteredCustomers.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Matching customer records
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ArrowUpRight size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* Toolbar */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Customer Directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search and manage your customer accounts.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">
                <Search
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search customers..."
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    pl-10
                    pr-4
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-100
                    sm:w-72
                  "
                />
              </div>

              <button
                type="button"
                onClick={() => loadCustomers(true)}
                disabled={refreshing}
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

              <Link
                href="/customers/add"
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                "
              >
                <Plus size={17} />

                New Customer
              </Link>

            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              {search
                ? `${filteredCustomers.length} matching records`
                : `${customers.length} customer records`}
            </p>
          </div>

        </div>

        {/* Customer Table */}

        {filteredCustomers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Users size={25} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {search
                ? "No customers found"
                : "No customers yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "Try a different name, company, email address or phone number."
                : "Start building your customer database by creating your first customer."}
            </p>

            {!search && (
              <Link
                href="/customers/add"
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-blue-700
                "
              >
                <Plus size={17} />
                Add Customer
              </Link>
            )}

          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <DataTable<Customer>
              columns={columns}
              data={filteredCustomers}
            />

          </div>
        )}

      </div>
    </AppShell>
  );
}