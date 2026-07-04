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
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top Navigation */}
        <Topbar />

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto bg-slate-100">

          {/* Centered Container */}
          <div className="mx-auto w-full max-w-[1700px] p-8">

            {/* Page Header */}
            <div className="mb-8 space-y-5">

              {breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} />
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
                  <QuickActions actions={actions} />
                )}

              </div>

            </div>

            {/* Page Content */}
            <div className="space-y-8">

              {children}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}