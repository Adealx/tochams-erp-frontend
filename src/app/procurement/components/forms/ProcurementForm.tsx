"use client";

import { useEffect, useState } from "react";

import api from "@/services/api";

import { getVendors } from "@/services/vendorService";
import {
  getProcurements,
  getProcurement,
  createProcurement,
  updateProcurement,
  deleteProcurement,
  submitProcurement,
  approveProcurement,
  rejectProcurement,
} from "@/services/procurementService";

import ProcurementItems from "./ProcurementItems";

import GrandTotal from "../GrandTotal";

import ProcurementTable from "../tables/ProcurementTable";

import ProcurementViewModal from "../modals/ProcurementViewModal";

import DeleteProcurementModal from "../modals/DeleteProcurementModal";

import ProcurementInformation from "../ProcurementInformation";

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
  cost_price: number;
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

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedProcurement, setSelectedProcurement] =
    useState<any>(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);  

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

  const handleView = async (id: number) => {
  try {
    const data = await getProcurement(id);

    setSelectedProcurement(data);

    setViewOpen(true);
  } catch (error) {
    console.error(error);

    alert("Unable to load procurement.");
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
 
  const handleDeleteClick = (id: number) => {

  const procurement = procurements.find(
    (p) => p.id === id
  );

  if (!procurement) return;

  setSelectedProcurement(procurement);

  setDeleteOpen(true);
}; 

  const handleSubmitApproval = async (
  id: number
) => {
  try {
    await submitProcurement(id);

    alert("Submitted for approval.");

    loadProcurements();
  } catch (err: any) {
    alert(
      err.response?.data?.error ||
      "Unable to submit procurement."
    );
  }
};

const handleApprove = async (
  id: number
) => {
  try {
    await approveProcurement(id);

    alert("Procurement approved.");

    loadProcurements();
  } catch (err: any) {
    alert(
      err.response?.data?.error ||
      "Unable to approve procurement."
    );
  }
};

const handleReject = async (
  id: number
) => {
  const comment =
    prompt("Reason for rejection?") || "";

  try {
    await rejectProcurement(
      id,
      comment
    );

    alert("Procurement rejected.");

    loadProcurements();
  } catch (err: any) {
    alert(
      err.response?.data?.error ||
      "Unable to reject procurement."
    );
  }
};

  const confirmDelete = async () => {

  if (!selectedProcurement) return;

  try {

    await deleteProcurement(
      selectedProcurement.id
    );

    alert("Procurement Deleted");

    setDeleteOpen(false);

    setSelectedProcurement(null);

    loadProcurements();

  } catch (error) {

    console.error(error);

    alert("Unable to delete procurement.");

  }

};

  const handleEdit = async (id: number) => {
  const procurement = await getProcurement(id);

  setEditingId(procurement.id);

  setFormData({
    vendor: String(procurement.vendor),
    expected_delivery: procurement.expected_delivery,
    status: procurement.status,
    notes: procurement.notes || "",
  });

  setItems(
    procurement.items.map((item: any) => ({
      product: String(item.product),
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
    }))
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}; 

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

    const payload = {
      vendor: Number(formData.vendor),
      expected_delivery: formData.expected_delivery,
      status: formData.status,
      notes: formData.notes,
      items: items.map((item) => ({
        product: Number(item.product),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
      })),
    };

    if (editingId) {
      await updateProcurement(editingId, payload);
    } else {
      await createProcurement(payload);
    }


      alert(
        editingId
          ? "Procurement Updated Successfully"
          : "Procurement Created Successfully"
      );
       
      setEditingId(null);

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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

        <ProcurementInformation
          formData={formData}
          vendors={vendors}
          editing={editingId !== null}
          onChange={(field, value) =>
            setFormData((prev) => ({
              ...prev,
              [field]: value,
            }))
          }
        />
        
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
          className={`text-white px-8 py-3 rounded-lg ${
            editingId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Procurement"
            : "Save Procurement"}
        </button>
      </div>

      <ProcurementTable
          procurements={procurements}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onSubmit={handleSubmitApproval}
          onApprove={handleApprove}
          onReject={handleReject}
      />

      <ProcurementViewModal
        procurement={selectedProcurement}
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
      />

      <DeleteProcurementModal
        open={deleteOpen}
        poNumber={selectedProcurement?.po_number || ""}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedProcurement(null);
        }}
        onConfirm={confirmDelete}
      />

    </div>
  );
}