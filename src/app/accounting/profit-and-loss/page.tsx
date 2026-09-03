"use client";

import { useEffect, useState } from "react";
import {
  getProfitAndLoss,
  ProfitAndLoss,
  ProfitLossAccount,
} from "@/services/accountingService";

function formatCurrency(value: number) {
  return `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ProfitAndLossPage() {
  const [report, setReport] = useState<ProfitAndLoss | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport() {
    try {
      setLoading(true);
      setError("");

      const data = await getProfitAndLoss();

      setReport(data);
    } catch (err) {
      console.error("PROFIT AND LOSS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Profit & Loss report."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900">
            Profit & Loss
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Loading financial report...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900">
            Profit & Loss
          </h1>

          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>

          <button
            onClick={loadReport}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold">
            Profit & Loss
          </h1>

          <p className="mt-4 text-gray-500">
            No financial data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              ACCOUNTING
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Profit & Loss
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Detailed revenue, expenses and current-period profitability
            </p>
          </div>

          <button
            onClick={loadReport}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ↻ Refresh
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(report.total_revenue)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Total income generated
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(report.total_expenses)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Total recorded expenses
            </p>
          </div>

          <div
            className={`rounded-xl border bg-white p-5 shadow-sm ${
              report.is_profitable
                ? "border-green-200"
                : "border-red-200"
            }`}
          >
            <p className="text-sm text-gray-500">
              Net Profit
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                report.is_profitable
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(report.net_profit)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Revenue less expenses
            </p>
          </div>

        </div>

        {/* PROFITABILITY STATUS */}
        <div
          className={`rounded-xl border p-4 ${
            report.is_profitable
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Financial Status
              </p>

              <p
                className={`mt-1 font-semibold ${
                  report.is_profitable
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {report.is_profitable
                  ? "The business is currently profitable."
                  : "The business is currently operating at a loss."}
              </p>
            </div>

            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                report.is_profitable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {report.is_profitable
                ? "PROFITABLE"
                : "LOSS"}
            </div>
          </div>
        </div>

        {/* REVENUE */}
        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="border-b p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Revenue
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Revenue accounts from posted accounting transactions
            </p>
          </div>

          {report.revenue.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No revenue accounts recorded.
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
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.revenue.map(
                    (account: ProfitLossAccount) => (
                      <tr
                        key={account.account_id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="px-5 py-3 text-sm">
                          {account.code}
                        </td>

                        <td className="px-5 py-3 text-sm font-medium">
                          {account.name}
                        </td>

                        <td className="px-5 py-3 text-sm capitalize">
                          {account.account_type}
                        </td>

                        <td className="px-5 py-3 text-right text-sm font-medium">
                          {formatCurrency(account.amount)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-4 font-semibold"
                    >
                      Total Revenue
                    </td>

                    <td className="px-5 py-4 text-right font-bold">
                      {formatCurrency(report.total_revenue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        {/* EXPENSES */}
        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="border-b p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Expenses
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Expense accounts from posted accounting transactions
            </p>
          </div>

          {report.expenses.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No expenses recorded.
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
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.expenses.map(
                    (account: ProfitLossAccount) => (
                      <tr
                        key={account.account_id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="px-5 py-3 text-sm">
                          {account.code}
                        </td>

                        <td className="px-5 py-3 text-sm font-medium">
                          {account.name}
                        </td>

                        <td className="px-5 py-3 text-sm capitalize">
                          {account.account_type}
                        </td>

                        <td className="px-5 py-3 text-right text-sm font-medium">
                          {formatCurrency(account.amount)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-4 font-semibold"
                    >
                      Total Expenses
                    </td>

                    <td className="px-5 py-4 text-right font-bold">
                      {formatCurrency(report.total_expenses)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        {/* NET PROFIT */}
        <section className="rounded-xl border bg-white shadow-sm">

          <div className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Net Profit / Loss
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Total Revenue − Total Expenses
                </p>
              </div>

              <p
                className={`text-3xl font-bold ${
                  report.is_profitable
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(report.net_profit)}
              </p>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            Accounting figures are calculated from posted journal transactions.
          </span>

          <span>
            ERP Accounting · Phase 15.6
          </span>
        </div>

      </div>
    </div>
  );
}