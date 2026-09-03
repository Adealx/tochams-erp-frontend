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
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => void | Promise<void>;
  loading?: boolean;
  submitText?: string;
}

interface ProductFormData {
  sku: string;
  name: string;
  category: number;
  brand: number;
  unit: number;
  supplier: string;
  barcode: string;
  description: string;
  cost_price: number | "";
  wholesale_price: number | "";
  retail_price: number | "";
  stock_quantity: number;
  reorder_level: number;
  status: "ACTIVE" | "INACTIVE";
}

export default function ProductForm({
  initialData = {},
  onSubmit,
  loading = false,
  submitText = "Save Product",
}: ProductFormProps) {

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [formData, setFormData] = useState<Partial<Product>>({
    sku: "",
    name: "",
    category: 0,
    brand: 0,
    unit: 0,
    supplier: "",
    barcode: "",
    description: "",
    cost_price: 0,
    wholesale_price: 0,
    retail_price: 0,
    stock_quantity: 0,
    reorder_level: 0,
    status: "ACTIVE",
  });

  /*
  ===========================
  Load lookup tables
  ===========================
  */

  useEffect(() => {
    loadLookups();
  }, []);

  /*
  ===========================
  Populate form when editing
  ===========================
  */

  useEffect(() => {
    setFormData({
      sku: initialData.sku ?? "",
      name: initialData.name ?? "",
      category: Number(initialData.category ?? 0),
      brand: Number(initialData.brand ?? 0),
      unit: Number(initialData.unit ?? 0),
      supplier: initialData.supplier ?? "",
      barcode: initialData.barcode ?? "",
      description: initialData.description ?? "",

      cost_price: Number(initialData.cost_price ?? 0),

      wholesale_price: Number(initialData.wholesale_price ?? 0),

      retail_price: Number(initialData.retail_price ?? 0),
      
      stock_quantity: Number(initialData.stock_quantity ?? 0),
      reorder_level: Number(initialData.reorder_level ?? 0),
      status:
        initialData.status === "INACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
    });
  }, [initialData]);

  /*
  ===========================
  Load Categories / Brands / Units
  ===========================
  */

  const loadLookups = async () => {
    try {
      const [
        categoriesData,
        brandsData,
        unitsData,
      ] = await Promise.all([
        getCategories(),
        getBrands(),
        getUnits(),
      ]);

      setCategories(categoriesData);
      setBrands(brandsData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Lookup Error:", error);
    }
  };

  /*
  ===========================
  Handle Inputs
  ===========================
  */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {

    const { name, value } = e.target;

    const numericFields = [
      "category",
      "brand",
      "unit",
      "cost_price",
      "wholesale_price",
      "retail_price",
      "stock_quantity",
      "reorder_level",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  /*
  ===========================
  Submit Form
  ===========================
  */

  const submit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    onSubmit(formData);
  };

  return (
  <form
    onSubmit={submit}
    className="erp-form space-y-6"
  >
    {/* ===========================================
        PRODUCT INFORMATION
    =========================================== */}

    <div className="erp-form-section">

      <h2 className="text-xl font-semibold border-b pb-3 mb-6">
        📦 Product Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium mb-2">
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
          <label className="block text-sm font-medium mb-2">
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
          <label className="block text-sm font-medium mb-2">
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

          <label className="block text-sm font-medium mb-2">
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

    {/* ===========================================
        CLASSIFICATION
    =========================================== */}

    <div className="erp-form-section">

      <h2 className="text-xl font-semibold border-b pb-3 mb-6">
        🏷 Classification
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Category */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >

            <option value={0}>
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

          <label className="block text-sm font-medium mb-2">
            Brand
          </label>

          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >

            <option value={0}>
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

          <label className="block text-sm font-medium mb-2">
            Unit
          </label>

          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >

            <option value={0}>
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

          <label className="block text-sm font-medium mb-2">
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

          {/* ===========================================
        PRICING
    =========================================== */}

    <div className="erp-form-section">

      <h2 className="text-xl font-semibold border-b pb-3 mb-6">
        💰 Pricing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <label className="block text-sm font-medium mb-2">
            Cost Price
          </label>

          <input
            type="number"
            name="cost_price"
            value={formData.cost_price}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            min={0}
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Wholesale Price
          </label>

          <input
            type="number"
            name="wholesale_price"
            value={formData.wholesale_price}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            min={0}
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Retail Price
          </label>

          <input
            type="number"
            name="retail_price"
            value={formData.retail_price}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            min={0}
            step="0.01"
            required
          />
        </div>

      </div>

    </div>

    {/* ===========================================
        INVENTORY
    =========================================== */}

    <div className="erp-form-section">

      <h2 className="text-xl font-semibold border-b pb-3 mb-6">
        📦 Inventory
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>

          <label className="block text-sm font-medium mb-2">
            Opening Stock
          </label>

          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            min={0}
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            Reorder Level
          </label>

          <input
            type="number"
            name="reorder_level"
            value={formData.reorder_level}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            min={0}
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
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

          {/* ===========================================
        ACTION BUTTONS
    =========================================== */}

    <div className="flex justify-end gap-4 pt-2">

      <button
        type="submit"
        disabled={loading}
        className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 shadow-[0_8px_18px_rgba(79,70,229,.22)]"
        }`}
      >
        {loading ? "Saving..." : submitText}
      </button>

    </div>

  </form>
);

}
