"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  ClipboardList,
  Clock3,
  ShoppingCart,
} from "lucide-react";

interface RecentOrdersProps {
  orders: any[];
}

function formatCurrency(value: any) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

function getStatusStyle(status: string) {
  const normalized =
    String(status || "").toLowerCase();

  if (
    normalized.includes("complete") ||
    normalized.includes("delivered") ||
    normalized.includes("paid")
  ) {
    return {
      wrapper:
        "border-emerald-200 bg-emerald-50",
      text:
        "text-emerald-700",
      dot:
        "bg-emerald-500",
    };
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("processing") ||
    normalized.includes("picking") ||
    normalized.includes("packed")
  ) {
    return {
      wrapper:
        "border-amber-200 bg-amber-50",
      text:
        "text-amber-700",
      dot:
        "bg-amber-500",
    };
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("reject")
  ) {
    return {
      wrapper:
        "border-red-200 bg-red-50",
      text:
        "text-red-700",
      dot:
        "bg-red-500",
    };
  }

  return {
    wrapper:
      "border-blue-200 bg-blue-50",
    text:
      "text-blue-700",
    dot:
      "bg-blue-500",
  };
}

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  const visibleOrders =
    orders.slice(0, 5);

  return (
    <div
      className="
        overflow-hidden
        rounded-[20px]
        border
        border-slate-200
        bg-white
        shadow-[0_6px_24px_rgba(15,23,42,0.045)]
      "
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          px-5
          py-4
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-violet-50
              text-violet-600
            "
          >
            <ShoppingCart size={17} />
          </div>

          <div>

            <h3
              className="
                text-sm
                font-black
                text-slate-900
              "
            >
              Recent Orders
            </h3>

            <p
              className="
                mt-0.5
                text-[10px]
                text-slate-400
              "
            >
              Latest sales order activity
            </p>

          </div>

        </div>

        {/* =================================================
            VIEW ALL → SALES ORDERS
        ================================================== */}

        <Link
          href="/sales-orders"
          className="
            flex
            items-center
            gap-1
            rounded-lg
            px-2
            py-1.5
            text-[10px]
            font-bold
            text-blue-600
            transition
            hover:bg-blue-50
            hover:text-blue-700
          "
        >
          View all
          <ArrowUpRight size={12} />
        </Link>

      </div>


      {/* =====================================================
          ORDER LIST
      ====================================================== */}

      {visibleOrders.length === 0 ? (

        <div
          className="
            flex
            min-h-[180px]
            flex-col
            items-center
            justify-center
            px-6
            text-center
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
              text-slate-400
            "
          >
            <ClipboardList size={21} />
          </div>

          <p
            className="
              mt-3
              text-sm
              font-bold
              text-slate-800
            "
          >
            No sales orders yet
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            New sales order activity will appear here.
          </p>

        </div>

      ) : (

        <div className="divide-y divide-slate-100">

          {visibleOrders.map(
            (order: any, index: number) => {

              const orderId =
                order.id ??
                order.order_id;

              const orderNumber =
                order.order_number ||
                order.orderNumber ||
                order.reference ||
                `Order ${index + 1}`;

              const customerName =
                order.customer_name ||
                order.customer?.name ||
                order.customer ||
                "Customer";

              const status =
                order.status ||
                order.order_status ||
                "Pending";

              const amount =
                order.total_amount ??
                order.total ??
                order.amount ??
                order.grand_total ??
                0;

              const statusStyle =
                getStatusStyle(status);

              const content = (
                <>
                  {/* Order icon */}

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-50
                      text-slate-500
                      transition
                      group-hover:bg-blue-50
                      group-hover:text-blue-600
                    "
                  >
                    <ClipboardList size={16} />
                  </div>

                  {/* Main information */}

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
                          font-bold
                          text-slate-800
                        "
                      >
                        {orderNumber}
                      </p>

                      <span
                        className={`
                          hidden
                          shrink-0
                          items-center
                          gap-1
                          rounded-full
                          border
                          px-2
                          py-0.5
                          text-[8px]
                          font-bold
                          sm:inline-flex
                          ${statusStyle.wrapper}
                          ${statusStyle.text}
                        `}
                      >

                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${statusStyle.dot}
                          `}
                        />

                        {status}

                      </span>

                    </div>

                    <div
                      className="
                        mt-1
                        flex
                        min-w-0
                        items-center
                        gap-1.5
                        text-[10px]
                        text-slate-400
                      "
                    >

                      <Clock3
                        size={10}
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
                      {formatCurrency(amount)}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Order value
                    </p>

                  </div>

                  {/* Arrow */}

                  <ArrowUpRight
                    size={14}
                    className="
                      hidden
                      shrink-0
                      text-slate-300
                      transition
                      group-hover:text-blue-500
                      sm:block
                    "
                  />
                </>
              );

              return orderId ? (
                <Link
                  key={
                    orderId ??
                    `${orderNumber}-${index}`
                  }
                  href={`/sales-orders/${orderId}`}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3.5
                    transition
                    hover:bg-blue-50/40
                  "
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={`${orderNumber}-${index}`}
                  className="
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3.5
                  "
                >
                  {content}
                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}