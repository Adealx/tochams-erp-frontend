"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  ArrowUpRight,
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
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb] text-slate-900">

      {/* =========================================================
          ACCESSIBILITY
      ========================================================== */}

      <a
        href="#main-content"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
          focus:z-[9999]
          focus:rounded-lg
          focus:bg-slate-950
          focus:px-4
          focus:py-2
          focus:text-sm
          focus:font-semibold
          focus:text-white
          focus:shadow-xl
        "
      >
        Skip to main content
      </a>

      {/* =========================================================
          SIDEBAR
      ========================================================== */}

      <Sidebar />

      {/* =========================================================
          APPLICATION AREA
      ========================================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* =======================================================
            TOPBAR
        ======================================================== */}

        <Topbar />

        {/* =======================================================
            MAIN WORKSPACE
        ======================================================== */}

        <main
          id="main-content"
          className="
            min-h-0
            flex-1
            overflow-y-auto
            scroll-smooth
            bg-[#f4f7fb]
          "
        >

          {/* =====================================================
              WORKSPACE CONTAINER
          ====================================================== */}

          <div
            className="
              mx-auto
              w-full
              max-w-[1800px]
              px-4
              py-5

              sm:px-6
              sm:py-6

              lg:px-7
              lg:py-7

              xl:px-8
              xl:py-8
            "
          >

            {/* ===================================================
                PAGE CONTEXT
            ==================================================== */}

            <header className="mb-6">

              {/* =================================================
                  BREADCRUMBS
              ================================================== */}

              {breadcrumbs.length > 0 && (
                <nav
                  aria-label="Breadcrumb"
                  className="mb-4"
                >
                  <ol
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-1.5
                      text-[11px]
                      font-medium
                      text-slate-400
                    "
                  >

                    {/* HOME */}

                    <li>
                      <Link
                        href="/dashboard"
                        className="
                          group
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-md
                          px-1.5
                          py-1
                          transition-colors
                          hover:bg-white
                          hover:text-blue-600
                        "
                      >
                        <Home
                          size={12}
                          strokeWidth={2}
                          className="
                            text-slate-400
                            transition-colors
                            group-hover:text-blue-600
                          "
                        />

                        <span className="hidden sm:inline">
                          Home
                        </span>
                      </Link>
                    </li>

                    {breadcrumbs.map((item, index) => {
                      const isLast =
                        index === breadcrumbs.length - 1;

                      return (
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
                            strokeWidth={2}
                            className="text-slate-300"
                          />

                          {item.href && !isLast ? (
                            <Link
                              href={item.href}
                              className="
                                rounded-md
                                px-1.5
                                py-1
                                transition-colors
                                hover:bg-white
                                hover:text-blue-600
                              "
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <span
                              className="
                                rounded-md
                                px-1.5
                                py-1
                                font-semibold
                                text-slate-500
                              "
                              aria-current={
                                isLast
                                  ? "page"
                                  : undefined
                              }
                            >
                              {item.label}
                            </span>
                          )}

                        </li>
                      );
                    })}

                  </ol>
                </nav>
              )}

              {/* =================================================
                  PAGE HEADER CARD
              ================================================== */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  shadow-[0_2px_10px_rgba(15,23,42,0.025)]
                "
              >

                {/* =================================================
                    SUBTLE BRAND ACCENT
                ================================================== */}

                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-full
                    w-[3px]
                    bg-gradient-to-b
                    from-blue-600
                    via-indigo-500
                    to-cyan-400
                  "
                />

                {/* =================================================
                    HEADER CONTENT
                ================================================== */}

                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    px-5
                    py-5

                    sm:px-6
                    sm:py-6

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    lg:px-7
                  "
                >

                  {/* =================================================
                      TITLE AREA
                  ================================================== */}

                  <div className="min-w-0">

                    <div className="flex items-start gap-3">

                      {/* TITLE MARK */}

                      <div
                        className="
                          mt-1
                          hidden
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          sm:flex
                        "
                        aria-hidden="true"
                      >
                        <ArrowUpRight
                          size={16}
                          strokeWidth={2.2}
                        />
                      </div>

                      {/* TEXT */}

                      <div className="min-w-0">

                        <h1
                          className="
                            truncate
                            text-xl
                            font-bold
                            tracking-[-0.02em]
                            text-slate-950

                            sm:text-2xl

                            lg:text-[26px]
                          "
                        >
                          {title}
                        </h1>

                        {subtitle && (
                          <p
                            className="
                              mt-1.5
                              max-w-3xl
                              text-xs
                              leading-5
                              text-slate-500

                              sm:text-sm
                              sm:leading-6
                            "
                          >
                            {subtitle}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      ACTION AREA
                  ================================================== */}

                  {actions.length > 0 && (
                    <div
                      className="
                        flex
                        shrink-0
                        flex-wrap
                        items-center
                        gap-2

                        lg:justify-end
                      "
                    >
                      <QuickActions
                        actions={actions}
                      />
                    </div>
                  )}

                </div>

              </div>

            </header>

            {/* =====================================================
                MAIN PAGE CONTENT
            ====================================================== */}

            <section
              className="
                min-w-0
                space-y-6

                sm:space-y-7

                lg:space-y-8
              "
            >
              {children}
            </section>

            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer
              className="
                mt-10
                border-t
                border-slate-200/80
                pt-5
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-2

                  text-[10px]
                  font-medium
                  text-slate-400

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div className="flex items-center gap-2">

                  <span>
                    TOCHAMS ERP
                  </span>

                  <span className="text-slate-300">
                    •
                  </span>

                  <span>
                    Enterprise Resource Planning Platform
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <span>
                    Operational Workspace
                  </span>

                  <span className="h-1 w-1 rounded-full bg-emerald-500" />

                  <span>
                    System Operational
                  </span>

                </div>

              </div>

            </footer>

          </div>

        </main>

      </div>

    </div>
  );
}