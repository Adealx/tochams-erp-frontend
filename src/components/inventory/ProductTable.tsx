"use client";

import DataTable, {
  Column,
} from "@/components/table/DataTable";

import RowActions from "@/components/table/RowActions";

import RoleGuard from "@/components/RoleGuard";

import { useAuth } from "@/context/AuthContext";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  supplier: string;
  stock_quantity: number;
  reorder_level: number;
  cost_price: string;
  retail_price: string;
  wholesale_price: string;
  stock_value: number;
  potential_sales_value: number;
  potential_profit: number;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onRestock: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onRestock,
}: ProductTableProps) {

  const { user } = useAuth();

  const canManageProducts =
    ["admin", "manager", "warehouse"].includes(
      user?.role || ""
    );

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
      key: "cost_price",
      title: "Cost Price",
      sortable: true,

      render: (product) => (
        <>₦{Number(product.cost_price).toLocaleString()}</>
      ),
    },

    {
      key: "retail_price",
      title: "Retail Price",
      sortable: true,

      render: (product) => (
        <>₦{Number(product.retail_price).toLocaleString()}</>
      ),
    },

    {
      key: "wholesale_price",
      title: "Wholesale Price",
      sortable: true,

      render: (product) => (
        <>₦{Number(product.wholesale_price).toLocaleString()}</>
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
      key: "stock_value",
      title: "Store Value",
      sortable: true,

      render: (product) => (
        <>₦{Number(product.stock_value).toLocaleString()}</>
      ),
    },

  ];

  if (canManageProducts) {

    columns.push({

      key: "id",

      title: "Actions",

      render: (product) => (

        <RoleGuard
    roles={[
        "admin",
        "manager",
        "warehouse",
    ]}
>
    <div className="flex gap-2">

        <button
            onClick={() => onEdit(product)}
            className="rounded bg-blue-600 px-3 py-1 text-white text-sm"
        >
            Edit
        </button>

        <button
            onClick={() => onRestock(product)}
            className="rounded bg-green-600 px-3 py-1 text-white text-sm"
        >
            Restock
        </button>

        <button
            onClick={() => onDelete(product.id)}
            className="rounded bg-red-600 px-3 py-1 text-white text-sm"
        >
            Delete
        </button>

    </div>
</RoleGuard>

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