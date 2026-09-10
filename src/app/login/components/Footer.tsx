import Link from "next/link";
import {
  ShieldCheck,
  Lock,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 pt-5">

      {/* Security */}

      <div className="flex items-center justify-center gap-5">

        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">

          <ShieldCheck
            size={13}
            className="text-emerald-500"
          />

          Enterprise Security

        </div>

        <span className="h-3 w-px bg-slate-200" />

        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">

          <Lock
            size={13}
            className="text-blue-500"
          />

          Secure Connection

        </div>

      </div>

      {/* Links */}

      <div className="mt-4 flex justify-center gap-4 text-[10px]">

        <Link
          href="/privacy"
          className="text-slate-400 transition hover:text-blue-600"
        >
          Privacy
        </Link>

        <span className="text-slate-300">•</span>

        <Link
          href="/terms"
          className="text-slate-400 transition hover:text-blue-600"
        >
          Terms
        </Link>

        <span className="text-slate-300">•</span>

        <Link
          href="/support"
          className="text-slate-400 transition hover:text-blue-600"
        >
          Support
        </Link>

      </div>

      {/* Copyright */}

      <div className="mt-4 text-center">

        <p className="text-[10px] text-slate-400">
          © {year} TOCHAMS Distribution Limited. All rights reserved.
        </p>

        <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-300">
          TOCHAMS ERP · Enterprise Platform · v1.0.0
        </p>

      </div>

    </footer>
  );
}