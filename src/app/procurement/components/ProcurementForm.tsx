"use client";

import { useEffect, useState } from "react";

import api from "@/services/api";

import { getVendors } from "@/services/vendorService";
import {
  getProcurements,
  createProcurement,
} from "@/services/procurementService";

import ProcurementItems from "./ProcurementItems";

import GrandTotal from "./GrandTotal";

import ProcurementTable from "./ProcurementTable";

/* ============================
   Interfaces
============================ */

interface Vendor {
  id: number;
  vendor_code: string;
  company_name: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  wholesale_price: number;
  retail_price: number;
}

interface ProcurementItem {
  product: string;
  quantity: number;
  unit_price: number;
}

interface Procurement {
  id: number;
  po_number: string;
  vendor_name: string;
  status: string;
  order_date: string;
  total_amount: number;
}

export default function ProcurementForm() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [procurements, setProcurements] = useState<Procurement[]>([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vendor: "",
    expected_delivery: "",
    status: "Draft",
    notes: "",
  });

  const [items, setItems] = useState<ProcurementItem[]>([
    {
      product: "",
      quantity: 1,
      unit_price: 0,
    },
  ]);

  useEffect(() => {
    loadVendors();
    loadProducts();
    loadProcurements();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProcurements = async () => {
    try {
      const data = await getProcurements();
      setProcurements(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addItem = () => {
  setItems((prev) => [
    ...prev,
    {
      product: "",
      quantity: 1,
      unit_price: 0,
    },
  ]);
};

   const removeItem = (index: number) => {
     setItems((prev) => prev.filter((_, i) => i !== index));
   };

  const updateItem = (
  index: number,
  field: keyof ProcurementItem,
  value: any
) => {
  setItems((prevItems) => {
    const updated = [...prevItems];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    return updated;
  });
};

  const grandTotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.unit_price || 0),
    0
  );

  const handleSubmit = async () => {
  try {
    setLoading(true);

    console.log("========== PROCUREMENT PAYLOAD ==========");

    console.log({
      vendor: Number(formData.vendor),
      expected_delivery: formData.expected_delivery,
      status: formData.status,
      notes: formData.notes,
      items,
    });

    console.log("========================================");

    await createProcurement({
      vendor: Number(formData.vendor),
      expected_delivery: formData.expected_delivery,
      status: formData.status,
      notes: formData.notes,
      items: items.map((item) => ({
        ...item,
        product: Number(item.product),
    })),
 });


      alert("Procurement Created Successfully");

      setFormData({
        vendor: "",
        expected_delivery: "",
        status: "Draft",
        notes: "",
      });

      setItems([
        {
          product: "",
          quantity: 1,
          unit_price: 0,
        },
      ]);

      loadProcurements();
    } catch (err: any) {
      console.error("Backend Error:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
        alert(JSON.stringify(err.response.data, null, 2));
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
    console.log("Products passed to ProcurementItems:", products);
    console.log("Current Items State:", items);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold">
        Procurement
      </h1>

      <p className="text-gray-500 mt-2 mb-8">
        Create and manage procurement orders
      </p>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Vendor
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={formData.vendor}
            onChange={(e) =>
              setFormData({
                ...formData,
                vendor: e.target.value,
              })
            }
          >
            <option value="">
              Select Vendor
            </option>

            {vendors.map((vendor) => (
              <option
                key={vendor.id}
                value={vendor.id}
              >
                {vendor.company_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Expected Delivery
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
            value={formData.expected_delivery}
            onChange={(e) =>
              setFormData({
                ...formData,
                expected_delivery:
                  e.target.value,
              })
            }
          />
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <div>
          <label className="block mb-2 font-medium">
            Status
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          >
            <option>Draft</option>
            <option>Submitted</option>
            <option>Approved</option>
            <option>Ordered</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Notes
          </label>

          <textarea
            rows={3}
            className="w-full border rounded-lg p-3"
            value={formData.notes}
            onChange={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value,
              })
            }
          />
        </div>

      </div>
        
      <ProcurementItems
        products={products}
        items={items}
        addItem={addItem}
        removeItem={removeItem}
        updateItem={updateItem}
      />

      <GrandTotal total={grandTotal} />

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
        >
          {loading
            ? "Saving..."
            : "Save Procurement"}
        </button>
      </div>

      <ProcurementTable
        procurements={procurements}
      />

    </div>
  );
}