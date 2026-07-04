"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import ProductTable from "@/components/inventory/ProductTable";

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

  const [loading, setLoading] =
    useState(true);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [isEditing, setIsEditing] =
    useState(false); 

  const [formData, setFormData] =
    useState({
      sku: "",
      name: "",
      cost_price: "",
      retail_price: "",
      wholesale_price: "",
      stock_quantity: 0,
    });

  useEffect(() => {
    loadProducts();
    loadMovements();
  }, []);

  const loadProducts = async () => {

    try {

      const response =
        await api.get("/products/");

      setProducts(response.data);

    } catch (error: any) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };
  
  const loadMovements = async () => {

  try {

    const response =
      await api.get(
        "/stock-movements/"
      );

    console.log(response.data);

    setMovements(response.data);

  } catch (error: any) {

    console.error(error);

  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createProduct = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {
      
      console.log(formData);
      await api.post(
        "/products/",
        {
          ...formData,
          stock_quantity: Number(
            formData.stock_quantity
          ),
        }
      );

      console.log(
        "product created Successfully"
      );

      toast.success(
        "Product Added Successfully"
      );

      setFormData({
        sku: "",
        name: "",
        cost_price: "",
        retail_price: "",
        wholesale_price: "",
        stock_quantity: 0,
      });

      await loadProducts();

    } catch (error: any) {

      console.error(error);

      console.log(
        error.response?.data
      );

      alert(
        JSON.stringify(
          error.response?.data
        )
      );
    }
  };

  const updateProduct = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  if (editingId === null) return;

  try {

    await api.put(
      `/products/${editingId}/`,
      {
        ...formData,
        stock_quantity: Number(
          formData.stock_quantity
        ),
      }
    );

    toast.success(
      "Product Updated Successfully"
    );

    setEditingId(null);

    setIsEditing(false);

    setFormData({
      sku: "",
      name: "",
      cost_price: "",
      retail_price: "",
      wholesale_price: "",
      stock_quantity: 0,
    });

    loadProducts();

  } catch (error: any) {

    console.error(error);

    toast.error(
      "Failed to update product"
    );
  }
};
  
  const editProduct = (
  product: Product
) => {

  setEditingId(product.id);

  setIsEditing(true);

  setFormData({
    sku: product.sku,
    name: product.name,
    cost_price: product.cost_price,
    retail_price: product.retail_price,
    wholesale_price:
      product.wholesale_price || "",
    stock_quantity:
      product.stock_quantity,
  });
};

const restockProduct = async (
  product: Product
) => {

  const quantity = Number(
    prompt(
      `How many units of ${product.name} do you want to add?`
    )
  );

  if (
    !quantity ||
    quantity <= 0
  ) {
    return;
  }

  try {

    await api.post(
      `/products/${product.id}/restock/`,
      {
        quantity,
      }
    );

    toast.success(
      `${quantity} units added successfully`
    );

    loadProducts();
    loadMovements();

  }catch (error: any) {

    console.error(error);

    console.log(
      error.response?.data
    );

    alert(
      JSON.stringify(
        error.response?.data
      )
    );
  }
};

  const deleteProduct = async (
    id: number
  ) => {

    const confirmed = confirm(
      "Delete this product?"
    );

    if (!confirmed) return;

    try {

      await api.delete(
        `/products/${id}/`
      );
      
      toast.success(
        "Product deleted successfully"
      );

      loadProducts();

    } catch (error: any) {

      console.error(error);

      toast.error(
        "Failed to delete product"
      );
    }
  };

  const totalStock = products.reduce(
    (sum, product) =>
      sum + product.stock_quantity,
    0
  );

  if (loading) {

    return (
      <div className="p-6">
        Loading Inventory...
      </div>
    );
  }

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Inventory
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="bg-white p-4 rounded shadow">

          <p className="text-gray-500">
            Products
          </p>

          <h2 className="text-3xl font-bold">
            {products.length}
          </h2>

        </div>

        <div className="bg-white p-4 rounded shadow">

          <p className="text-gray-500">
            Total Stock
          </p>

          <h2 className="text-3xl font-bold">
            {totalStock}
          </h2>

        </div>

        <div className="bg-white p-4 rounded shadow">

          <p className="text-gray-500">
            Low Stock Items
          </p>

          <h2 className="text-3xl font-bold text-red-600">
            {
              products.filter(
                p => p.stock_quantity < 10
              ).length
            }
          </h2>

        </div>

      </div>

      <div className="bg-white p-6 rounded shadow mb-8">

        <h2 className="text-xl font-semibold mb-4">
          {isEditing
            ? "Edit Product"
            : "Add Product"}
        </h2>    

        <form
          onSubmit={
            isEditing
              ? updateProduct
              : createProduct
          }
          className="grid gap-4 md:grid-cols-2"
        >

          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="number"
            name="cost_price"
            placeholder="Cost Price"
            value={formData.cost_price}
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />

          <input
            type="number"
            name="retail_price"
            placeholder="Retail Price"
            value={formData.retail_price}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="number"
            name="wholesale_price"
            placeholder="Wholesale Price"
            value={formData.wholesale_price}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="number"
            name="stock_quantity"
            placeholder="Stock Quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            {isEditing
              ? "Update Product"
              : "Add Product"}
          </button>
          
        {isEditing && (

          <button
            type="button"
            onClick={() => {

              setIsEditing(false);

              setEditingId(null);

              setFormData({
                sku: "",
                name: "",
                cost_price: "",
                retail_price: "",
                wholesale_price: "",
                stock_quantity: 0,
              });

            }}
            className="bg-gray-500 text-white px-6 py-3 rounded"
         >
            Cancel
         </button>

       )}

        </form>

      </div>

      <ProductTable
        products={products}
        onEdit={editProduct}
        onDelete={deleteProduct}
        onRestock={restockProduct}
      />

      <div className="bg-white rounded shadow mt-8 overflow-hidden">

        <div className="p-4 border-b">

          <h2 className="text-xl font-semibold">
            Stock Movement History
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Type
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
                className="border-b"
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
                    className={`px-3 py-1 rounded text-white ${
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

                <td className="p-4 font-bold">
                  {movement.quantity}
                </td>

                <td className="p-4">
                  {movement.user_name}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


