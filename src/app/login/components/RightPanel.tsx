"use client";

import Image from "next/image";
import TrustBadges from "./TrustBadges";
import LoginForm from "./LoginForm";
import Footer from "./Footer";
import { Activity } from "lucide-react";

export default function RightPanel() {
  return (
    <section
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-slate-50
        via-white
        to-blue-50
        px-6
        py-10
      "
    >
      {/* ========================= */}
      {/* Background Decoration */}
      {/* ========================= */}

      <div className="absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -right-44
            -top-44
            h-96
            w-96
            rounded-full
            bg-blue-100/60
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-44
            -left-44
            h-96
            w-96
            rounded-full
            bg-cyan-100/60
            blur-3xl
          "
        />

      </div>

      {/* ========================= */}
      {/* Main Card */}
      {/* ========================= */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-xl
        "
      >

        <div
          className="
            rounded-[32px]
            border
            border-slate-200
            bg-white/90
            p-10
            shadow-2xl
            backdrop-blur-xl
          "
        >

          {/* ========================= */}
          {/* Logo */}
          {/* ========================= */}

          <div className="flex justify-center">

            <div
              className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-lg
              "
            >

              <Image
                src="/logo/tochams-logo.png"
                alt="TOCHAMS ERP"
                width={72}
                height={72}
                priority
                className="object-contain"
              />

            </div>

          </div>

          {/* ========================= */}
          {/* Welcome */}
          {/* ========================= */}

          <div className="mt-8 text-center">

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                text-slate-900
              "
            >

              Welcome Back

            </h1>

            <p
              className="
                mt-4
                text-lg
                leading-8
                text-slate-600
              "
            >

              Sign in to continue managing
              your business operations with
              TOCHAMS ERP.

            </p>

          </div>

          {/* ========================= */}
          {/* Status */}
          {/* ========================= */}

          <div className="mt-8 flex justify-center">

            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-green-200
                bg-green-50
                px-5
                py-2
              "
            >

              <Activity
                size={18}
                className="text-green-600"
              />

              <span
                className="
                  text-sm
                  font-semibold
                  text-green-700
                "
              >

                All Services Operational

              </span>

            </div>

          </div>

          {/* ========================= */}
          {/* Trust Badges */}
          {/* ========================= */}

          <div className="mt-10">

            <TrustBadges />

          </div>

          {/* ========================= */}
          {/* Login Form */}
          {/* ========================= */}

          <div className="mt-10">

            <LoginForm />

          </div>

          {/* ========================= */}
          {/* Footer */}
          {/* ========================= */}

          <div className="mt-12">

            <Footer />

          </div>

        </div>

      </div>

    </section>
  );
}