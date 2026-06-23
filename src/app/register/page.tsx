"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { User, Mail, Lock } from "lucide-react";

import { registerUser } from "@/services/authService";

export default function RegisterPage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");

    if (
      password !== confirmPassword
    ) {

      setError(
        "Passwords do not match"
      );

      return;
    }

    try {

      const response =
        await registerUser(
          username,
          email,
          password
        );

      setMessage(
        response.message
      );

      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (error: any) {

      setError(
        error.response?.data?.error ||
        "Registration failed"
      );

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-4 text-gray-400"
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3 pl-10"
              required
            />

          </div>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-4 text-gray-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3 pl-10"
              required
            />

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-4 text-gray-400"
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
              className="w-full border rounded-xl p-3 pl-10"
              required
            />

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-4 text-gray-400"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3 pl-10"
              required
            />

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?

          <a
            href="/login"
            className="text-blue-600 ml-1"
          >
            Login
          </a>
        </p>

      </div>

    </div>
  );
}