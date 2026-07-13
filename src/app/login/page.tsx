"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
  Building2,
  BarChart3,
  ShieldCheck,
  Boxes,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { loginUser } from "@/services/authService";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const { refreshUser } = useAuth();  

  const [error, setError] =
    useState("");

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

      // Tell AuthContext to load the logged-in user
      await refreshUser();
      router.refresh();
      console.log("Logged in successfully, refreshing user...");
      router.push("/dashboard");

    }

    catch {

      setError(
        "Invalid username or password."
      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <main
      className="
      min-h-screen
      lg:grid
      lg:grid-cols-[52%_48%]
      bg-white
    "
    >

      {/* ====================================== */}
      {/* LEFT PANEL */}
      {/* ====================================== */}

      <section
        className="
        relative
        hidden
        lg:flex
        flex-col
        justify-between
        overflow-hidden
        bg-gradient-to-br
        from-[#0B2A83]
        via-[#1546D8]
        to-[#2563EB]
        px-14
        py-12
        text-white
      "
      >

        {/* Background */}

        <div className="absolute inset-0">

          <div
            className="
            absolute
            -left-52
            -top-52
            h-[650px]
            w-[650px]
            rounded-full
            bg-white/10
            blur-3xl
          "
          />

          <div
            className="
            absolute
            bottom-[-220px]
            right-[-220px]
            h-[600px]
            w-[600px]
            rounded-full
            bg-cyan-300/10
            blur-3xl
          "
          />

        </div>

        {/* Dots */}

        <div
          className="
          absolute
          right-16
          top-14
          grid
          grid-cols-7
          gap-3
          opacity-20
        "
        >

          {Array.from({
            length: 49,
          }).map((_, i) => (

            <span
              key={i}
              className="
              h-2
              w-2
              rounded-full
              bg-white
            "
            />

          ))}

        </div>

        {/* Content */}

        <div className="relative z-10">

          {/* Logo */}

          <div className="flex items-center gap-5">

            <div
              className="
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-3xl
              bg-white
              shadow-xl
            "
            >

              <Building2
                size={42}
                className="text-blue-700"
              />

            </div>

            <div>

              <h1
                className="
                text-5xl
                font-black
              "
              >

                TOCHAMS ERP

              </h1>

              <p
                className="
                mt-2
                text-lg
                text-blue-100
              "
              >

                Enterprise Resource Planning

              </p>

            </div>

          </div>

          {/* Badge */}

          <div
            className="
            mt-12
            inline-flex
            items-center
            gap-3
            rounded-full
            bg-white/10
            px-5
            py-3
            backdrop-blur-md
          "
          >

            <ShieldCheck size={18} />

            <span>

              Trusted by enterprise teams

            </span>

          </div>

          {/* Heading */}

          <h2
            className="
            mt-14
            max-w-lg
            text-6xl
            font-black
            leading-tight
          "
          >

            Manage Business.

            <br />

            <span className="text-cyan-300">

              At Scale.

            </span>

          </h2>

          {/* Description */}

          <p
            className="
            mt-10
            max-w-xl
            text-xl
            leading-10
            text-blue-100
          "
          >

            A unified platform for managing
            inventory, procurement,
            customers, invoices,
            payments, accounting,
            sales, logistics and
            enterprise operations —
            built for speed and clarity.

          </p>

        </div>

                {/* ====================================== */}
        {/* FEATURES */}
        {/* ====================================== */}

        <div className="relative z-10 mt-16">

          <div className="space-y-7">

            <div className="flex items-center gap-5">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/10
                  backdrop-blur-md
                "
              >

                <BarChart3 size={24} />

              </div>

              <div>

                <h3 className="text-xl font-semibold">

                  Real-Time Analytics

                </h3>

                <p className="mt-1 text-blue-200">

                  Monitor business performance instantly.

                </p>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/10
                  backdrop-blur-md
                "
              >

                <Boxes size={24} />

              </div>

              <div>

                <h3 className="text-xl font-semibold">

                  Inventory Control

                </h3>

                <p className="mt-1 text-blue-200">

                  Track products, warehouses and stock.

                </p>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/10
                  backdrop-blur-md
                "
              >

                <Users size={24} />

              </div>

              <div>

                <h3 className="text-xl font-semibold">

                  Team Collaboration

                </h3>

                <p className="mt-1 text-blue-200">

                  Connect every department together.

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================== */}
        {/* STATISTICS */}
        {/* ====================================== */}

        <div className="relative z-10 mt-20">

          <div className="border-t border-white/20 pt-10">

            <div className="grid grid-cols-3 gap-10">

              <div>

                <h2 className="text-5xl font-black">

                  250+

                </h2>

                <p className="mt-3 text-blue-200">

                  Companies

                </p>

              </div>

              <div>

                <h2 className="text-5xl font-black">

                  25K+

                </h2>

                <p className="mt-3 text-blue-200">

                  Transactions

                </p>

              </div>

              <div>

                <h2 className="text-5xl font-black">

                  99.9%

                </h2>

                <p className="mt-3 text-blue-200">

                  Uptime

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================== */}
      {/* RIGHT PANEL */}
      {/* ====================================== */}

      <section
        className="
          flex
          items-center
          justify-center
          bg-white
          px-20
          py-16
        "
      >

        <div
          className="
            w-full
            max-w-xl
          "
        >
        
                  {/* ====================================== */}
          {/* LOGO */}
          {/* ====================================== */}

          <div className="text-center">

            <div
              className="
                mx-auto
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-3xl
                bg-blue-50
                shadow-lg
              "
            >

              <Building2
                size={38}
                className="text-blue-700"
              />

            </div>

            <h1
              className="
                mt-8
                text-4xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >

              Welcome to TOCHAMS ERP

            </h1>

            <p
              className="
                mt-3
                text-slate-500
              "
            >

              Sign in to access your workspace

            </p>

          </div>

          {/* ====================================== */}
          {/* SIGN IN / REGISTER */}
          {/* ====================================== */}

          <div
            className="
              mt-10
              rounded-2xl
              bg-slate-100
              p-1
            "
          >

            <div className="grid grid-cols-2">

              <button
                className="
                  rounded-xl
                  bg-white
                  py-3
                  text-sm
                  font-semibold
                  shadow-sm
                "
              >

                Sign In

              </button>

              <Link
                href="/register"
                className="
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  py-3
                  text-sm
                  font-semibold
                  text-slate-500
                  transition
                  hover:text-blue-700
                "
              >

                Register

              </Link>

            </div>

          </div>

          {/* ====================================== */}
          {/* ERROR */}
          {/* ====================================== */}

          {error && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-5
                py-4
                text-sm
                text-red-700
              "
            >

              {error}

            </div>

          )}

          {/* ====================================== */}
          {/* FORM */}
          {/* ====================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-7"
          >

            {/* Username */}

            <div>

              <label
                htmlFor="username"
                className="
                  mb-3
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >

                Username

              </label>

              <div className="relative">

                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    pl-5
                    pr-12
                    text-base
                    outline-none
                    transition
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                  "
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label
                htmlFor="password"
                className="
                  mb-3
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >

                Password

              </label>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    pl-5
                    pr-14
                    text-base
                    outline-none
                    transition
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                  "
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition
                    hover:text-blue-700
                  "
                >

                  {showPassword ? (

                    <EyeOff size={20} />

                  ) : (

                    <Eye size={20} />

                  )}

                </button>

              </div>

            </div>

                        {/* Remember Me */}

            <div
              className="
                flex
                items-center
                justify-between
                pt-2
              "
            >

              <label
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-slate-600
                  cursor-pointer
                  select-none
                "
              >

                <input
                  type="checkbox"
                  className="
                    h-4
                    w-4
                    rounded
                    border-slate-300
                    text-blue-600
                    focus:ring-blue-500
                  "
                />

                Remember me

              </label>

              <button
                type="button"
                className="
                  text-sm
                  font-semibold
                  text-blue-700
                  transition
                  hover:text-blue-900
                "
              >

                Forgot Password?

              </button>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-gradient-to-r
                from-[#0B2A83]
                via-[#1546D8]
                to-[#2563EB]
                text-base
                font-semibold
                text-white
                shadow-xl
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-2xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (

                <>

                  <div
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  Signing In...

                </>

              ) : (

                <>

                  Sign In

                  <ArrowRight
                    size={18}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />

                </>

              )}

            </button>

            {/* Register */}

          </form>

          {/* Footer */}

          <div
            className="
              mt-12
              border-t
              border-slate-200
              pt-8
              text-center
            "
          >

            <p className="text-sm font-semibold text-slate-700">

              TOCHAMS ERP

            </p>

            <p className="mt-2 text-sm text-slate-400">

              Enterprise Resource Planning Platform

            </p>

            <p className="mt-6 text-xs text-slate-400">

              © 2026 TOCHAMS Group. All Rights Reserved.

            </p>

          </div>

        </div>

      </section>

    </main>

  );

}
