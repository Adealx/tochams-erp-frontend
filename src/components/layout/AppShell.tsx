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
    <div className="flex h-screen overflow-hidden bg-slate-100">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar />

        <main className="flex-1 overflow-y-auto">

          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              px-8
              py-8
            "
          >

            <section
              className="
                mb-10
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-8
                py-6
                shadow-sm
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

                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">

                    {title}

                  </h1>

                  {subtitle && (

                    <p className="mt-2 text-slate-500">

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

            <section className="space-y-12">

              {children}

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}