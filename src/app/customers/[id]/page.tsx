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
  Archive,
  RotateCcw,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getCustomer,
  updateCustomer,
  downloadCustomerStatement,
  archiveCustomer,
  reactivateCustomer,
} from "@/services/customerService";


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

  is_active: boolean;

  total_invoiced?: number | string | null;
  total_paid?: number | string | null;
  outstanding_balance?: number | string | null;

  invoices?: CustomerInvoice[];
}


function formatCurrency(
  value: number | string | null | undefined
) {
  const amount = Number(value || 0);

  return `₦${amount.toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}


function formatDate(
  value: string | undefined
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


function getInvoiceStatusClass(
  status?: string | null
) {
  const normalized = String(
    status ?? "pending"
  )
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
    normalized === "canceled" ||
    normalized === "draft"
  ) {
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


function getInvoiceStatus(
  invoice: CustomerInvoice
) {
  return String(
    invoice.invoice_status ??
      invoice.status ??
      "Pending"
  );
}


export default function CustomerDetail() {
  const params = useParams();

  const customerId =
    Number(params.id);

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [downloading, setDownloading] =
    useState(false);

  const [processingStatus, setProcessingStatus] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [editForm, setEditForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
    });


  /*
   * --------------------------------------------------
   * LOAD CUSTOMER
   * --------------------------------------------------
   */

  const loadCustomer =
    async () => {
      try {
        setLoading(true);

        const data =
          await getCustomer(
            customerId
          );

        setCustomer(
          data as Customer
        );
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


  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    loadCustomer();
  }, [customerId]);


  /*
   * --------------------------------------------------
   * ARCHIVE
   * --------------------------------------------------
   */

  const handleArchive =
    async () => {
      if (!customer) {
        return;
      }

      const confirmed =
        window.confirm(
          `Archive ${customer.name}?\n\nThis customer will no longer be available for new sales orders or invoices.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingStatus(true);

        const response =
          await archiveCustomer(
            customer.id
          );

        setCustomer(
          (current) =>
            current
              ? {
                  ...current,
                  is_active: false,
                }
              : current
        );

        alert(
          response?.message ||
            "Customer archived successfully."
        );
      } catch (error: any) {
        console.error(
          "Archive customer error:",
          error
        );

        alert(
          error?.response?.data
            ?.error ||
            error?.response?.data
              ?.detail ||
            "Unable to archive customer."
        );
      } finally {
        setProcessingStatus(false);
      }
    };


  /*
   * --------------------------------------------------
   * REACTIVATE
   * --------------------------------------------------
   */

  const handleReactivate =
    async () => {
      if (!customer) {
        return;
      }

      const confirmed =
        window.confirm(
          `Reactivate ${customer.name}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingStatus(true);

        const response =
          await reactivateCustomer(
            customer.id
          );

        setCustomer(
          (current) =>
            current
              ? {
                  ...current,
                  is_active: true,
                }
              : current
        );

        alert(
          response?.message ||
            "Customer reactivated successfully."
        );
      } catch (error: any) {
        console.error(
          "Reactivate customer error:",
          error
        );

        alert(
          error?.response?.data
            ?.error ||
            error?.response?.data
              ?.detail ||
            "Unable to reactivate customer."
        );
      } finally {
        setProcessingStatus(false);
      }
    };


  /*
   * --------------------------------------------------
   * DOWNLOAD STATEMENT
   * --------------------------------------------------
   */

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


  /*
   * --------------------------------------------------
   * EDIT
   * --------------------------------------------------
   */

  const handleEditCustomer =
    () => {
      if (!customer) {
        return;
      }

      setEditForm({
        name:
          customer.name || "",
        email:
          customer.email || "",
        phone:
          customer.phone || "",
        company:
          customer.company || "",
        address:
          customer.address || "",
      });

      setEditing(true);
    };


  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setEditForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  const handleSaveCustomer =
    async () => {
      if (!customer) {
        return;
      }

      if (!editForm.name.trim()) {
        alert(
          "Customer name is required."
        );

        return;
      }

      try {
        setSaving(true);

        await updateCustomer(
          customer.id,
          {
            name:
              editForm.name.trim(),
            email:
              editForm.email.trim(),
            phone:
              editForm.phone.trim(),
            company:
              editForm.company.trim(),
            address:
              editForm.address.trim(),
          }
        );

        await loadCustomer();

        setEditing(false);
      } catch (error: any) {
        console.error(
          "Error updating customer:",
          error
        );

        alert(
          error?.response?.data
            ?.detail ||
            error?.response?.data
              ?.message ||
            "Failed to update customer."
        );
      } finally {
        setSaving(false);
      }
    };


  /*
   * --------------------------------------------------
   * LOADING
   * --------------------------------------------------
   */

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
              The customer account may have been removed or the ID is invalid.
            </p>

            <Link
              href="/customers"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Customers
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }


  const invoices =
    Array.isArray(
      customer.invoices
    )
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
      customer.outstanding_balance ||
        0
    );


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

        {/* ACTIONS */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Customers
          </Link>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={handleEditCustomer}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Edit size={17} />
              Edit Customer
            </button>

            {customer.is_active ? (
              <button
                type="button"
                onClick={handleArchive}
                disabled={
                  processingStatus
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 shadow-sm hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processingStatus ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                ) : (
                  <Archive size={17} />
                )}

                Archive Customer
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleReactivate
                }
                disabled={
                  processingStatus
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processingStatus ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                ) : (
                  <RotateCcw size={17} />
                )}

                Reactivate Customer
              </button>
            )}

            <button
              type="button"
              onClick={
                handleDownloadStatement
              }
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Download size={17} />
              )}

              {downloading
                ? "Preparing..."
                : "Download Statement"}
            </button>

          </div>
        </div>


        {/* PROFILE */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-7 text-white">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold ring-1 ring-white/20">
                  {customer.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "C"}
                </div>

                <div>

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Customer Account
                  </p>

                  <h1 className="mt-1 text-2xl font-bold">
                    {customer.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">

                    <span>
                      Account #
                      {customer.id}
                    </span>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        customer.is_active
                          ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20"
                          : "bg-white/10 text-slate-300 ring-white/20"
                      }`}
                    >
                      {customer.is_active
                        ? "Active"
                        : "Archived"}
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

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs text-slate-400">
                  Outstanding Balance
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {formatCurrency(
                    outstanding
                  )}
                </p>
              </div>

            </div>

          </div>


          {/* CONTACT */}

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

            <ContactItem
              icon={
                <Mail size={17} />
              }
              label="Email"
              value={
                customer.email ||
                "—"
              }
              className="bg-blue-50 text-blue-600"
            />

            <ContactItem
              icon={
                <Phone size={17} />
              }
              label="Phone"
              value={
                customer.phone ||
                "—"
              }
              className="bg-emerald-50 text-emerald-600"
            />

            <ContactItem
              icon={
                <Building2
                  size={17}
                />
              }
              label="Company"
              value={
                customer.company ||
                "Individual"
              }
              className="bg-purple-50 text-purple-600"
            />

            <ContactItem
              icon={
                <MapPin size={17} />
              }
              label="Address"
              value={
                customer.address ||
                "—"
              }
              className="bg-amber-50 text-amber-600"
            />

          </div>

        </section>


        {/* FINANCIAL SUMMARY */}

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

            <FinancialCard
              title="Total Invoiced"
              value={formatCurrency(
                totalInvoiced
              )}
              description="Total value of customer invoices"
              icon={
                <FileText
                  size={21}
                />
              }
            />

            <FinancialCard
              title="Total Paid"
              value={formatCurrency(
                totalPaid
              )}
              description="Payments received from customer"
              icon={
                <Wallet
                  size={21}
                />
              }
              valueClass="text-emerald-600"
            />

            <FinancialCard
              title="Outstanding"
              value={formatCurrency(
                outstanding
              )}
              description={
                outstanding > 0
                  ? "Amount currently owed"
                  : "Account is fully settled"
              }
              icon={
                <Wallet
                  size={21}
                />
              }
              valueClass={
                outstanding > 0
                  ? "text-red-600"
                  : "text-emerald-600"
              }
            />

          </div>

        </section>


        {/* INVOICE HISTORY */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

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


          {invoices.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FileText
                  size={24}
                />
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
                          key={
                            invoice.id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <Receipt
                                  size={16}
                                />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {invoice.invoice_number ||
                                    `Invoice #${invoice.id}`}
                                </p>

                                <p className="text-xs text-slate-400">
                                  ID #
                                  {
                                    invoice.id
                                  }
                                </p>
                              </div>

                            </div>

                          </td>

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

                          <td className="px-6 py-4 text-right">

                            <span className="text-sm font-semibold text-slate-800">
                              {formatCurrency(
                                invoice.amount
                              )}
                            </span>

                          </td>

                          <td className="px-6 py-4 text-center">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getInvoiceStatusClass(
                                invoiceStatus
                              )}`}
                            >
                              {
                                invoiceStatus
                              }
                            </span>

                          </td>

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


      {/* EDIT MODAL */}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

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
                onClick={() =>
                  setEditing(false)
                }
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>


            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">

              <EditField
                id="customer-name"
                name="name"
                label="Customer Name"
                value={
                  editForm.name
                }
                onChange={
                  handleEditChange
                }
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <EditField
                  id="customer-email"
                  name="email"
                  type="email"
                  label="Email"
                  value={
                    editForm.email
                  }
                  onChange={
                    handleEditChange
                  }
                />

                <EditField
                  id="customer-phone"
                  name="phone"
                  label="Phone"
                  value={
                    editForm.phone
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>

              <EditField
                id="customer-company"
                name="company"
                label="Company"
                value={
                  editForm.company
                }
                onChange={
                  handleEditChange
                }
              />

              <div>
                <label
                  htmlFor="customer-address"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Address
                </label>

                <textarea
                  id="customer-address"
                  name="address"
                  value={
                    editForm.address
                  }
                  onChange={
                    handleEditChange
                  }
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

            </div>


            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setEditing(false)
                }
                disabled={saving}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSaveCustomer
                }
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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


/* =========================================================
   CONTACT ITEM
========================================================= */

function ContactItem({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${className}`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   FINANCIAL CARD
========================================================= */

function FinancialCard({
  title,
  value,
  description,
  icon,
  valueClass = "text-slate-900",
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${valueClass}`}
          >
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          {icon}
        </div>

      </div>

      <p className="mt-3 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   EDIT FIELD
========================================================= */

function EditField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}