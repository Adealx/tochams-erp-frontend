"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/services/customerService";

export default function AddCustomer() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await createCustomer(formData);

      alert("Customer created successfully!");

      router.push("/customers");

    } catch (error) {
      console.error(error);
      alert("Failed to create customer");
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Add Customer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >

        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Save Customer
        </button>

      </form>

    </div>
  );
}