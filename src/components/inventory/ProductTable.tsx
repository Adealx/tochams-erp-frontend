"use client";

import DataTable, {
  Column,
} from "@/components/table/DataTable";

import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onRestock: (product: Product) => void | Promise<void>;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onRestock,
}: ProductTableProps) {

  const { user } = useAuth();

  const canManageProducts = [
    "admin",
    "manager",
    "warehouse",
  ].includes(user?.role || "");

  const columns: Column<Product>[] = [

    {
      key: "sku",
      title: "SKU",
      sortable: true,
    },

    {
      key: "name",
      title: "Product",
      sortable: true,
    },

    {
      key: "category_name",
      title: "Category",
      sortable: true,
      render: (product) =>
        product.category_name || "-",
    },

    {
      key: "brand_name",
      title: "Brand",
      sortable: true,
      render: (product) =>
        product.brand_name || "-",
    },

    {
      key: "unit_name",
      title: "Unit",
      sortable: true,
      render: (product) =>
        product.unit_name || "-",
    },

    {
      key: "supplier",
      title: "Supplier",
      sortable: true,
    },

    {
      key: "cost_price",
      title: "Cost Price",
      sortable: true,
      render: (product) => (
        <>₦{Number(product.cost_price).toLocaleString()}</>
      ),
    },

    {
      key: "wholesale_price",
      title: "Wholesale",
      sortable: true,
      render: (product) => (
        <>₦{Number(product.wholesale_price).toLocaleString()}</>
      ),
    },

    {
      key: "retail_price",
      title: "Retail",
      sortable: true,
      render: (product) => (
        <>₦{Number(product.retail_price).toLocaleString()}</>
      ),
    },

    {
      key: "stock_quantity",
      title: "Stock",
      sortable: true,
      render: (product) => (

        <span
          className={`font-semibold ${
            product.stock_quantity <= product.reorder_level
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {product.stock_quantity}
        </span>

      ),
    },

    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (product) => (

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
            product.status === "ACTIVE"
              ? "bg-green-600"
              : "bg-gray-500"
          }`}
        >
          {product.status}
        </span>

      ),
    },

    {
      key: "stock_value",
      title: "Stock Value",
      sortable: true,
      render: (product) => (
        <>₦{Number(product.stock_value).toLocaleString()}</>
      ),
    },

    {
      key: "potential_profit",
      title: "Potential Profit",
      sortable: true,
      render: (product) => (
        <>₦{Number(product.potential_profit).toLocaleString()}</>
      ),
    },

  ];

  if (canManageProducts) {

    columns.push({

      key: "id",

      title: "Actions",

      render: (product) => (

        <div className="flex gap-2">

          <button
            onClick={() => onEdit(product)}
            className="rounded bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm text-white"
          >
            Edit
          </button>

          <button
            onClick={() => onRestock(product)}
            className="rounded bg-green-600 hover:bg-green-700 px-3 py-1 text-sm text-white"
          >
            Restock
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="rounded bg-red-600 hover:bg-red-700 px-3 py-1 text-sm text-white"
          >
            Delete
          </button>

        </div>

      ),

    });

  }

  return (

    <DataTable<Product>
  columns={columns}
  data={products}
/>

  );

}