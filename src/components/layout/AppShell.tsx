"use client";

import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Breadcrumbs from "./Breadcrumbs";
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
    <div className="flex h-screen overflow-hidden bg-[#f6f7fb]">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar />

        <main className="flex-1 overflow-y-auto">

          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-4
              py-5
              sm:px-6
              lg:px-9
              lg:py-8
            "
          >

            <section
              className="
                mb-8
                rounded-[22px]
                border border-slate-200/80
                bg-white/90
                px-5 py-5
                shadow-[0_10px_30px_rgba(15,23,42,0.04)]
                backdrop-blur-sm
                sm:px-7 sm:py-6
              "
            >

              {breadcrumbs.length > 0 && (

                <div className="mb-5">

                  <Breadcrumbs
                    items={breadcrumbs}
                  />

                </div>

              )}

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">

                    {title}

                  </h1>

                  {subtitle && (

                  <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-[15px]">

                      {subtitle}

                    </p>

                  )}

                </div>

                {actions.length > 0 && (

                  <QuickActions
                    actions={actions}
                  />

                )}

              </div>

            </section>

            <section className="space-y-9">

              {children}

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}
