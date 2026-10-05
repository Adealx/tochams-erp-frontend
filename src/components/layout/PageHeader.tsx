"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface PageHeaderProps {

  title: string;

  subtitle?: string;

  description?: string;

  icon?: ReactNode;

  action?: ReactNode;

  actions?: ReactNode;

  breadcrumbs?: ReactNode;

  className?: string;
}

export default function PageHeader({

  title,

  subtitle,

  description,

  icon,

  action,

  actions,

  breadcrumbs,

  className,

}: PageHeaderProps) {

  const supportingText =
    description ?? subtitle;

  const rightActions =
    actions ?? action;

  return (

    <header
      className={clsx(
        "mb-6",
        className
      )}
    >

      {/* Breadcrumb */}

      {breadcrumbs && (

        <div
          className="
            mb-3
            flex
            items-center
            text-xs
            text-slate-500
          "
        >

          {breadcrumbs}

        </div>

      )}

      {/* Header */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          {icon && (

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-blue-100
                bg-blue-50
                text-blue-700
              "
            >

              {icon}

            </div>

          )}

          <div className="min-w-0">

            <h1
              className="
                truncate
                text-[25px]
                font-bold
                tracking-[-0.02em]
                text-slate-950
              "
            >

              {title}

            </h1>

            {supportingText && (

              <p
                className="
                  mt-0.5
                  text-[13px]
                  text-slate-500
                "
              >

                {supportingText}

              </p>

            )}

          </div>

        </div>


        {/* ACTIONS */}

        {rightActions && (

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            {rightActions}

          </div>

        )}

      </div>

    </header>

  );
}