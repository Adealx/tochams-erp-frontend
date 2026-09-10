"use client";

import Image from "next/image";
import { Activity, SunMedium } from "lucide-react";

import TrustBadges from "./TrustBadges";
import LoginForm from "./LoginForm";
import Footer from "./Footer";

export default function RightPanel() {
  return (
    <section
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-y-auto
        bg-[#F2F7FC]
        px-5
        py-6
        sm:px-8
        sm:py-8
        lg:px-8
        xl:px-12
      "
    >

      {/* =====================================================
          EXECUTIVE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Large soft blue shape */}

        <div
          className="
            absolute
            -right-40
            -top-48
            h-[620px]
            w-[620px]
            rounded-full
            bg-blue-200/35
            blur-[110px]
          "
        />

        {/* Cyan lower glow */}

        <div
          className="
            absolute
            -bottom-48
            -left-40
            h-[560px]
            w-[560px]
            rounded-full
            bg-cyan-200/30
            blur-[110px]
          "
        />

        {/* Architectural curved shape */}

        <div
          className="
            absolute
            -right-24
            top-1/2
            h-[520px]
            w-[280px]
            -translate-y-1/2
            rounded-[50%]
            border
            border-blue-200/30
            bg-white/20
            blur-[1px]
          "
        />

        <div
          className="
            absolute
            -right-20
            top-1/2
            h-[460px]
            w-[220px]
            -translate-y-1/2
            rounded-[50%]
            border
            border-white/60
          "
        />

        {/* Very subtle grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[560px]
        "
      >

        {/* ===================================================
            TOP BRAND BAR
        ==================================================== */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
            px-1
            sm:mb-5
          "
        >

          {/* TOCHAMS identity */}

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200/80
                bg-white/80
                shadow-sm
                backdrop-blur
              "
            >

              <Image
                src="/logo/tochams-logo.png"
                alt="TOCHAMS"
                width={34}
                height={34}
                className="h-7 w-7 object-contain"
              />

            </div>

            <div className="leading-none">

              <p className="text-[11px] font-bold tracking-[0.02em] text-slate-800">
                TOCHAMS ERP
              </p>

              <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Enterprise Resource Planning
              </p>

            </div>

          </div>

          {/* Right identity */}

          <div className="hidden items-center gap-2 sm:flex">

            <SunMedium
              size={14}
              className="text-slate-400"
            />

            <span className="text-[9px] font-medium text-slate-400">
              Welcome to TOCHAMS ERP
            </span>

          </div>

        </div>

        {/* ===================================================
            GLASS LOGIN CARD
        ==================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border
            border-white/80
            bg-white/70
            shadow-[0_30px_90px_rgba(15,45,90,0.14)]
            backdrop-blur-2xl
          "
        >

          {/* Card light effects */}

          <div
            className="
              pointer-events-none
              absolute
              -right-32
              -top-32
              h-72
              w-72
              rounded-full
              bg-blue-100/45
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-40
              -left-32
              h-80
              w-80
              rounded-full
              bg-cyan-100/40
              blur-3xl
            "
          />

          {/* =================================================
              CARD CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-10
              p-6
              sm:p-8
              lg:p-9
            "
          >

            {/* =================================================
                BRAND HEADER INSIDE CARD
            ================================================== */}

            <div className="flex items-center justify-center">

              <div className="flex items-center gap-4">

                {/* Logo */}

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-blue-100
                    bg-white
                    shadow-[0_8px_25px_rgba(37,99,235,0.10)]
                  "
                >

                  <Image
                    src="/logo/tochams-logo.png"
                    alt="TOCHAMS ERP"
                    width={50}
                    height={50}
                    priority
                    className="h-9 w-9 object-contain"
                  />

                </div>

                {/* Brand name */}

                <div className="border-l border-slate-200 pl-4">

                  <h2
                    className="
                      text-base
                      font-black
                      tracking-tight
                      text-slate-950
                    "
                  >
                    TOCHAMS ERP
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      text-slate-400
                    "
                  >
                    Enterprise Resource Planning
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                WELCOME
            ================================================== */}

            <div className="mt-7 text-center">

              <h1
                className="
                  text-3xl
                  font-black
                  tracking-[-0.04em]
                  text-[#071633]
                  sm:text-[34px]
                "
              >
                Welcome Back
              </h1>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Sign in to continue managing your
                business operations with TOCHAMS ERP.
              </p>

            </div>

            {/* =================================================
                SYSTEM STATUS
            ================================================== */}

            <div className="mt-5 flex justify-center">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-emerald-200
                  bg-emerald-50/90
                  px-4
                  py-2
                  shadow-sm
                "
              >

                <span className="relative flex h-2 w-2">

                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-emerald-400
                      opacity-60
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-500
                    "
                  />

                </span>

                <Activity
                  size={14}
                  className="text-emerald-600"
                />

                <span className="text-[11px] font-bold text-emerald-700">
                  All Services Operational
                </span>

              </div>

            </div>

            {/* =================================================
                SECURITY FEATURES
            ================================================== */}

            <div className="mt-6">

              <TrustBadges />

            </div>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-200/80" />

              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-slate-300
                "
              >
                Secure Access
              </span>

              <div className="h-px flex-1 bg-slate-200/80" />

            </div>

            {/* =================================================
                LOGIN FORM
            ================================================== */}

            <LoginForm />

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="mt-7">

              <Footer />

            </div>

          </div>

        </div>

        {/* ===================================================
            OUTSIDE CARD SECURITY MESSAGE
        ==================================================== */}

        <div className="mt-4 flex items-center justify-center gap-2">

          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

          <span className="text-[9px] font-medium text-slate-400">
            Protected enterprise workspace
          </span>

        </div>

      </div>

    </section>
  );
}