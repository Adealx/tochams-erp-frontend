"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Phone,
  UserRound,
  Users,
} from "lucide-react";

interface RecentCustomersProps {
  customers: any[];
}

export default function RecentCustomers({
  customers,
}: RecentCustomersProps) {
  const visibleCustomers = customers.slice(0, 5);

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
              bg-blue-50
              text-blue-600
            "
          >
            <Users size={17} />
          </div>

          <div>

            <h3
              className="
                text-sm
                font-black
                text-slate-900
              "
            >
              Recent Customers
            </h3>

            <p
              className="
                mt-0.5
                text-[10px]
                text-slate-400
              "
            >
              Latest customer activity
            </p>

          </div>

        </div>

        {/* View all */}

        <Link
          href="/customers"
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
          CUSTOMER LIST
      ====================================================== */}

      {visibleCustomers.length === 0 ? (

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
            <UserRound size={21} />
          </div>

          <p
            className="
              mt-3
              text-sm
              font-bold
              text-slate-800
            "
          >
            No customers yet
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            Customer activity will appear here.
          </p>

        </div>

      ) : (

        <div className="divide-y divide-slate-100">

          {visibleCustomers.map(
            (customer: any, index: number) => {

              const customerId =
                customer.id ??
                customer.customer_id;

              const customerName =
                customer.name ||
                customer.customer_name ||
                customer.company_name ||
                customer.full_name ||
                `Customer ${index + 1}`;

              const email =
                customer.email ||
                customer.email_address ||
                "";

              const phone =
                customer.phone ||
                customer.phone_number ||
                "";

              const initials =
                customerName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(
                    (part: string) =>
                      part.charAt(0).toUpperCase()
                  )
                  .join("") || "C";

              const content = (
                <>
                  {/* Avatar */}

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-blue-50
                      to-cyan-50
                      text-[11px]
                      font-black
                      text-blue-600
                    "
                  >
                    {initials}
                  </div>

                  {/* Customer information */}

                  <div className="min-w-0 flex-1">

                    <p
                      className="
                        truncate
                        text-xs
                        font-bold
                        text-slate-800
                      "
                    >
                      {customerName}
                    </p>

                    {email ? (
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
                        <Mail
                          size={11}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {email}
                        </span>
                      </div>
                    ) : phone ? (
                      <div
                        className="
                          mt-1
                          flex
                          items-center
                          gap-1.5
                          text-[10px]
                          text-slate-400
                        "
                      >
                        <Phone
                          size={11}
                          className="shrink-0"
                        />

                        <span>
                          {phone}
                        </span>
                      </div>
                    ) : (
                      <p
                        className="
                          mt-1
                          text-[10px]
                          text-slate-400
                        "
                      >
                        Customer account
                      </p>
                    )}

                  </div>

                  {/* Arrow */}

                  <ArrowUpRight
                    size={14}
                    className="
                      shrink-0
                      text-slate-300
                      transition
                      group-hover:text-blue-500
                    "
                  />
                </>
              );

              return customerId ? (
                <Link
                  key={
                    customerId ??
                    `${customerName}-${index}`
                  }
                  href={`/customers/${customerId}`}
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
                  key={`${customerName}-${index}`}
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