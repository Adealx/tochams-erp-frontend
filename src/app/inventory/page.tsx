"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CsvImport from "@/components/inventory/CsvImport";

import {
  downloadTemplate,
} from "@/services/productService";

import RoleGuard from "@/components/RoleGuard";
import ProductForm from "@/components/inventory/ProductForm";
import ProductTable from "@/components/inventory/ProductTable";
import AppShell from "@/components/layout/AppShell";

import {
  Product,
} from "@/types/product";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restockProduct,
} from "@/services/productService";

import api from "@/services/api";

interface StockMovement {

  id: number;

  product_name: string;

  quantity: number;

  movement_type: string;

  user_name: string;

  created_at: string;

}

export default function InventoryPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [movements, setMovements] =
    useState<StockMovement[]>([]);

  const [showImport, setShowImport] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

    useEffect(() => {

      fetchProducts();

      fetchMovements();

    }, []);

    const fetchProducts = async () => {

    setLoading(true);

    try {

      const data = await getProducts();

      setProducts(data);

    } catch (error) {

      console.error(error);

      toast.error(
        "Unable to load products."
      );

    } finally {

      setLoading(false);

    }

  };

  const fetchMovements = async () => {

    try {

      const response =
        await api.get(
          "/stock-movements/"
        );

      setMovements(response.data);

    } catch (error) {

      console.error(error);

    }

  };

    const totalStock =

    products.reduce(

      (sum, product) =>

        sum + product.stock_quantity,

      0

    );

  const handleSubmit = async (data: Partial<Product>) => {

    try {

      setLoading(true);

      if (editingProduct) {

        await updateProduct(
          editingProduct.id,
          data
        );

        toast.success(
          "Product updated successfully."
        );

      } else {

        await createProduct(data);

        toast.success(
          "Product created successfully."
        );

      }

      setEditingProduct(null);

      await fetchProducts();

    } catch (error) {

      console.error(error);

      toast.error(
        "Unable to save product."
      );

    } finally {

      setLoading(false);

    }

  };

  const handleDownloadTemplate =
  async () => {

    try {

      const blob =
        await downloadTemplate();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "product_template.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

      alert(
        "Unable to download template."
      );

    }

}; 

    const handleEdit = (
    product: Product
  ) => {

    setEditingProduct(product);

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };

    const handleDelete = async (
    id: number
  ) => {

    if (
      !confirm(
        "Delete this product?"
      )
    ) {
      return;
    }

    try {

      await deleteProduct(id);

      toast.success(
        "Product deleted."
      );

      await fetchProducts();

    } catch (error) {

      console.error(error);

      toast.error(
        "Unable to delete product."
      );

    }

  };

    const handleRestock = async (
    product: Product
  ) => {

    const quantity = Number(

      prompt(

        `How many units of ${product.name} would you like to add?`

      )

    );

    if (
      Number.isNaN(quantity) ||
      quantity <= 0
    ) {
      return;
    }

    try {

      await restockProduct(
        product.id,
        quantity
      );

      toast.success(
        "Stock updated."
      );

      await Promise.all([

        fetchProducts(),

        fetchMovements(),

      ]);

    } catch (error) {

      console.error(error);

      toast.error(
        "Unable to restock product."
      );

    }

  };

    const cancelEdit = () => {

    setEditingProduct(null);

  };

  if (loading && products.length === 0) {
  return (
    <AppShell
      title="Inventory"
      subtitle="Manage products, pricing and warehouse stock."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Inventory",
        },
      ]}
    >
      <div>Loading Inventory...</div>
    </AppShell>
  );
}

  return (
  <AppShell
    title="Inventory"
    subtitle="Manage products, pricing, stock levels and warehouse movements."
    breadcrumbs={[
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Inventory",
      },
    ]}
  >
    <div className="space-y-8">

    <div className="flex flex-wrap gap-3 justify-end">

    <button
      id="download-template"
      onClick={handleDownloadTemplate}
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
    >
      📥 Download Template
    </button>

    <button
      id="upload-csv"
      onClick={() =>
        setShowImport(true)
      }
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    >
      📤 Upload CSV
    </button>

  </div>

      {/* ==========================
          DASHBOARD
      ========================== */}

      <div className="grid gap-6 md:grid-cols-3">

        <div 
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            "
          >

          <p className="text-gray-500">

            Total Products

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {products.length}

          </h2>

        </div>

        <div 
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            "
          >

          <p className="text-gray-500">

            Total Stock

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {totalStock}

          </h2>

        </div>

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            "
          >

          <p className="text-gray-500">

            Low Stock

          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">

            {

              products.filter(

                p => p.stock_quantity <= p.reorder_level

              ).length

            }

          </h2>

        </div>

      </div>

      {/* ==========================
          PRODUCT MASTER
      ========================== */}

      <RoleGuard
        roles={[
          "admin",
          "manager",
          "warehouse",
        ]}
      >

        <div 
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="border-b p-6">

            <h2 className="text-xl font-semibold">

              {

                editingProduct

                  ? "Edit Product"

                  : "New Product"

              }

            </h2>

          </div>

          <div className="p-6">

            <ProductForm

              initialData={

                editingProduct || {}

              }

              loading={loading}

              submitText={

                editingProduct

                  ? "Update Product"

                  : "Create Product"

              }

              onSubmit={handleSubmit}

            />

            {

              editingProduct && (

                <div className="mt-4">

                  <button

                    onClick={cancelEdit}

                    className="px-6 py-3 rounded bg-gray-500 text-white"

                  >

                    Cancel Editing

                  </button>

                </div>

              )

            }

          </div>

        </div>

      </RoleGuard>

      {/* ==========================
          PRODUCTS
      ========================== */}

      <div>

        <h2 className="text-2xl font-semibold mb-4">

          Product List

        </h2>  

       <ProductTable
         products={products}
         onEdit={handleEdit}
         onDelete={handleDelete}
         onRestock={handleRestock}
      />

      </div>

      {/* ==========================
          STOCK MOVEMENT HISTORY
      ========================== */}

      <div 
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          overflow-hidden
        "
      >

        <div className="border-b p-6">

          <h2 className="text-xl font-semibold">

            Stock Movement History

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-left">
                  Movement
                </th>

                <th className="p-4 text-left">
                  Quantity
                </th>

                <th className="p-4 text-left">
                  User
                </th>

              </tr>

            </thead>

            <tbody>

              {movements.map((movement) => (

                <tr
                  key={movement.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">

                    {new Date(
                      movement.created_at
                    ).toLocaleString()}

                  </td>

                  <td className="p-4">

                    {movement.product_name}

                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        movement.movement_type === "IN"
                          ? "bg-green-600"
                          : movement.movement_type === "OUT"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }`}
                    >

                      {movement.movement_type}

                    </span>

                  </td>

                  <td className="p-4 font-semibold">

                    {movement.quantity}

                  </td>

                  <td className="p-4">

                    {movement.user_name}

                  </td>

                </tr>

              ))}

              {movements.length === 0 && (

                <tr>

                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500"
                  >

                    No stock movement history available.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>
    
          {/* ==========================
          CSV IMPORT MODAL
      ========================== */}

      {showImport && (
        <CsvImport
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            setShowImport(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  </AppShell>
);
}