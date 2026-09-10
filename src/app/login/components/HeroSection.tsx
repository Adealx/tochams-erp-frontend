import Image from "next/image";
import {
  BarChart3,
  Building2,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  ShieldCheck,
  Zap,
} from "lucide-react";

const modules = [
  {
    title: "Inventory",
    description: "Track. Control. Optimize.",
    icon: Package,
  },
  {
    title: "Procurement",
    description: "Source. Approve. Deliver.",
    icon: ShoppingCart,
  },
  {
    title: "Sales & Distribution",
    description: "Sell. Fulfil. Grow.",
    icon: BarChart3,
  },
  {
    title: "Finance & Accounting",
    description: "Accurate. Compliant. Clear.",
    icon: Building2,
  },
  {
    title: "Warehouse",
    description: "Receive. Store. Dispatch.",
    icon: Warehouse,
  },
  {
    title: "Business Intelligence",
    description: "Insight. Decisions. Results.",
    icon: Users,
  },
];

export default function HeroSection() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-white
              shadow-xl
            "
          >
            <Image
              src="/logo/tochams-logo.png"
              alt="TOCHAMS"
              width={64}
              height={64}
              priority
              className="h-9 w-9 object-contain"
            />
          </div>

          <div className="border-l border-white/15 pl-4">

            <h1 className="text-xl font-bold tracking-tight text-white">
              TOCHAMS ERP
            </h1>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-blue-200/70">
              Enterprise Resource Planning
            </p>

          </div>

        </div>

        {/* Top navigation */}

        <div className="hidden items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-200/60 xl:flex">

          <span>People</span>

          <span className="h-1 w-1 rounded-full bg-blue-300/30" />

          <span>Process</span>

          <span className="h-1 w-1 rounded-full bg-blue-300/30" />

          <span>Performance</span>

        </div>

      </div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <div className="mt-20 xl:mt-24">

        <div className="mb-6 flex items-center gap-3">

          <span className="h-[3px] w-12 rounded-full bg-cyan-400" />

          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
            Enterprise Operations
          </span>

        </div>

        <h2
          className="
            max-w-2xl
            text-5xl
            font-black
            leading-[1.03]
            tracking-[-0.045em]
            text-white
            xl:text-[64px]
          "
        >
          One Platform

          <br />

          <span className="text-cyan-300">
            for a Stronger
          </span>

          <br />

          Tomorrow.
        </h2>

        <p
          className="
            mt-7
            max-w-xl
            text-base
            leading-7
            text-blue-100/70
            xl:text-lg
            xl:leading-8
          "
        >
          TOCHAMS ERP connects your sales, procurement, inventory,
          warehouse, finance and business intelligence in one
          integrated enterprise platform.
        </p>

      </div>

      {/* =====================================================
          MODULE CARDS
      ====================================================== */}

      <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 xl:mt-12 xl:grid-cols-3">

        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <div
              key={module.title}
              className="
                group
                rounded-2xl
                border
                border-white/15
                bg-[#071D40]/60
                p-4
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-300/30
                hover:bg-[#0B2A55]/70
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/10
                    text-cyan-300
                    transition
                    group-hover:bg-cyan-400/15
                  "
                >
                  <Icon size={18} />
                </div>

                <div>

                  <h3 className="text-xs font-bold text-white">
                    {module.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-blue-100/50">
                    {module.description}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* =====================================================
          BOTTOM
      ====================================================== */}

      <div className="mt-auto pt-12">

        <div className="flex items-center gap-7 border-t border-white/10 pt-6">

          <TrustItem
            icon={<ShieldCheck size={17} />}
            text="Secure"
          />

          <TrustItem
            icon={<Zap size={17} />}
            text="Reliable"
          />

          <TrustItem
            icon={<BarChart3 size={17} />}
            text="Built for Growth"
          />

        </div>

        <div className="mt-5 flex items-end justify-between">

          <p className="max-w-xs text-xs italic leading-5 text-blue-200/55">
            “Empowering businesses for a stronger tomorrow.”
          </p>

          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-200/40">
            TOCHAMS ERP
          </span>

        </div>

      </div>

    </div>
  );
}

function TrustItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-blue-100/60">

      <span className="text-cyan-300">
        {icon}
      </span>

      {text}

    </div>
  );
}