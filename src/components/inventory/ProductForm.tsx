"use client";

import { useEffect, useState } from "react";
import {
  Product,
  Category,
  Brand,
  Unit,
} from "@/types/product";

import {
  getCategories,
  getBrands,
  getUnits,
} from "@/services/productService";

interface ProductFormProps {
  initialData: Partial<Product>;

  onSubmit: (data: any) => void;

  loading?: boolean;

  submitText?: string;
}

export default function ProductForm({

  initialData,

  onSubmit,

  loading = false,

  submitText = "Save Product",

}: ProductFormProps) {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [units, setUnits] =
    useState<Unit[]>([]);

  const [formData, setFormData] = useState({

    sku: initialData.sku || "",

    name: initialData.name || "",

    category: initialData.category || "",

    brand: initialData.brand || "",

    unit: initialData.unit || "",

    supplier: initialData.supplier || "",

    barcode: initialData.barcode || "",

    description:
      initialData.description || "",

    cost_price:
      initialData.cost_price || "",

    wholesale_price:
      initialData.wholesale_price || "",

    retail_price:
      initialData.retail_price || "",

    stock_quantity:
      initialData.stock_quantity || 0,

    reorder_level:
      initialData.reorder_level || 0,

    status:
      initialData.status || "ACTIVE",

  });

  useEffect(() => {

    loadLookups();

  }, []);

  const loadLookups = async () => {

    try {

      const [

        categories,

        brands,

        units,

      ] = await Promise.all([

        getCategories(),

        getBrands(),

        getUnits(),

      ]);

      setCategories(categories);

      setBrands(brands);

      setUnits(units);

    } catch (error) {

      console.error(error);

    }

  };

  const handleChange = (

    e: React.ChangeEvent<

      HTMLInputElement |

      HTMLSelectElement |

      HTMLTextAreaElement

    >

  ) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const submit = (

    e: React.FormEvent

  ) => {

    e.preventDefault();

    onSubmit(formData);

  };

  return (

    <form
      onSubmit={submit}
      className="space-y-8"
    >

      {/* ==========================
          PRODUCT INFORMATION
      ========================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-6 border-b pb-3">

          📦 Product Information

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 text-sm font-medium">

              SKU

            </label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

          </div>

          <div>

            <label className="block mb-2 text-sm font-medium">

              Product Name

            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

          </div>

          <div>

            <label className="block mb-2 text-sm font-medium">

              Barcode

            </label>

            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 text-sm font-medium">

              Description

            </label>

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

        </div>

      </div>

            {/* ==========================
          CLASSIFICATION
      ========================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-6 border-b pb-3">

          🏷 Classification

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Category */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            >

              <option value="">
                Select Category
              </option>

              {categories.map((category) => (

                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>

              ))}

            </select>

          </div>

          {/* Brand */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Brand
            </label>

            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            >

              <option value="">
                Select Brand
              </option>

              {brands.map((brand) => (

                <option
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name}
                </option>

              ))}

            </select>

          </div>

          {/* Unit */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Unit
            </label>

            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            >

              <option value="">
                Select Unit
              </option>

              {units.map((unit) => (

                <option
                  key={unit.id}
                  value={unit.id}
                >
                  {unit.name}
                </option>

              ))}

            </select>

          </div>

          {/* Supplier */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Supplier
            </label>

            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Supplier Name"
            />

          </div>

        </div>

      </div>

            {/* ==========================
          PRICING
      ========================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-6 border-b pb-3">

          💰 Pricing

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>

            <label className="block mb-2 text-sm font-medium">

              Cost Price

            </label>

            <input
              type="number"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

          </div>

          <div>

            <label className="block mb-2 text-sm font-medium">

              Wholesale Price

            </label>

            <input
              type="number"
              name="wholesale_price"
              value={formData.wholesale_price}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

          </div>

          <div>

            <label className="block mb-2 text-sm font-medium">

              Retail Price

            </label>

            <input
              type="number"
              name="retail_price"
              value={formData.retail_price}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

          </div>

        </div>

      </div>

      {/* ==========================
          INVENTORY
      ========================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-6 border-b pb-3">

          📊 Inventory

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>

            <label className="block mb-2 text-sm font-medium">

              Opening Stock

            </label>

            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 text-sm font-medium">

              Reorder Level

            </label>

            <input
              type="number"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 text-sm font-medium">

              Status

            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >

              <option value="ACTIVE">

                Active

              </option>

              <option value="INACTIVE">

                Inactive

              </option>

            </select>

          </div>

        </div>

      </div>

      {/* ==========================
          ACTION BUTTONS
      ========================== */}

      <div className="flex justify-end gap-4">

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >

          {loading
            ? "Saving..."
            : submitText}

        </button>

      </div>

    </form>

  );

}