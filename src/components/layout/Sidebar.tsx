"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  ClipboardList,
  Receipt,
  CreditCard,
  Truck,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

const menuGroups = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Sales",
    items: [
      {
        title: "Customers",
        href: "/customers",
        icon: Users,
      },
      {
        title: "Sales Orders",
        href: "/sales-orders",
        icon: ShoppingCart,
      },
      {
        title: "Invoices",
        href: "/invoices",
        icon: Receipt,
      },
      {
        title: "Payments",
        href: "/payments",
        icon: CreditCard,
      },
    ],
  },

  {
    title: "Inventory",
    items: [
      {
        title: "Inventory",
        href: "/inventory",
        icon: Package,
      },
      {
        title: "Procurement",
        href: "/procurement",
        icon: ClipboardList,
      },
      {
        title: "Vendors",
        href: "/vendors",
        icon: Truck,
      },
    ],
  },

  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "Administration",
    items: [
      {
        title: "Users",
        href: "/users",
        icon: ShieldCheck,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const { collapsed } = useSidebar();

  const { user } = useAuth();

  return (
    <aside
      className={`
        flex
        flex-col
        bg-slate-950
        text-white
        transition-all
        duration-300
        border-r
        border-slate-800
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      {/* ================= Logo ================= */}

      <div
        className="
          flex
          h-20
          items-center
          border-b
          border-slate-800
          px-6
          shrink-0
        "
      >
        {collapsed ? (
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-blue-600
              font-bold
              text-xl
            "
          >
            T
          </div>
        ) : (
          <div className="px-4 py-5">

    <div
        className="
            rounded-2xl
            bg-white
            p-4
            shadow-md
        "
    >

        <Image
            src="/logo/tochams-logo.png"
            alt="Tochams Distribution Limited"
            width={180}
            height={65}
            priority
            className="mx-auto h-auto w-full object-contain"
        />

    </div>

    <p
        className="
            mt-4
            text-center
            text-xs
            uppercase
            tracking-[0.25em]
            text-slate-400
        "
    >
        Enterprise ERP
    </p>

</div>
        )}
      </div>

      {/* ================= Navigation ================= */}

      <nav
        className="
          flex-1
          overflow-y-auto
          px-4
          py-8
        "
      >
        {menuGroups.map((group) => (
          <div
            key={group.title}
            className="mb-10"
          >
            {!collapsed && (
              <p
                className="
                  mb-4
                  px-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500
                "
              >
                {group.title}
              </p>
            )}

            <div className="space-y-2">
              {group.items.map((item) => {

                const Icon = item.icon;

                const active =
                  pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group
                      relative
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      px-4
                      py-3.5
                      transition-all
                      duration-200

                      ${
                        active
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }
                    `}
                  >
                    {active && (
                      <div
                        className="
                          absolute
                          left-0
                          top-2
                          bottom-2
                          w-1
                          rounded-r-full
                          bg-white
                        "
                      />
                    )}

                    <Icon
                      size={20}
                      className="
                        shrink-0
                      "
                    />

                    {!collapsed && (
                      <span
                        className="
                          text-[15px]
                          font-medium
                        "
                      >
                        {item.title}
                      </span>
                    )}
                  </Link>
                );

              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ================= User ================= */}

      <div
        className="
          border-t
          border-slate-800
          p-5
          shrink-0
        "
      >
        {collapsed ? (
          <div
            className="
              flex
              justify-center
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-blue-600
                text-lg
                font-bold
              "
            >
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        ) : (
          <div
            className="
              rounded-2xl
              bg-slate-900
              p-4
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-600
                  font-bold
                "
              >
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>

                <p
  className="
    font-semibold
    text-white
  "
>
  {user?.username || "Loading..."}
</p>

<p
  className="
    text-sm
    text-slate-400
    capitalize
  "
>
  {user?.role?.replace("_", " ") || ""}
</p>

              </div>

            </div>
          </div>
        )}
      </div>
    </aside>
  );
}