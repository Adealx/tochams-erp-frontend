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

  padding?:
    | "none"
    | "sm"
    | "md"
    | "lg";
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

    md: "p-5",

    lg: "p-6",
  };

  return (

    <section
      className={twMerge(
        clsx(
          `
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-[0_1px_2px_rgba(15,23,42,.04)]
          `,
          paddingClasses[padding]
        ),
        className
      )}
    >

      {(title || subtitle || action) && (

        <div
          className="
            mb-5
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            {title && (

              <h2
                className="
                  text-[15px]
                  font-semibold
                  text-slate-900
                "
              >

                {title}

              </h2>

            )}

            {subtitle && (

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >

                {subtitle}

              </p>

            )}

          </div>

          {action && (

            <div className="shrink-0">

              {action}

            </div>

          )}

        </div>

      )}

      <div>

        {children}

      </div>

      {footer && (

        <div
          className="
            mt-5
            border-t
            border-slate-100
            pt-4
          "
        >

          {footer}

        </div>

      )}

    </section>

  );
}