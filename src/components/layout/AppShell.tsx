"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import QuickActions from "./QuickActions";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;

  breadcrumbs?: {
    label: string;
    href?: string;
  }[];

  actions?: {
    label: string;
    href: string;
  }[];
}

export default function AppShell({
  title,
  subtitle,
  children,
  breadcrumbs = [],
  actions = [],
}: AppShellProps) {
  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden
        bg-[#f6f7fb]
        text-slate-900
      "
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar />

      {/* =====================================================
          APPLICATION AREA
      ====================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* Topbar */}

        <Topbar />

        {/* =================================================
            MAIN CONTENT
        ================================================== */}

        <main
          className="
            min-h-0
            flex-1
            overflow-y-auto
            scroll-smooth
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1680px]
              px-4
              py-5
              sm:px-6
              lg:px-8
              lg:py-6
              xl:px-9
            "
          >
            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <header className="mb-6">
              {/* Breadcrumbs */}

              {breadcrumbs.length > 0 && (
                <nav
                  aria-label="Breadcrumb"
                  className="mb-3"
                >
                  <ol
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-1.5
                      text-[11px]
                      font-medium
                    "
                  >
                    {/* Home */}

                    <li>
                      <Link
                        href="/dashboard"
                        className="
                          flex
                          items-center
                          gap-1
                          text-slate-400
                          transition
                          hover:text-blue-600
                        "
                      >
                        <Home size={12} />

                        <span className="hidden sm:inline">
                          Home
                        </span>
                      </Link>
                    </li>

                    {breadcrumbs.map(
                      (item, index) => (
                        <li
                          key={`${item.label}-${index}`}
                          className="
                            flex
                            items-center
                            gap-1.5
                          "
                        >
                          <ChevronRight
                            size={12}
                            className="text-slate-300"
                          />

                          {item.href ? (
                            <Link
                              href={item.href}
                              className="
                                text-slate-400
                                transition
                                hover:text-blue-600
                              "
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <span className="text-slate-500">
                              {item.label}
                            </span>
                          )}
                        </li>
                      )
                    )}
                  </ol>
                </nav>
              )}

              {/* Page heading */}

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  px-5
                  py-4
                  shadow-[0_4px_18px_rgba(15,23,42,0.035)]
                  sm:px-6
                  sm:py-5
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                {/* Title */}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        h-6
                        w-1
                        rounded-full
                        bg-gradient-to-b
                        from-blue-500
                        to-cyan-400
                      "
                    />

                    <h1
                      className="
                        truncate
                        text-xl
                        font-black
                        tracking-[-0.025em]
                        text-slate-950
                        sm:text-2xl
                      "
                    >
                      {title}
                    </h1>
                  </div>

                  {subtitle && (
                    <p
                      className="
                        mt-1.5
                        max-w-3xl
                        pl-3
                        text-xs
                        leading-5
                        text-slate-500
                        sm:text-sm
                      "
                    >
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Actions */}

                {actions.length > 0 && (
                  <div className="shrink-0">
                    <QuickActions
                      actions={actions}
                    />
                  </div>
                )}
              </div>
            </header>

            {/* =================================================
                PAGE CONTENT
            ================================================== */}

            <section className="space-y-7">
              {children}
            </section>

            {/* =================================================
                FOOTER
            ================================================== */}

            <footer
              className="
                mt-8
                border-t
                border-slate-200/80
                py-4
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-1
                  text-[10px]
                  text-slate-400
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <span>
                  TOCHAMS ERP • Enterprise Resource
                  Planning Platform
                </span>

                <span>
                  Operational workspace
                </span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}