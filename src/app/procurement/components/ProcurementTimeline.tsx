"use client";

import clsx from "clsx";

import {
  FileEdit,
  Send,
  ClipboardCheck,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface ProcurementTimelineProps {
  steps?: TimelineStep[];
}

const defaultSteps: TimelineStep[] = [
  {
    id: 1,
    title: "Draft",
    description: "Purchase order created",
    completed: true,
    active: false,
  },
  {
    id: 2,
    title: "Submitted",
    description: "Awaiting review",
    completed: true,
    active: false,
  },
  {
    id: 3,
    title: "Manager Review",
    description: "Under approval",
    completed: false,
    active: true,
  },
  {
    id: 4,
    title: "Approved",
    description: "Approved for purchasing",
    completed: false,
    active: false,
  },
  {
    id: 5,
    title: "Received",
    description: "Goods received",
    completed: false,
    active: false,
  },
];

const icons = [
  FileEdit,
  Send,
  ClipboardCheck,
  CheckCircle2,
  PackageCheck,
];

export default function ProcurementTimeline({
  steps = defaultSteps,
}: ProcurementTimelineProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        p-8
      "
    >
      {/* Header */}

      <div className="mb-8">

        <h2
          className="
            text-xl
            font-bold
            text-slate-900
          "
        >
          Procurement Workflow
        </h2>

        <p className="mt-2 text-slate-500">
          Track the progress of a purchase order from
          creation through approval and receipt.
        </p>

      </div>

      {/* Timeline */}

      <div
        className="
          grid
          gap-8

          md:grid-cols-5
        "
      >
        {steps.map((step, index) => {

          const Icon = icons[index];

          return (

            <div
              key={step.id}
              className="
                relative
                flex
                flex-col
                items-center
                text-center
              "
            >
              {/* Connector */}

              {index !== steps.length - 1 && (

                <div
                  className={clsx(
                    `
                    absolute
                    left-1/2
                    top-6
                    hidden
                    h-1
                    w-full
                    translate-x-1/2

                    md:block
                    `,
                    step.completed
                      ? "bg-green-500"
                      : "bg-slate-200"
                  )}
                />

              )}

              {/* Icon */}

              <div
                className={clsx(
                  `
                  relative
                  z-10

                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-full
                  border-4

                  transition
                  `,
                  step.completed &&
                    `
                    border-green-500
                    bg-green-500
                    text-white
                    `,

                  step.active &&
                    `
                    border-blue-600
                    bg-blue-50
                    text-blue-600
                    `,

                  !step.completed &&
                    !step.active &&
                    `
                    border-slate-300
                    bg-white
                    text-slate-400
                    `
                )}
              >
                <Icon size={24} />
              </div>

              {/* Title */}

              <h3
                className="
                  mt-5
                  font-semibold
                  text-slate-900
                "
              >
                {step.title}
              </h3>

              {/* Description */}

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {step.description}
              </p>

              {/* Status */}

              <span
                className={clsx(
                  `
                  mt-4

                  rounded-full

                  px-3
                  py-1

                  text-xs
                  font-semibold
                  `,
                  step.completed &&
                    "bg-green-100 text-green-700",

                  step.active &&
                    "bg-blue-100 text-blue-700",

                  !step.completed &&
                    !step.active &&
                    "bg-slate-100 text-slate-600"
                )}
              >
                {step.completed
                  ? "Completed"
                  : step.active
                  ? "Current"
                  : "Pending"}
              </span>

            </div>

          );

        })}
      </div>
    </div>
  );
}