"use client";

interface Props {
  products: number;
  stock: number;
  lowStock: number;
  storeValue: number;
}

export default function InventoryOverview({
  products,
  stock,
  lowStock,
  storeValue,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-4 mb-8">

      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <p className="text-slate-500">
          Products
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {products}
        </h2>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <p className="text-slate-500">
          Total Stock
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {stock}
        </h2>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <p className="text-slate-500">
          Store Value
        </p>

        <h2 className="mt-2 text-3xl font-bold text-blue-600">
          ₦{storeValue.toLocaleString()}
        </h2>
      </div>

      <div className="rounded-2xl bg-white border border-red-200 p-6 shadow-sm">
        <p className="text-red-500">
          Low Stock
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-600">
          {lowStock}
        </h2>
      </div>

    </div>
  );
}