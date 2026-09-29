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
  Archive,
  RotateCcw,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import TableLoading from "@/components/table/TableLoading";
import DataTable, {
  Column,
} from "@/components/table/DataTable";

import {
  getCustomers,
  archiveCustomer,
  reactivateCustomer,
} from "@/services/customerService";

interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  is_active: boolean;
}

type CustomerFilter =
  | "active"
  | "archived"
  | "all";

export default function Customers() {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [customerFilter, setCustomerFilter] =
    useState<CustomerFilter>("active");

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  /*
   * --------------------------------------------------
   * LOAD CUSTOMERS
   * --------------------------------------------------
   */

  const loadCustomers = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      /*
       * Management page needs both active
       * and archived customers.
       */
      const data =
        await getCustomers(true);

      setCustomers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching customers:",
        error
      );

      setCustomers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /*
   * --------------------------------------------------
   * COUNTS
   * --------------------------------------------------
   */

  const activeCustomers =
    useMemo(
      () =>
        customers.filter(
          (customer) =>
            customer.is_active === true
        ),
      [customers]
    );

  const archivedCustomers =
    useMemo(
      () =>
        customers.filter(
          (customer) =>
            customer.is_active === false
        ),
      [customers]
    );

  /*
   * --------------------------------------------------
   * FILTER + SEARCH
   * --------------------------------------------------
   */

  const filteredCustomers =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      let result = customers;

      if (
        customerFilter ===
        "active"
      ) {
        result =
          result.filter(
            (customer) =>
              customer.is_active === true
          );
      }

      if (
        customerFilter ===
        "archived"
      ) {
        result =
          result.filter(
            (customer) =>
              customer.is_active === false
          );
      }

      if (!query) {
        return result;
      }

      return result.filter(
        (customer) =>
          customer.name
            ?.toLowerCase()
            .includes(query) ||
          customer.company
            ?.toLowerCase()
            .includes(query) ||
          customer.email
            ?.toLowerCase()
            .includes(query) ||
          customer.phone
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      customers,
      customerFilter,
      search,
    ]);

  /*
   * --------------------------------------------------
   * ARCHIVE
   * --------------------------------------------------
   */

  const handleArchive = async (
    customer: Customer
  ) => {
    const confirmed =
      window.confirm(
        `Archive ${customer.name}?\n\nArchived customers cannot be used for new sales orders or invoices.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(customer.id);

      await archiveCustomer(
        customer.id
      );

      /*
       * Update locally immediately.
       */
      setCustomers(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              customer.id
                ? {
                    ...item,
                    is_active: false,
                  }
                : item
          )
      );

      /*
       * If viewing active customers,
       * the archived customer disappears
       * automatically.
       */
      if (
        customerFilter ===
        "active"
      ) {
        setSearch("");
      }

      alert(
        "Customer archived successfully."
      );
    } catch (error: any) {
      console.error(
        "Archive customer error:",
        error
      );

      const message =
        error?.response?.data
          ?.error ||
        error?.response?.data
          ?.detail ||
        "Unable to archive customer.";

      alert(message);
    } finally {
      setProcessingId(null);
    }
  };

  /*
   * --------------------------------------------------
   * REACTIVATE
   * --------------------------------------------------
   */

  const handleReactivate =
    async (
      customer: Customer
    ) => {
      const confirmed =
        window.confirm(
          `Reactivate ${customer.name}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingId(
          customer.id
        );

        await reactivateCustomer(
          customer.id
        );

        setCustomers(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                customer.id
                  ? {
                      ...item,
                      is_active: true,
                    }
                  : item
            )
        );

        alert(
          "Customer reactivated successfully."
        );
      } catch (error: any) {
        console.error(
          "Reactivate customer error:",
          error
        );

        const message =
          error?.response?.data
            ?.error ||
          error?.response?.data
            ?.detail ||
          "Unable to reactivate customer.";

        alert(message);
      } finally {
        setProcessingId(null);
      }
    };

  /*
   * --------------------------------------------------
   * TABLE COLUMNS
   * --------------------------------------------------
   */

  const columns:
    Column<Customer>[] = [
      {
        key: "name",
        title: "Customer",
        sortable: true,

        render: (
          customer
        ) => (
          <Link
            href={`/customers/${customer.id}`}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
              {customer.name
                ?.charAt(0)
                ?.toUpperCase() ||
                "C"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800 group-hover:text-blue-600">
                {customer.name ||
                  "Unnamed Customer"}
              </p>

              <p className="text-xs text-slate-400">
                Customer #
                {customer.id}
              </p>
            </div>
          </Link>
        ),
      },

      {
        key: "company",
        title: "Company",
        sortable: true,

        render: (
          customer
        ) => (
          <div className="flex items-center gap-2 text-slate-600">
            <Building2
              size={15}
              className="text-slate-400"
            />

            <span>
              {customer.company ||
                "Individual"}
            </span>
          </div>
        ),
      },

      {
        key: "email",
        title: "Email",
        sortable: true,

        render: (
          customer
        ) => (
          <div className="flex items-center gap-2">
            <Mail
              size={15}
              className="text-slate-400"
            />

            <span className="truncate text-slate-600">
              {customer.email ||
                "—"}
            </span>
          </div>
        ),
      },

      {
        key: "phone",
        title: "Phone",
        sortable: true,

        render: (
          customer
        ) => (
          <div className="flex items-center gap-2 text-slate-600">
            <Phone
              size={15}
              className="text-slate-400"
            />

            <span>
              {customer.phone ||
                "—"}
            </span>
          </div>
        ),
      },

      {
        key: "is_active",
        title: "Status",

        render: (
          customer
        ) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
              customer.is_active
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                : "bg-slate-100 text-slate-600 ring-slate-500/20"
            }`}
          >
            {customer.is_active
              ? "Active"
              : "Archived"}
          </span>
        ),
      },

      {
        key: "id",
        title: "Action",

        render: (
          customer
        ) => (
          <div className="flex flex-wrap items-center justify-end gap-2">

            <Link
              href={`/customers/${customer.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <Eye size={15} />
              View
            </Link>

            {customer.is_active ? (
              <button
                type="button"
                disabled={
                  processingId ===
                  customer.id
                }
                onClick={() =>
                  handleArchive(
                    customer
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId ===
                customer.id ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                ) : (
                  <Archive size={14} />
                )}

                Archive
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  processingId ===
                  customer.id
                }
                onClick={() =>
                  handleReactivate(
                    customer
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId ===
                customer.id ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                ) : (
                  <RotateCcw
                    size={14}
                  />
                )}

                Reactivate
              </button>
            )}

          </div>
        ),
      },
    ];

  /*
   * --------------------------------------------------
   * LOADING
   * --------------------------------------------------
   */

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

        {/* SUMMARY */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <SummaryCard
            title="Total Customers"
            value={customers.length}
            description="All customer accounts"
            icon={
              <Users size={21} />
            }
            active={
              customerFilter ===
              "all"
            }
            onClick={() =>
              setCustomerFilter(
                "all"
              )
            }
          />

          <SummaryCard
            title="Active Customers"
            value={
              activeCustomers.length
            }
            description="Available for new transactions"
            icon={
              <Users size={21} />
            }
            active={
              customerFilter ===
              "active"
            }
            onClick={() =>
              setCustomerFilter(
                "active"
              )
            }
          />

          <SummaryCard
            title="Archived Customers"
            value={
              archivedCustomers.length
            }
            description="Inactive customer accounts"
            icon={
              <Archive size={21} />
            }
            active={
              customerFilter ===
              "archived"
            }
            onClick={() =>
              setCustomerFilter(
                "archived"
              )
            }
          />

          <SummaryCard
            title="Business Customers"
            value={
              customers.filter(
                (customer) =>
                  customer.company?.trim()
              ).length
            }
            description="Customers linked to companies"
            icon={
              <Building2 size={21} />
            }
            active={false}
            onClick={() => {}}
          />

        </div>

        {/* TOOLBAR */}

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
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search customers..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-72"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  loadCustomers(true)
                }
                disabled={refreshing}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Plus size={17} />

                New Customer
              </Link>

            </div>
          </div>

          {/* FILTER TABS */}

          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">

            <FilterButton
              label="Active"
              count={
                activeCustomers.length
              }
              active={
                customerFilter ===
                "active"
              }
              onClick={() =>
                setCustomerFilter(
                  "active"
                )
              }
            />

            <FilterButton
              label="Archived"
              count={
                archivedCustomers.length
              }
              active={
                customerFilter ===
                "archived"
              }
              onClick={() =>
                setCustomerFilter(
                  "archived"
                )
              }
            />

            <FilterButton
              label="All"
              count={
                customers.length
              }
              active={
                customerFilter ===
                "all"
              }
              onClick={() =>
                setCustomerFilter(
                  "all"
                )
              }
            />

          </div>

          <div className="mt-4 flex items-center justify-between">

            <p className="text-xs text-slate-500">
              {search
                ? `${filteredCustomers.length} matching records`
                : `${filteredCustomers.length} records displayed`}
            </p>

          </div>

        </div>

        {/* TABLE */}

        {filteredCustomers.length ===
        0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Users size={25} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {search
                ? "No customers found"
                : customerFilter ===
                  "archived"
                ? "No archived customers"
                : "No active customers"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "Try a different name, company, email address or phone number."
                : "There are no customer records in this category."}
            </p>

          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <DataTable<Customer>
              columns={columns}
              data={
                filteredCustomers
              }
            />
          </div>
        )}

      </div>
    </AppShell>
  );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  description,
  icon,
  active,
  onClick,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left shadow-sm transition ${
        active
          ? "border-blue-300 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
          {icon}
        </div>

      </div>
    </button>
  );
}


/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          active
            ? "bg-white/20"
            : "bg-white"
        }`}
      >
        {count}
      </span>
    </button>
  );
}