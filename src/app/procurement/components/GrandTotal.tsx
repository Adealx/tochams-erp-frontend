"use client";

import {
  Calculator,
  Receipt,
} from "lucide-react";

interface GrandTotalProps {
  total: number;
}

export default function GrandTotal({
  total,
}: GrandTotalProps) {

  // Future-proof values

  const subtotal = total;
  const tax = 0;
  const discount = 0;
  const shipping = 0;

  const grandTotal =
    subtotal +
    tax +
    shipping -
    discount;

  return (

    <div
      className="
        mt-8
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-200
          px-6
          py-5
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
            "
          >
            <Calculator size={20} />
          </div>

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Procurement Summary
            </h2>

            <p className="text-sm text-slate-500">

              Purchase order totals

            </p>

          </div>

        </div>

        <Receipt
          size={24}
          className="text-slate-400"
        />

      </div>

      {/* Body */}

      <div className="p-6">

        <div className="space-y-5">

          <SummaryRow
            label="Subtotal"
            value={subtotal}
          />

          <SummaryRow
            label="Tax"
            value={tax}
          />

          <SummaryRow
            label="Discount"
            value={discount}
          />

          <SummaryRow
            label="Shipping"
            value={shipping}
          />

          <div className="border-t border-slate-200 pt-5">

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                Grand Total
              </span>

              <span
                className="
                  text-3xl
                  font-black
                  text-green-600
                "
              >
                ₦
                {grandTotal.toLocaleString()}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

/* ===========================
   Summary Row
=========================== */

interface SummaryRowProps {
  label: string;
  value: number;
}

function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (

    <div
      className="
        flex
        items-center
        justify-between
      "
    >

      <span className="text-slate-500">

        {label}

      </span>

      <span
        className="
          font-semibold
          text-slate-900
        "
      >
        ₦{value.toLocaleString()}
      </span>

    </div>

  );
}