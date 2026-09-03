"use client";

import {
  Plus,
  Trash2,
  Package,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  cost_price: number;
}

interface ProcurementItem {
  product: string;
  quantity: number;
  unit_price: number;
}

interface ProcurementItemsProps {
  products: Product[];
  items: ProcurementItem[];

  addItem: () => void;

  removeItem: (
    index: number
  ) => void;

  updateItem: (
    index: number,
    field: keyof ProcurementItem,
    value: any
  ) => void;
}

export default function ProcurementItems({
  products,
  items,
  addItem,
  removeItem,
  updateItem,
}: ProcurementItemsProps) {

  return (

    <div
      className="
        mt-10
        overflow-hidden
        rounded-[20px]
        border
        border-slate-200
        bg-white
        shadow-[0_6px_20px_rgba(15,23,42,.035)]
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
              bg-blue-50
              text-blue-600
            "
          >
            <Package size={20} />
          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Procurement Items
            </h2>

            <p className="text-sm text-slate-500">
              Add products to this purchase order.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={addItem}
          className="
            flex
            items-center
            gap-2

            rounded-xl

            bg-indigo-600

            px-5
            py-3

            font-medium

            text-white

            transition

            hover:bg-indigo-700
          "
        >
          <Plus size={18} />

          Add Item

        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>

            <tr className="border-b bg-slate-50">

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Product
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold">
                Quantity
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold">
                Unit Cost
              </th>

              <th className="px-4 py-4 text-right text-sm font-semibold">
                Line Total
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr
                key={index}
                className="border-b last:border-none"
              >

                {/* Product */}

                <td className="px-6 py-4">

                  <select
                    value={item.product}
                    onChange={(e) => {

                      updateItem(
                        index,
                        "product",
                        e.target.value
                      );

                      const selected =
                        products.find(

                          (p) =>

                            p.id ===
                            Number(e.target.value)

                        );

                      if (selected) {

                        setTimeout(() => {

                          updateItem(
                            index,
                            "unit_price",
                            Number(
                              selected.cost_price
                            )
                          );

                        }, 0);

                      }

                    }}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      px-4
                      py-3
                    "
                  >

                    <option value="">
                      Select Product
                    </option>

                    {products.map((product) => (

                      <option
                        key={product.id}
                        value={product.id}
                      >
                        {product.name}
                      </option>

                    ))}

                  </select>

                </td>

                {/* Quantity */}

                <td className="px-4 py-4">

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="
                      w-24
                      rounded-xl
                      border
                      border-slate-300
                      px-3
                      py-3
                      text-center
                    "
                  />

                </td>

                {/* Unit Price */}

                <td className="px-4 py-4">

                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "unit_price",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="
                      w-36
                      rounded-xl
                      border
                      border-slate-300
                      px-3
                      py-3
                    "
                  />

                </td>

                {/* Line Total */}

                <td
                  className="
                    px-4
                    py-4
                    text-right
                    font-bold
                    text-slate-900
                  "
                >
                  ₦
                  {(
                    Number(item.quantity) *
                    Number(item.unit_price)
                  ).toLocaleString()}
                </td>

                {/* Remove */}

                <td className="px-4 py-4 text-center">

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(index)
                    }
                    className="
                      rounded-xl
                      bg-red-100
                      p-3
                      text-red-600
                      transition
                      hover:bg-red-600
                      hover:text-white
                    "
                  >
                    <Trash2 size={18} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}
