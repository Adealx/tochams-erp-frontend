import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  title,
  subtitle,
  action,
  footer,
  className,
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-2xl border border-slate-200 shadow-sm",
          "transition-all duration-200 hover:shadow-md",
          paddingClasses[padding]
        ),
        className
      )}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-slate-900">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div>
              {action}
            </div>
          )}
        </div>
      )}

      <div>
        {children}
      </div>

      {footer && (
        <div className="mt-6 pt-5 border-t border-slate-200">
          {footer}
        </div>
      )}
    </div>
  );
}