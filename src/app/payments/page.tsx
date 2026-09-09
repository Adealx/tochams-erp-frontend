"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AlertCircle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  Search,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  cancelPayment,
  getPayments,
  Payment,
} from "@/services/paymentService";

import { getInvoices } from "@/services/invoiceService";


const formatCurrency = (
  value: string | number
) => {
  return `₦${Number(value || 0).toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};


const formatDate = (
  value: string | null
) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


interface InvoiceSummary {
  id: number;
  invoice_number: string;
  customer_name: string;
  balance_due: string | number;
}


export default function PaymentsPage() {

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [invoices, setInvoices] =
    useState<InvoiceSummary[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [customerFilter, setCustomerFilter] =
    useState("All");

  const [invoiceFilter, setInvoiceFilter] =
    useState("All");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [cancellingPayment, setCancellingPayment] =
    useState<Payment | null>(null);

  const [cancellationReason, setCancellationReason] =
    useState("");

  const [cancelling, setCancelling] =
    useState(false);


  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadData = async (
    showRefresh = false
  ) => {

    try {

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        paymentData,
        invoiceData,
      ] = await Promise.all([
        getPayments(),
        getInvoices(),
      ]);

      setPayments(paymentData);

      setInvoices(
        invoiceData.map(
          (invoice: any) => ({
            id: invoice.id,
            invoice_number:
              invoice.invoice_number,
            customer_name:
              invoice.customer_name,
            balance_due:
              invoice.balance_due,
          })
        )
      );

    } catch (error) {

      console.error(
        "Failed to load payment data:",
        error
      );

      toast.error(
        "Unable to load payment information."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []);


  // =========================================================
  // CUSTOMER OPTIONS
  // =========================================================

  const customers = useMemo(() => {

    return Array.from(
      new Set(
        payments
          .map(
            (payment) =>
              payment.customer_name
          )
          .filter(Boolean)
      )
    ).sort();

  }, [payments]);


  // =========================================================
  // INVOICE OPTIONS
  // =========================================================

  const invoiceOptions = useMemo(() => {

    return Array.from(
      new Map(
        payments.map(
          (payment) => [
            payment.invoice,
            {
              id: payment.invoice,
              number:
                payment.invoice_number,
            },
          ]
        )
      ).values()
    ).sort(
      (a, b) =>
        a.number.localeCompare(b.number)
    );

  }, [payments]);


  // =========================================================
  // FILTER PAYMENTS
  // =========================================================

  const filteredPayments = useMemo(() => {

    const query =
      search.trim().toLowerCase();

    return payments.filter(
      (payment) => {

        const matchesStatus =
          statusFilter === "All" ||
          payment.status === statusFilter;

        const matchesCustomer =
          customerFilter === "All" ||
          payment.customer_name ===
            customerFilter;

        const matchesInvoice =
          invoiceFilter === "All" ||
          payment.invoice ===
            Number(invoiceFilter);

        const paymentDate =
          payment.payment_date;

        const matchesFrom =
          !fromDate ||
          paymentDate >= fromDate;

        const matchesTo =
          !toDate ||
          paymentDate <= toDate;

        const searchable = [
          payment.payment_number,
          payment.invoice_number,
          payment.customer_name,
          payment.payment_method,
          payment.journal_reference,
          payment.amount_paid,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !query ||
          searchable.includes(query);

        return (
          matchesStatus &&
          matchesCustomer &&
          matchesInvoice &&
          matchesFrom &&
          matchesTo &&
          matchesSearch
        );
      }
    );

  }, [
    payments,
    search,
    statusFilter,
    customerFilter,
    invoiceFilter,
    fromDate,
    toDate,
  ]);


  // =========================================================
  // SUMMARY
  // =========================================================

  const stats = useMemo(() => {

    const posted =
      filteredPayments.filter(
        (payment) =>
          payment.status === "Posted"
      );

    const cancelled =
      filteredPayments.filter(
        (payment) =>
          payment.status === "Cancelled"
      );

    const postedAmount =
      posted.reduce(
        (total, payment) =>
          total +
          Number(payment.amount_paid || 0),
        0
      );

    const cancelledAmount =
      cancelled.reduce(
        (total, payment) =>
          total +
          Number(payment.amount_paid || 0),
        0
      );

    const receivables =
      invoices.reduce(
        (total, invoice) =>
          total +
          Math.max(
            Number(invoice.balance_due || 0),
            0
          ),
        0
      );

    return {
      total: filteredPayments.length,
      posted: posted.length,
      cancelled: cancelled.length,
      postedAmount,
      cancelledAmount,
      receivables,
    };

  }, [
    filteredPayments,
    invoices,
  ]);


  // =========================================================
  // RESET FILTERS
  // =========================================================

  const resetFilters = () => {

    setSearch("");
    setStatusFilter("All");
    setCustomerFilter("All");
    setInvoiceFilter("All");
    setFromDate("");
    setToDate("");
  };


  // =========================================================
  // CANCEL PAYMENT
  // =========================================================

  const handleCancel = async () => {

    if (!cancellingPayment) {
      return;
    }

    const reason =
      cancellationReason.trim();

    if (!reason) {

      toast.error(
        "Please enter a cancellation reason."
      );

      return;
    }

    if (reason.length < 3) {

      toast.error(
        "Cancellation reason must contain at least 3 characters."
      );

      return;
    }

    try {

      setCancelling(true);

      const response =
        await cancelPayment(
          cancellingPayment.id,
          reason
        );

      toast.success(
        `Payment ${cancellingPayment.payment_number || `#${cancellingPayment.id}`} cancelled. ${response.reversal_reference} created.`
      );

      setCancellingPayment(null);
      setCancellationReason("");

      await loadData(true);

    } catch (error: any) {

      console.error(
        "Failed to cancel payment:",
        error
      );

      const message =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to cancel payment.";

      toast.error(message);

    } finally {

      setCancelling(false);
    }
  };


  return (
    <AppShell
      title="Payments"
      subtitle="Manage customer payments, receipts and accounting reversals."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Payments",
        },
      ]}
      actions={[
        {
          label: "Record Payment",
          href: "/payments/add",
        },
      ]}
    >

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          label="Payments"
          value={String(stats.total)}
          icon={<CreditCard size={20} />}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <SummaryCard
          label="Posted Amount"
          value={formatCurrency(
            stats.postedAmount
          )}
          icon={<Banknote size={20} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          label="Cancelled Amount"
          value={formatCurrency(
            stats.cancelledAmount
          )}
          icon={<XCircle size={20} />}
          iconClass="bg-red-50 text-red-600"
        />

        <SummaryCard
          label="Outstanding Receivables"
          value={formatCurrency(
            stats.receivables
          )}
          icon={<WalletCards size={20} />}
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>


      {/* =====================================================
          PAYMENT REGISTER
      ====================================================== */}

      <section className="mt-6 overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

        {/* Header */}

        <div className="border-b border-slate-100 p-5">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h2 className="font-semibold text-slate-950">
                Payment Register
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search, filter and manage customer payment transactions.
              </p>

            </div>


            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search payment, customer..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:w-72"
                />

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (value) => !value
                  )
                }
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                  showFilters
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Filter size={16} />
                Filters
              </button>


              <button
                type="button"
                onClick={() =>
                  loadData(true)
                }
                disabled={refreshing}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                title="Refresh payments"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

            </div>

          </div>


          {/* Filters */}

          {showFilters && (

            <div className="mt-5 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2 xl:grid-cols-5">

              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  "All",
                  "Posted",
                  "Cancelled",
                ]}
              />


              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </label>

                <select
                  value={customerFilter}
                  onChange={(event) =>
                    setCustomerFilter(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="All">
                    All Customers
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={customer}
                        value={customer}
                      >
                        {customer}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Invoice
                </label>

                <select
                  value={invoiceFilter}
                  onChange={(event) =>
                    setInvoiceFilter(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="All">
                    All Invoices
                  </option>

                  {invoiceOptions.map(
                    (invoice) => (
                      <option
                        key={invoice.id}
                        value={invoice.id}
                      >
                        {invoice.number}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  From Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) =>
                      setFromDate(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </div>


              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  To Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) =>
                      setToDate(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </div>


              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 xl:col-span-5 xl:justify-self-end"
              >
                <X size={15} />
                Clear Filters
              </button>

            </div>

          )}

        </div>


        {/* =================================================
            TABLE
        ================================================== */}

        {loading ? (

          <div className="flex min-h-[360px] items-center justify-center">

            <div className="text-center">

              <RefreshCw
                size={25}
                className="mx-auto animate-spin text-indigo-500"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading payments...
              </p>

            </div>

          </div>

        ) : filteredPayments.length === 0 ? (

          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <CreditCard size={24} />
            </span>

            <h3 className="mt-4 font-semibold text-slate-900">
              No payments found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Try changing your filters or record a new customer payment.
            </p>

            <Link
              href="/payments/add"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={16} />
              Record Payment
            </Link>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px] text-left">

              <thead className="bg-slate-50/80">

                <tr className="border-b border-slate-100">

                  <TableHead>
                    Payment
                  </TableHead>

                  <TableHead>
                    Customer
                  </TableHead>

                  <TableHead>
                    Invoice
                  </TableHead>

                  <TableHead>
                    Amount
                  </TableHead>

                  <TableHead>
                    Method
                  </TableHead>

                  <TableHead>
                    Date
                  </TableHead>

                  <TableHead>
                    Accounting
                  </TableHead>

                  <TableHead align="right">
                    Action
                  </TableHead>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredPayments.map(
                  (payment) => {

                    const cancelled =
                      payment.status ===
                      "Cancelled";

                    return (

                      <tr
                        key={payment.id}
                        className={`transition hover:bg-slate-50/70 ${
                          cancelled
                            ? "bg-red-50/20"
                            : ""
                        }`}
                      >

                        <td className="px-5 py-4">

                          <Link
                            href={`/payments/${payment.id}`}
                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            {payment.payment_number ||
                              `PAY-${payment.id}`}
                          </Link>

                          <p className="mt-0.5 text-xs text-slate-400">
                            ID #{payment.id}
                          </p>

                        </td>


                        <td className="px-5 py-4">

                          <p className="font-medium text-slate-800">
                            {payment.customer_name}
                          </p>

                        </td>


                        <td className="px-5 py-4">

                          <p className="font-medium text-slate-700">
                            {payment.invoice_number}
                          </p>

                        </td>


                        <td className="px-5 py-4">

                          <p
                            className={`font-semibold ${
                              cancelled
                                ? "text-slate-400 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {formatCurrency(
                              payment.amount_paid
                            )}
                          </p>

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">
                          {payment.payment_method}
                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(
                            payment.payment_date
                          )}
                        </td>


                        <td className="px-5 py-4">

                          <div className="flex flex-col gap-1">

                            <span
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                cancelled
                                  ? "bg-red-50 text-red-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >

                              {cancelled ? (
                                <XCircle size={13} />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}

                              {payment.status}

                            </span>


                            {payment.journal_reference && (

                              <span className="text-xs text-slate-400">
                                {payment.journal_reference}

                                {cancelled &&
                                  " · Reversed"}
                              </span>

                            )}

                            {!payment.journal_reference && (

                              <span className="text-xs text-amber-600">
                                Legacy payment
                              </span>

                            )}

                          </div>

                        </td>


                        <td className="px-5 py-4 text-right">

                          <div className="flex justify-end gap-2">

                            <Link
                              href={`/payments/${payment.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                              <Eye size={14} />
                              View
                            </Link>


                            {!cancelled && (

                              <button
                                type="button"
                                onClick={() => {
                                  setCancellingPayment(
                                    payment
                                  );
                                  setCancellationReason(
                                    ""
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                              >
                                <XCircle size={14} />
                                Cancel
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}


        {/* Footer */}

        {!loading &&
          filteredPayments.length > 0 && (

            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

              <span>
                Showing{" "}
                <strong className="text-slate-700">
                  {filteredPayments.length}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-700">
                  {payments.length}
                </strong>{" "}
                payments
              </span>

              <Link
                href="/payments/add"
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Record another payment
                <ChevronRight size={15} />
              </Link>

            </div>

          )}

      </section>


      {/* =====================================================
          ACCOUNTING CONTROL
      ====================================================== */}

      <div className="mt-6 flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">

        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0 text-indigo-600"
        />

        <div>

          <p className="text-sm font-semibold text-indigo-950">
            Accounting control
          </p>

          <p className="mt-1 text-sm leading-6 text-indigo-900/70">
            Posted customer payments remain part of the
            accounting history. Cancellation creates a
            reversal journal and restores the customer's
            outstanding receivable instead of deleting the
            original payment.
          </p>

        </div>

      </div>


      {/* =====================================================
          CANCELLATION MODAL
      ====================================================== */}

      {cancellingPayment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-[24px] bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-slate-950">
                  Cancel Payment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This action creates an accounting reversal.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setCancellingPayment(null)
                }
                disabled={cancelling}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>


            <div className="space-y-5 p-6">

              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">

                <div className="flex items-start gap-3">

                  <XCircle
                    size={20}
                    className="mt-0.5 text-red-600"
                  />

                  <div>

                    <p className="font-semibold text-red-900">
                      You are cancelling{" "}
                      {cancellingPayment.payment_number ||
                        `PAY-${cancellingPayment.id}`}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-800/80">
                      {formatCurrency(
                        cancellingPayment.amount_paid
                      )}{" "}
                      received from{" "}
                      {cancellingPayment.customer_name}.
                    </p>

                  </div>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Invoice
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {cancellingPayment.invoice_number}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Payment Method
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {cancellingPayment.payment_method}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Journal
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {cancellingPayment.journal_reference ||
                      "-"}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Current Status
                  </p>

                  <p className="mt-1 font-semibold text-emerald-700">
                    Posted
                  </p>

                </div>

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cancellation Reason
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  value={cancellationReason}
                  onChange={(event) =>
                    setCancellationReason(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Enter why this payment is being cancelled..."
                  disabled={cancelling}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 disabled:bg-slate-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  This reason will be stored with the payment and included in the audit trail.
                </p>

              </div>

            </div>


            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setCancellingPayment(null)
                }
                disabled={cancelling}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Keep Payment
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={
                  cancelling ||
                  cancellationReason.trim().length < 3
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >

                {cancelling ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle size={15} />
                    Cancel Payment
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


// =========================================================
// COMPONENTS
// =========================================================

function SummaryCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}) {

  return (

    <div className="rounded-[20px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

        </div>

        <span
          className={`grid h-11 w-11 place-items-center rounded-xl ${iconClass}`}
        >
          {icon}
        </span>

      </div>

    </div>
  );
}


function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {

  return (

    <th
      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>

  );
}


function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
}) {

  return (

    <div>

      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      >

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option === "All"
                ? `All ${label}s`
                : option}
            </option>
          )
        )}

      </select>

    </div>
  );
}