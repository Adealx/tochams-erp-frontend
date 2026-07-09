"use client";

import Link from "next/link";

import {
  ShoppingCart,
  ArrowRight,
  User,
  PackageOpen,
} from "lucide-react";

interface Order {
  id: number;
  customer_name: string;
  status: string;
  total_amount: number;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusStyles = {
  Approved:
    "bg-emerald-100 text-emerald-700",

  Pending:
    "bg-amber-100 text-amber-700",

  Rejected:
    "bg-red-100 text-red-700",

  Draft:
    "bg-slate-100 text-slate-700",
};

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* ================= Header ================= */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-200
          px-8
          py-6
        "
      >
        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-blue-100
            "
          >

            <ShoppingCart
              size={24}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Recent Orders
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Latest customer purchase orders
            </p>

          </div>

        </div>

        <div className="flex items-center gap-5">

          <div className="text-right">

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Showing
            </p>

            <p
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              {Math.min(orders.length, 5)}
            </p>

          </div>

          <Link
            href="/sales-orders"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            View All

            <ArrowRight size={16} />

          </Link>

        </div>

      </div>

      {/* ================= Body ================= */}

      <div className="p-6">

        {orders.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-12
              text-center
            "
          >

            <PackageOpen
              size={52}
              className="mb-4 text-slate-300"
            />

            <h3
              className="
                text-lg
                font-semibold
                text-slate-700
              "
            >
              No Recent Orders
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Orders will appear here once sales begin.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {orders
              .slice(0, 5)
              .map((order) => (

                <div
                  key={order.id}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                    transition-all
                    hover:border-blue-300
                    hover:bg-blue-50
                  "
                >

                  {/* Customer */}

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                      "
                    >

                      <User
                        size={22}
                        className="text-slate-600"
                      />

                    </div>

                    <div>

                      <h3
                        className="
                          font-semibold
                          text-slate-900
                        "
                      >
                        {order.customer_name}
                      </h3>

                      <div className="mt-2">

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold

                            ${
                              statusStyles[
                                order.status as keyof typeof statusStyles
                              ] ||
                              statusStyles.Draft
                            }
                          `}
                        >
                          {order.status}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Amount */}

                  <div className="text-right">

                    <p
                      className="
                        text-sm
                        text-slate-500
                      "
                    >
                      Order Value
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      ₦
                      {Number(
                        order.total_amount || 0
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}