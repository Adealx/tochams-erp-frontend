"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";
import Link from "next/link";

interface LowStockItem {
  id: number;
  name: string;
  stock: number;
}

interface Props {
  products: LowStockItem[];
}

export default function LowStockCard({
  products,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 transition hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle
              size={20}
              className="text-red-600"
            />
          </div>

          <div className="text-left">

            <h2 className="font-semibold text-slate-900">
              Low Stock Alerts
            </h2>

            <p className="text-sm text-slate-500">
              Products requiring replenishment
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
            {products.length}
          </span>

          {expanded ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          )}

        </div>
      </button>

      {expanded && (

        <>

          <div className="max-h-[420px] overflow-y-auto divide-y">

            {products.map((product) => (

              <div
                key={product.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50"
              >

                <div className="flex items-center gap-3">

                  <Package
                    size={18}
                    className="text-slate-500"
                  />

                  <div>

                    <p className="text-sm font-semibold">
                      {product.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      Inventory Item
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                  {product.stock} Left
                </span>

              </div>

            ))}

          </div>

          <div className="border-t bg-slate-50 p-4">

            <Link
              href="/inventory?filter=low-stock"
              className="block text-center font-semibold text-blue-600 hover:underline"
            >
              View Full Inventory →
            </Link>

          </div>

        </>

      )}

    </div>
  );
}