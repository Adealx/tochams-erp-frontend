"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
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
    <section
      className="
        group
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
        <div className="flex min-w-0 items-center gap-3">

          {/* Icon */}

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
              border-blue-100
              bg-blue-50
              text-blue-600
            "
          >
            <Users
              size={18}
              strokeWidth={2}
            />
          </div>

          {/* Heading */}

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
                Recent Customers
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
                {customers.length}
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
              Latest customer activity across the enterprise
            </p>

          </div>

        </div>

        {/* View all */}

        <Link
          href="/customers"
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
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600
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
          CUSTOMER LIST
      ====================================================== */}

      {visibleCustomers.length === 0 ? (

        /* ===================================================
            EMPTY STATE
        ==================================================== */

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
            <UserRound size={23} />
          </div>

          <p
            className="
              mt-4
              text-sm
              font-black
              text-slate-800
            "
          >
            No customers yet
          </p>

          <p
            className="
              mt-1
              max-w-[260px]
              text-xs
              leading-5
              text-slate-500
            "
          >
            Customer activity will appear here once customers
            are added to the ERP.
          </p>

          <Link
            href="/customers/add"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-3.5
              py-2
              text-xs
              font-bold
              text-white
              shadow-[0_6px_18px_rgba(37,99,235,0.18)]
              transition-all
              hover:-translate-y-0.5
              hover:bg-blue-700
            "
          >
            Add customer
            <ArrowUpRight size={13} />
          </Link>

        </div>

      ) : (

        <div className="divide-y divide-slate-100">

          {visibleCustomers.map(
            (customer: any, index: number) => {

              /* =================================================
                 CUSTOMER DATA NORMALIZATION
              ================================================== */

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

              /* =================================================
                 CUSTOMER ROW CONTENT
              ================================================== */

              const content = (
                <>
                  {/* Avatar */}

                  <div
                    className="
                      relative
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      border
                      border-blue-100
                      bg-gradient-to-br
                      from-blue-50
                      via-white
                      to-cyan-50
                      text-[11px]
                      font-black
                      text-blue-600
                      transition-all
                      duration-200
                      group-hover/customer:border-blue-200
                      group-hover/customer:shadow-sm
                    "
                  >
                    {initials}
                  </div>

                  {/* Customer information */}

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
                          group-hover/customer:text-blue-700
                        "
                      >
                        {customerName}
                      </p>

                      <span
                        className="
                          hidden
                          shrink-0
                          rounded-full
                          bg-emerald-50
                          px-1.5
                          py-0.5
                          text-[8px]
                          font-bold
                          text-emerald-700
                          sm:inline-flex
                        "
                      >
                        Customer
                      </span>

                    </div>

                    {/* Contact information */}

                    {email ? (

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
                        <Mail
                          size={11}
                          strokeWidth={2}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {email}
                        </span>
                      </div>

                    ) : phone ? (

                      <div
                        className="
                          mt-1.5
                          flex
                          items-center
                          gap-1.5
                          text-[10px]
                          text-slate-400
                        "
                      >
                        <Phone
                          size={11}
                          strokeWidth={2}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {phone}
                        </span>
                      </div>

                    ) : (

                      <p
                        className="
                          mt-1.5
                          text-[10px]
                          text-slate-400
                        "
                      >
                        Customer account
                      </p>

                    )}

                  </div>

                  {/* Navigation indicator */}

                  <div
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-slate-300
                      transition-all
                      duration-200
                      group-hover/customer:bg-blue-50
                      group-hover/customer:text-blue-600
                    "
                  >
                    <ChevronRight
                      size={15}
                      strokeWidth={2}
                    />
                  </div>

                </>
              );

              /* =================================================
                 LINKED CUSTOMER
              ================================================== */

              return customerId ? (

                <Link
                  key={customerId}
                  href={`/customers/${customerId}`}
                  className="
                    group/customer
                    flex
                    min-w-0
                    items-center
                    gap-3
                    px-5
                    py-3.5
                    transition-all
                    duration-200
                    hover:bg-slate-50
                    sm:px-6
                  "
                >
                  {content}
                </Link>

              ) : (

                /* =================================================
                   CUSTOMER WITHOUT ID
                ================================================== */

                <div
                  key={`${customerName}-${index}`}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                    px-5
                    py-3.5
                    sm:px-6
                  "
                >
                  {content}
                </div>

              );
            }
          )}

        </div>
      )}

      {/* =====================================================
          FOOTER
      ====================================================== */}

      {visibleCustomers.length > 0 && (
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
              Showing latest {visibleCustomers.length} customer
              {visibleCustomers.length === 1 ? "" : "s"}
            </p>

            <Link
              href="/customers"
              className="
                shrink-0
                text-[9px]
                font-bold
                text-blue-600
                transition-colors
                hover:text-blue-700
              "
            >
              Customer directory
            </Link>

          </div>
        </div>
      )}

    </section>
  );
}