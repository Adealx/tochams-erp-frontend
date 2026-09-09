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
  Clock3,
  Eye,
  Filter,
  FileText,
  Plus,
  RefreshCw,
  Search,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getExpenses,
  Expense,
} from "@/services/expenseService";


// ============================================================
// HELPERS
// ============================================================

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
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


const formatPaymentMethod = (
  value: string
) => {
  switch (value) {
    case "cash":
      return "Cash";

    case "bank":
      return "Bank";

    case "credit":
      return "Credit / Pay Later";

    default:
      return value || "-";
  }
};


const formatStatus = (
  value: string
) => {
  switch (value) {
    case "posted":
      return "Posted";

    case "cancelled":
      return "Cancelled";

    case "draft":
      return "Draft";

    default:
      return value || "-";
  }
};


// ============================================================
// PAGE
// ============================================================

export default function ExpensesPage() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [paymentMethodFilter, setPaymentMethodFilter] =
    useState("All");

  const [supplierFilter, setSupplierFilter] =
    useState("All");

  const [accountFilter, setAccountFilter] =
    useState("All");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);


  // ==========================================================
  // LOAD EXPENSES
  // ==========================================================

  const loadExpenses = async (
    showRefresh = false
  ) => {

    try {

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data =
        await getExpenses();

      setExpenses(data);

    } catch (error) {

      console.error(
        "Failed to load expenses:",
        error
      );

      toast.error(
        "Unable to load expenses."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadExpenses();
  }, []);


  // ==========================================================
  // SUPPLIER OPTIONS
  // ==========================================================

  const supplierOptions = useMemo(() => {

    const map = new Map<
      number,
      NonNullable<
        Expense["supplier_detail"]
      >
    >();

    expenses.forEach(
      (expense) => {

        if (
          expense.supplier !== null &&
          expense.supplier_detail !== null
        ) {

          map.set(
            expense.supplier,
            expense.supplier_detail
          );
        }
      }
    );

    return Array.from(
      map.values()
    ).sort(
      (a, b) =>
        a.company_name.localeCompare(
          b.company_name
        )
    );

  }, [expenses]);


  // ==========================================================
  // EXPENSE ACCOUNT OPTIONS
  // ==========================================================

  const accountOptions = useMemo(() => {

    const map = new Map<
      number,
      NonNullable<
        Expense["expense_account_detail"]
      >
    >();

    expenses.forEach(
      (expense) => {

        if (
          expense.expense_account_detail
        ) {

          map.set(
            expense.expense_account,
            expense.expense_account_detail
          );
        }
      }
    );

    return Array.from(
      map.values()
    ).sort(
      (a, b) => {

        const nameA =
          `${a.code} ${a.name}`;

        const nameB =
          `${b.code} ${b.name}`;

        return nameA.localeCompare(
          nameB
        );
      }
    );

  }, [expenses]);


  // ==========================================================
  // FILTER EXPENSES
  // ==========================================================

  const filteredExpenses = useMemo(() => {

    const query =
      search
        .trim()
        .toLowerCase();

    return expenses.filter(
      (expense) => {

        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        const matchesStatus =
          statusFilter === "All" ||
          expense.status ===
            statusFilter.toLowerCase();


        // ----------------------------------------------------
        // PAYMENT METHOD
        // ----------------------------------------------------

        const matchesPaymentMethod =
          paymentMethodFilter === "All" ||
          expense.payment_method ===
            paymentMethodFilter;


        // ----------------------------------------------------
        // SUPPLIER
        // ----------------------------------------------------

        const matchesSupplier =
          supplierFilter === "All" ||
          expense.supplier ===
            Number(supplierFilter);


        // ----------------------------------------------------
        // EXPENSE ACCOUNT
        // ----------------------------------------------------

        const matchesAccount =
          accountFilter === "All" ||
          expense.expense_account ===
            Number(accountFilter);


        // ----------------------------------------------------
        // DATE
        // ----------------------------------------------------

        const expenseDate =
          expense.date || "";

        const matchesFrom =
          !fromDate ||
          expenseDate >= fromDate;

        const matchesTo =
          !toDate ||
          expenseDate <= toDate;


        // ----------------------------------------------------
        // SEARCH
        // ----------------------------------------------------

        const searchable = [
          expense.expense_number,
          expense.reference,
          expense.description,
          expense.supplier_detail
            ?.company_name,
          expense.expense_account_detail
            ?.code,
          expense.expense_account_detail
            ?.name,
          expense.payment_account_detail
            ?.code,
          expense.payment_account_detail
            ?.name,
          expense.journal_reference,
          expense.created_by_name,
          expense.amount,
        ]
          .filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              value !== ""
          )
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !query ||
          searchable.includes(query);


        return (
          matchesStatus &&
          matchesPaymentMethod &&
          matchesSupplier &&
          matchesAccount &&
          matchesFrom &&
          matchesTo &&
          matchesSearch
        );
      }
    );

  }, [
    expenses,
    search,
    statusFilter,
    paymentMethodFilter,
    supplierFilter,
    accountFilter,
    fromDate,
    toDate,
  ]);


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const stats = useMemo(() => {

    const posted =
      filteredExpenses.filter(
        (expense) =>
          expense.status === "posted"
      );

    const drafts =
      filteredExpenses.filter(
        (expense) =>
          expense.status === "draft"
      );

    const cancelled =
      filteredExpenses.filter(
        (expense) =>
          expense.status === "cancelled"
      );


    const postedAmount =
      posted.reduce(
        (
          total,
          expense
        ) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      );


    const draftAmount =
      drafts.reduce(
        (
          total,
          expense
        ) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      );


    const cancelledAmount =
      cancelled.reduce(
        (
          total,
          expense
        ) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      );


    return {
      total:
        filteredExpenses.length,

      posted:
        posted.length,

      drafts:
        drafts.length,

      cancelled:
        cancelled.length,

      postedAmount,

      draftAmount,

      cancelledAmount,
    };

  }, [filteredExpenses]);


  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const resetFilters = () => {

    setSearch("");

    setStatusFilter(
      "All"
    );

    setPaymentMethodFilter(
      "All"
    );

    setSupplierFilter(
      "All"
    );

    setAccountFilter(
      "All"
    );

    setFromDate("");

    setToDate("");
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <AppShell
      title="Expenses"
      subtitle="Manage operating expenses, accounting entries and business spending."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Expenses",
        },
      ]}
      actions={[
        {
          label: "Record Expense",
          href: "/expenses/add",
        },
      ]}
    >

      {/* ====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          label="Expenses"
          value={String(
            stats.total
          )}
          icon={
            <FileText
              size={20}
            />
          }
          iconClass="bg-indigo-50 text-indigo-600"
        />


        <SummaryCard
          label="Posted Amount"
          value={formatCurrency(
            stats.postedAmount
          )}
          icon={
            <Banknote
              size={20}
            />
          }
          iconClass="bg-emerald-50 text-emerald-600"
        />


        <SummaryCard
          label="Draft Expenses"
          value={String(
            stats.drafts
          )}
          icon={
            <Clock3
              size={20}
            />
          }
          iconClass="bg-amber-50 text-amber-600"
        />


        <SummaryCard
          label="Cancelled Amount"
          value={formatCurrency(
            stats.cancelledAmount
          )}
          icon={
            <XCircle
              size={20}
            />
          }
          iconClass="bg-red-50 text-red-600"
        />

      </div>


      {/* ====================================================
          SECONDARY SUMMARY
      ===================================================== */}

      <div className="mt-4 grid gap-4 md:grid-cols-3">

        <MiniSummary
          label="Posted Expenses"
          value={String(
            stats.posted
          )}
          description="Accounting-posted transactions"
          icon={
            <CheckCircle2
              size={17}
            />
          }
          iconClass="text-emerald-600 bg-emerald-50"
        />


        <MiniSummary
          label="Draft Value"
          value={formatCurrency(
            stats.draftAmount
          )}
          description="Expenses awaiting posting"
          icon={
            <Clock3
              size={17}
            />
          }
          iconClass="text-amber-600 bg-amber-50"
        />


        <MiniSummary
          label="Cancelled"
          value={String(
            stats.cancelled
          )}
          description="Transactions retained for audit"
          icon={
            <XCircle
              size={17}
            />
          }
          iconClass="text-red-600 bg-red-50"
        />

      </div>


      {/* ====================================================
          EXPENSE REGISTER
      ===================================================== */}

      <section className="mt-6 overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

        {/* --------------------------------------------------
            HEADER
        --------------------------------------------------- */}

        <div className="border-b border-slate-100 p-5">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h2 className="font-semibold text-slate-950">
                Expense Register
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search, filter and review all business expenses.
              </p>

            </div>


            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}

              <div className="relative">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search expenses..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:w-72"
                />

              </div>


              {/* FILTER BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (
                      value
                    ) => !value
                  )
                }
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                  showFilters
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >

                <Filter
                  size={16}
                />

                Filters

              </button>


              {/* REFRESH */}

              <button
                type="button"
                onClick={() =>
                  loadExpenses(
                    true
                  )
                }
                disabled={
                  refreshing
                }
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
                title="Refresh expenses"
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


          {/* ------------------------------------------------
              FILTERS
          ------------------------------------------------- */}

          {showFilters && (

            <div className="mt-5 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2 xl:grid-cols-6">

              <FilterSelect
                label="Status"
                value={
                  statusFilter
                }
                onChange={
                  setStatusFilter
                }
                options={[
                  "All",
                  "Draft",
                  "Posted",
                  "Cancelled",
                ]}
              />


              <FilterSelect
                label="Payment Method"
                value={
                  paymentMethodFilter
                }
                onChange={
                  setPaymentMethodFilter
                }
                options={[
                  "All",
                  "cash",
                  "bank",
                  "credit",
                ]}
                displayOptions={[
                  "All",
                  "Cash",
                  "Bank",
                  "Credit / Pay Later",
                ]}
              />


              {/* SUPPLIER */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Supplier
                </label>

                <select
                  value={
                    supplierFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setSupplierFilter(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                >

                  <option value="All">
                    All Suppliers
                  </option>

                  {supplierOptions.map(
                    (
                      supplier
                    ) => (

                      <option
                        key={
                          supplier.id
                        }
                        value={
                          supplier.id
                        }
                      >
                        {
                          supplier.company_name
                        }
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* EXPENSE ACCOUNT */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Expense Account
                </label>

                <select
                  value={
                    accountFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setAccountFilter(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                >

                  <option value="All">
                    All Accounts
                  </option>

                  {accountOptions.map(
                    (
                      account
                    ) => (

                      <option
                        key={
                          account.id
                        }
                        value={
                          account.id
                        }
                      >
                        {account.code} -{" "}
                        {account.name}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* FROM */}

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
                    value={
                      fromDate
                    }
                    onChange={(
                      event
                    ) =>
                      setFromDate(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </div>


              {/* TO */}

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
                    value={
                      toDate
                    }
                    onChange={(
                      event
                    ) =>
                      setToDate(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </div>


              {/* CLEAR */}

              <button
                type="button"
                onClick={
                  resetFilters
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 xl:col-span-6 xl:justify-self-end"
              >

                <X
                  size={15}
                />

                Clear Filters

              </button>

            </div>

          )}

        </div>


        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <RefreshCw
                size={26}
                className="mx-auto animate-spin text-indigo-500"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading expenses...
              </p>

            </div>

          </div>

        ) : filteredExpenses.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================== */

          <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">

            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">

              <WalletCards
                size={25}
              />

            </span>


            <h3 className="mt-4 font-semibold text-slate-900">
              No expenses found
            </h3>


            <p className="mt-1 max-w-md text-sm text-slate-500">
              There are no expenses matching your current search and filters.
            </p>


            <div className="mt-5 flex flex-wrap justify-center gap-3">

              {(search ||
                statusFilter !== "All" ||
                paymentMethodFilter !== "All" ||
                supplierFilter !== "All" ||
                accountFilter !== "All" ||
                fromDate ||
                toDate) && (

                <button
                  type="button"
                  onClick={
                    resetFilters
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >

                  <X
                    size={16}
                  />

                  Clear Filters

                </button>

              )}


              <Link
                href="/expenses/add"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >

                <Plus
                  size={16}
                />

                Record Expense

              </Link>

            </div>

          </div>

        ) : (

          /* =================================================
             EXPENSE TABLE
          ================================================== */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1350px] text-left">

              <thead className="bg-slate-50/80">

                <tr className="border-b border-slate-100">

                  <TableHead>
                    Expense
                  </TableHead>

                  <TableHead>
                    Description
                  </TableHead>

                  <TableHead>
                    Supplier
                  </TableHead>

                  <TableHead>
                    Account
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

                {filteredExpenses.map(
                  (
                    expense
                  ) => {

                    const isPosted =
                      expense.status ===
                      "posted";

                    const isDraft =
                      expense.status ===
                      "draft";

                    const isCancelled =
                      expense.status ===
                      "cancelled";


                    return (

                      <tr
                        key={
                          expense.id
                        }
                        className={`transition hover:bg-slate-50/70 ${
                          isCancelled
                            ? "bg-red-50/20"
                            : isDraft
                              ? "bg-amber-50/10"
                              : ""
                        }`}
                      >

                        {/* EXPENSE */}

                        <td className="px-5 py-4">

                          <Link
                            href={`/expenses/${expense.id}`}
                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            {
                              expense.expense_number
                            }
                          </Link>

                          <p className="mt-0.5 text-xs text-slate-400">
                            ID #{expense.id}
                          </p>

                        </td>


                        {/* DESCRIPTION */}

                        <td className="max-w-[260px] px-5 py-4">

                          <p className="truncate font-medium text-slate-800">

                            {expense.description ||
                              "No description"}

                          </p>

                          {expense.reference &&
                            expense.reference !==
                              expense.expense_number && (

                            <p className="mt-1 truncate text-xs text-slate-400">
                              Ref:{" "}
                              {
                                expense.reference
                              }
                            </p>

                          )}

                        </td>


                        {/* SUPPLIER */}

                        <td className="px-5 py-4">

                          {expense.supplier_detail ? (

                            <div>

                              <p className="font-medium text-slate-800">
                                {
                                  expense
                                    .supplier_detail
                                    .company_name
                                }
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  expense
                                    .supplier_detail
                                    .vendor_code
                                }
                              </p>

                            </div>

                          ) : (

                            <span className="text-sm text-slate-400">
                              No supplier
                            </span>

                          )}

                        </td>


                        {/* ACCOUNT */}

                        <td className="px-5 py-4">

                          {expense.expense_account_detail ? (

                            <div>

                              <p className="font-medium text-slate-800">
                                {
                                  expense
                                    .expense_account_detail
                                    .name
                                }
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  expense
                                    .expense_account_detail
                                    .code
                                }
                              </p>

                            </div>

                          ) : (

                            <span className="text-sm text-red-500">
                              Account missing
                            </span>

                          )}

                        </td>


                        {/* AMOUNT */}

                        <td className="px-5 py-4">

                          <p
                            className={`font-semibold ${
                              isCancelled
                                ? "text-slate-400 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {
                              formatCurrency(
                                expense.amount
                              )
                            }
                          </p>

                        </td>


                        {/* PAYMENT METHOD */}

                        <td className="px-5 py-4">

                          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">

                            {
                              formatPaymentMethod(
                                expense.payment_method
                              )
                            }

                          </span>

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4 text-sm text-slate-600">

                          {
                            formatDate(
                              expense.date
                            )
                          }

                        </td>


                        {/* ACCOUNTING */}

                        <td className="px-5 py-4">

                          <div className="flex flex-col gap-1">

                            <span
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isPosted
                                  ? "bg-emerald-50 text-emerald-700"
                                  : isCancelled
                                    ? "bg-red-50 text-red-700"
                                    : "bg-amber-50 text-amber-700"
                              }`}
                            >

                              {isPosted ? (

                                <CheckCircle2
                                  size={13}
                                />

                              ) : isCancelled ? (

                                <XCircle
                                  size={13}
                                />

                              ) : (

                                <Clock3
                                  size={13}
                                />

                              )}

                              {
                                formatStatus(
                                  expense.status
                                )
                              }

                            </span>


                            {expense.journal_reference ? (

                              <span className="text-xs text-slate-400">
                                {
                                  expense.journal_reference
                                }
                              </span>

                            ) : isDraft ? (

                              <span className="text-xs text-amber-600">
                                Not posted
                              </span>

                            ) : (

                              <span className="text-xs text-slate-400">
                                No journal
                              </span>

                            )}

                          </div>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">

                          <div className="flex justify-end gap-2">

                            <Link
                              href={`/expenses/${expense.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                            >

                              <Eye
                                size={14}
                              />

                              View

                            </Link>


                            {isDraft && (

                              <Link
                                href={`/expenses/${expense.id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50"
                              >

                                <Clock3
                                  size={14}
                                />

                                Review

                              </Link>

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


        {/* =================================================
            FOOTER
        ================================================== */}

        {!loading &&
          filteredExpenses.length > 0 && (

            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

              <span>

                Showing{" "}

                <strong className="text-slate-700">
                  {
                    filteredExpenses.length
                  }
                </strong>

                {" "}of{" "}

                <strong className="text-slate-700">
                  {
                    expenses.length
                  }
                </strong>

                {" "}expenses

              </span>


              <Link
                href="/expenses/add"
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-700"
              >

                Record another expense

                <ChevronRight
                  size={15}
                />

              </Link>

            </div>

          )}

      </section>


      {/* ====================================================
          ACCOUNTING CONTROL
      ===================================================== */}

      <div className="mt-6 flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">

        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0 text-indigo-600"
        />

        <div>

          <p className="text-sm font-semibold text-indigo-950">
            Expense accounting control
          </p>

          <p className="mt-1 text-sm leading-6 text-indigo-900/70">
            Draft expenses do not affect the accounting
            ledger. Once posted, the system records a
            double-entry journal that debits the selected
            expense account and credits the cash, bank or
            supplier payable account.
          </p>

        </div>

      </div>


      {/* ====================================================
          EXPENSE FLOW
      ===================================================== */}

      <section className="mt-6 rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

        <div className="flex items-start gap-3">

          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">

            <WalletCards
              size={19}
            />

          </span>


          <div>

            <h3 className="font-semibold text-slate-950">
              How expenses flow through the ERP
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Every posted expense becomes part of the
              company's financial records and can ultimately
              flow into the Profit & Loss and Balance Sheet.
            </p>

          </div>

        </div>


        <div className="mt-5 grid gap-3 md:grid-cols-4">

          <FlowStep
            number="01"
            title="Record"
            description="Create the expense as a draft."
          />

          <FlowStep
            number="02"
            title="Post"
            description="Create the double-entry journal."
          />

          <FlowStep
            number="03"
            title="Ledger"
            description="Update the relevant accounts."
          />

          <FlowStep
            number="04"
            title="Reports"
            description="Expense affects financial reporting."
          />

        </div>

      </section>

    </AppShell>
  );
}


// ============================================================
// SUMMARY CARD
// ============================================================

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


// ============================================================
// MINI SUMMARY
// ============================================================

function MiniSummary({
  label,
  value,
  description,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}) {

  return (

    <div className="rounded-[18px] border border-slate-200/90 bg-white p-4">

      <div className="flex items-center gap-3">

        <span
          className={`grid h-9 w-9 place-items-center rounded-lg ${iconClass}`}
        >
          {icon}
        </span>


        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 font-bold text-slate-900">
            {value}
          </p>

        </div>

      </div>


      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>

    </div>

  );
}


// ============================================================
// TABLE HEAD
// ============================================================

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


// ============================================================
// FILTER SELECT
// ============================================================

function FilterSelect({
  label,
  value,
  onChange,
  options,
  displayOptions,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
  displayOptions?: string[];
}) {

  return (

    <div>

      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>


      <select
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      >

        {options.map(
          (
            option,
            index
          ) => (

            <option
              key={
                option
              }
              value={
                option
              }
            >

              {
                displayOptions
                  ? displayOptions[
                      index
                    ]
                  : option ===
                      "All"
                    ? `All ${label}s`
                    : formatStatus(
                        option
                      )
              }

            </option>

          )
        )}

      </select>

    </div>

  );
}


// ============================================================
// FLOW STEP
// ============================================================

function FlowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {

  return (

    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

      <div className="flex items-center gap-3">

        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-xs font-bold text-indigo-600 shadow-sm">

          {number}

        </span>


        <p className="font-semibold text-slate-800">
          {title}
        </p>

      </div>


      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>

  );
}