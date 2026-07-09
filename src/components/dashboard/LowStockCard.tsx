"use client";

import {
  AlertTriangle,
  Package,
  CheckCircle2,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  stock_quantity: number;
}

interface LowStockCardProps {
  products: Product[];
}

export default function LowStockCard({
  products,
}: LowStockCardProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
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
          border-slate-100
          px-6
          py-5
        "
      >
        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-600
            "
          >
            <AlertTriangle size={20} />
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">

              Low Stock Alerts

            </h2>

            <p className="text-sm text-slate-500">

              Products requiring replenishment

            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="text-sm text-slate-500">

            Total Alerts

          </p>

          <h3 className="text-2xl font-bold text-red-600">

            {products.length}

          </h3>

        </div>

      </div>

      {/* ================= Body ================= */}

      <div className="p-6">

        {products.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-10
            "
          >

            <CheckCircle2
              size={54}
              className="mb-4 text-emerald-500"
            />

            <h3 className="text-lg font-semibold text-slate-800">

              Inventory Healthy

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              No products are below the minimum stock level.

            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {products.map((product) => (

              <div
                key={product.id}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                  transition
                  hover:border-red-300
                  hover:bg-red-50
                "
              >

                {/* Left */}

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                    "
                  >

                    <Package
                      size={18}
                      className="text-slate-600"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">

                      {product.name}

                    </h3>

                    <p className="text-sm text-slate-500">

                      Inventory Item

                    </p>

                  </div>

                </div>

                {/* Right */}

                <span
                  className="
                    rounded-full
                    bg-red-100
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-red-700
                  "
                >

                  {product.stock_quantity} Left

                </span>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================= Footer ================= */}

      {products.length > 0 && (

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            px-6
            py-4
          "
        >

          <span className="text-sm text-slate-500">

            Monitor inventory to avoid stock-outs.

          </span>

          <span className="font-semibold text-red-600">

            Action Required

          </span>

        </div>

      )}

    </div>
  );
}