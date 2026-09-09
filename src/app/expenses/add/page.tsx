"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileText,
  Receipt,
  Save,
  Upload,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  createExpense,
  ExpensePaymentMethod,
} from "@/services/expenseService";

import {
  getTrialBalance,
  TrialBalanceAccount,
} from "@/services/accountingService";

import { getVendors } from "@/services/vendorService";


const formatCurrency = (value: string | number) => {
  return `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


interface Supplier {
  id: number;
  vendor_code?: string;
  company_name: string;
  contact_person?: string | null;
}


export default function RecordExpensePage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<TrialBalanceAccount[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [expenseAccount, setExpenseAccount] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<ExpensePaymentMethod>("bank");

  const [paymentAccount, setPaymentAccount] =
    useState("");

  const [supplier, setSupplier] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [reference, setReference] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [receipt, setReceipt] =
    useState<File | null>(null);


  // =========================================================
  // LOAD ACCOUNTS + SUPPLIERS
  // =========================================================

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoadingData(true);

        const [trialBalance, vendorData] =
          await Promise.all([
            getTrialBalance(),
            getVendors(),
          ]);

        setAccounts(trialBalance.accounts || []);
        setSuppliers(vendorData || []);
      } catch (error) {
        console.error(
          "Failed to load expense form data:",
          error
        );

        toast.error(
          "Unable to load accounting information."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadFormData();
  }, []);


  // =========================================================
  // ACCOUNT OPTIONS
  // =========================================================

  const expenseAccounts = useMemo(() => {
    return accounts
      .filter(
        (account) =>
          account.account_type === "expense"
      )
      .sort((a, b) =>
        a.code.localeCompare(b.code)
      );
  }, [accounts]);


  const paymentAccounts = useMemo(() => {
    return accounts
      .filter(
        (account) =>
          account.account_type === "asset" ||
          account.account_type === "liability"
      )
      .sort((a, b) =>
        a.code.localeCompare(b.code)
      );
  }, [accounts]);


  // =========================================================
  // SELECTED ACCOUNT
  // =========================================================

  const selectedExpenseAccount =
    expenseAccounts.find(
      (account) =>
        account.account_id.toString() ===
        expenseAccount
    );


  const selectedPaymentAccount =
    paymentAccounts.find(
      (account) =>
        account.account_id.toString() ===
        paymentAccount
    );


  // =========================================================
  // AMOUNT
  // =========================================================

  const numericAmount =
    Number(amount || 0);


  // =========================================================
  // RECEIPT
  // =========================================================

  const handleReceipt = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] || null;

    if (!file) {
      setReceipt(null);
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Receipt must not exceed 10MB."
      );

      event.target.value = "";
      setReceipt(null);
      return;
    }

    setReceipt(file);
  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!expenseAccount) {
      toast.error(
        "Please select an expense account."
      );
      return;
    }

    if (!amount || numericAmount <= 0) {
      toast.error(
        "Please enter a valid expense amount."
      );
      return;
    }

    if (
      paymentMethod === "cash" ||
      paymentMethod === "bank"
    ) {
      if (!paymentAccount) {
        toast.error(
          "Please select the payment account."
        );
        return;
      }
    }

    if (paymentMethod === "credit") {
      if (!supplier) {
        toast.error(
          "Please select the supplier for a credit expense."
        );
        return;
      }
    }

    try {
      setSaving(true);

      await createExpense({
        date,
        expense_account:
          Number(expenseAccount),
        supplier:
          paymentMethod === "credit"
            ? Number(supplier)
            : null,
        payment_account:
          paymentAccount
            ? Number(paymentAccount)
            : null,
        amount: numericAmount,
        payment_method: paymentMethod,
        reference,
        description,
      });

      /*
       * Receipt is intentionally not sent yet.
       *
       * The current backend Expense model does not
       * contain a receipt/file field. We will connect
       * this once the backend receipt field is added.
       */

      toast.success(
        "Expense saved as draft."
      );

      router.push("/expenses");

    } catch (error: any) {
      console.error(
        "Failed to create expense:",
        error
      );

      const message =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Unable to record expense.";

      toast.error(message);

    } finally {
      setSaving(false);
    }
  };


  return (
    <AppShell
      title="Record Expense"
      subtitle="Capture a business expense and prepare it for accounting."
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
          label: "Record Expense",
        },
      ]}
      actions={[
        {
          label: "Back to Expenses",
          href: "/expenses",
        },
      ]}
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ===================================================
            TOP INFORMATION
        ==================================================== */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

          <section className="overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

            <div className="border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Receipt size={21} />
                </span>

                <div>
                  <h2 className="font-semibold text-slate-950">
                    Expense Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the details of the business expense.
                  </p>
                </div>

              </div>

            </div>


            <div className="space-y-5 p-6">

              {/* DATE */}

              <Field label="Expense Date" required>

                <div className="relative">

                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </Field>


              {/* EXPENSE ACCOUNT */}

              <Field
                label="Expense Account"
                required
                hint="The account that will receive the debit when the expense is posted."
              >

                <SelectWrapper>

                  <select
                    value={expenseAccount}
                    onChange={(event) =>
                      setExpenseAccount(
                        event.target.value
                      )
                    }
                    disabled={loadingData}
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
                  >

                    <option value="">
                      {loadingData
                        ? "Loading expense accounts..."
                        : "Select expense account"}
                    </option>

                    {expenseAccounts.map(
                      (account) => (
                        <option
                          key={account.account_id}
                          value={account.account_id}
                        >
                          {account.code} —{" "}
                          {account.name}
                        </option>
                      )
                    )}

                  </select>

                </SelectWrapper>

              </Field>


              {/* AMOUNT */}

              <Field
                label="Amount"
                required
              >

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    ₦
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </Field>


              {/* PAYMENT METHOD */}

              <Field
                label="Payment Method"
                required
              >

                <div className="grid gap-3 sm:grid-cols-3">

                  <PaymentMethod
                    active={
                      paymentMethod === "cash"
                    }
                    label="Cash"
                    description="Paid immediately"
                    icon={
                      <Banknote size={18} />
                    }
                    onClick={() =>
                      setPaymentMethod("cash")
                    }
                  />

                  <PaymentMethod
                    active={
                      paymentMethod === "bank"
                    }
                    label="Bank"
                    description="Paid from bank"
                    icon={
                      <WalletCards size={18} />
                    }
                    onClick={() =>
                      setPaymentMethod("bank")
                    }
                  />

                  <PaymentMethod
                    active={
                      paymentMethod === "credit"
                    }
                    label="Credit"
                    description="Pay supplier later"
                    icon={
                      <Building2 size={18} />
                    }
                    onClick={() =>
                      setPaymentMethod("credit")
                    }
                  />

                </div>

              </Field>


              {/* PAYMENT ACCOUNT */}

              {(paymentMethod === "cash" ||
                paymentMethod === "bank") && (

                <Field
                  label="Payment Account"
                  required
                  hint={
                    paymentMethod === "cash"
                      ? "Select the cash account used to pay the expense."
                      : "Select the bank account used to pay the expense."
                  }
                >

                  <SelectWrapper>

                    <select
                      value={paymentAccount}
                      onChange={(event) =>
                        setPaymentAccount(
                          event.target.value
                        )
                      }
                      disabled={loadingData}
                      className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
                    >

                      <option value="">
                        {loadingData
                          ? "Loading accounts..."
                          : "Select payment account"}
                      </option>

                      {paymentAccounts.map(
                        (account) => (
                          <option
                            key={account.account_id}
                            value={account.account_id}
                          >
                            {account.code} —{" "}
                            {account.name}
                          </option>
                        )
                      )}

                    </select>

                  </SelectWrapper>

                </Field>

              )}


              {/* SUPPLIER */}

              {paymentMethod === "credit" && (

                <Field
                  label="Supplier"
                  required
                  hint="The supplier balance will remain payable until the supplier is paid."
                >

                  <SelectWrapper>

                    <select
                      value={supplier}
                      onChange={(event) =>
                        setSupplier(
                          event.target.value
                        )
                      }
                      disabled={loadingData}
                      className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
                    >

                      <option value="">
                        {loadingData
                          ? "Loading suppliers..."
                          : "Select supplier"}
                      </option>

                      {suppliers.map(
                        (item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.company_name}
                          </option>
                        )
                      )}

                    </select>

                  </SelectWrapper>

                </Field>

              )}


              {/* REFERENCE */}

              <Field
                label="Reference"
                hint="Optional receipt, invoice or payment reference."
              >

                <input
                  type="text"
                  value={reference}
                  onChange={(event) =>
                    setReference(
                      event.target.value
                    )
                  }
                  placeholder="e.g. INV-2026-0042"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />

              </Field>


              {/* DESCRIPTION */}

              <Field
                label="Description"
                required
              >

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe what the expense was for..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />

              </Field>

            </div>

          </section>


          {/* =================================================
              ACCOUNTING PREVIEW
          ================================================== */}

          <aside className="space-y-5">

            <section className="overflow-hidden rounded-[22px] border border-indigo-100 bg-indigo-50/60">

              <div className="border-b border-indigo-100 px-5 py-4">

                <div className="flex items-center gap-3">

                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <CheckCircle2 size={18} />
                  </span>

                  <div>

                    <h2 className="font-semibold text-indigo-950">
                      Accounting Preview
                    </h2>

                    <p className="mt-1 text-xs text-indigo-900/60">
                      This is what happens when the expense is posted.
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                {numericAmount > 0 &&
                selectedExpenseAccount ? (

                  <div className="space-y-3">

                    <div className="rounded-xl border border-white bg-white p-4">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Debit
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {selectedExpenseAccount.code}{" "}
                        —{" "}
                        {selectedExpenseAccount.name}
                      </p>

                      <p className="mt-2 text-lg font-bold text-slate-950">
                        {formatCurrency(
                          numericAmount
                        )}
                      </p>

                    </div>


                    <div className="text-center text-xs font-semibold text-indigo-600">
                      ↓ Double-entry journal ↓
                    </div>


                    <div className="rounded-xl border border-white bg-white p-4">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Credit
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">

                        {paymentMethod === "credit"
                          ? selectedPaymentAccount
                            ? `${selectedPaymentAccount.code} — ${selectedPaymentAccount.name}`
                            : "Supplier Payable"
                          : selectedPaymentAccount
                            ? `${selectedPaymentAccount.code} — ${selectedPaymentAccount.name}`
                            : "Payment Account"}

                      </p>

                      <p className="mt-2 text-lg font-bold text-slate-950">
                        {formatCurrency(
                          numericAmount
                        )}
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="rounded-xl border border-dashed border-indigo-200 bg-white/70 p-5 text-center">

                    <WalletCards
                      size={25}
                      className="mx-auto text-indigo-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Accounting preview
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Select an expense account and enter an amount to preview the journal.
                    </p>

                  </div>

                )}

              </div>

            </section>


            {/* RECEIPT */}

            <section className="rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)]">

              <div className="flex items-start gap-3">

                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <Upload size={18} />
                </span>

                <div>

                  <h2 className="font-semibold text-slate-950">
                    Receipt
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Attach the supporting receipt or invoice.
                  </p>

                </div>

              </div>


              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">

                <Upload
                  size={21}
                  className="text-slate-400"
                />

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {receipt
                    ? receipt.name
                    : "Choose receipt"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  PDF, JPG, PNG up to 10MB
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleReceipt}
                  className="hidden"
                />

              </label>


              {receipt && (

                <button
                  type="button"
                  onClick={() =>
                    setReceipt(null)
                  }
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <X size={13} />
                  Remove receipt
                </button>

              )}

              <div className="mt-4 rounded-xl bg-amber-50 p-3">

                <p className="text-xs leading-5 text-amber-800">
                  Receipt storage will be connected to the accounting record when the backend receipt field is enabled.
                </p>

              </div>

            </section>

          </aside>

        </div>


        {/* ===================================================
            FOOTER ACTIONS
        ==================================================== */}

        <div className="flex flex-col gap-3 rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)] sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <FileText
              size={18}
              className="mt-0.5 text-slate-400"
            />

            <div>

              <p className="text-sm font-semibold text-slate-800">
                Expense will be saved as Draft
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Saving the expense does not affect the ledger. Posting it later creates the accounting journal.
              </p>

            </div>

          </div>


          <div className="flex gap-3">

            <Link
              href="/expenses"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft size={15} />
              Cancel
            </Link>


            <button
              type="submit"
              disabled={
                saving ||
                loadingData ||
                !expenseAccount ||
                numericAmount <= 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >

              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Draft Expense
                </>
              )}

            </button>

          </div>

        </div>

      </form>

    </AppShell>
  );
}


// =============================================================
// FIELD
// =============================================================

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs text-slate-400">
          {hint}
        </p>
      )}

    </div>
  );
}


// =============================================================
// SELECT WRAPPER
// =============================================================

function SelectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">

      {children}

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

    </div>
  );
}


// =============================================================
// PAYMENT METHOD
// =============================================================

function PaymentMethod({
  active,
  label,
  description,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >

      <div className="flex items-center gap-3">

        <span
          className={`grid h-9 w-9 place-items-center rounded-lg ${
            active
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </span>

        <div>

          <p
            className={`text-sm font-semibold ${
              active
                ? "text-indigo-900"
                : "text-slate-800"
            }`}
          >
            {label}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            {description}
          </p>

        </div>

      </div>

    </button>
  );
}