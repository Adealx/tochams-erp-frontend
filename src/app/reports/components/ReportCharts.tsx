import {
  BarChart3,
  LineChart,
  PieChart,
} from "lucide-react";

export default function ReportCharts() {
  return (
    <section
      className="
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
              Analytics
            </h3>

            <p className="mt-1 text-[11px] text-slate-400">
              Visual performance trends and business intelligence.
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BarChart3 size={16} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
        <ChartPlaceholder
          icon={<LineChart size={18} />}
          title="Performance Trends"
          description="Revenue and performance trends will appear here."
        />

        <ChartPlaceholder
          icon={<BarChart3 size={18} />}
          title="Comparative Analysis"
          description="Department and period comparisons will appear here."
        />

        <ChartPlaceholder
          icon={<PieChart size={18} />}
          title="Business Composition"
          description="Category and contribution analysis will appear here."
        />
      </div>
    </section>
  );
}

function ChartPlaceholder({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
        {icon}
      </div>

      <h4 className="mt-4 text-xs font-bold text-slate-700">
        {title}
      </h4>

      <p className="mt-1 text-[11px] leading-5 text-slate-400">
        {description}
      </p>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-2/5 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}