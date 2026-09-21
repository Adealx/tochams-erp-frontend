import {
  BarChart3,
  Database,
  ShieldCheck,
} from "lucide-react";

export default function ReportHeader() {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        shadow-[0_4px_18px_rgba(15,23,42,0.035)]
      "
    >
      <div className="relative px-5 py-5 sm:px-6">
        {/* Decorative glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-20
            h-40
            w-40
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <BarChart3 size={21} strokeWidth={2} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-500">
                Reporting Workspace
              </p>

              <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">
                Business Intelligence & Analytics
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Monitor financial performance, sales activity, inventory,
                procurement and operational performance from one workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Database size={14} className="text-slate-400" />

              <span className="text-[11px] font-semibold text-slate-600">
                Live ERP Data
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
              <ShieldCheck size={14} className="text-emerald-600" />

              <span className="text-[11px] font-semibold text-emerald-700">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}