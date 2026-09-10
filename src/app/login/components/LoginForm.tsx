"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  KeyRound,
  ArrowRight,
} from "lucide-react";

import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      console.log("Logging in...");

      const data = await loginUser(username, password);

      console.log("Login Response:", data);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      console.log("Tokens stored.");

      await new Promise((resolve) =>
        setTimeout(resolve, 100)
      );

      await refreshUser();

      router.replace("/dashboard");

      router.refresh();

    } catch (err: any) {

      console.error("LOGIN FAILED", err);

      setError(
        err?.response?.data?.detail ||
        "Invalid username or password."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* =================================================
          USERNAME
      ================================================= */}

      <div>

        <label
          htmlFor="username"
          className="
            mb-2
            block
            text-xs
            font-bold
            text-slate-700
          "
        >
          Username
        </label>

        <div className="relative">

          <User
            size={17}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            id="username"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Enter your username"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              pl-11
              pr-4
              text-sm
              text-slate-900
              outline-none
              transition-all
              placeholder:text-slate-400
              hover:border-slate-300
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />

        </div>

      </div>

      {/* =================================================
          PASSWORD
      ================================================= */}

      <div>

        <label
          htmlFor="password"
          className="
            mb-2
            block
            text-xs
            font-bold
            text-slate-700
          "
        >
          Password
        </label>

        <div className="relative">

          <KeyRound
            size={17}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              pl-11
              pr-12
              text-sm
              text-slate-900
              outline-none
              transition-all
              placeholder:text-slate-400
              hover:border-slate-300
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="
              absolute
              right-2
              top-1/2
              flex
              h-8
              w-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}
          </button>

        </div>

      </div>

      {/* =================================================
          OPTIONS
      ================================================= */}

      <div className="flex items-center justify-between">

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-2
            text-xs
            text-slate-500
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

        <Link
          href="/forgot-password"
          className="
            text-xs
            font-bold
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          Forgot Password?
        </Link>

      </div>

      {/* =================================================
          SIGN IN
      ================================================= */}

      <button
        type="submit"
        disabled={loading}
        className="
          group
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          text-sm
          font-bold
          text-white
          shadow-lg
          shadow-blue-600/20
          transition-all
          duration-200
          hover:bg-blue-700
          hover:shadow-blue-600/30
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >

        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
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
                duration-200
                group-hover:translate-x-1
              "
            />
          </>
        )}

      </button>

      {/* =================================================
          REGISTER
      ================================================= */}

      <div className="text-center text-xs text-slate-500">

        Don't have an account?{" "}

        <Link
          href="/register"
          className="
            font-bold
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          Create Account
        </Link>

      </div>

    </form>
  );
}