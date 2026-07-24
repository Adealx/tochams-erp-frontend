import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 pt-8">

      {/* Security Notice */}

      <div className="flex flex-wrap items-center justify-center gap-6">

        <div className="flex items-center gap-2 text-sm text-slate-600">

          <ShieldCheck
            size={16}
            className="text-green-600"
          />

          <span>Enterprise Security</span>

        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">

          <Lock
            size={16}
            className="text-blue-600"
          />

          <span>SSL Encrypted Connection</span>

        </div>

      </div>

      {/* Links */}

      <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">

        <Link
          href="/privacy"
          className="text-slate-500 transition hover:text-blue-600"
        >
          Privacy Policy
        </Link>

        <Link
          href="/terms"
          className="text-slate-500 transition hover:text-blue-600"
        >
          Terms of Service
        </Link>

        <Link
          href="/support"
          className="text-slate-500 transition hover:text-blue-600"
        >
          Contact Support
        </Link>

      </div>

      {/* Copyright */}

      <div className="mt-8 text-center">

        <p className="text-sm text-slate-500">
          © {year} <strong>TOCHAMS Distribution Limited</strong>.
          All rights reserved.
        </p>

        <p className="mt-2 text-xs text-slate-400">
          TOCHAMS ERP • Enterprise Resource Planning Platform
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Version 1.0.0
        </p>

      </div>

    </footer>
  );
}