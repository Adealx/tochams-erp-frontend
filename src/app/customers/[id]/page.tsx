"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Save,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getCustomer,
  updateCustomer,
  downloadCustomerStatement,
} from "@/services/customerService";

/* =========================================================
   TYPES
========================================================= */

interface CustomerInvoice {
  id: number;
  invoice_number?: string;
  amount?: number | string | null;

  invoice_status?: string | null;
  status?: string | null;

  balance_due?: number | string | null;
  created_at?: string;
  due_date?: string;
}

interface Customer {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  address?: string | null;

  total_invoiced?: number | string | null;
  total_paid?: number | string | null;
  outstanding_balance?: number | string | null;

  invoices?: CustomerInvoice[];
}

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(
  value: number | string | null | undefined
) {
  const amount = Number(value || 0);

  return `\u20A6${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   INVOICE STATUS
========================================================= */

function getInvoiceStatusClass(
  status?: string | null
) {
  const normalized = String(status ?? "pending")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

  if (normalized === "paid") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  }

  if (
    normalized.includes("partial") ||
    normalized.includes("partially")
  ) {
    return "bg-amber-50 text-amber-700 ring-amber-600/20";
  }

  if (
    normalized.includes("overdue") ||
    normalized.includes("late")
  ) {
    return "bg-red-50 text-red-700 ring-red-600/20";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "bg-slate-100 text-slate-600 ring-slate-500/20";
  }

  if (normalized === "draft") {
    return "bg-slate-100 text-slate-600 ring-slate-500/20";
  }

  if (
    normalized === "sent" ||
    normalized === "issued"
  ) {
    return "bg-blue-50 text-blue-700 ring-blue-600/20";
  }

  return "bg-blue-50 text-blue-700 ring-blue-600/20";
}

/* =========================================================
   GET INVOICE STATUS
========================================================= */

function getInvoiceStatus(
  invoice: CustomerInvoice
) {
  const status =
    invoice.invoice_status ??
    invoice.status ??
    "Pending";

  return String(status);
}

/* =========================================================
   CUSTOMER DETAIL PAGE
========================================================= */

export default function CustomerDetail() {
  const params = useParams();

  const customerId = Number(params.id);

  /* =======================================================
     CUSTOMER STATE
  ======================================================= */

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     DOWNLOAD STATE
  ======================================================= */

  const [downloading, setDownloading] =
    useState(false);

  /* =======================================================
     EDIT STATE
  ======================================================= */

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  /* =======================================================
     LOAD CUSTOMER
  ======================================================= */

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);

      const data = await getCustomer(
        customerId
      );

      setCustomer(data as Customer);

    } catch (error) {

      console.error(
        "Error fetching customer:",
        error
      );

      setCustomer(null);

    } finally {

      setLoading(false);

    }
  };

  /* =======================================================
     DOWNLOAD STATEMENT
  ======================================================= */

  const handleDownloadStatement =
    async () => {

      if (!customer) {
        return;
      }

      try {

        setDownloading(true);

        await downloadCustomerStatement(
          customer.id
        );

      } catch (error) {

        console.error(
          "Error downloading customer statement:",
          error
        );

        alert(
          "Unable to download customer statement."
        );

      } finally {

        setDownloading(false);

      }
    };

  /* =======================================================
     OPEN EDIT FORM
  ======================================================= */

  const handleEditCustomer = () => {

    if (!customer) {
      return;
    }

    setEditForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
      address: customer.address || "",
    });

    setEditing(true);
  };

  /* =======================================================
     HANDLE EDIT INPUT
  ======================================================= */

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     SAVE CUSTOMER
  ======================================================= */

  const handleSaveCustomer =
    async () => {

      if (!customer) {
        return;
      }

      /* -----------------------------------------------
         VALIDATION
      ------------------------------------------------ */

      if (!editForm.name.trim()) {

        alert(
          "Customer name is required."
        );

        return;
      }

      try {

        setSaving(true);

        /* ---------------------------------------------
           UPDATE CUSTOMER
        ---------------------------------------------- */

        await updateCustomer(
          customer.id,
          {
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            phone: editForm.phone.trim(),
            company: editForm.company.trim(),
            address: editForm.address.trim(),
          }
        );

        /* ---------------------------------------------
           RELOAD CUSTOMER
        ---------------------------------------------- */

        await loadCustomer();

        /* ---------------------------------------------
           CLOSE MODAL
        ---------------------------------------------- */

        setEditing(false);

      } catch (error: any) {

        console.error(
          "Error updating customer:",
          error
        );

        console.error(
          "Backend response:",
          error?.response?.data
        );

        const backendMessage =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to update customer. Please try again.";

        alert(
          backendMessage
        );

      } finally {

        setSaving(false);

      }
    };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {

    return (
      <AppShell
        title="Customer"
        subtitle="Loading customer account..."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Customers",
            href: "/customers",
          },
          {
            label: "Customer",
          },
        ]}
      >

        <div className="mx-auto max-w-6xl space-y-6">

          <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />

            <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />

            <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />

          </div>

          <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />

        </div>

      </AppShell>
    );
  }

  /* =======================================================
     CUSTOMER NOT FOUND
  ======================================================= */

  if (!customer) {

    return (
      <AppShell
        title="Customer Not Found"
        subtitle="The requested customer account could not be found"
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Customers",
            href: "/customers",
          },
          {
            label: "Not Found",
          },
        ]}
      >

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">

              <UserRound size={28} />

            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Customer not found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The customer account may have been removed
              or the ID is invalid.
            </p>

            <Link
              href="/customers"
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

              <ArrowLeft size={17} />

              Back to Customers

            </Link>

          </div>

        </div>

      </AppShell>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const invoices =
    Array.isArray(customer.invoices)
      ? customer.invoices
      : [];

  const totalInvoiced =
    Number(
      customer.total_invoiced || 0
    );

  const totalPaid =
    Number(
      customer.total_paid || 0
    );

  const outstanding =
    Number(
      customer.outstanding_balance || 0
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <AppShell
      title={customer.name}
      subtitle="Customer account and transaction history"
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Customers",
          href: "/customers",
        },
        {
          label: customer.name,
        },
      ]}
    >

      <div className="mx-auto max-w-6xl space-y-6">

        {/* =================================================
            BACK / ACTIONS
        ================================================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* BACK */}

          <Link
            href="/customers"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              hover:text-blue-600
            "
          >

            <ArrowLeft size={17} />

            Back to Customers

          </Link>

          {/* ACTION BUTTONS */}

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* EDIT CUSTOMER */}

            <button
              type="button"
              onClick={handleEditCustomer}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
                hover:text-blue-600
              "
            >

              <Edit size={17} />

              Edit Customer

            </button>

            {/* DOWNLOAD STATEMENT */}

            <button
              type="button"
              onClick={handleDownloadStatement}
              disabled={downloading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {downloading ? (

                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                />

              ) : (

                <Download size={17} />

              )}

              {downloading
                ? "Preparing..."
                : "Download Statement"}

            </button>

          </div>

        </div>

        {/* =================================================
            CUSTOMER PROFILE
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-7 text-white">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                {/* AVATAR */}

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold ring-1 ring-white/20">

                  {customer.name
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}

                </div>

                {/* CUSTOMER NAME */}

                <div>

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Customer Account
                  </p>

                  <h1 className="mt-1 text-2xl font-bold">
                    {customer.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">

                    <span>
                      Account #{customer.id}
                    </span>

                    {customer.company && (

                      <span className="flex items-center gap-1.5">

                        <Building2 size={14} />

                        {customer.company}

                      </span>

                    )}

                  </div>

                </div>

              </div>

              {/* OUTSTANDING */}

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <p className="text-xs text-slate-400">
                  Outstanding Balance
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {formatCurrency(outstanding)}
                </p>

              </div>

            </div>

          </div>

          {/* CONTACT INFORMATION */}

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* EMAIL */}

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                <Mail size={17} />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium text-slate-400">
                  Email
                </p>

                <p className="mt-1 truncate text-sm font-medium text-slate-700">
                  {customer.email || "—"}
                </p>

              </div>

            </div>

            {/* PHONE */}

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

                <Phone size={17} />

              </div>

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {customer.phone || "—"}
                </p>

              </div>

            </div>

            {/* COMPANY */}

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">

                <Building2 size={17} />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium text-slate-400">
                  Company
                </p>

                <p className="mt-1 truncate text-sm font-medium text-slate-700">
                  {customer.company || "Individual"}
                </p>

              </div>

            </div>

            {/* ADDRESS */}

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">

                <MapPin size={17} />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium text-slate-400">
                  Address
                </p>

                <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-700">
                  {customer.address || "—"}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            FINANCIAL SUMMARY
        ================================================= */}

        <section>

          <div className="mb-4">

            <h2 className="text-lg font-bold text-slate-900">
              Account Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Financial position for this customer account.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* TOTAL INVOICED */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Invoiced
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatCurrency(totalInvoiced)}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <FileText size={21} />

                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Total value of customer invoices
              </p>

            </div>

            {/* TOTAL PAID */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Paid
                  </p>

                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {formatCurrency(totalPaid)}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                  <Wallet size={21} />

                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Payments received from customer
              </p>

            </div>

            {/* OUTSTANDING */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Outstanding
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${
                      outstanding > 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {formatCurrency(outstanding)}
                  </p>

                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    outstanding > 0
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >

                  <Wallet size={21} />

                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">

                {outstanding > 0
                  ? "Amount currently owed"
                  : "Account is fully settled"}

              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            INVOICE HISTORY
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Customer Invoices
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Invoice history and outstanding balances.
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">

              <Receipt size={15} />

              {invoices.length} invoice
              {invoices.length === 1
                ? ""
                : "s"}

            </div>

          </div>

          {/* NO INVOICES */}

          {invoices.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                <FileText size={24} />

              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No invoices yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                This customer does not have any invoices.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50">

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Invoice
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Balance Due
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {invoices.map(
                    (invoice) => {

                      const invoiceStatus =
                        getInvoiceStatus(
                          invoice
                        );

                      return (

                        <tr
                          key={invoice.id}
                          className="transition hover:bg-slate-50"
                        >

                          {/* INVOICE */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                                <Receipt size={16} />

                              </div>

                              <div>

                                <p className="text-sm font-semibold text-slate-800">

                                  {invoice.invoice_number ||
                                    `Invoice #${invoice.id}`}

                                </p>

                                <p className="text-xs text-slate-400">
                                  ID #{invoice.id}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* DATE */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2 text-sm text-slate-600">

                              <CalendarDays
                                size={15}
                                className="text-slate-400"
                              />

                              {formatDate(
                                invoice.created_at ||
                                  invoice.due_date
                              )}

                            </div>

                          </td>

                          {/* AMOUNT */}

                          <td className="px-6 py-4 text-right">

                            <span className="text-sm font-semibold text-slate-800">

                              {formatCurrency(
                                invoice.amount
                              )}

                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4 text-center">

                            <span
                              className={`
                                inline-flex
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                ring-1
                                ring-inset
                                ${getInvoiceStatusClass(
                                  invoiceStatus
                                )}
                              `}
                            >
                              {invoiceStatus}
                            </span>

                          </td>

                          {/* BALANCE */}

                          <td className="px-6 py-4 text-right">

                            <span
                              className={`text-sm font-bold ${
                                Number(
                                  invoice.balance_due ||
                                    0
                                ) > 0
                                  ? "text-red-600"
                                  : "text-emerald-600"
                              }`}
                            >

                              {formatCurrency(
                                invoice.balance_due
                              )}

                            </span>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

      {/* ===================================================
          EDIT CUSTOMER MODAL
      =================================================== */}

      {editing && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-900/50
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-6
                py-5
              "
            >

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Edit Customer
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update customer account information.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <X size={20} />

              </button>

            </div>

            {/* FORM */}

            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">

              {/* CUSTOMER NAME */}

              <div>

                <label
                  htmlFor="customer-name"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Customer Name
                </label>

                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Enter customer name"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                  "
                />

              </div>

              {/* EMAIL + PHONE */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="customer-email"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Email
                  </label>

                  <input
                    id="customer-email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    placeholder="customer@example.com"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/20
                    "
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label
                    htmlFor="customer-phone"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Phone
                  </label>

                  <input
                    id="customer-phone"
                    name="phone"
                    type="text"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    placeholder="08012345678"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/20
                    "
                  />

                </div>

              </div>

              {/* COMPANY */}

              <div>

                <label
                  htmlFor="customer-company"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Company
                </label>

                <input
                  id="customer-company"
                  name="company"
                  type="text"
                  value={editForm.company}
                  onChange={handleEditChange}
                  placeholder="Company name"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                  "
                />

              </div>

              {/* ADDRESS */}

              <div>

                <label
                  htmlFor="customer-address"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Address
                </label>

                <textarea
                  id="customer-address"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  rows={3}
                  placeholder="Customer address"
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                  "
                />

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-slate-200
                bg-slate-50
                px-6
                py-4
                sm:flex-row
                sm:justify-end
              "
            >

              {/* CANCEL */}

              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              {/* SAVE */}

              <button
                type="button"
                onClick={handleSaveCustomer}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {saving ? (

                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                      "
                    />

                    Saving...

                  </>

                ) : (

                  <>
                    <Save size={17} />

                    Save Changes
                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </AppShell>
  );
}