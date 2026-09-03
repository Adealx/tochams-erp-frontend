"use client";

import { useEffect, useState } from "react";
import {
  getBalanceSheet,
  BalanceSheet,
  BalanceSheetAccount,
} from "@/services/accountingService";

function formatCurrency(value: number) {
  return `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function BalanceSheetPage() {
  const [report, setReport] = useState<BalanceSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport() {
    try {
      setLoading(true);
      setError("");

      const data = await getBalanceSheet();

      setReport(data);
    } catch (err) {
      console.error("BALANCE SHEET ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Balance Sheet report."
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
            Balance Sheet
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Loading financial position...
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
            Balance Sheet
          </h1>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-700">
              Unable to load Balance Sheet.
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
            Balance Sheet
          </h1>

          <p className="mt-4 text-gray-500">
            No Balance Sheet data available.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     CALCULATIONS
  ========================= */

  const totalEquityWithProfit =
    Number(report.total_equity || 0) +
    Number(report.net_profit || 0);

  const liabilitiesAndEquity =
    Number(report.total_liabilities || 0) +
    totalEquityWithProfit;

  const difference =
    Number(report.total_assets || 0) -
    liabilitiesAndEquity;

  const assetCount = report.assets?.length || 0;
  const liabilityCount = report.liabilities?.length || 0;
  const equityCount = report.equity?.length || 0;

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
              Balance Sheet
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Detailed statement of the business financial position
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

          {/* ASSETS */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Assets
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(report.total_assets)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {assetCount} asset account
              {assetCount === 1 ? "" : "s"}
            </p>
          </div>

          {/* LIABILITIES */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Liabilities
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(report.total_liabilities)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {liabilityCount} liability account
              {liabilityCount === 1 ? "" : "s"}
            </p>
          </div>

          {/* EQUITY */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Equity
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(totalEquityWithProfit)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Equity + current-period profit
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
              Balance Sheet Status
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
                ? "Assets equal liabilities plus equity"
                : "Financial position requires review"}
            </p>
          </div>

        </div>

        {/* =========================
            BALANCE VALIDATION
        ========================= */}

        <div
          className={`rounded-xl border p-5 ${
            report.balanced
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Accounting Equation
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Assets = Liabilities + Equity + Current-Period Profit
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
            MAIN BALANCE SHEET
        ========================= */}

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="border-b p-5">

            <h2 className="text-xl font-semibold text-gray-900">
              Statement of Financial Position
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Assets, liabilities and equity from posted accounting transactions
            </p>

          </div>

          <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">

            {/* =========================
                ASSETS
            ========================= */}

            <div className="p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Assets
                  </h3>

                  <p className="text-xs text-gray-500">
                    Resources owned by the business
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {assetCount}
                </span>

              </div>

              {report.assets.length === 0 ? (

                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  No assets recorded.
                </div>

              ) : (

                <div className="space-y-1">

                  {report.assets.map(
                    (account: BalanceSheetAccount) => (

                      <div
                        key={account.account_id}
                        className="flex items-center justify-between border-b py-3 last:border-b-0"
                      >

                        <div className="min-w-0">

                          <p className="text-sm font-medium text-gray-900">
                            {account.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {account.code} ·{" "}
                            {account.account_type}
                          </p>

                        </div>

                        <p className="ml-4 text-right text-sm font-medium text-gray-900">
                          {formatCurrency(account.amount)}
                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

              <div className="mt-4 flex justify-between border-t-2 pt-4">

                <span className="font-semibold text-gray-900">
                  Total Assets
                </span>

                <span className="font-bold text-gray-900">
                  {formatCurrency(report.total_assets)}
                </span>

              </div>

            </div>

            {/* =========================
                LIABILITIES
            ========================= */}

            <div className="p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Liabilities
                  </h3>

                  <p className="text-xs text-gray-500">
                    Obligations owed by the business
                  </p>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                  {liabilityCount}
                </span>

              </div>

              {report.liabilities.length === 0 ? (

                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  No liabilities recorded.
                </div>

              ) : (

                <div className="space-y-1">

                  {report.liabilities.map(
                    (account: BalanceSheetAccount) => (

                      <div
                        key={account.account_id}
                        className="flex items-center justify-between border-b py-3 last:border-b-0"
                      >

                        <div className="min-w-0">

                          <p className="text-sm font-medium text-gray-900">
                            {account.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {account.code} ·{" "}
                            {account.account_type}
                          </p>

                        </div>

                        <p className="ml-4 text-right text-sm font-medium text-gray-900">
                          {formatCurrency(account.amount)}
                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

              <div className="mt-4 flex justify-between border-t-2 pt-4">

                <span className="font-semibold text-gray-900">
                  Total Liabilities
                </span>

                <span className="font-bold text-gray-900">
                  {formatCurrency(report.total_liabilities)}
                </span>

              </div>

            </div>

            {/* =========================
                EQUITY
            ========================= */}

            <div className="p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Equity
                  </h3>

                  <p className="text-xs text-gray-500">
                    Owners&apos; interest in the business
                  </p>
                </div>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  {equityCount}
                </span>

              </div>

              {report.equity.length === 0 ? (

                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  No equity accounts recorded.
                </div>

              ) : (

                <div className="space-y-1">

                  {report.equity.map(
                    (account: BalanceSheetAccount) => (

                      <div
                        key={account.account_id}
                        className="flex items-center justify-between border-b py-3 last:border-b-0"
                      >

                        <div className="min-w-0">

                          <p className="text-sm font-medium text-gray-900">
                            {account.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {account.code} ·{" "}
                            {account.account_type}
                          </p>

                        </div>

                        <p className="ml-4 text-right text-sm font-medium text-gray-900">
                          {formatCurrency(account.amount)}
                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

              {/* CURRENT PERIOD PROFIT */}

              <div className="mt-4 border-t-2 pt-4">

                <div className="flex items-center justify-between py-2">

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Current Period Profit
                    </p>

                    <p className="text-xs text-gray-500">
                      Current-period net profit
                    </p>
                  </div>

                  <p
                    className={`text-sm font-bold ${
                      Number(report.net_profit) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(report.net_profit)}
                  </p>

                </div>

                <div className="mt-2 flex justify-between border-t pt-3">

                  <span className="font-semibold text-gray-900">
                    Total Equity + Profit
                  </span>

                  <span className="font-bold text-gray-900">
                    {formatCurrency(totalEquityWithProfit)}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            EQUATION SUMMARY
        ========================= */}

        <section className="rounded-xl border bg-white shadow-sm">

          <div className="border-b p-5">

            <h2 className="text-xl font-semibold text-gray-900">
              Balance Sheet Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Final accounting equation validation
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">

            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Total Assets
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {formatCurrency(report.total_assets)}
              </p>

            </div>

            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Liabilities + Equity
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {formatCurrency(liabilitiesAndEquity)}
              </p>

            </div>

            <div
              className={`rounded-lg p-4 ${
                report.balanced
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >

              <p className="text-sm text-gray-500">
                Difference
              </p>

              <p
                className={`mt-2 text-xl font-bold ${
                  report.balanced
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(difference))}
              </p>

            </div>

          </div>

          <div
            className={`mx-5 mb-5 rounded-lg border p-4 ${
              report.balanced
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="font-semibold text-gray-900">
                  {report.balanced
                    ? "✓ Balance Sheet is Balanced"
                    : "✕ Balance Sheet is Not Balanced"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {report.balanced
                    ? "Total assets equal liabilities plus equity and current-period profit."
                    : "Please review the posted journal transactions and account balances."}
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
                  ? "BALANCED"
                  : "REVIEW REQUIRED"}
              </div>

            </div>

          </div>

        </section>

        {/* =========================
            ACCOUNTING NOTE
        ========================= */}

        <div className="rounded-lg border bg-white p-4 text-sm text-gray-500 shadow-sm">

          <p className="font-medium text-gray-700">
            Accounting Note
          </p>

          <p className="mt-1">
            Balance Sheet figures are calculated from posted journal
            transactions. Current-period profit is included in equity
            for the accounting equation validation.
          </p>

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="flex flex-col gap-2 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">

          <span>
            Accounting figures are calculated from posted journal transactions.
          </span>

          <span>
            ERP Accounting · Phase 15.6.3
          </span>

        </div>

      </div>
    </div>
  );
}