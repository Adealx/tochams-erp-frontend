"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Breadcrumbs from "./Breadcrumbs";
import QuickActions from "./QuickActions";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;

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

      {/* Right Section */}
      <div className="flex flex-1 flex-col">

        {/* Top Navigation */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* Page Header */}
          <div className="mb-8 space-y-5">

  {breadcrumbs.length > 0 && (
    <Breadcrumbs
      items={breadcrumbs}
    />
  )}

  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>

      <h1 className="text-3xl font-bold text-slate-900">
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

</div>

          {children}

        </main>

      </div>

    </div>
  );
}