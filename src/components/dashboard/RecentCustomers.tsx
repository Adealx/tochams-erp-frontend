"use client";

import Link from "next/link";

import {
  Users,
  User,
  ArrowRight,
  UserPlus,
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  company?: string;
}

interface RecentCustomersProps {
  customers: Customer[];
}

export default function RecentCustomers({
  customers,
}: RecentCustomersProps) {
  return (
    <div
      className="
        rounded-[20px]
        border
        border-slate-200
        bg-white
        shadow-[0_6px_20px_rgba(15,23,42,.035)]
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
              bg-indigo-100
            "
          >
            <Users
              size={24}
              className="text-indigo-600"
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
              Recent Customers
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Recently registered customers
            </p>

          </div>

        </div>

        <div className="flex items-center gap-5">

          <div className="text-right">

            <p className="text-sm text-slate-500">
              Showing
            </p>

            <p
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              {Math.min(customers.length, 5)}
            </p>

          </div>

          <Link
            href="/customers"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-indigo-700
            "
          >
            View All

            <ArrowRight size={16} />
          </Link>

        </div>

      </div>

      {/* ================= Body ================= */}

      <div className="p-6">

        {customers.length === 0 ? (

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

            <UserPlus
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
              No Customers Yet
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              New customers will appear here once they are created.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {customers
              .slice(0, 5)
              .map((customer) => (

                <div
                  key={customer.id}
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
                    hover:border-indigo-300
                    hover:bg-indigo-50
                  "
                >

                  {/* Left */}

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
                        {customer.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        {customer.email}
                      </p>

                      {customer.company && (

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          {customer.company}
                        </p>

                      )}

                    </div>

                  </div>

                  {/* Right */}

                  <span
                    className="
                      rounded-full
                      bg-indigo-100
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-indigo-700
                    "
                  >
                    New
                  </span>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}
