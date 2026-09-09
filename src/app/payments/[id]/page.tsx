"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Landmark,
  RefreshCw,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getPayment,
  PaymentDetail,
} from "@/services/paymentService";


const formatCurrency = (
  value: string | number
) =>
  `₦${Number(value || 0).toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;


const formatDate = (
  value: string | null
) => {

  if (!value) return "-";

  return new Date(value).toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};


export default function PaymentDetailPage() {

  const params = useParams();
  const router = useRouter();

  const paymentId = Number(
    params.id
  );

  const [payment, setPayment] =
    useState<PaymentDetail | null>(null);

  const [loading, setLoading] =
    useState(true);


  const loadPayment = async () => {

    try {

      setLoading(true);

      const data =
        await getPayment(
          paymentId
        );

      setPayment(data);

    } catch (error) {

      console.error(
        "Failed to load payment:",
        error
      );

      toast.error(
        "Unable to load payment."
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    if (paymentId) {
      loadPayment();
    }

  }, [paymentId]);


  if (loading) {

    return (

      <AppShell
        title="Payment"
        subtitle="Loading payment details..."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Payments",
            href: "/payments",
          },
          {
            label: "Payment",
          },
        ]}
      >

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="text-center">

            <RefreshCw
              size={25}
              className="mx-auto animate-spin text-indigo-500"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading payment...
            </p>

          </div>

        </div>

      </AppShell>
    );
  }


  if (!payment) {

    return (

      <AppShell
        title="Payment Not Found"
        subtitle="The requested payment could not be found."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Payments",
            href: "/payments",
          },
        ]}
      >

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

          <XCircle
            size={40}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-4 font-semibold text-slate-900">
            Payment not found
          </h2>

          <Link
            href="/payments"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft size={15} />
            Back to Payments
          </Link>

        </div>

      </AppShell>
    );
  }


  const cancelled =
    payment.status === "Cancelled";


  return (

    <AppShell
      title={
        payment.payment_number ||
        `PAY-${payment.id}`
      }
      subtitle="Customer payment and accounting transaction details."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Payments",
          href: "/payments",
        },
        {
          label:
            payment.payment_number ||
            `PAY-${payment.id}`,
        },
      ]}
      actions={[
        {
          label: "Back to Payments",
          href: "/payments",
        },
      ]}
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div className="flex items-start gap-4">

            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                cancelled
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >

              {cancelled ? (
                <XCircle size={22} />
              ) : (
                <CheckCircle2 size={22} />
              )}

            </span>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-xl font-bold text-slate-950">
                  {payment.payment_number ||
                    `PAY-${payment.id}`}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    cancelled
                      ? "bg-red-50 text-red-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {payment.status}
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Receipt reference for{" "}
                {payment.customer_name}
              </p>

            </div>

          </div>


          <div className="text-left lg:text-right">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Amount
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                cancelled
                  ? "text-slate-400 line-through"
                  : "text-slate-950"
              }`}
            >
              {formatCurrency(
                payment.amount_paid
              )}
            </p>

          </div>

        </div>


        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">

          <Info
            label="Customer"
            value={payment.customer_name}
          />

          <Info
            label="Invoice"
            value={payment.invoice_number}
          />

          <Info
            label="Payment Method"
            value={payment.payment_method}
          />

          <Info
            label="Payment Date"
            value={formatDate(
              payment.payment_date
            )}
          />

        </div>

      </div>


      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">

        {/* Accounting */}

        <section className="rounded-[22px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

          <div className="border-b border-slate-100 p-5">

            <div className="flex items-center gap-3">

              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Landmark size={19} />
              </span>

              <div>

                <h2 className="font-semibold text-slate-950">
                  Accounting Journal
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Double-entry record generated by this payment.
                </p>

              </div>

            </div>

          </div>


          <div className="p-5">

            <div className="grid gap-4 sm:grid-cols-3">

              <Info
                label="Journal Reference"
                value={
                  payment.journal_reference ||
                  "-"
                }
              />

              <Info
                label="Journal Status"
                value={
                  payment.journal_status ||
                  "-"
                }
              />

              <Info
                label="Invoice Balance"
                value={formatCurrency(
                  payment.balance_due
                )}
              />

            </div>


            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">

              <table className="w-full text-left">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Account
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Debit
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Credit
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {payment.journal_lines.map(
                    (line) => (

                      <tr key={line.id}>

                        <td className="px-4 py-4">

                          <p className="font-semibold text-slate-800">
                            {line.account_code} ·{" "}
                            {line.account_name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {line.account_type}
                          </p>

                        </td>

                        <td className="px-4 py-4 text-right font-semibold text-slate-800">
                          {Number(
                            line.debit
                          ) > 0
                            ? formatCurrency(
                                line.debit
                              )
                            : "-"}
                        </td>

                        <td className="px-4 py-4 text-right font-semibold text-slate-800">
                          {Number(
                            line.credit
                          ) > 0
                            ? formatCurrency(
                                line.credit
                              )
                            : "-"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>


        {/* Transaction information */}

        <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

          <div className="flex items-center gap-3">

            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <FileText size={19} />
            </span>

            <div>

              <h2 className="font-semibold text-slate-950">
                Transaction Information
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Payment traceability and audit information.
              </p>

            </div>

          </div>


          <div className="mt-6 space-y-5">

            <Info
              label="Payment Reference"
              value={
                payment.payment_number ||
                `PAY-${payment.id}`
              }
            />

            <Info
              label="Invoice"
              value={payment.invoice_number}
            />

            <Info
              label="Created"
              value={formatDate(
                payment.created_at
              )}
            />

            <Info
              label="Created By"
              value={
                payment.created_by
                  ? `User #${payment.created_by}`
                  : "-"
              }
            />

          </div>


          {cancelled && (

            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">

              <div className="flex items-start gap-3">

                <XCircle
                  size={18}
                  className="mt-0.5 text-red-600"
                />

                <div>

                  <p className="font-semibold text-red-900">
                    Payment Cancelled
                  </p>

                  <p className="mt-2 text-sm leading-5 text-red-800/80">
                    {payment.cancellation_reason ||
                      "No cancellation reason recorded."}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-red-700">

                    <p>
                      Cancelled by:{" "}
                      <strong>
                        {payment.cancelled_by_name ||
                          `User #${payment.cancelled_by || "-"}`}
                      </strong>
                    </p>

                    <p>
                      Cancelled at:{" "}
                      <strong>
                        {formatDate(
                          payment.cancelled_at
                        )}
                      </strong>
                    </p>

                  </div>

                </div>

              </div>

            </div>

          )}

        </section>

      </div>


      {/* =====================================================
          TRACEABILITY
      ====================================================== */}

      <div className="mt-6 rounded-[22px] border border-indigo-100 bg-indigo-50/60 p-6">

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-indigo-950">

          <Link
            href={`/invoices/${payment.invoice}`}
            className="hover:text-indigo-600"
          >
            Customer Invoice
          </Link>

          <ChevronRight size={15} />

          <span>
            {payment.payment_number ||
              `PAY-${payment.id}`}
          </span>

          <ChevronRight size={15} />

          <span>
            {payment.journal_reference ||
              "Accounting Journal"}
          </span>

        </div>

        <p className="mt-2 text-sm text-indigo-900/70">
          Customer → Invoice → Payment → Accounting
        </p>

      </div>


      <button
        type="button"
        onClick={() =>
          router.push("/payments")
        }
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft size={15} />
        Back to Payments
      </button>

    </AppShell>
  );
}


function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}