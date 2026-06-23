"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Building2,
  BarChart3,
  ShieldCheck,
  Users,
  User,
  Lock,
} from "lucide-react";

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
      const data =
        await loginUser(
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

      router.push(
        "/dashboard"
      );
    } catch {
      setError(
        "Invalid username or password"
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Left Panel */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white p-12 flex-col justify-between">

        <div>

          <div className="flex items-center gap-4 mb-10">

            <div className="bg-white/20 p-4 rounded-2xl">
              <Building2 size={40} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                TOCHAMS ARP
              </h1>

              <p className="text-blue-100">
                Accounts Receivable Platform
              </p>
            </div>

          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Smarter Receivables.
            <br />
            Stronger Business.
          </h2>

          <p className="text-lg text-blue-100 max-w-lg">
            Manage invoices,
            payments, customers,
            inventory and sales
            operations from one
            intelligent platform.
          </p>

        </div>

        <div className="space-y-6">

          <div className="flex items-center gap-4">
            <BarChart3 />
            <span>
              Real-time business insights
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ShieldCheck />
            <span>
              Secure role-based access
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Users />
            <span>
              Multi-user collaboration
            </span>
          </div>

        </div>

      </div>

      {/* Right Panel */}

      <div className="flex-1 flex items-center justify-center p-6">

        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

          <div className="text-center mb-8">

            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2
                size={40}
                className="text-blue-600"
              />
            </div>

            <h2 className="text-4xl font-bold">
              Welcome Back
            </h2>

            <p className="text-gray-500 mt-2">
              Sign in to continue
            </p>

          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="relative mb-4">

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
                className="w-full border rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <div className="relative mb-6">

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
                className="w-full border rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold"
            >
              Login
            </button>
          
          </form>

          <p className="text-center mt-4">
            Don't have an account?

            <a
              href="/register"
              className="text-blue-600 ml-1"
            >
              Sign Up
            </a>
          </p>

          <div className="mt-8 text-center text-sm text-gray-400">
            © 2026 TOCHAMS Group. All rights reserved.
          </div>

        </div>

      </div>

    </div>
  );
}