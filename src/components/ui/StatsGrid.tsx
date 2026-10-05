"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface StatsGridProps {

  children: ReactNode;

  className?: string;
}

export default function StatsGrid({

  children,

  className,

}: StatsGridProps) {

  return (

    <section
      className={clsx(
        `
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        `,
        className
      )}
    >

      {children}

    </section>

  );
}