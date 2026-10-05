"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  ShoppingCart,
  UserRound,
} from "lucide-react";

interface RecentOrdersProps {
  orders: any[];
}

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  const visibleOrders = orders.slice(0, 5);

  /*
   * Normalize order status so the UI can handle
   * different backend naming conventions safely.
   */
  function getOrderStatus(order: any) {
    const rawStatus =
      order.status ||
      order.order_status ||
      order.state ||
      "";

    const normalized = String(rawStatus)
      .trim()
      .toLowerCase();

    if (
      normalized.includes("complete") ||
      normalized.includes("delivered") ||
      normalized.includes("approved")
    ) {
      return {
        label: "Completed",
        tone: "emerald",
        icon: <CheckCircle2 size={12} />,
      };
    }

    if (
      normalized.includes("pending") ||
      normalized.includes("draft") ||
      normalized.includes("processing")
    ) {
      return {
        label:
          normalized.includes("processing")
            ? "Processing"
            : "Pending",
        tone: "amber",
        icon: <Clock3 size={12} />,
      };
    }

    return {
      label:
        rawStatus || "Order",
      tone: "blue",
      icon: <FileText size={12} />,
    };
  }

  function formatAmount(value: any) {
    const amount = Number(value || 0);

    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <section
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
        transition-all
        duration-300
        hover:shadow-[0_12px_36px_rgba(15,23,42,0.065)]
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-100
          px-5
          py-4.5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
        "
      >
        {/* Title */}

        <div className="flex min-w-0 items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-violet-100
              bg-violet-50
              text-violet-600
            "
          >
            <ShoppingCart
              size={18}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h3
                className="
                  truncate
                  text-sm
                  font-black
                  tracking-[-0.01em]
                  text-slate-950
                "
              >
                Recent Orders
              </h3>

              <span
                className="
                  hidden
                  rounded-full
                  border
                  border-slate-200
                  bg-slate-50
                  px-2
                  py-0.5
                  text-[9px]
                  font-bold
                  text-slate-500
                  sm:inline-flex
                "
              >
                {orders.length}
              </span>

            </div>

            <p
              className="
                mt-0.5
                truncate
                text-[10px]
                leading-4
                text-slate-400
              "
            >
              Latest sales orders and fulfillment activity
            </p>

          </div>

        </div>

        {/* View all */}

        <Link
          href="/sales-orders"
          className="
            group/view
            inline-flex
            w-fit
            shrink-0
            items-center
            gap-1.5
            rounded-lg
            border
            border-slate-200
            bg-white
            px-2.5
            py-1.5
            text-[10px]
            font-bold
            text-slate-600
            transition-all
            duration-200
            hover:border-violet-200
            hover:bg-violet-50
            hover:text-violet-600
          "
        >
          View all

          <ArrowUpRight
            size={12}
            strokeWidth={2}
            className="
              transition-transform
              duration-200
              group-hover/view:translate-x-0.5
              group-hover/view:-translate-y-0.5
            "
          />
        </Link>

      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {visibleOrders.length === 0 ? (

        <div
          className="
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            px-6
            py-10
            text-center
          "
        >

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              text-slate-400
            "
          >
            <ShoppingCart size={23} />
          </div>

          <p
            className="
              mt-4
              text-sm
              font-black
              text-slate-800
            "
          >
            No sales orders yet
          </p>

          <p
            className="
              mt-1
              max-w-[270px]
              text-xs
              leading-5
              text-slate-500
            "
          >
            New sales orders will appear here as transactions
            enter the ERP.
          </p>

          <Link
            href="/sales-orders"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-violet-600
              px-3.5
              py-2
              text-xs
              font-bold
              text-white
              shadow-[0_6px_18px_rgba(124,58,237,0.18)]
              transition-all
              hover:-translate-y-0.5
              hover:bg-violet-700
            "
          >
            Open Sales Orders
            <ArrowUpRight size={13} />
          </Link>

        </div>

      ) : (

        <>
          {/* =================================================
              TABLE HEADER
          ================================================== */}

          <div
            className="
              hidden
              grid-cols-[minmax(0,1fr)_130px_120px]
              items-center
              gap-4
              border-b
              border-slate-100
              bg-slate-50/60
              px-6
              py-2.5
              md:grid
            "
          >
            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              Order
            </span>

            <span
              className="
                text-right
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              Amount
            </span>

            <span
              className="
                text-right
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              Status
            </span>
          </div>

          {/* =================================================
              ORDER LIST
          ================================================== */}

          <div className="divide-y divide-slate-100">

            {visibleOrders.map(
              (order: any, index: number) => {

                const orderId =
                  order.id ??
                  order.order_id;

                const orderNumber =
                  order.order_number ||
                  order.order_no ||
                  order.reference ||
                  order.number ||
                  (orderId
                    ? `SO-${orderId}`
                    : `Order ${index + 1}`);

                const customerName =
                  order.customer_name ||
                  order.customer?.name ||
                  order.customer?.customer_name ||
                  order.customer ||
                  "Customer";

                const amount =
                  order.total_amount ??
                  order.total ??
                  order.grand_total ??
                  order.amount ??
                  0;

                const status =
                  getOrderStatus(order);

                const statusStyles = {
                  emerald: {
                    badge:
                      "border-emerald-100 bg-emerald-50 text-emerald-700",
                    dot: "bg-emerald-500",
                  },

                  amber: {
                    badge:
                      "border-amber-100 bg-amber-50 text-amber-700",
                    dot: "bg-amber-500",
                  },

                  blue: {
                    badge:
                      "border-blue-100 bg-blue-50 text-blue-700",
                    dot: "bg-blue-500",
                  },
                };

                const selectedStyle =
                  statusStyles[
                    status.tone as keyof typeof statusStyles
                  ] || statusStyles.blue;

                const content = (
                  <>
                    {/* Order icon */}

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-violet-100
                        bg-violet-50
                        text-violet-600
                        transition-all
                        duration-200
                        group-hover/order:border-violet-200
                        group-hover/order:bg-violet-100
                      "
                    >
                      <FileText
                        size={17}
                        strokeWidth={2}
                      />
                    </div>

                    {/* Order information */}

                    <div className="min-w-0 flex-1">

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                        "
                      >
                        <p
                          className="
                            truncate
                            text-xs
                            font-black
                            text-slate-800
                            transition-colors
                            duration-200
                            group-hover/order:text-violet-700
                          "
                        >
                          {orderNumber}
                        </p>
                      </div>

                      <div
                        className="
                          mt-1.5
                          flex
                          min-w-0
                          items-center
                          gap-1.5
                          text-[10px]
                          text-slate-400
                        "
                      >
                        <UserRound
                          size={11}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {customerName}
                        </span>
                      </div>

                    </div>

                    {/* Amount */}

                    <div
                      className="
                        shrink-0
                        text-right
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-black
                          text-slate-900
                        "
                      >
                        {formatAmount(amount)}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[8px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-slate-400
                        "
                      >
                        Order value
                      </p>
                    </div>

                    {/* Status */}

                    <div
                      className="
                        hidden
                        items-center
                        justify-end
                        gap-2
                        md:flex
                      "
                    >
                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-[9px]
                          font-black
                          uppercase
                          tracking-wider
                          ${selectedStyle.badge}
                        `}
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${selectedStyle.dot}
                          `}
                        />

                        {status.label}
                      </span>

                      <ChevronRight
                        size={14}
                        className="
                          text-slate-300
                          transition-all
                          duration-200
                          group-hover/order:translate-x-0.5
                          group-hover/order:text-violet-500
                        "
                      />
                    </div>

                    {/* Mobile arrow */}

                    <ChevronRight
                      size={15}
                      className="
                        shrink-0
                        text-slate-300
                        transition
                        group-hover/order:text-violet-500
                        md:hidden
                      "
                    />
                  </>
                );

                /*
                 * Preserve the existing detail route:
                 * /sales-orders/[id]
                 *
                 * If an order has no ID, don't invent a
                 * detail URL. The row simply remains static.
                 */

                return orderId ? (

                  <Link
                    key={orderId}
                    href={`/sales-orders/${orderId}`}
                    className="
                      group/order
                      flex
                      min-w-0
                      items-center
                      gap-3
                      px-5
                      py-3.5
                      transition-all
                      duration-200
                      hover:bg-violet-50/30
                      md:grid
                      md:grid-cols-[minmax(0,1fr)_130px_120px]
                      md:gap-4
                      sm:px-6
                    "
                  >
                    {content}
                  </Link>

                ) : (

                  <div
                    key={`${orderNumber}-${index}`}
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                      px-5
                      py-3.5
                      md:grid
                      md:grid-cols-[minmax(0,1fr)_130px_120px]
                      md:gap-4
                      sm:px-6
                    "
                  >
                    {content}
                  </div>

                );
              }
            )}

          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div
            className="
              border-t
              border-slate-100
              bg-slate-50/50
              px-5
              py-2.5
              sm:px-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >

              <p
                className="
                  truncate
                  text-[9px]
                  font-medium
                  text-slate-400
                "
              >
                Showing latest{" "}
                <span className="font-bold text-slate-600">
                  {visibleOrders.length}
                </span>{" "}
                order
                {visibleOrders.length === 1
                  ? ""
                  : "s"}
              </p>

              <Link
                href="/sales-orders"
                className="
                  group/footer
                  inline-flex
                  shrink-0
                  items-center
                  gap-1.5
                  text-[9px]
                  font-bold
                  text-violet-600
                  transition-colors
                  hover:text-violet-700
                "
              >
                Sales order directory

                <ArrowUpRight
                  size={11}
                  className="
                    transition-transform
                    group-hover/footer:translate-x-0.5
                    group-hover/footer:-translate-y-0.5
                  "
                />
              </Link>

            </div>
          </div>
        </>
      )}

    </section>
  );
}