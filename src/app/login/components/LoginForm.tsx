"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

      // Small delay to ensure storage is available
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
      className="space-y-6"
    >
      {error && (
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      <div>
        <label
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
          "
        >
          Username
        </label>

        <input
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          placeholder="Enter your username"
          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            px-5
            py-4
            outline-none
            transition
            focus:border-blue-600
            focus:ring-4
            focus:ring-blue-100
          "
        />
      </div>

      <div>
        <label
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
          "
        >
          Password
        </label>

        <div className="relative">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="••••••••"
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-5
              py-4
              pr-14
              outline-none
              transition
              focus:border-blue-600
              focus:ring-4
              focus:ring-blue-100
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-500
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

      <div className="flex items-center justify-between">

        <label
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-600
          "
        >
          <input
            type="checkbox"
            className="rounded"
          />

          Remember me

        </label>

        <Link
          href="/forgot-password"
          className="
            text-sm
            font-semibold
            text-blue-600
            hover:underline
          "
        >
          Forgot Password?
        </Link>

      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          flex
          w-full
          items-center
          justify-center
          rounded-2xl
          bg-blue-700
          py-4
          text-lg
          font-bold
          text-white
          transition
          hover:bg-blue-800
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        {loading ? (
          <>
            <Loader2
              className="mr-2 animate-spin"
              size={20}
            />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="text-center text-sm text-slate-600">

        Don't have an account?{" "}

        <Link
          href="/register"
          className="
            font-semibold
            text-blue-700
            hover:underline
          "
        >
          Create Account
        </Link>

      </div>

    </form>
  );
}