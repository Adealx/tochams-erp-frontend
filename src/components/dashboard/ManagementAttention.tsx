"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Package,
  ShoppingCart,
  WalletCards,
} from "lucide-react";

interface ManagementAttentionProps {
  overdueInvoices?: number;
  outstandingAmount?: number;
  lowStock?: number;
  pendingOrders?: number;
  pendingPayments?: number;
  pendingProcurement?: number;
}

type AttentionItem = {
  title: string;
  description: string;
  value: string;
  href: string;
  icon: React.ElementType;
  tone: "red" | "amber" | "blue" | "violet" | "emerald";
};

export default function ManagementAttention({
  overdueInvoices = 0,
  outstandingAmount = 0,
  lowStock = 0,
  pendingOrders = 0,
  pendingPayments = 0,
  pendingProcurement = 0,
}: ManagementAttentionProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);

  const attentionItems: AttentionItem[] = [
    {
      title: "Overdue Invoices",
      description:
        overdueInvoices > 0
          ? `${overdueInvoices} invoice${
              overdueInvoices === 1 ? "" : "s"
            } require collection attention.`
          : "No overdue invoices requiring attention.",
      value:
        overdueInvoices > 0
          ? formatCurrency(outstandingAmount)
          : "Clear",
      href: "/invoices",
      icon: CreditCard,
      tone: overdueInvoices > 0 ? "red" : "emerald",
    },
    {
      title: "Low Stock",
      description:
        lowStock > 0
          ? `${lowStock} product${
              lowStock === 1 ? "" : "s"
            } need replenishment or review.`
          : "Inventory levels are currently healthy.",
      value: lowStock > 0 ? `${lowStock} items` : "Healthy",
      href: "/inventory",
      icon: Package,
      tone: lowStock > 0 ? "amber" : "emerald",
    },
    {
      title: "Pending Orders",
      description:
        pendingOrders > 0
          ? `${pendingOrders} sales order${
              pendingOrders === 1 ? "" : "s"
            } are awaiting processing.`
          : "No pending sales orders.",
      value: pendingOrders > 0 ? `${pendingOrders} orders` : "Clear",
      href: "/sales-orders",
      icon: ShoppingCart,
      tone: pendingOrders > 0 ? "amber" : "emerald",
    },
    {
      title: "Pending Payments",
      description:
        pendingPayments > 0
          ? `${pendingPayments} payment${
              pendingPayments === 1 ? "" : "s"
            } need accounting attention.`
          : "No pending payment activity.",
      value: pendingPayments > 0 ? `${pendingPayments} items` : "Clear",
      href: "/payments",
      icon: WalletCards,
      tone: pendingPayments > 0 ? "blue" : "emerald",
    },
    {
      title: "Pending Procurement",
      description:
        pendingProcurement > 0
          ? `${pendingProcurement} procurement request${
              pendingProcurement === 1 ? "" : "s"
            } require review.`
          : "No procurement items require attention.",
      value:
        pendingProcurement > 0
          ? `${pendingProcurement} requests`
          : "Clear",
      href: "/procurement",
      icon: ClipboardCheck,
      tone: pendingProcurement > 0 ? "violet" : "emerald",
    },
  ];

  const toneStyles = {
    red: {
      icon: "bg-red-50 text-red-600",
      badge: "bg-red-50 text-red-700 border-red-100",
      hover: "hover:border-red-200 hover:bg-red-50/30",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      badge: "bg-amber-50 text-amber-700 border-amber-100",
      hover: "hover:border-amber-200 hover:bg-amber-50/30",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      badge: "bg-blue-50 text-blue-700 border-blue-100",
      hover: "hover:border-blue-200 hover:bg-blue-50/30",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      badge: "bg-violet-50 text-violet-700 border-violet-100",
      hover: "hover:border-violet-200 hover:bg-violet-50/30",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
      hover: "hover:border-emerald-200 hover:bg-emerald-50/30",
    },
  };

  const attentionCount = [
    overdueInvoices,
    lowStock,
    pendingOrders,
    pendingPayments,
    pendingProcurement,
  ].filter((value) => value > 0).length;

  return (
    <div
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
      "
    >
      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-100
          px-5
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-900
              text-white
              shadow-sm
            "
          >
            <AlertCircle size={18} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black tracking-tight text-slate-950">
                Management Attention
              </h3>

              {attentionCount > 0 && (
                <span
                  className="
                    rounded-full
                    border
                    border-red-100
                    bg-red-50
                    px-2
                    py-0.5
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wider
                    text-red-700
                  "
                >
                  {attentionCount} active
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              Operational issues and actions requiring management attention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live control view
        </div>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 md:divide-y-0 md:divide-x">
        {attentionItems.map((item) => {
          const Icon = item.icon;
          const styles = toneStyles[item.tone];

          const isClear =
            item.value === "Clear" || item.value === "Healthy";

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`
                group
                relative
                flex
                min-h-[118px]
                items-center
                gap-4
                px-5
                py-5
                transition
                ${styles.hover}
                ${item.title === "Pending Procurement"
                  ? "md:col-span-2"
                  : ""}
              `}
            >
              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${styles.icon}
                `}
              >
                {isClear ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Icon size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="truncate text-xs font-black text-slate-900">
                    {item.title}
                  </h4>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      border
                      px-2
                      py-1
                      text-[9px]
                      font-black
                      ${styles.badge}
                    `}
                  >
                    {item.value}
                  </span>
                </div>

                <p className="mt-1.5 max-w-md text-[11px] leading-5 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-slate-400 transition group-hover:text-slate-700">
                  Review
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}