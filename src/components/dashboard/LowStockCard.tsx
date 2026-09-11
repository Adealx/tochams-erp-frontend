"use client";

import { useState } from "react";

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  ChevronDown,
  Package,
} from "lucide-react";

interface LowStockCardProps {
  products: any[];
}

export default function LowStockCard({
  products,
}: LowStockCardProps) {
  const [isExpanded, setIsExpanded] =
    useState(true);

  const visibleProducts =
    products.slice(0, 6);

  return (
    <div
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-amber-200
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.05)]
      "
    >

      {/* =====================================================
          HEADER
          -----------------------------------------------------
          CLICK TO COLLAPSE / EXPAND
      ====================================================== */}

      <button
        type="button"
        onClick={() =>
          setIsExpanded((current) => !current)
        }
        aria-expanded={isExpanded}
        className="
          flex
          w-full
          flex-col
          gap-4
          border-b
          border-amber-100
          bg-gradient-to-r
          from-amber-50
          to-white
          px-5
          py-5
          text-left
          transition
          hover:from-amber-100/70
          hover:to-white

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        {/* Left */}

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
              bg-amber-100
              text-amber-600
            "
          >
            <AlertTriangle size={19} />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h3
                className="
                  truncate
                  text-sm
                  font-black
                  text-slate-900
                "
              >
                Inventory Alerts
              </h3>

              <span
                className="
                  hidden
                  rounded-full
                  bg-red-50
                  px-2
                  py-0.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-wider
                  text-red-600
                  sm:inline-flex
                "
              >
                Attention
              </span>

            </div>

            <p
              className="
                mt-1
                text-[11px]
                text-slate-500
              "
            >
              Products requiring replenishment
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center justify-between gap-3 sm:justify-end">

          <span
            className="
              rounded-full
              bg-red-50
              px-3
              py-1.5
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-red-600
            "
          >
            {products.length} Critical
          </span>

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-500
              shadow-sm
            "
          >
            <ChevronDown
              size={16}
              className={`
                transition-transform
                duration-300
                ${
                  isExpanded
                    ? "rotate-180"
                    : "rotate-0"
                }
              `}
            />
          </div>

        </div>

      </button>


      {/* =====================================================
          COLLAPSIBLE CONTENT
      ====================================================== */}

      <div
        className={`
          grid
          transition-[grid-template-rows]
          duration-300
          ease-in-out
          ${
            isExpanded
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]"
          }
        `}
      >

        <div className="min-h-0 overflow-hidden">

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {visibleProducts.length === 0 ? (

            <div
              className="
                flex
                min-h-[150px]
                flex-col
                items-center
                justify-center
                p-6
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
                  bg-emerald-50
                  text-emerald-600
                "
              >
                <Boxes size={22} />
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                Inventory is healthy
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                No products currently require
                replenishment.
              </p>

            </div>

          ) : (

            /* =================================================
               PRODUCT LIST
            ================================================== */

            <div className="divide-y divide-slate-100">

              {visibleProducts.map(
                (product: any, index: number) => {

                  const quantity =
                    Number(
                      product.stock_quantity ??
                      product.quantity ??
                      product.stock ??
                      0
                    );

                  const productName =
                    product.name ||
                    product.product_name ||
                    `Product ${index + 1}`;

                  return (
                    <div
                      key={
                        product.id ??
                        `${productName}-${index}`
                      }
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        px-5
                        py-4
                        transition
                        hover:bg-slate-50
                      "
                    >

                      {/* Product */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-50
                            text-red-500
                          "
                        >
                          <Package size={17} />
                        </div>

                        <div className="min-w-0">

                          <p
                            className="
                              truncate
                              text-xs
                              font-bold
                              text-slate-800
                            "
                          >
                            {productName}
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              text-slate-400
                            "
                          >
                            SKU:{" "}
                            {product.sku ||
                              product.product_code ||
                              "—"}
                          </p>

                        </div>

                      </div>

                      {/* Stock */}

                      <div
                        className="
                          shrink-0
                          text-right
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-black
                            text-red-600
                          "
                        >
                          {quantity}
                        </p>

                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          In stock
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}


          {/* =================================================
              FOOTER
          ================================================== */}

          {products.length > 6 && (

            <div
              className="
                border-t
                border-slate-100
                px-5
                py-3
              "
            >

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  font-bold
                  text-blue-600
                  transition
                  hover:text-blue-700
                "
              >
                View all inventory alerts

                <ArrowRight size={13} />

              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}