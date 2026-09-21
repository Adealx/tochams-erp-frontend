import {
  Database,
  Table2,
} from "lucide-react";

export default function ReportTable() {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        shadow-[0_4px_18px_rgba(15,23,42,0.035)]
      "
    >
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-950">
              Report Data
            </h3>

            <p className="mt-1 text-[11px] text-slate-400">
              Detailed report records and transactional analysis.
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Table2 size={16} />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
            <Database size={19} />
          </div>

          <h4 className="mt-4 text-sm font-bold text-slate-700">
            Detailed reporting tables
          </h4>

          <p className="mx-auto mt-1 max-w-md text-[11px] leading-5 text-slate-400">
            Detailed tabular data will appear here as each reporting
            module is connected to its underlying dataset.
          </p>
        </div>
      </div>
    </section>
  );
}