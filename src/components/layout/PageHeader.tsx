import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumbs?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="mb-8">

      {breadcrumbs && (
        <div className="mb-3 text-sm text-slate-500">
          {breadcrumbs}
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

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

        {action && (
          <div className="flex items-center gap-3">
            {action}
          </div>
        )}

      </div>

    </div>
  );
}