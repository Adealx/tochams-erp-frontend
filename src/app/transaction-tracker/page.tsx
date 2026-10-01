"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";

import {
  getTransactionTrackerData,
  TrackerTransaction,
  TransactionType,
  calculateTotalSales,
  calculateTotalExpenses,
  calculateNetMovement,
  calculateTotalPaid,
  calculateTotalOutstanding,
  calculateRegisterTotal,
} from "@/services/transactionTrackerService";

import {
  Search,
  RefreshCw,
  Download,
  X,
  Eye,
  ChevronDown,
  Filter,
  FileSpreadsheet,
} from "lucide-react";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

function formatCurrency(value: number) {
  return currency.format(Number(value || 0));
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export default function TransactionTrackerPage() {
  const [transactions, setTransactions] = useState<TrackerTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | TransactionType>(
    "All"
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [salespersonFilter, setSalespersonFilter] = useState("All");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showFilters, setShowFilters] = useState(true);

  async function loadTransactions() {
    try {
      setLoading(true);

      const data = await getTransactionTrackerData();

      setTransactions(data);
    } catch (error) {
      console.error("Transaction Tracker Error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  /*
  ============================================================
  FILTER OPTIONS
  ============================================================
  */

  const statuses = useMemo(() => {
    const values = transactions
      .map((transaction) => transaction.status)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [transactions]);

  const salespeople = useMemo(() => {
    const values = transactions
      .map((transaction) => transaction.salesperson)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [transactions]);

  const paymentMethods = useMemo(() => {
    const values = transactions
      .map((transaction) => transaction.paymentMethod)
      .filter(Boolean)
      .filter((value) => value !== "—");

    return ["All", ...Array.from(new Set(values))];
  }, [transactions]);

  /*
  ============================================================
  FILTER TRANSACTIONS
  ============================================================
  */

  const filteredTransactions = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !searchText ||
        [
          transaction.reference,
          transaction.party,
          transaction.salesperson,
          transaction.description,
          transaction.account,
          transaction.paymentAccount,
          transaction.paymentMethod,
          transaction.status,
          transaction.journalReference,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "All" || transaction.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      const matchesSalesperson =
        salespersonFilter === "All" ||
        transaction.salesperson === salespersonFilter;

      const matchesPaymentMethod =
        paymentMethodFilter === "All" ||
        transaction.paymentMethod === paymentMethodFilter;

      const transactionDate =
        transaction.date?.slice(0, 10) || "";

      const matchesFrom =
        !dateFrom || transactionDate >= dateFrom;

      const matchesTo =
        !dateTo || transactionDate <= dateTo;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesSalesperson &&
        matchesPaymentMethod &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [
    transactions,
    search,
    typeFilter,
    statusFilter,
    salespersonFilter,
    paymentMethodFilter,
    dateFrom,
    dateTo,
  ]);

  /*
  ============================================================
  EXCEL-STYLE CALCULATIONS
  ============================================================
  */

  const totalSales = calculateTotalSales(filteredTransactions);

  const totalExpenses =
    calculateTotalExpenses(filteredTransactions);

  const netMovement =
    calculateNetMovement(filteredTransactions);

  const totalPaid =
    calculateTotalPaid(filteredTransactions);

  const totalOutstanding =
    calculateTotalOutstanding(filteredTransactions);

  const registerTotal =
    calculateRegisterTotal(filteredTransactions);

  const salesRows = filteredTransactions.filter(
    (transaction) => transaction.type === "Sale"
  ).length;

  const expenseRows = filteredTransactions.filter(
    (transaction) => transaction.type === "Expense"
  ).length;

  /*
  ============================================================
  CLEAR FILTERS
  ============================================================
  */

  function clearFilters() {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setSalespersonFilter("All");
    setPaymentMethodFilter("All");
    setDateFrom("");
    setDateTo("");
  }

  /*
  ============================================================
  CSV EXPORT
  ============================================================
  */

  function exportCsv() {
    const headers = [
      "No",
      "Date",
      "Type",
      "Reference",
      "Customer / Supplier",
      "Salesperson",
      "Description",
      "Account",
      "Payment Account",
      "Payment Method",
      "Amount",
      "Total Paid",
      "Balance Due",
      "Payment Date",
      "Status",
      "Journal Reference",
    ];

    const rows = filteredTransactions.map(
      (transaction, index) => [
        index + 1,
        formatDate(transaction.date),
        transaction.type,
        transaction.reference,
        transaction.party,
        transaction.salesperson,
        transaction.description,
        transaction.account,
        transaction.paymentAccount,
        transaction.paymentMethod,
        transaction.amount,
        transaction.totalPaid,
        transaction.balanceDue,
        formatDate(transaction.paymentDate),
        transaction.status,
        transaction.journalReference || "",
      ]
    );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row.map(escapeCsv).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `tochams_transaction_tracker_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  /*
  ============================================================
  OPEN TRANSACTION
  ============================================================
  */

  function openTransaction(
    transaction: TrackerTransaction
  ) {
    window.location.href = transaction.sourcePath;
  }

  /*
  ============================================================
  LOADING
  ============================================================
  */

  if (loading) {
    return (
      <AppShell
        title="Transaction Tracker"
        subtitle="Excel-style sales, expenses and transaction register"
      >
        <div className="flex min-h-[520px] items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading Transaction Tracker
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Reading sales, payments and expenses from the ERP...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  /*
  ============================================================
  PAGE
  ============================================================
  */

  return (
    <AppShell
      title="Transaction Tracker"
      subtitle="Excel-style sales, expenses and transaction register"
    >
      <div className="min-w-0 space-y-4">

        {/* =====================================================
            EXCEL TOOLBAR
        ====================================================== */}

        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 bg-slate-100 px-3 py-2">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-600 text-white">
                <FileSpreadsheet size={17} />
              </div>

              <div>
                <h1 className="text-sm font-bold text-slate-800">
                  Transaction Register
                </h1>

                <p className="text-[10px] text-slate-500">
                  ERP transaction worksheet
                </p>
              </div>

            </div>

            <div className="flex items-center gap-1">

              <button
                onClick={loadTransactions}
                className="inline-flex h-8 items-center gap-1 rounded border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={13} />
                Refresh
              </button>

              <button
                onClick={exportCsv}
                className="inline-flex h-8 items-center gap-1 rounded border border-emerald-700 bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <Download size={13} />
                Export CSV
              </button>

            </div>

          </div>

          {/* ===================================================
              SUMMARY FORMULAS
          ==================================================== */}

          <div className="grid grid-cols-2 border-b border-slate-300 sm:grid-cols-3 lg:grid-cols-6">

            <FormulaCell
              label="TOTAL SALES"
              formula="=SUM(Sale Amount)"
              value={formatCurrency(totalSales)}
              valueClass="text-emerald-700"
            />

            <FormulaCell
              label="TOTAL EXPENSES"
              formula="=SUM(Expense Amount)"
              value={formatCurrency(totalExpenses)}
              valueClass="text-red-600"
            />

            <FormulaCell
              label="NET MOVEMENT"
              formula="=Sales - Expenses"
              value={formatCurrency(netMovement)}
              valueClass="text-blue-700"
            />

            <FormulaCell
              label="TOTAL PAID"
              formula="=SUM(Paid Amount)"
              value={formatCurrency(totalPaid)}
              valueClass="text-emerald-700"
            />

            <FormulaCell
              label="OUTSTANDING"
              formula="=SUM(Balance Due)"
              value={formatCurrency(totalOutstanding)}
              valueClass="text-orange-600"
            />

            <FormulaCell
              label="TRANSACTIONS"
              formula="=COUNTA(Reference)"
              value={String(filteredTransactions.length)}
              valueClass="text-slate-800"
            />

          </div>

          {/* ===================================================
              FILTER BAR
          ==================================================== */}

          <div className="border-b border-slate-300 bg-slate-50">

            <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-500" />

                <span className="text-xs font-bold text-slate-700">
                  Filters
                </span>

                <span className="text-[10px] text-slate-400">
                  {filteredTransactions.length} of{" "}
                  {transactions.length} records
                </span>
              </div>

              <div className="flex items-center gap-1">

                <button
                  onClick={() =>
                    setShowFilters(!showFilters)
                  }
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600"
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>

                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <X size={11} />
                  Clear
                </button>

              </div>

            </div>

            {showFilters && (
              <div className="grid grid-cols-1 gap-px bg-slate-300 sm:grid-cols-2 lg:grid-cols-7">

                <FilterField label="SEARCH">

                  <div className="relative">

                    <Search
                      size={13}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search..."
                      className="h-8 w-full border-0 bg-white pl-7 pr-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                </FilterField>

                <FilterField label="TYPE">

                  <select
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(
                        e.target.value as
                          | "All"
                          | TransactionType
                      )
                    }
                    className="h-8 w-full border-0 bg-white px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">
                      All Types
                    </option>
                    <option value="Sale">
                      Sale
                    </option>
                    <option value="Expense">
                      Expense
                    </option>
                  </select>

                </FilterField>

                <FilterField label="STATUS">

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="h-8 w-full border-0 bg-white px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status === "All"
                          ? "All Statuses"
                          : status}
                      </option>
                    ))}
                  </select>

                </FilterField>

                <FilterField label="SALESPERSON">

                  <select
                    value={salespersonFilter}
                    onChange={(e) =>
                      setSalespersonFilter(e.target.value)
                    }
                    className="h-8 w-full border-0 bg-white px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {salespeople.map((person) => (
                      <option
                        key={person}
                        value={person}
                      >
                        {person === "All"
                          ? "All Salespeople"
                          : person}
                      </option>
                    ))}
                  </select>

                </FilterField>

                <FilterField label="PAYMENT METHOD">

                  <select
                    value={paymentMethodFilter}
                    onChange={(e) =>
                      setPaymentMethodFilter(e.target.value)
                    }
                    className="h-8 w-full border-0 bg-white px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentMethods.map((method) => (
                      <option
                        key={method}
                        value={method}
                      >
                        {method === "All"
                          ? "All Methods"
                          : method}
                      </option>
                    ))}
                  </select>

                </FilterField>

                <FilterField label="DATE FROM">

                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) =>
                      setDateFrom(e.target.value)
                    }
                    className="h-8 w-full border-0 bg-white px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </FilterField>

                <FilterField label="DATE TO">

                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) =>
                      setDateTo(e.target.value)
                    }
                    className="h-8 w-full border-0 bg-white px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </FilterField>

              </div>
            )}

          </div>

        </div>

        {/* =====================================================
            REGISTER INFORMATION
        ====================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-[10px]">

          <div className="flex flex-wrap items-center gap-4">

            <span>
              <strong className="text-slate-700">
                SALES ROWS:
              </strong>{" "}
              <span className="text-emerald-700">
                {salesRows}
              </span>
            </span>

            <span>
              <strong className="text-slate-700">
                EXPENSE ROWS:
              </strong>{" "}
              <span className="text-red-600">
                {expenseRows}
              </span>
            </span>

            <span>
              <strong className="text-slate-700">
                RECORDS:
              </strong>{" "}
              {filteredTransactions.length}
            </span>

          </div>

          <div>
            <strong className="text-slate-700">
              REGISTER TOTAL:
            </strong>{" "}
            <span className="font-bold text-blue-700">
              {formatCurrency(registerTotal)}
            </span>
          </div>

        </div>

        {/* =====================================================
            EXCEL TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded border border-slate-400 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1800px] border-collapse text-[10px]">

              <thead className="sticky top-0 z-20">

                <tr className="bg-[#D9EAF7] text-slate-700">

                  <th className="w-10 border border-slate-400 px-2 py-2 text-center font-bold">
                    #
                  </th>

                  <th className="w-24 border border-slate-400 px-2 py-2 text-left font-bold">
                    DATE
                  </th>

                  <th className="w-20 border border-slate-400 px-2 py-2 text-left font-bold">
                    TYPE
                  </th>

                  <th className="w-36 border border-slate-400 px-2 py-2 text-left font-bold">
                    REFERENCE
                  </th>

                  <th className="w-44 border border-slate-400 px-2 py-2 text-left font-bold">
                    CUSTOMER / SUPPLIER
                  </th>

                  <th className="w-28 border border-slate-400 px-2 py-2 text-left font-bold">
                    SALESPERSON
                  </th>

                  <th className="w-64 border border-slate-400 px-2 py-2 text-left font-bold">
                    DESCRIPTION
                  </th>

                  <th className="w-32 border border-slate-400 px-2 py-2 text-left font-bold">
                    ACCOUNT
                  </th>

                  <th className="w-32 border border-slate-400 px-2 py-2 text-left font-bold">
                    PAYMENT ACCOUNT
                  </th>

                  <th className="w-28 border border-slate-400 px-2 py-2 text-left font-bold">
                    PAYMENT METHOD
                  </th>

                  <th className="w-32 border border-slate-400 px-2 py-2 text-right font-bold">
                    AMOUNT
                  </th>

                  <th className="w-32 border border-slate-400 px-2 py-2 text-right font-bold">
                    TOTAL PAID
                  </th>

                  <th className="w-32 border border-slate-400 px-2 py-2 text-right font-bold">
                    BALANCE DUE
                  </th>

                  <th className="w-28 border border-slate-400 px-2 py-2 text-left font-bold">
                    PAYMENT DATE
                  </th>

                  <th className="w-28 border border-slate-400 px-2 py-2 text-left font-bold">
                    STATUS
                  </th>

                  <th className="w-32 border border-slate-400 px-2 py-2 text-left font-bold">
                    JOURNAL
                  </th>

                  <th className="w-20 border border-slate-400 px-2 py-2 text-center font-bold">
                    VIEW
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredTransactions.length === 0 ? (
                  <tr>

                    <td
                      colSpan={17}
                      className="border border-slate-300 px-4 py-16 text-center"
                    >
                      <div className="text-sm font-semibold text-slate-500">
                        No transactions found
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        Try changing or clearing the filters.
                      </div>
                    </td>

                  </tr>
                ) : (
                  filteredTransactions.map(
                    (transaction, index) => {

                      const isSale =
                        transaction.type === "Sale";

                      const isPaid =
                        transaction.status
                          ?.toLowerCase()
                          .includes("paid");

                      return (
                        <tr
                          key={transaction.id}
                          className={
                            index % 2 === 0
                              ? "bg-white hover:bg-blue-50"
                              : "bg-slate-50 hover:bg-blue-50"
                          }
                        >

                          {/* ROW NUMBER */}

                          <td className="border border-slate-300 bg-slate-100 px-2 py-2 text-center font-semibold text-slate-500">
                            {index + 1}
                          </td>

                          {/* DATE */}

                          <td className="border border-slate-300 px-2 py-2 whitespace-nowrap">
                            {formatDate(transaction.date)}
                          </td>

                          {/* TYPE */}

                          <td className="border border-slate-300 px-2 py-2">

                            <span
                              className={
                                isSale
                                  ? "font-bold text-emerald-700"
                                  : "font-bold text-red-600"
                              }
                            >
                              {transaction.type}
                            </span>

                          </td>

                          {/* REFERENCE */}

                          <td className="border border-slate-300 px-2 py-2 font-semibold text-blue-700">
                            {transaction.reference}
                          </td>

                          {/* PARTY */}

                          <td
                            className="max-w-[220px] truncate border border-slate-300 px-2 py-2 font-semibold text-slate-700"
                            title={transaction.party}
                          >
                            {transaction.party}
                          </td>

                          {/* SALESPERSON */}

                          <td className="border border-slate-300 px-2 py-2">
                            {transaction.salesperson || "—"}
                          </td>

                          {/* DESCRIPTION */}

                          <td
                            className="max-w-[280px] truncate border border-slate-300 px-2 py-2"
                            title={transaction.description}
                          >
                            {transaction.description || "—"}
                          </td>

                          {/* ACCOUNT */}

                          <td className="border border-slate-300 px-2 py-2">
                            {transaction.account || "—"}
                          </td>

                          {/* PAYMENT ACCOUNT */}

                          <td className="border border-slate-300 px-2 py-2">
                            {transaction.paymentAccount || "—"}
                          </td>

                          {/* PAYMENT METHOD */}

                          <td className="border border-slate-300 px-2 py-2">
                            {transaction.paymentMethod || "—"}
                          </td>

                          {/* AMOUNT */}

                          <td
                            className={
                              isSale
                                ? "border border-slate-300 px-2 py-2 text-right font-bold text-emerald-700"
                                : "border border-slate-300 px-2 py-2 text-right font-bold text-red-600"
                            }
                          >
                            {formatCurrency(transaction.amount)}
                          </td>

                          {/* TOTAL PAID */}

                          <td className="border border-slate-300 px-2 py-2 text-right font-semibold text-emerald-700">
                            {formatCurrency(
                              transaction.totalPaid
                            )}
                          </td>

                          {/* BALANCE */}

                          <td
                            className={
                              transaction.balanceDue > 0
                                ? "border border-slate-300 px-2 py-2 text-right font-bold text-orange-600"
                                : "border border-slate-300 px-2 py-2 text-right font-semibold text-slate-500"
                            }
                          >
                            {formatCurrency(
                              transaction.balanceDue
                            )}
                          </td>

                          {/* PAYMENT DATE */}

                          <td className="border border-slate-300 px-2 py-2 whitespace-nowrap">
                            {formatDate(
                              transaction.paymentDate
                            )}
                          </td>

                          {/* STATUS */}

                          <td className="border border-slate-300 px-2 py-2">

                            <span
                              className={
                                isPaid
                                  ? "font-bold text-emerald-700"
                                  : "font-semibold text-orange-600"
                              }
                            >
                              {transaction.status || "—"}
                            </span>

                          </td>

                          {/* JOURNAL */}

                          <td className="border border-slate-300 px-2 py-2">
                            {transaction.journalReference ||
                              "—"}
                          </td>

                          {/* VIEW */}

                          <td className="border border-slate-300 px-2 py-2 text-center">

                            <button
                              onClick={() =>
                                openTransaction(
                                  transaction
                                )
                              }
                              className="inline-flex items-center gap-1 rounded border border-blue-300 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-100"
                            >
                              <Eye size={11} />
                              View
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

              {/* =================================================
                  EXCEL TOTAL ROW
              ================================================== */}

              <tfoot>

                <tr className="bg-[#FFF2CC] font-bold">

                  <td
                    colSpan={10}
                    className="border border-slate-400 px-2 py-2 text-right"
                  >
                    REGISTER TOTAL
                  </td>

                  <td className="border border-slate-400 px-2 py-2 text-right text-blue-700">
                    {formatCurrency(registerTotal)}
                  </td>

                  <td className="border border-slate-400 px-2 py-2 text-right text-emerald-700">
                    {formatCurrency(totalPaid)}
                  </td>

                  <td className="border border-slate-400 px-2 py-2 text-right text-orange-600">
                    {formatCurrency(totalOutstanding)}
                  </td>

                  <td
                    colSpan={4}
                    className="border border-slate-400 px-2 py-2"
                  />

                </tr>

              </tfoot>

            </table>

          </div>

        </div>

        {/* =====================================================
            ACCOUNTING FORMULAS
        ====================================================== */}

        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">

          <div className="border-b border-slate-300 bg-slate-100 px-3 py-2">

            <h2 className="text-xs font-bold text-slate-800">
              Accounting Control
            </h2>

            <p className="text-[10px] text-slate-500">
              Calculations generated directly from the filtered ERP transaction records.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-px bg-slate-300 sm:grid-cols-2 lg:grid-cols-4">

            <FormulaBox
              title="TOTAL SALES"
              formula="SUM(Sale Amount)"
              value={formatCurrency(totalSales)}
            />

            <FormulaBox
              title="TOTAL EXPENSES"
              formula="SUM(Expense Amount)"
              value={formatCurrency(totalExpenses)}
              valueClass="text-red-600"
            />

            <FormulaBox
              title="NET MOVEMENT"
              formula="Sales - Expenses"
              value={formatCurrency(netMovement)}
              valueClass="text-blue-700"
            />

            <FormulaBox
              title="TOTAL OUTSTANDING"
              formula="SUM(Balance Due)"
              value={formatCurrency(totalOutstanding)}
              valueClass="text-orange-600"
            />

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-400">

          <span>
            Showing {filteredTransactions.length} of{" "}
            {transactions.length} transaction records
          </span>

          <span>
            Excel-style calculations are generated from ERP records.
          </span>

        </div>

      </div>
    </AppShell>
  );
}

/*
============================================================
FORMULA CELL
============================================================
*/

function FormulaCell({
  label,
  formula,
  value,
  valueClass = "text-slate-800",
}: {
  label: string;
  formula: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="border-r border-slate-300 px-3 py-2 last:border-r-0">

      <div className="text-[9px] font-bold text-slate-500">
        {label}
      </div>

      <div className="mt-0.5 text-[9px] text-slate-400">
        {formula}
      </div>

      <div
        className={`mt-1 text-sm font-black ${valueClass}`}
      >
        {value}
      </div>

    </div>
  );
}

/*
============================================================
FILTER FIELD
============================================================
*/

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-100 p-1">

      <label className="mb-1 block px-1 text-[9px] font-bold text-slate-500">
        {label}
      </label>

      {children}

    </div>
  );
}

/*
============================================================
FORMULA BOX
============================================================
*/

function FormulaBox({
  title,
  formula,
  value,
  valueClass = "text-emerald-700",
}: {
  title: string;
  formula: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-slate-50 px-4 py-3">

      <div className="text-[9px] font-bold text-slate-500">
        {title}
      </div>

      <div className="mt-1 font-mono text-[10px] text-slate-400">
        {formula}
      </div>

      <div
        className={`mt-1 text-sm font-black ${valueClass}`}
      >
        {value}
      </div>

    </div>
  );
}