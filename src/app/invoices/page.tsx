"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, FileText, Plus } from "lucide-react";
import { getInvoices } from "@/services/invoiceService";
import AppShell from "@/components/layout/AppShell";

const money = (value: number | string) => `₦${Number(value || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const statusStyles: Record<string, string> = { Paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", Overdue: "bg-rose-50 text-rose-700 ring-rose-600/20", "Partially Paid": "bg-indigo-50 text-indigo-700 ring-indigo-600/20" };

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { void getInvoices().then(setInvoices).catch((error) => console.error("Error loading invoices:", error)).finally(() => setLoading(false)); }, []);

  return <AppShell title="Invoices" subtitle="Track receivables, due dates, and customer payment progress." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Invoices" }]} actions={[{ label: "Create invoice", href: "/invoices/add" }]}>
    <section className="overflow-hidden rounded-[20px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><FileText size={19} /></span><div><h2 className="font-semibold text-slate-900">Invoice register</h2><p className="mt-0.5 text-sm text-slate-500">{loading ? "Loading invoices…" : `${invoices.length} invoice${invoices.length === 1 ? "" : "s"} in your register`}</p></div></div>
        <Link href="/invoices/add" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:hidden"><Plus size={16} />New invoice</Link>
      </div>
      {loading ? <div className="grid gap-3 p-6">{[1, 2, 3, 4].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div> : invoices.length === 0 ? <EmptyInvoices /> : <div className="overflow-x-auto"><table className="min-w-[860px] w-full"><thead className="bg-slate-50/80"><tr>{["Invoice", "Amount", "Due date", "Received", "Balance", "Status", ""].map((label) => <th key={label} className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{invoices.map((invoice) => <tr key={invoice.id} className="group transition hover:bg-slate-50/70"><td className="px-6 py-4"><Link href={`/invoices/${invoice.id}`} className="font-semibold text-indigo-600 hover:text-indigo-800">{invoice.invoice_number}</Link><p className="mt-0.5 text-xs text-slate-400">Customer invoice</p></td><td className="px-6 py-4 text-sm font-semibold text-slate-800">{money(invoice.amount)}</td><td className="px-6 py-4 text-sm text-slate-600">{invoice.due_date || "—"}</td><td className="px-6 py-4 text-sm text-slate-600">{money(invoice.total_paid)}</td><td className="px-6 py-4 text-sm font-semibold text-slate-800">{money(invoice.balance_due)}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[invoice.invoice_status] || "bg-amber-50 text-amber-700 ring-amber-600/20"}`}>{invoice.invoice_status || "Pending"}</span></td><td className="px-6 py-4"><Link aria-label={`View ${invoice.invoice_number}`} href={`/invoices/${invoice.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"><ArrowUpRight size={17} /></Link></td></tr>)}</tbody></table></div>}
    </section>
  </AppShell>;
}

function EmptyInvoices() { return <div className="flex flex-col items-center px-6 py-20 text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><FileText size={26} /></span><h3 className="mt-5 text-lg font-semibold text-slate-900">No invoices yet</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Create your first invoice to start tracking customer balances and payment status.</p><Link href="/invoices/add" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,.22)] hover:bg-indigo-700"><Plus size={16} />Create invoice</Link></div>; }
