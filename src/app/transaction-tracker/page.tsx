"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowUpDown,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getTransactionTrackerData,
  TrackerTransaction,
} from "@/services/transactionTrackerService";

// ============================================================
// TYPES
// ============================================================

type TrackerTab =
  | "All"
  | "Sale"
  | "Expense";

type SortField =
  | "date"
  | "reference"
  | "party"
  | "amount"
  | "status";

type SortDirection =
  | "asc"
  | "desc";

// ============================================================
// HELPERS
// ============================================================

function formatCurrency(
  value: number
) {
  return `₦${value.toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatDate(
  value: string
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
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

function getStatusClass(
  status: string
) {
  const normalized =
    status
      ?.toLowerCase()
      .replace(/_/g, " ");

  if (
    normalized === "posted" ||
    normalized === "paid" ||
    normalized === "completed"
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  }

  if (
    normalized.includes("partial") ||
    normalized === "pending"
  ) {
    return "bg-amber-50 text-amber-700 ring-amber-600/20";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "bg-red-50 text-red-700 ring-red-600/20";
  }

  if (
    normalized === "draft"
  ) {
    return "bg-slate-100 text-slate-600 ring-slate-500/20";
  }

  return "bg-blue-50 text-blue-700 ring-blue-600/20";
}

// ============================================================
// PAGE
// ============================================================

export default function TransactionTracker() {
  const [
    transactions,
    setTransactions,
  ] = useState<TrackerTransaction[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [tab, setTab] =
    useState<TrackerTab>("All");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [sortField, setSortField] =
    useState<SortField>("date");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  // ==========================================================
  // LOAD TRANSACTIONS
  // ==========================================================

  const loadTransactions = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data =
        await getTransactionTrackerData();

      setTransactions(data);

    } catch (error) {
      console.error(
        "Error loading transaction tracker:",
        error
      );

      setTransactions([]);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filteredTransactions =
    useMemo(() => {
      let result = [
        ...transactions,
      ];

      // --------------------------------------------------------
      // TAB
      // --------------------------------------------------------

      if (tab !== "All") {
        result =
          result.filter(
            (transaction) =>
              transaction.type ===
              tab
          );
      }

      // --------------------------------------------------------
      // SEARCH
      // --------------------------------------------------------

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (transaction) =>
              transaction.reference
                .toLowerCase()
                .includes(query) ||
              transaction.party
                .toLowerCase()
                .includes(query) ||
              transaction.description
                .toLowerCase()
                .includes(query) ||
              transaction.account
                .toLowerCase()
                .includes(query) ||
              transaction.paymentMethod
                .toLowerCase()
                .includes(query)
          );
      }

      // --------------------------------------------------------
      // STATUS
      // --------------------------------------------------------

      if (
        statusFilter !== "All"
      ) {
        result =
          result.filter(
            (transaction) =>
              transaction.status
                .toLowerCase() ===
              statusFilter.toLowerCase()
          );
      }

      // --------------------------------------------------------
      // DATE RANGE
      // --------------------------------------------------------

      if (startDate) {
        result =
          result.filter(
            (transaction) =>
              transaction.date >=
              startDate
          );
      }

      if (endDate) {
        result =
          result.filter(
            (transaction) =>
              transaction.date <=
              endDate
          );
      }

      // --------------------------------------------------------
      // SORT
      // --------------------------------------------------------

      result.sort((a, b) => {
        let comparison = 0;

        if (
          sortField === "amount"
        ) {
          comparison =
            a.amount - b.amount;

        } else if (
          sortField === "date"
        ) {
          comparison =
            new Date(
              a.date || 0
            ).getTime() -
            new Date(
              b.date || 0
            ).getTime();

        } else {
          comparison =
            String(
              a[sortField]
            ).localeCompare(
              String(
                b[sortField]
              )
            );
        }

        return sortDirection ===
          "asc"
          ? comparison
          : -comparison;
      });

      return result;
    }, [
      transactions,
      tab,
      search,
      statusFilter,
      startDate,
      endDate,
      sortField,
      sortDirection,
    ]);

  // ==========================================================
  // STATUS OPTIONS
  // ==========================================================

  const statusOptions =
    useMemo(() => {
      const statuses =
        new Set<string>();

      transactions.forEach(
        (transaction) => {
          if (
            transaction.status
          ) {
            statuses.add(
              transaction.status
            );
          }
        }
      );

      return Array.from(
        statuses
      ).sort();

    }, [transactions]);

  // ==========================================================
  // SUMMARY
  // ==========================================================

  const invoiceValue =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "Sale"
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0
      );

  const recordedExpenses =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "Expense"
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0
      );

  // ==========================================================
  // SORT
  // ==========================================================

  const handleSort = (
    field: SortField
  ) => {
    if (
      sortField === field
    ) {
      setSortDirection(
        (current) =>
          current === "asc"
            ? "desc"
            : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setStartDate("");
    setEndDate("");
    setTab("All");
  };

  // ==========================================================
  // CSV EXPORT
  // ==========================================================

  const exportCSV = () => {
    if (
      filteredTransactions.length ===
      0
    ) {
      return;
    }

    const headers = [
      "Date",
      "Type",
      "Reference",
      "Party",
      "Description",
      "Account",
      "Payment Method",
      "Amount",
      "Status",
      "Journal Reference",
    ];

    const rows =
      filteredTransactions.map(
        (transaction) => [
          transaction.date,
          transaction.type,
          transaction.reference,
          transaction.party,
          transaction.description,
          transaction.account,
          transaction.paymentMethod,
          transaction.amount.toFixed(
            2
          ),
          transaction.status,
          transaction.journalReference ||
            "",
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text =
              String(value);

            return `"${text.replace(
              /"/g,
              '""'
            )}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `tochams-transaction-tracker-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url
    );
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <AppShell
        title="Transaction Tracker"
        subtitle="Sales and expense activity across the ERP"
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Finance",
          },
          {
            label: "Transaction Tracker",
          },
        ]}
      >
        <div className="space-y-6">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />

            <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />

            <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />

          </div>

          <div className="h-[500px] animate-pulse rounded-2xl bg-slate-100" />

        </div>
      </AppShell>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <AppShell
      title="Transaction Tracker"
      subtitle="Excel-style operational tracking for sales and expenses"
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Finance",
        },
        {
          label: "Transaction Tracker",
        },
      ]}
    >
      <div className="space-y-6">

        {/* ================================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* ================================================= */}
          {/* INVOICE VALUE */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Invoice Value
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(
                    invoiceValue
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Operational invoice register total
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp size={21} />
              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* RECORDED EXPENSES */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Recorded Expenses
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(
                    recordedExpenses
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Expense register total
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <TrendingDown size={21} />
              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* RECORDS */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Records
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {
                    filteredTransactions.length
                  }
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Matching records
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileSpreadsheet size={21} />
              </div>

            </div>

          </div>

        </div>

        {/* ================================================== */}
        {/* TRANSACTION REGISTER */}
        {/* ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="border-b border-slate-100 px-5 py-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Transaction Register
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track operational transactions without altering the accounting records.
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                {/* Refresh */}

                <button
                  type="button"
                  onClick={() =>
                    loadTransactions(
                      true
                    )
                  }
                  disabled={refreshing}
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-sm
                    font-medium
                    text-slate-700
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
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

                {/* Export */}

                <button
                  type="button"
                  onClick={exportCSV}
                  disabled={
                    filteredTransactions.length ===
                    0
                  }
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-lg
                    bg-emerald-600
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-emerald-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Download size={16} />
                  Export CSV
                </button>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* TABS */}
          {/* ================================================= */}

          <div className="border-b border-slate-100 px-5">

            <div className="flex gap-6">

              {(
                [
                  "All",
                  "Sale",
                  "Expense",
                ] as TrackerTab[]
              ).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setTab(item)
                    }
                    className={`
                      border-b-2
                      px-1
                      py-3
                      text-sm
                      font-semibold
                      transition
                      ${
                        tab === item
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }
                    `}
                  >
                    {item ===
                    "All"
                      ? "All Transactions"
                      : item ===
                        "Sale"
                      ? "Sales"
                      : "Expenses"}
                  </button>
                )
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* FILTER BAR */}
          {/* ================================================= */}

          <div className="border-b border-slate-100 bg-slate-50/70 p-4">

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">

              {/* Search */}

              <div className="relative xl:col-span-2">

                <Search
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search reference, customer, supplier, description..."
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>

              {/* Status */}

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="
                  h-10
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value="All">
                  All Statuses
                </option>

                {statusOptions.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}

              </select>

              {/* Start Date */}

              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(
                    event.target.value
                  )
                }
                className="
                  h-10
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              {/* End Date */}

              <input
                type="date"
                value={endDate}
                onChange={(event) =>
                  setEndDate(
                    event.target.value
                  )
                }
                className="
                  h-10
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>

            {/* Filter Summary */}

            <div className="mt-3 flex items-center justify-between">

              <div className="flex items-center gap-2 text-xs text-slate-500">

                <Filter size={14} />

                <span>
                  {filteredTransactions.length}{" "}
                  matching records
                </span>

              </div>

              {(search ||
                statusFilter !==
                  "All" ||
                startDate ||
                endDate ||
                tab !== "All") && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          {filteredTransactions.length ===
          0 ? (
            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FileSpreadsheet size={25} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No transactions found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                No transactions match your current
                search, status or date filters.
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  mt-5
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
                Clear Filters
              </button>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-[1100px] w-full">

                {/* ================================================= */}
                {/* TABLE HEADER */}
                {/* ================================================= */}

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    {/* DATE */}

                    <th className="px-5 py-3 text-left">

                      <button
                        type="button"
                        onClick={() =>
                          handleSort(
                            "date"
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-slate-500
                          hover:text-slate-800
                        "
                      >
                        Date
                        <ArrowUpDown size={13} />
                      </button>

                    </th>

                    {/* TYPE */}

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    {/* REFERENCE */}

                    <th className="px-5 py-3 text-left">

                      <button
                        type="button"
                        onClick={() =>
                          handleSort(
                            "reference"
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-slate-500
                          hover:text-slate-800
                        "
                      >
                        Reference
                        <ArrowUpDown size={13} />
                      </button>

                    </th>

                    {/* PARTY */}

                    <th className="px-5 py-3 text-left">

                      <button
                        type="button"
                        onClick={() =>
                          handleSort(
                            "party"
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-slate-500
                          hover:text-slate-800
                        "
                      >
                        Customer / Supplier
                        <ArrowUpDown size={13} />
                      </button>

                    </th>

                    {/* DESCRIPTION */}

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Description
                    </th>

                    {/* ACCOUNT */}

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Account
                    </th>

                    {/* AMOUNT */}

                    <th className="px-5 py-3 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          handleSort(
                            "amount"
                          )
                        }
                        className="
                          ml-auto
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-slate-500
                          hover:text-slate-800
                        "
                      >
                        Amount
                        <ArrowUpDown size={13} />
                      </button>

                    </th>

                    {/* STATUS */}

                    <th className="px-5 py-3 text-center">

                      <button
                        type="button"
                        onClick={() =>
                          handleSort(
                            "status"
                          )
                        }
                        className="
                          mx-auto
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-slate-500
                          hover:text-slate-800
                        "
                      >
                        Status
                        <ArrowUpDown size={13} />
                      </button>

                    </th>

                    {/* ACTION */}

                    <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* ================================================= */}
                {/* TABLE BODY */}
                {/* ================================================= */}

                <tbody className="divide-y divide-slate-100">

                  {filteredTransactions.map(
                    (
                      transaction
                    ) => (
                      <tr
                        key={
                          transaction.id
                        }
                        className="transition hover:bg-slate-50"
                      >

                        {/* DATE */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">

                          {formatDate(
                            transaction.date
                          )}

                        </td>

                        {/* TYPE */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${
                                transaction.type ===
                                "Sale"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }
                            `}
                          >

                            {transaction.type ===
                            "Sale" ? (
                              <TrendingUp
                                size={13}
                              />
                            ) : (
                              <TrendingDown
                                size={13}
                              />
                            )}

                            {transaction.type}

                          </span>

                        </td>

                        {/* REFERENCE */}

                        <td className="px-5 py-4">

                          <Link
                            href={
                              transaction.sourcePath
                            }
                            className="
                              font-semibold
                              text-blue-600
                              hover:text-blue-700
                              hover:underline
                            "
                          >
                            {
                              transaction.reference
                            }
                          </Link>

                          {transaction.journalReference && (
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              Journal:{" "}
                              {
                                transaction.journalReference
                              }
                            </p>
                          )}

                        </td>

                        {/* PARTY */}

                        <td className="px-5 py-4">

                          <p className="font-medium text-slate-800">
                            {
                              transaction.party
                            }
                          </p>

                        </td>

                        {/* DESCRIPTION */}

                        <td className="max-w-[240px] px-5 py-4">

                          <p className="truncate text-sm text-slate-600">
                            {
                              transaction.description
                            }
                          </p>

                          {transaction.paymentMethod !==
                            "—" && (
                            <p className="mt-0.5 text-xs capitalize text-slate-400">
                              {
                                transaction.paymentMethod
                              }
                            </p>
                          )}

                        </td>

                        {/* ACCOUNT */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-slate-600">
                            {
                              transaction.account
                            }
                          </span>

                        </td>

                        {/* AMOUNT */}

                        <td className="px-5 py-4 text-right">

                          <span
                            className={`
                              font-bold
                              ${
                                transaction.type ===
                                "Sale"
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }
                            `}
                          >

                            {transaction.type ===
                            "Sale"
                              ? "+"
                              : "-"}

                            {formatCurrency(
                              transaction.amount
                            )}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4 text-center">

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
                              ${getStatusClass(
                                transaction.status
                              )}
                            `}
                          >
                            {
                              transaction.status
                            }
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-center">

                          <Link
                            href={
                              transaction.sourcePath
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-lg
                              border
                              border-slate-200
                              bg-white
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-slate-700
                              hover:border-blue-200
                              hover:bg-blue-50
                              hover:text-blue-600
                            "
                          >

                            <ExternalLink
                              size={14}
                            />

                            View

                          </Link>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

                {/* ================================================= */}
                {/* TOTAL */}
                {/* ================================================= */}

                <tfoot>

                  <tr className="border-t-2 border-slate-200 bg-slate-50">

                    <td
                      colSpan={6}
                      className="px-5 py-4 text-right text-sm font-bold text-slate-700"
                    >
                      Register Total
                    </td>

                    <td className="px-5 py-4 text-right">

                      <span className="font-bold text-slate-900">
                        {formatCurrency(
                          filteredTransactions.reduce(
                            (
                              sum,
                              transaction
                            ) =>
                              sum +
                              transaction.amount,
                            0
                          )
                        )}
                      </span>

                    </td>

                    <td
                      colSpan={2}
                    />

                  </tr>

                </tfoot>

              </table>

            </div>
          )}

        </section>

        {/* ================================================== */}
        {/* ACCOUNTING CONTROL */}
        {/* ================================================== */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">

          <div className="flex gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FileSpreadsheet size={17} />
            </div>

            <div>

              <p className="text-sm font-semibold text-blue-900">
                Accounting control
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                This tracker is a management view of
                ERP transactions. It does not create
                independent accounting records. Invoices
                and expenses remain controlled by their
                respective modules and accounting journals.
              </p>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}