import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const modules = [
  "Inventory Management",
  "Procurement",
  "Sales & Distribution",
  "Warehouse Operations",
  "Finance & Accounting",
  "Business Intelligence",
];

export default function HeroSection() {
  return (
    <div className="relative z-10 max-w-xl">

      {/* Logo */}

      <div className="flex items-center gap-5">

        <div className="rounded-3xl bg-white p-4 shadow-2xl">

          <Image
            src="/logo/tochams-logo.png"
            alt="TOCHAMS ERP"
            width={72}
            height={72}
            priority
          />

        </div>

        <div>

          <h1 className="text-5xl font-black tracking-tight">
            TOCHAMS ERP
          </h1>

          <p className="mt-2 text-lg text-blue-100">
            Enterprise Resource Planning
          </p>

        </div>

      </div>

      {/* Hero */}

      <div className="mt-14">

        <h2 className="text-6xl font-black leading-tight">

          One Platform.

          <br />

          <span className="text-cyan-300">

            Every Department.

          </span>

          <br />

          Complete Control.

        </h2>

        <p className="mt-8 max-w-lg text-lg leading-8 text-blue-100">

          Manage your entire business from one secure,
          intelligent platform.

        </p>

      </div>

      {/* ERP Modules */}

      <div className="mt-12 grid grid-cols-2 gap-5">

        {modules.map((module) => (

          <div
            key={module}
            className="flex items-center gap-3"
          >

            <CheckCircle2
              size={20}
              className="text-cyan-300"
            />

            <span className="text-lg">

              {module}

            </span>

          </div>

        ))}

      </div>

    </div>
  );
}