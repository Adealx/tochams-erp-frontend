"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  ChevronDown,
  ExternalLink,
  Package,
  ShieldAlert,
} from "lucide-react";

interface LowStockCardProps {
  products: any[];
}

export default function LowStockCard({
  products,
}: LowStockCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  /*
   * Keep the dashboard compact.
   * The complete inventory remains available from /inventory.
   */
  const visibleProducts = products.slice(0, 6);

  /*
   * Calculate basic inventory indicators from the
   * existing product data without changing the API.
   */
  const inventoryStats = useMemo(() => {
    const critical = products.length;

    const totalUnits = products.reduce(
      (sum, product) =>
        sum +
        Number(
          product.stock_quantity ??
            product.quantity ??
            product.stock ??
            0
        ),
      0
    );

    return {
      critical,
      totalUnits,
    };
  }, [products]);

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-[0_10px_35px_rgba(15,23,42,0.055)]
        transition-all
        duration-300
        hover:shadow-[0_16px_42px_rgba(15,23,42,0.075)]
      "
    >
      {/* =====================================================
          TOP ACCENT
      ====================================================== */}

      <div
        className="
          absolute
          left-0
          top-0
          h-1
          w-full
          bg-gradient-to-r
          from-amber-500
          via-orange-500
          to-red-500
        "
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          border-b
          border-slate-100
          bg-gradient-to-r
          from-amber-50/80
          via-white
          to-white
          px-5
          py-5
          sm:px-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* LEFT */}

          <button
            type="button"
            onClick={() =>
              setIsExpanded((current) => !current)
            }
            aria-expanded={isExpanded}
            className="
              flex
              min-w-0
              items-center
              gap-3
              text-left
            "
          >
            {/* Icon */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-amber-200
                bg-amber-100
                text-amber-600
              "
            >
              <ShieldAlert size={20} />
            </div>

            {/* Heading */}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-amber-600
                  "
                >
                  Inventory Control
                </span>

                <span
                  className="
                    hidden
                    rounded-full
                    border
                    border-red-200
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
                  Attention Required
                </span>
              </div>

              <h3
                className="
                  mt-1
                  truncate
                  text-base
                  font-black
                  tracking-[-0.02em]
                  text-slate-950
                "
              >
                Inventory Health
              </h3>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-slate-500
                "
              >
                Products requiring attention or replenishment
              </p>
            </div>
          </button>

          {/* RIGHT */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            {/* Critical */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-100
                bg-red-50
                px-3
                py-2
              "
            >
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-lg
                  bg-red-100
                  text-red-600
                "
              >
                <AlertTriangle size={13} />
              </span>

              <div>
                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-red-500
                  "
                >
                  Critical
                </p>

                <p
                  className="
                    text-sm
                    font-black
                    leading-none
                    text-red-700
                  "
                >
                  {inventoryStats.critical}
                </p>
              </div>
            </div>

            {/* Units */}

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                sm:inline-flex
              "
            >
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                  text-slate-500
                "
              >
                <Boxes size={13} />
              </span>

              <div>
                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Units at Risk
                </p>

                <p
                  className="
                    text-sm
                    font-black
                    leading-none
                    text-slate-800
                  "
                >
                  {inventoryStats.totalUnits.toLocaleString(
                    "en-NG"
                  )}
                </p>
              </div>
            </div>

            {/* Open inventory */}

            <Link
              href="/inventory"
              onClick={(event) =>
                event.stopPropagation()
              }
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3.5
                py-2.5
                text-[10px]
                font-bold
                text-slate-700
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-700
                hover:shadow-md
              "
            >
              <Package
                size={14}
                className="text-slate-400 transition group-hover:text-blue-600"
              />

              <span>Open Inventory</span>

              <ExternalLink
                size={12}
                className="
                  text-slate-300
                  transition
                  group-hover:text-blue-500
                "
              />
            </Link>

            {/* Collapse */}

            <button
              type="button"
              onClick={() =>
                setIsExpanded((current) => !current)
              }
              aria-label={
                isExpanded
                  ? "Collapse inventory health"
                  : "Expand inventory health"
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-400
                shadow-sm
                transition-all
                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-700
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
            </button>
          </div>
        </div>
      </div>

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
              TABLE HEADER
          ================================================== */}

          {visibleProducts.length > 0 && (
            <div
              className="
                hidden
                grid-cols-[minmax(0,1fr)_110px_120px]
                items-center
                gap-4
                border-b
                border-slate-100
                bg-slate-50/70
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
                Product
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
                Stock
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
          )}

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {visibleProducts.length === 0 ? (
            <div
              className="
                flex
                min-h-[210px]
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
                  border-emerald-100
                  bg-emerald-50
                  text-emerald-600
                "
              >
                <Boxes size={24} />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-black
                  text-slate-900
                "
              >
                Inventory is healthy
              </p>

              <p
                className="
                  mt-1
                  max-w-sm
                  text-xs
                  leading-5
                  text-slate-500
                "
              >
                No products currently require
                replenishment or attention.
              </p>

              <Link
                href="/inventory"
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                "
              >
                Open Inventory
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            /* =================================================
               PRODUCT LIST
            ================================================== */

            <div className="divide-y divide-slate-100">
              {visibleProducts.map(
                (product: any, index: number) => {
                  const quantity = Number(
                    product.stock_quantity ??
                      product.quantity ??
                      product.stock ??
                      0
                  );

                  const productName =
                    product.name ||
                    product.product_name ||
                    `Product ${index + 1}`;

                  const sku =
                    product.sku ||
                    product.product_code ||
                    "—";

                  const productId =
                    product.id ??
                    product.product_id;

                  /*
                   * Every alert takes the user to the
                   * inventory module. We intentionally do
                   * not invent a product-detail route.
                   */
                  return (
                    <Link
                      key={
                        productId ??
                        `${productName}-${index}`
                      }
                      href="/inventory"
                      className="
                        group
                        block
                        px-5
                        py-3.5
                        transition-all
                        duration-200
                        hover:bg-blue-50/40
                        sm:px-6
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          md:grid
                          md:grid-cols-[minmax(0,1fr)_110px_120px]
                          md:gap-4
                        "
                      >
                        {/* PRODUCT */}

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                          "
                        >
                          {/* Status icon */}

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-red-100
                              bg-red-50
                              text-red-500
                              transition
                              group-hover:border-red-200
                              group-hover:bg-red-100
                            "
                          >
                            <Package size={16} />
                          </div>

                          {/* Product information */}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p
                                className="
                                  truncate
                                  text-xs
                                  font-bold
                                  text-slate-800
                                  transition
                                  group-hover:text-blue-700
                                "
                              >
                                {productName}
                              </p>

                              <span
                                className="
                                  hidden
                                  shrink-0
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
                                Critical
                              </span>
                            </div>

                            <p
                              className="
                                mt-1
                                truncate
                                text-[9px]
                                font-medium
                                text-slate-400
                              "
                            >
                              SKU: {sku}
                            </p>
                          </div>

                          {/* Mobile arrow */}

                          <ArrowRight
                            size={14}
                            className="
                              shrink-0
                              text-slate-300
                              transition-all
                              group-hover:translate-x-0.5
                              group-hover:text-blue-500
                              md:hidden
                            "
                          />
                        </div>

                        {/* STOCK */}

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
                            {quantity.toLocaleString(
                              "en-NG"
                            )}
                          </p>

                          <p
                            className="
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            In stock
                          </p>
                        </div>

                        {/* STATUS */}

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
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              border-red-100
                              bg-red-50
                              px-2.5
                              py-1
                              text-[9px]
                              font-black
                              uppercase
                              tracking-wider
                              text-red-600
                            "
                          >
                            <span
                              className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-red-500
                              "
                            />

                            Critical
                          </span>

                          <ArrowRight
                            size={13}
                            className="
                              text-slate-300
                              transition-all
                              group-hover:translate-x-0.5
                              group-hover:text-blue-500
                            "
                          />
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================== */}

          {products.length > 0 && (
            <div
              className="
                flex
                flex-col
                gap-3
                border-t
                border-slate-100
                bg-slate-50/40
                px-5
                py-3.5
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-6
              "
            >
              <p
                className="
                  text-[10px]
                  text-slate-400
                "
              >
                Showing{" "}
                <span className="font-bold text-slate-600">
                  {Math.min(products.length, 6)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-600">
                  {products.length}
                </span>{" "}
                inventory alerts
              </p>

              <Link
                href="/inventory"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-blue-100
                  bg-blue-50
                  px-3.5
                  py-2
                  text-[10px]
                  font-black
                  text-blue-600
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-blue-200
                  hover:bg-blue-100
                  hover:text-blue-700
                "
              >
                View all inventory alerts

                <ArrowRight
                  size={13}
                  className="
                    transition
                    group-hover:translate-x-0.5
                  "
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}