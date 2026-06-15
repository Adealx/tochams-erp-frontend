"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginUser } from "@/services/authService";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const data = await loginUser(
        username,
        password
      );

      localStorage.setItem(
        "access",
        data.access
      );

      localStorage.setItem(
        "refresh",
        data.refresh
      );

      router.push("/dashboard");

    } catch {

      setError(
        "Invalid username or password"
      );

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          TOCHAMS ARP
        </h1>

        {error && (

          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {error}
          </div>

        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

      </form>

    </div>
  );
}