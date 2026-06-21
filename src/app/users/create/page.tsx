"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function CreateUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "sales",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    setLoading(true);

    try {
      const response = await api.post(
        "/accounts/users/create/",
        formData
      );

      console.log("Success:", response.data);

      toast.success("User created successfully");

      router.push("/users");

    } catch (error: any) {

      console.error("Create User Error:", error);

      console.log("Response:", error.response?.data);

      alert(
        JSON.stringify(
          error.response?.data || error.message
        )
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Create User
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow"
      >

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="admin">
            Admin
          </option>

          <option value="manager">
            Manager
          </option>

          <option value="sales_head">
            Sales Head
          </option>

          <option value="accountant">
            Accountant
          </option>

          <option value="sales">
            Sales Head
          </option>

        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          {loading
            ? "Creating..."
            : "Create User"}
        </button>

      </form>

    </div>
  );
}