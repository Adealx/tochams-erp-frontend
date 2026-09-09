"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Loader2,
  Receipt,
  RefreshCw,
  ShieldCheck,
  User,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  cancelExpense,
  getExpense,
  postExpense,
  Expense,
} from "@/services/expenseService";


const formatCurrency = (
  value: string | number | null | undefined
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
  value: string | null | undefined
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


const formatDateTime = (
  value: string | null | undefined
) => {
  if (!value) return "-";

  return new Date(value).toLocaleString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


const getStatusLabel = (
  status: Expense["status"]
) => {
  switch (status) {
    case "posted":
      return "Posted";

    case "cancelled":
      return "Cancelled";

    default:
      return "Draft";
  }
};


const getPaymentMethodLabel = (
  method: Expense["payment_method"]
) => {
  switch (method) {
    case "cash":
      return "Cash";

    case "bank":
      return "Bank";

    case "credit":
      return "Credit / Pay Later";

    default:
      return method;
  }
};


export default function ExpenseDetailPage() {

  const params = useParams();
  const router = useRouter();

  const expenseId = Number(params.id);

  const [expense, setExpense] =
    useState<Expense | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [showCancelModal, setShowCancelModal] =
    useState(false);


  // =========================================================
  // LOAD EXPENSE
  // =========================================================

  const loadExpense = async () => {

    if (!expenseId || Number.isNaN(expenseId)) {

      toast.error(
        "Invalid expense."
      );

      router.push("/expenses");

      return;
    }

    try {

      setLoading(true);

      const data =
        await getExpense(expenseId);

      setExpense(data);

    } catch (error: any) {

      console.error(
        "Failed to load expense:",
        error
      );

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to load this expense.";

      toast.error(message);

      router.push("/expenses");

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    loadExpense();
  }, [expenseId]);


  // =========================================================
  // POST EXPENSE
  // =========================================================

  const handlePost = async () => {

    if (!expense) return;

    if (expense.status !== "draft") {

      toast.error(
        "Only draft expenses can be posted."
      );

      return;
    }

    try {

      setProcessing(true);

      const response =
        await postExpense(
          expense.id
        );

      toast.success(
        response.message ||
          "Expense posted successfully."
      );

      setExpense(
        response.expense
      );

    } catch (error: any) {

      console.error(
        "Failed to post expense:",
        error
      );

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to post expense.";

      toast.error(message);

    } finally {

      setProcessing(false);
    }
  };


  // =========================================================
  // CANCEL EXPENSE
  // =========================================================

  const handleCancel = async () => {

    if (!expense) return;

    if (expense.status !== "posted") {

      toast.error(
        "Only posted expenses can be cancelled."
      );

      return;
    }

    try {

      setProcessing(true);

      const response =
        await cancelExpense(
          expense.id
        );

      toast.success(
        response.message ||
          "Expense cancelled successfully."
      );

      setShowCancelModal(false);

      setExpense(
        response.expense
      );

    } catch (error: any) {

      console.error(
        "Failed to cancel expense:",
        error
      );

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to cancel expense.";

      toast.error(message);

    } finally {

      setProcessing(false);
    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <AppShell
        title="Expense"
        subtitle="Loading expense details..."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Expenses",
            href: "/expenses",
          },
          {
            label: "Expense",
          },
        ]}
      >

        <div className="flex min-h-[520px] items-center justify-center">

          <div className="text-center">

            <Loader2
              size={30}
              className="mx-auto animate-spin text-indigo-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading expense...
            </p>

          </div>

        </div>

      </AppShell>
    );
  }


  if (!expense) {
    return null;
  }


  const status =
    getStatusLabel(
      expense.status
    );

  const isDraft =
    expense.status === "draft";

  const isPosted =
    expense.status === "posted";

  const isCancelled =
    expense.status === "cancelled";


  return (
    <AppShell
      title={expense.expense_number}
      subtitle="Review expense details, accounting status and transaction history."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Expenses",
          href: "/expenses",
        },
        {
          label: expense.expense_number,
        },
      ]}
      actions={[
        {
          label: "Back to Expenses",
          href: "/expenses",
        },
      ]}
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="rounded-[24px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <Link
              href="/expenses"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              title="Back to expenses"
            >
              <ArrowLeft size={18} />
            </Link>


            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  {expense.expense_number}
                </h1>

                <StatusBadge
                  status={expense.status}
                />

              </div>


              <p className="mt-1 text-sm text-slate-500">
                {expense.description ||
                  "No expense description provided."}
              </p>


              <p className="mt-2 text-xs text-slate-400">
                Reference:{" "}
                <span className="font-medium text-slate-500">
                  {expense.reference || "-"}
                </span>
              </p>

            </div>

          </div>


          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">

            <div className="text-left sm:text-right">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Expense Amount
              </p>

              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                {formatCurrency(
                  expense.amount
                )}
              </p>

            </div>


            {isDraft && (

              <button
                type="button"
                onClick={handlePost}
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {processing ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2 size={16} />
                )}

                {processing
                  ? "Posting..."
                  : "Post Expense"}

              </button>

            )}


            {isPosted && (

              <button
                type="button"
                onClick={() =>
                  setShowCancelModal(true)
                }
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <XCircle size={16} />
                Cancel Expense
              </button>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          STATUS CONTROL
      ====================================================== */}

      {isDraft && (

        <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">

          <Receipt
            size={19}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>

            <p className="text-sm font-semibold text-amber-950">
              Draft expense
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-900/75">
              This expense has been recorded but has not
              yet affected the accounting ledger. Posting
              it will create the corresponding double-entry
              journal.
            </p>

          </div>

        </div>

      )}


      {isPosted && (

        <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <div>

            <p className="text-sm font-semibold text-emerald-950">
              Expense posted
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-900/75">
              This expense has been posted to the accounting
              ledger. Posted expenses cannot be edited or
              deleted. Cancellation must be performed through
              an accounting reversal.
            </p>

          </div>

        </div>

      )}


      {isCancelled && (

        <div className="mt-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

          <XCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>

            <p className="text-sm font-semibold text-red-950">
              Expense cancelled
            </p>

            <p className="mt-1 text-sm leading-6 text-red-900/75">
              This expense has been cancelled through an
              accounting reversal. The original transaction
              remains in the accounting history.
            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_.9fr]">


        {/* ===================================================
            LEFT
        ==================================================== */}

        <div className="space-y-6">


          {/* EXPENSE DETAILS */}

          <section className="rounded-[22px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

            <SectionHeader
              icon={
                <FileText
                  size={18}
                />
              }
              title="Expense Details"
              subtitle="Transaction information"
            />


            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">

              <DetailItem
                label="Expense Number"
                value={
                  expense.expense_number
                }
              />

              <DetailItem
                label="Reference"
                value={
                  expense.reference || "-"
                }
              />

              <DetailItem
                label="Expense Date"
                value={
                  formatDate(
                    expense.date
                  )
                }
                icon={
                  <CalendarDays
                    size={15}
                  />
                }
              />

              <DetailItem
                label="Payment Method"
                value={
                  getPaymentMethodLabel(
                    expense.payment_method
                  )
                }
                icon={
                  <Wallet
                    size={15}
                  />
                }
              />

              <DetailItem
                label="Expense Account"
                value={
                  expense.expense_account_detail
                    ? `${expense.expense_account_detail.code} — ${expense.expense_account_detail.name}`
                    : "-"
                }
                icon={
                  <CircleDollarSign
                    size={15}
                  />
                }
              />

              <DetailItem
                label="Payment Account"
                value={
                  expense.payment_account_detail
                    ? `${expense.payment_account_detail.code} — ${expense.payment_account_detail.name}`
                    : "Not specified"
                }
                icon={
                  <Banknote
                    size={15}
                  />
                }
              />

              <DetailItem
                label="Supplier"
                value={
                  expense.supplier_detail
                    ? `${expense.supplier_detail.company_name} (${expense.supplier_detail.vendor_code})`
                    : "No supplier"
                }
                icon={
                  <Building2
                    size={15}
                  />
                }
              />

              <DetailItem
                label="Created By"
                value={
                  expense.created_by_name ||
                  "System"
                }
                icon={
                  <User
                    size={15}
                  />
                }
              />

            </div>


            <div className="border-t border-slate-100 p-6">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {expense.description ||
                  "No description provided."}
              </p>

            </div>

          </section>


          {/* ACCOUNTING */}

          <section className="rounded-[22px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

            <SectionHeader
              icon={
                <CircleDollarSign
                  size={18}
                />
              }
              title="Accounting"
              subtitle="Double-entry accounting status"
            />


            <div className="p-6">

              {expense.status === "draft" ? (

                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">

                  <div className="flex items-start gap-3">

                    <RefreshCw
                      size={19}
                      className="mt-0.5 text-amber-600"
                    />

                    <div>

                      <p className="font-semibold text-amber-950">
                        Accounting entry not posted
                      </p>

                      <p className="mt-1 text-sm leading-6 text-amber-900/70">
                        Posting this expense will create:
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 overflow-hidden rounded-xl border border-amber-200 bg-white">

                    <AccountingRow
                      label={
                        expense.expense_account_detail
                          ? `${expense.expense_account_detail.code} — ${expense.expense_account_detail.name}`
                          : "Expense Account"
                      }
                      amount={
                        formatCurrency(
                          expense.amount
                        )
                      }
                      side="Debit"
                    />

                    <AccountingRow
                      label={
                        expense.payment_account_detail
                          ? `${expense.payment_account_detail.code} — ${expense.payment_account_detail.name}`
                          : expense.payment_method ===
                            "credit"
                            ? "Supplier Payable"
                            : "Payment Account"
                      }
                      amount={
                        formatCurrency(
                          expense.amount
                        )
                      }
                      side="Credit"
                    />

                  </div>

                </div>

              ) : (

                <div>

                  <div className="grid gap-4 sm:grid-cols-3">

                    <MetricBox
                      label="Journal"
                      value={
                        expense.journal_reference ||
                        "-"
                      }
                    />

                    <MetricBox
                      label="Journal ID"
                      value={
                        expense.journal
                          ? `#${expense.journal}`
                          : "-"
                      }
                    />

                    <MetricBox
                      label="Status"
                      value={
                        expense.status ===
                        "posted"
                          ? "Posted"
                          : "Reversed"
                      }
                    />

                  </div>


                  <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">

                    <div className="flex items-start gap-3">

                      <CheckCircle2
                        size={19}
                        className="mt-0.5 text-emerald-600"
                      />

                      <div>

                        <p className="font-semibold text-slate-900">
                          Accounting journal recorded
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          The original journal reference is{" "}
                          <strong className="text-slate-700">
                            {expense.journal_reference ||
                              "-"}
                          </strong>
                          .
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </section>


          {/* AUDIT / TIMELINE */}

          <section className="rounded-[22px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

            <SectionHeader
              icon={
                <ShieldCheck
                  size={18}
                />
              }
              title="Expense Timeline"
              subtitle="Transaction lifecycle"
            />


            <div className="p-6">

              <TimelineItem
                title="Expense created"
                description={`Created as ${status.toLowerCase()} expense.`}
                date={
                  formatDateTime(
                    expense.created_at
                  )
                }
                active
              />


              {isDraft && (

                <TimelineItem
                  title="Awaiting posting"
                  description="The expense is still a draft and has not affected the ledger."
                  date="Current status"
                  active
                />

              )}


              {isPosted && (

                <TimelineItem
                  title="Expense posted"
                  description="A double-entry accounting journal was created for this expense."
                  date={
                    formatDateTime(
                      expense.updated_at
                    )
                  }
                  active
                />

              )}


              {isCancelled && (

                <>

                  <TimelineItem
                    title="Expense posted"
                    description="The original accounting journal was recorded."
                    date={
                      formatDateTime(
                        expense.created_at
                      )
                    }
                    active
                  />

                  <TimelineItem
                    title="Expense cancelled"
                    description="The original accounting journal was reversed. The transaction remains available for audit."
                    date={
                      formatDateTime(
                        expense.updated_at
                      )
                    }
                    active
                    danger
                  />

                </>

              )}

            </div>

          </section>

        </div>


        {/* ===================================================
            RIGHT
        ==================================================== */}

        <div className="space-y-6">


          {/* STATUS CARD */}

          <section className="rounded-[22px] border border-slate-200/90 bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Status
            </p>

            <div className="mt-4 flex items-center gap-3">

              <StatusIcon
                status={expense.status}
              />

              <div>

                <p className="font-bold text-slate-950">
                  {status}
                </p>

                <p className="text-sm text-slate-500">
                  {isDraft &&
                    "Awaiting accounting posting"}

                  {isPosted &&
                    "Posted to accounting ledger"}

                  {isCancelled &&
                    "Reversed and retained for audit"}
                </p>

              </div>

            </div>

          </section>


          {/* AMOUNT CARD */}

          <section className="rounded-[22px] border border-slate-200/90 bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Transaction Value
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {formatCurrency(
                    expense.amount
                  )}
                </p>

              </div>

              <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Banknote
                  size={20}
                />
              </span>

            </div>


            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">

              <InfoRow
                label="Method"
                value={
                  getPaymentMethodLabel(
                    expense.payment_method
                  )
                }
              />

              <InfoRow
                label="Date"
                value={
                  formatDate(
                    expense.date
                  )
                }
              />

              <InfoRow
                label="Reference"
                value={
                  expense.reference ||
                  "-"
                }
              />

            </div>

          </section>


          {/* SUPPLIER */}

          <section className="rounded-[22px] border border-slate-200/90 bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

            <div className="flex items-center gap-3">

              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <Building2
                  size={18}
                />
              </span>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Supplier
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {expense.supplier_detail
                    ?.company_name ||
                    "No supplier"}
                </p>

              </div>

            </div>


            {expense.supplier_detail && (

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">

                <InfoRow
                  label="Vendor Code"
                  value={
                    expense.supplier_detail
                      .vendor_code
                  }
                />

                <InfoRow
                  label="Contact"
                  value={
                    expense.supplier_detail
                      .contact_person ||
                    "-"
                  }
                />

                <InfoRow
                  label="Phone"
                  value={
                    expense.supplier_detail
                      .phone ||
                    "-"
                  }
                />

              </div>

            )}

          </section>


          {/* ACCOUNTING CONTROL */}

          <section className="rounded-[22px] border border-indigo-100 bg-indigo-50/60 p-5">

            <div className="flex gap-3">

              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <div>

                <p className="text-sm font-semibold text-indigo-950">
                  Accounting control
                </p>

                <p className="mt-1 text-sm leading-6 text-indigo-900/70">
                  Draft expenses do not affect the ledger.
                  Posted expenses cannot be edited or deleted.
                  Cancellation creates a reversal instead of
                  deleting the original accounting history.
                </p>

              </div>

            </div>

          </section>


          <Link
            href="/expenses"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Expense Register
          </Link>

        </div>

      </div>


      {/* =====================================================
          CANCEL MODAL
      ====================================================== */}

      {showCancelModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-[24px] bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-slate-950">
                  Cancel Expense
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This will reverse the accounting journal.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCancelModal(false)
                }
                disabled={processing}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>

            </div>


            <div className="space-y-5 p-6">

              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">

                <div className="flex items-start gap-3">

                  <XCircle
                    size={21}
                    className="mt-0.5 text-red-600"
                  />

                  <div>

                    <p className="font-semibold text-red-950">
                      Cancel{" "}
                      {expense.expense_number}?
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-900/75">
                      This will mark the expense as
                      cancelled and create a reversal
                      journal. The original journal will
                      not be deleted.
                    </p>

                  </div>

                </div>

              </div>


              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

                <div className="space-y-3">

                  <InfoRow
                    label="Amount"
                    value={
                      formatCurrency(
                        expense.amount
                      )
                    }
                  />

                  <InfoRow
                    label="Original Journal"
                    value={
                      expense.journal_reference ||
                      "-"
                    }
                  />

                  <InfoRow
                    label="Expense Account"
                    value={
                      expense.expense_account_detail
                        ? `${expense.expense_account_detail.code} — ${expense.expense_account_detail.name}`
                        : "-"
                    }
                  />

                </div>

              </div>


              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">

                <p className="text-sm font-semibold text-indigo-950">
                  Accounting reversal
                </p>

                <p className="mt-1 text-sm leading-6 text-indigo-900/70">
                  The system will create a reversal of
                  the original journal and preserve both
                  transactions for audit purposes.
                </p>

              </div>

            </div>


            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowCancelModal(false)
                }
                disabled={processing}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Keep Expense
              </button>


              <button
                type="button"
                onClick={handleCancel}
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >

                {processing ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle size={15} />
                    Cancel Expense
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


// ============================================================
// COMPONENTS
// ============================================================

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">

      <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </span>

      <div>

        <h2 className="font-semibold text-slate-950">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          {subtitle}
        </p>

      </div>

    </div>
  );
}


function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {

  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">

        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <p className="text-sm font-semibold text-slate-800">
          {value}
        </p>

      </div>

    </div>
  );
}


function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div className="flex items-start justify-between gap-4">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}


function MetricBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 truncate font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}


function AccountingRow({
  label,
  amount,
  side,
}: {
  label: string;
  amount: string;
  side: "Debit" | "Credit";
}) {

  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-b-0">

      <div>

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {side}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {label}
        </p>

      </div>

      <p className="font-bold text-slate-900">
        {amount}
      </p>

    </div>
  );
}


function TimelineItem({
  title,
  description,
  date,
  active,
  danger = false,
}: {
  title: string;
  description: string;
  date: string;
  active?: boolean;
  danger?: boolean;
}) {

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">

      <div className="relative flex flex-col items-center">

        <span
          className={`grid h-9 w-9 place-items-center rounded-full ${
            danger
              ? "bg-red-50 text-red-600"
              : active
                ? "bg-indigo-50 text-indigo-600"
                : "bg-slate-100 text-slate-400"
          }`}
        >
          {danger ? (
            <XCircle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
        </span>

        <span className="absolute top-9 h-full w-px bg-slate-200 last:hidden" />

      </div>


      <div className="min-w-0 flex-1">

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

          <p className="font-semibold text-slate-900">
            {title}
          </p>

          <span className="text-xs text-slate-400">
            {date}
          </span>

        </div>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}


function StatusBadge({
  status,
}: {
  status: Expense["status"];
}) {

  const styles = {
    draft:
      "bg-amber-50 text-amber-700 border-amber-100",
    posted:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled:
      "bg-red-50 text-red-700 border-red-100",
  };


  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >

      {status === "posted" && (
        <CheckCircle2 size={13} />
      )}

      {status === "draft" && (
        <RefreshCw size={13} />
      )}

      {status === "cancelled" && (
        <XCircle size={13} />
      )}

      {getStatusLabel(status)}

    </span>
  );
}


function StatusIcon({
  status,
}: {
  status: Expense["status"];
}) {

  if (status === "posted") {

    return (
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={21} />
      </span>
    );
  }


  if (status === "cancelled") {

    return (
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600">
        <XCircle size={21} />
      </span>
    );
  }


  return (
    <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
      <RefreshCw size={21} />
    </span>
  );
}