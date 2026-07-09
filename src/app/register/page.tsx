"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Building2,
  User,
  Mail,
  Lock,
  ShieldCheck,
  BarChart3,
  Boxes,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { registerUser } from "@/services/authService";

export default function RegisterPage() {

  const router = useRouter();

  /* ====================================== */
  /* STATES                                */
  /* ====================================== */

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [registrationSuccess, setRegistrationSuccess] =
    useState(false);

  /* ====================================== */
/* HANDLE REGISTER                        */
/* ====================================== */

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {

  e.preventDefault();

  setLoading(true);

  setError("");

  if (password !== confirmPassword) {

    setLoading(false);

    setError("Passwords do not match.");

    return;

  }

  try {

    await registerUser(
      username,
      email,
      password
    );

    setRegistrationSuccess(true);

  }

  catch (err: any) {

    setError(
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      "Registration failed."
    );

  }

  finally {

    setLoading(false);

  }

};

  /* ====================================== */
  /* SUCCESS SCREEN                         */
  /* ====================================== */

  if (registrationSuccess) {

    return (

      <main className="min-h-screen flex items-center justify-center bg-slate-100">

        <div
          className="
            w-full
            max-w-lg
            rounded-3xl
            bg-white
            p-12
            text-center
            shadow-2xl
          "
        >

          <div
            className="
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              bg-green-100
            "
          >

            <CheckCircle2
              size={48}
              className="text-green-600"
            />

          </div>

          <h1
            className="
              mt-8
              text-4xl
              font-bold
              text-slate-900
            "
          >
            Registration Successful
          </h1>

          <p
            className="
              mt-6
              text-lg
              leading-8
              text-slate-600
            "
          >
            Your account has been created successfully.
          </p>

          <p
            className="
              mt-3
              text-slate-600
              leading-8
            "
          >
            An administrator must approve your account
            before you can sign in.
          </p>

          <p
            className="
              mt-3
              text-slate-600
              leading-8
            "
          >
            You'll receive an email notification once
            your account has been approved.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="
              mt-10
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
              text-white
              font-semibold
              transition
              hover:-translate-y-1
            "
          >

            Go to Sign In

            <ArrowRight size={18} />

          </button>

        </div>

      </main>

    );

  }

  /* ====================================== */
  /* REGISTER PAGE                          */
  /* ====================================== */

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

        {/* Logo */}

        <div className="relative z-10">

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
              Secure Enterprise Registration
            </span>

          </div>

          <h2
            className="
              mt-14
              max-w-lg
              text-6xl
              font-black
              leading-tight
            "
          >

            Join Your

            <br />

            <span className="text-cyan-300">
              Enterprise Workspace.
            </span>

          </h2>

          <p
            className="
              mt-10
              max-w-xl
              text-xl
              leading-10
              text-blue-100
            "
          >

            Register to gain secure access to
            inventory, procurement, finance,
            accounting, sales, logistics,
            production and enterprise operations.

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
                  Smart Business Analytics
                </h3>

                <p className="mt-1 text-blue-200">
                  Gain instant insight into your operations.
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
                  Inventory & Procurement
                </h3>

                <p className="mt-1 text-blue-200">
                  Manage products, warehouses and procurement with ease.
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
                  Collaborate securely across every department.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================== */}
        {/* STATS */}
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

          {/* Logo */}

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
              Create Account
            </h1>

            <p
              className="
                mt-3
                text-slate-500
              "
            >
              Register to access your ERP workspace
            </p>

          </div>

          {/* Tabs */}

          <div
            className="
              mt-10
              rounded-2xl
              bg-slate-100
              p-1
            "
          >

            <div className="grid grid-cols-2">

              <Link
                href="/login"
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
                Sign In
              </Link>

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
                Register
              </button>

            </div>

          </div>

          {/* Error */}

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
          {/* REGISTER FORM */}
          {/* ====================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-7"
          >
                      {/* =============================== */}
            {/* Username */}
            {/* =============================== */}

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

                <User
                  size={18}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    pl-14
                    pr-5
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

            {/* =============================== */}
            {/* Email */}
            {/* =============================== */}

            <div>

              <label
                htmlFor="email"
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
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    pl-14
                    pr-5
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

            {/* =============================== */}
            {/* Password */}
            {/* =============================== */}

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

                <Lock
                  size={18}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    pl-14
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
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-5
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

            {/* =============================== */}
            {/* Confirm Password */}
            {/* =============================== */}

            <div>

              <label
                htmlFor="confirmPassword"
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
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
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
                    pl-14
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
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition
                    hover:text-blue-700
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            {/* =============================== */}
            {/* Approval Notice */}
            {/* =============================== */}

            <div
              className="
                rounded-2xl
                border
                border-amber-200
                bg-amber-50
                p-5
              "
            >

              <h4 className="font-semibold text-amber-900">
                Administrator Approval Required
              </h4>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-amber-800
                "
              >
                Your registration will be reviewed by an
                administrator before you can access the
                ERP system.

                <br />
                <br />

                You'll receive an email notification
                once your account has been approved.
              </p>

            </div>

            {/* =============================== */}
            {/* Register Button */}
            {/* =============================== */}

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

      Creating Account...

    </>

  ) : (

    <>

      Create Account

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

<p
  className="
    text-center
    text-sm
    text-slate-500
  "
>

  Already have an account?

  <Link
    href="/login"
    className="
      ml-2
      font-semibold
      text-blue-700
      transition
      hover:text-blue-900
    "
  >

    Sign In

  </Link>

</p>

</form>

{/* ====================================== */}
{/* FOOTER */}
{/* ====================================== */}

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

  <p
    className="
      mt-2
      text-sm
      text-slate-400
    "
  >
    Enterprise Resource Planning Platform
  </p>

  <p
    className="
      mt-6
      text-xs
      text-slate-400
    "
  >
    © 2026 TOCHAMS Group. All Rights Reserved.
  </p>

</div>

</div>

</section>

</main>

);
}