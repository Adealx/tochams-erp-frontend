"use client";

import { useEffect, useState } from "react";
import {
  getTrialBalance,
  TrialBalance,
  TrialBalanceAccount,
} from "@/services/accountingService";

function formatCurrency(value: number) {
  return `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function TrialBalancePage() {
  const [report, setReport] = useState<TrialBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport() {
    try {
      setLoading(true);
      setError("");

      const data = await getTrialBalance();

      setReport(data);
    } catch (err) {
      console.error("TRIAL BALANCE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Trial Balance report."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-gray-500">
            ACCOUNTING
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Trial Balance
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Loading accounting transactions...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-gray-500">
            ACCOUNTING
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Trial Balance
          </h1>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-700">
              Unable to load Trial Balance.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={loadReport}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">
            Trial Balance
          </h1>

          <p className="mt-4 text-gray-500">
            No trial balance data available.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     CALCULATIONS
  ========================= */

  const difference =
    Number(report.total_debit || 0) -
    Number(report.total_credit || 0);

  const accountCount = report.accounts?.length || 0;

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-medium text-gray-500">
              ACCOUNTING
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Trial Balance
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Detailed debit and credit balances from posted
              accounting transactions
            </p>
          </div>

          <button
            onClick={loadReport}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ↻ Refresh
          </button>

        </div>

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL ACCOUNTS */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Accounts
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {accountCount}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Accounts with posted activity
            </p>
          </div>

          {/* TOTAL DEBIT */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Debit
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(report.total_debit)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Total debit balance
            </p>
          </div>

          {/* TOTAL CREDIT */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Credit
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(report.total_credit)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Total credit balance
            </p>
          </div>

          {/* STATUS */}

          <div
            className={`rounded-xl border p-5 shadow-sm ${
              report.balanced
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <p className="text-sm text-gray-600">
              Trial Balance Status
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                report.balanced
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {report.balanced
                ? "BALANCED"
                : "NOT BALANCED"}
            </p>

            <p className="mt-1 text-xs text-gray-600">
              {report.balanced
                ? "Debit equals credit"
                : "Debit does not equal credit"}
            </p>
          </div>

        </div>

        {/* =========================
            VALIDATION
        ========================= */}

        <div
          className={`rounded-xl border p-5 ${
            report.balanced
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Trial Balance Validation
              </p>

              <p className="mt-1 text-sm text-gray-600">
                {report.balanced
                  ? "The total debit balance is equal to the total credit balance."
                  : "The trial balance contains a difference between debit and credit."}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Difference
              </p>

              <p
                className={`mt-1 text-xl font-bold ${
                  difference === 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(difference))}
              </p>
            </div>

          </div>

        </div>

        {/* =========================
            TRIAL BALANCE TABLE
        ========================= */}

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="border-b p-5">

            <h2 className="text-xl font-semibold text-gray-900">
              Trial Balance Accounts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Posted accounting transactions grouped by account
            </p>

          </div>

          {report.accounts.length === 0 ? (

            <div className="p-8 text-center">
              <p className="font-medium text-gray-700">
                No accounting transactions found.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Posted journal transactions will appear here.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">

                    <th className="px-5 py-3">
                      Code
                    </th>

                    <th className="px-5 py-3">
                      Account
                    </th>

                    <th className="px-5 py-3">
                      Type
                    </th>

                    <th className="px-5 py-3 text-right">
                      Debit
                    </th>

                    <th className="px-5 py-3 text-right">
                      Credit
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {report.accounts.map(
                    (account: TrialBalanceAccount) => (

                      <tr
                        key={account.account_id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >

                        <td className="px-5 py-3 text-sm font-medium text-gray-700">
                          {account.code}
                        </td>

                        <td className="px-5 py-3 text-sm font-medium text-gray-900">
                          {account.name}
                        </td>

                        <td className="px-5 py-3 text-sm capitalize text-gray-600">
                          {account.account_type}
                        </td>

                        <td className="px-5 py-3 text-right text-sm">
                          {formatCurrency(account.debit)}
                        </td>

                        <td className="px-5 py-3 text-right text-sm">
                          {formatCurrency(account.credit)}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

                {/* TOTAL */}

                <tfoot className="bg-gray-50">

                  <tr>

                    <td
                      colSpan={3}
                      className="px-5 py-4 text-sm font-bold text-gray-900"
                    >
                      TOTAL
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(report.total_debit)}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(report.total_credit)}
                    </td>

                  </tr>

                </tfoot>

              </table>

            </div>

          )}

        </section>

        {/* =========================
            ACCOUNTING CHECK
        ========================= */}

        <section className="rounded-xl border bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-900">
                Accounting Check
              </p>

              <p className="mt-1 text-sm text-gray-500">
                A properly posted double-entry accounting system
                should always have equal total debits and credits.
              </p>

            </div>

            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                report.balanced
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {report.balanced
                ? "✓ DOUBLE-ENTRY BALANCED"
                : "✕ CHECK JOURNAL ENTRIES"}
            </div>

          </div>

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="flex flex-col gap-2 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">

          <span>
            Accounting figures are calculated from posted journal transactions.
          </span>

          <span>
            ERP Accounting · Phase 15.6.2
          </span>

        </div>

      </div>
    </div>
  );
}