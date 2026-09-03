"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getAccountLedger,
  getTrialBalance,
  type AccountLedger,
  type LedgerEntry,
  type TrialBalance,
  type TrialBalanceAccount,
} from "@/services/accountingService";


// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value: number | string | null | undefined) => {
  const amount = Number(value || 0);

  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


// ============================================================
// PAGE
// ============================================================

export default function LedgerPage() {
  // ----------------------------------------------------------
  // ACCOUNT DATA
  // ----------------------------------------------------------

  const [trialBalance, setTrialBalance] =
    useState<TrialBalance | null>(null);

  const [selectedAccountId, setSelectedAccountId] =
    useState<number | "">("");


  // ----------------------------------------------------------
  // LEDGER DATA
  // ----------------------------------------------------------

  const [ledger, setLedger] =
    useState<AccountLedger | null>(null);


  // ----------------------------------------------------------
  // UI STATE
  // ----------------------------------------------------------

  const [loadingAccounts, setLoadingAccounts] =
    useState(true);

  const [loadingLedger, setLoadingLedger] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  // ==========================================================
  // LOAD ACCOUNTS
  // ==========================================================

  useEffect(() => {
    loadAccounts();
  }, []);


  async function loadAccounts() {
    try {
      setLoadingAccounts(true);
      setError("");

      const data = await getTrialBalance();

      setTrialBalance(data);

      // Automatically select the first account
      // if there is no account currently selected.
      if (
        data.accounts.length > 0 &&
        selectedAccountId === ""
      ) {
        setSelectedAccountId(
          data.accounts[0].account_id
        );
      }

    } catch (err) {
      console.error(
        "LEDGER ACCOUNT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load accounting accounts."
      );

    } finally {
      setLoadingAccounts(false);
    }
  }


  // ==========================================================
  // LOAD LEDGER
  // ==========================================================

  useEffect(() => {
    if (selectedAccountId === "") {
      setLedger(null);
      return;
    }

    loadLedger(selectedAccountId);
  }, [selectedAccountId]);


  async function loadLedger(accountId: number) {
    try {
      setLoadingLedger(true);
      setError("");

      const data =
        await getAccountLedger(accountId);

      setLedger(data);

    } catch (err) {
      console.error(
        "ACCOUNT LEDGER ERROR:",
        err
      );

      setLedger(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load account ledger."
      );

    } finally {
      setLoadingLedger(false);
    }
  }


  // ==========================================================
  // REFRESH
  // ==========================================================

  async function handleRefresh() {
    try {
      setRefreshing(true);
      setError("");

      await loadAccounts();

      if (selectedAccountId !== "") {
        await loadLedger(selectedAccountId);
      }

    } finally {
      setRefreshing(false);
    }
  }


  // ==========================================================
  // FILTER LEDGER
  // ==========================================================

  const filteredLedger =
    useMemo<LedgerEntry[]>(() => {
      if (!ledger?.ledger) {
        return [];
      }

      const query =
        search.trim().toLowerCase();

      if (!query) {
        return ledger.ledger;
      }

      return ledger.ledger.filter(
        (entry) =>
          entry.reference
            ?.toLowerCase()
            .includes(query) ||

          entry.transaction_type
            ?.toLowerCase()
            .includes(query) ||

          entry.description
            ?.toLowerCase()
            .includes(query)
      );
    }, [ledger, search]);


  // ==========================================================
  // SELECTED ACCOUNT
  // ==========================================================

  const selectedAccount =
    useMemo<TrialBalanceAccount | null>(() => {
      if (
        !trialBalance ||
        selectedAccountId === ""
      ) {
        return null;
      }

      return (
        trialBalance.accounts.find(
          (account) =>
            account.account_id ===
            selectedAccountId
        ) || null
      );
    }, [
      trialBalance,
      selectedAccountId,
    ]);


  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (
    loadingAccounts &&
    !trialBalance
  ) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Accounting
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Account Ledger
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Detailed transaction history for individual accounts
            </p>
          </div>

          <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading accounting accounts...
            </p>
          </div>

        </div>
      </div>
    );
  }


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      <div className="mx-auto max-w-7xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Accounting
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Account Ledger
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Detailed transaction history for posted accounting transactions
            </p>

          </div>


          <button
            type="button"
            onClick={handleRefresh}
            disabled={
              refreshing ||
              loadingAccounts
            }
            className="inline-flex items-center justify-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {refreshing ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                Refreshing...
              </>
            ) : (
              <>
                <span className="mr-2">
                  ↻
                </span>
                Refresh
              </>
            )}

          </button>

        </div>


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <div className="font-semibold">
              Unable to load ledger
            </div>

            <div className="mt-1">
              {error}
            </div>

          </div>
        )}


        {/* ================================================== */}
        {/* ACCOUNT SELECTOR */}
        {/* ================================================== */}

        <section className="mb-6 rounded-xl border bg-white p-5 shadow-sm">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end">

            <div className="md:col-span-2">

              <label
                htmlFor="account"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Select Account
              </label>

              <select
                id="account"
                value={selectedAccountId}
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setSelectedAccountId(
                    value
                      ? Number(value)
                      : ""
                  );

                  setSearch("");
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select an account
                </option>

                {trialBalance?.accounts.map(
                  (account) => (
                    <option
                      key={account.account_id}
                      value={account.account_id}
                    >
                      {account.code} — {account.name}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Accounts Available
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {trialBalance?.accounts.length || 0}
              </p>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* SELECTED ACCOUNT HEADER */}
        {/* ================================================== */}

        {ledger && (
          <section className="mb-6 rounded-xl border bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {ledger.account.code}
                  </span>

                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                    {ledger.account.account_type}
                  </span>

                </div>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {ledger.account.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Detailed posted transaction ledger
                </p>

              </div>


              <div className="rounded-lg bg-gray-50 px-5 py-3">

                <p className="text-xs text-gray-500">
                  Account Balance
                </p>

                <p
                  className={`mt-1 text-xl font-bold ${
                    Number(ledger.balance) >= 0
                      ? "text-gray-900"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(
                    ledger.balance
                  )}
                </p>

              </div>

            </div>

          </section>
        )}


        {/* ================================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================================== */}

        {ledger && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Total Debit
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(
                  ledger.debit_total
                )}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Total posted debits
              </p>

            </div>


            <div className="rounded-xl border bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Total Credit
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(
                  ledger.credit_total
                )}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Total posted credits
              </p>

            </div>


            <div className="rounded-xl border bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Transactions
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {ledger.ledger.length}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Posted ledger entries
              </p>

            </div>


            <div className="rounded-xl border bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Closing Balance
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${
                  Number(ledger.balance) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(
                  ledger.balance
                )}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Current account balance
              </p>

            </div>

          </div>
        )}


        {/* ================================================== */}
        {/* LEDGER TABLE */}
        {/* ================================================== */}

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Transaction Ledger
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Posted accounting transactions for the selected account
              </p>

            </div>


            {ledger && (
              <div className="w-full md:w-80">

                <label
                  htmlFor="ledger-search"
                  className="sr-only"
                >
                  Search ledger
                </label>

                <input
                  id="ledger-search"
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search reference, type or description..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>
            )}

          </div>


          {/* LOADING */}

          {loadingLedger ? (

            <div className="p-10 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-gray-500">
                Loading account ledger...
              </p>

            </div>

          ) : !ledger ? (

            /* NO ACCOUNT SELECTED */

            <div className="p-10 text-center">

              <div className="text-4xl">
                📒
              </div>

              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                Select an account
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                Select an account above to view its complete posted transaction ledger.
              </p>

            </div>

          ) : filteredLedger.length === 0 ? (

            /* EMPTY LEDGER */

            <div className="p-10 text-center">

              <div className="text-4xl">
                {search ? "🔎" : "📒"}
              </div>

              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {search
                  ? "No matching transactions"
                  : "No transactions recorded"}
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                {search
                  ? "Try changing your search criteria."
                  : "There are currently no posted journal transactions for this account."}
              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="min-w-full text-left text-sm">

                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">

                  <tr>

                    <th className="whitespace-nowrap px-5 py-3 font-semibold">
                      Date
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 font-semibold">
                      Reference
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 font-semibold">
                      Transaction Type
                    </th>

                    <th className="min-w-[260px] px-5 py-3 font-semibold">
                      Description
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-right font-semibold">
                      Debit
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-right font-semibold">
                      Credit
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-right font-semibold">
                      Balance
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-100">

                  {filteredLedger.map(
                    (entry, index) => (

                      <tr
                        key={`${entry.reference}-${entry.date}-${index}`}
                        className="transition hover:bg-gray-50"
                      >

                        <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                          {formatDate(
                            entry.date
                          )}
                        </td>


                        <td className="whitespace-nowrap px-5 py-4">

                          <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-gray-700">
                            {entry.reference || "-"}
                          </span>

                        </td>


                        <td className="whitespace-nowrap px-5 py-4">

                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
                            {entry.transaction_type ||
                              "-"}
                          </span>

                        </td>


                        <td className="px-5 py-4 text-gray-700">

                          <div className="max-w-[400px]">
                            {entry.description ||
                              "No description"}
                          </div>

                        </td>


                        <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-gray-900">
                          {Number(
                            entry.debit
                          ) > 0
                            ? formatCurrency(
                                entry.debit
                              )
                            : "—"}
                        </td>


                        <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-gray-900">
                          {Number(
                            entry.credit
                          ) > 0
                            ? formatCurrency(
                                entry.credit
                              )
                            : "—"}
                        </td>


                        <td
                          className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${
                            Number(
                              entry.balance
                            ) >= 0
                              ? "text-gray-900"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(
                            entry.balance
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>


                {/* ================================================== */}
                {/* TOTAL */}
                {/* ================================================== */}

                <tfoot className="border-t-2 bg-gray-50">

                  <tr>

                    <td
                      colSpan={4}
                      className="px-5 py-4 font-bold text-gray-900"
                    >
                      TOTAL
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-gray-900">
                      {formatCurrency(
                        ledger.debit_total
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-gray-900">
                      {formatCurrency(
                        ledger.credit_total
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-gray-900">
                      {formatCurrency(
                        ledger.balance
                      )}
                    </td>

                  </tr>

                </tfoot>

              </table>

            </div>

          )}

        </section>


        {/* ================================================== */}
        {/* ACCOUNTING NOTE */}
        {/* ================================================== */}

        <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            Accounting figures are calculated from posted journal transactions.
          </p>

          <p className="font-medium">
            ERP Accounting · Phase 15.7
          </p>

        </div>

      </div>

    </div>
  );
}