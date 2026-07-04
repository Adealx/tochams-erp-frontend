"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Building2,
  BarChart3,
  ShieldCheck,
  Users,
} from "lucide-react";

import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

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
        "Invalid username or password."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen flex bg-slate-100">

      {/* LEFT PANEL */}

      <div
        className="
          hidden
          lg:flex
          lg:w-1/2
          flex-col
          justify-around
          bg-gradient-to-br
          from-blue-950
          via-blue-800
          to-blue-600
          text-white
          p-16
        "
      >

        <div>

          <div className="flex items-center gap-5 mb-16">

            <div className="rounded-2xl bg-white/20 p-4">

              <Building2 size={42} />

            </div>

            <div>

              <h1 className="text-5xl font-bold">
                TOCHAMS ERP
              </h1>

              <p className="mt-2 text-blue-100 text-lg">
                Enterprise Resource Planning
              </p>

            </div>

          </div>

          <h2 className="text-7xl font-bold leading-tight">

            Smarter Business.
            <br />
            Better Decisions.

          </h2>

          <p className="mt-10 max-w-xl text-xl leading-10 text-blue-100">

            Manage inventory,
            procurement,
            customers,
            invoices,
            payments,
            sales,
            accounting and operations
            from one intelligent enterprise platform.

          </p>

        </div>

        <div className="space-y-8 text-xl pb-10">

          <div className="flex items-center gap-4">

            <BarChart3 size={28} />

            <span>
              Real-time business insights
            </span>

          </div>

          <div className="flex items-center gap-4">

            <ShieldCheck size={28} />

            <span>
              Enterprise-grade security
            </span>

          </div>

          <div className="flex items-center gap-4">

            <Users size={28} />

            <span>
              Multi-user collaboration
            </span>

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex flex-1 items-center justify-center p-10">

        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            bg-white
            shadow-2xl
            p-12
          "
        >

          {/* Logo */}

          <div className="text-center pt-4 mb-10">

            <div
              className="
                mx-auto
                mb-6
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-blue-100
              "
            >

              <Building2
                size={40}
                className="text-blue-600"
              />

            </div>

            <h2 className="text-5xl font-bold text-slate-900">

              Welcome Back

            </h2>

            <p className="mt-4 text-lg text-slate-500">

              Sign in to continue

            </p>

          </div>

          {error && (

            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">

              {error}

            </div>

          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            <div>

              <label className="mb-3 block text-sm font-semibold text-slate-700">

                Username

              </label>

              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="
                  w-full
                  h-14
                  rounded-xl
                  border
                  border-slate-300
                  px-5
                  text-base
                  transition
                  focus:border-blue-600
                  focus:ring-4
                  focus:ring-blue-100
                  outline-none
                "
                required
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-semibold text-slate-700">

                Password

              </label>

              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="
                  w-full
                  h-14
                  rounded-xl
                  border
                  border-slate-300
                  px-5
                  text-base
                  transition
                  focus:border-blue-600
                  focus:ring-4
                  focus:ring-blue-100
                  outline-none
                "
                required
              />

            </div>

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-600">

                <input
                  type="checkbox"
                  className="rounded"
                />

                Remember me

              </label>

              <a
                href="#"
                className="font-medium text-blue-600 hover:underline"
              >

                Forgot Password?

              </a>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-14
                rounded-2xl
                bg-blue-600
                text-lg
                font-semibold
                text-white
                shadow-lg
                transition-all
                hover:bg-blue-700
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading
                ? "Signing In..."
                : "Login"}

            </button>

          </form>

          <div className="mt-10 text-center">

            <span className="text-slate-500">

              Don't have an account?

            </span>

            <a
              href="/register"
              className="ml-2 font-semibold text-blue-600 hover:underline"
            >

              Sign Up

            </a>

          </div>

          <div
            className="
              mt-10
              border-t
              border-slate-200
              pt-8
              text-center
              text-sm
              text-slate-400
            "
          >

            © 2026 TOCHAMS Group. All rights reserved.

          </div>

        </div>

      </div>

    </div>

  );
}