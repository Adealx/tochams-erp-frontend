"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
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
  Warehouse,
  Calculator,
  BarChart3,
  Settings,
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
    title: "Operations",
    items: [
      {
        title: "Warehouse",
        href: "/warehouse",
        icon: Warehouse,
      },
    ],
  },

  {
    title: "Finance",
    items: [
      {
        title: "Accounting",
        href: "/accounting",
        icon: Calculator,
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
        icon: Users,
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
  const { user, loading } = useAuth();

  return (
    <aside
      className={`
        flex
        flex-col
        bg-[#0f172a]
        text-white
        transition-all
        duration-300
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      {/* Logo */}

      <div
        className="
          flex
          h-20
          shrink-0
          items-center
          border-b
          border-slate-700
          px-8
        "
      >
        {collapsed ? (
          <h1 className="mx-auto text-2xl font-bold">
            T
          </h1>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">
              TOCHAMS
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise ERP
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}

      <nav
        className="
          flex-1
          overflow-y-auto
          px-4
          py-6
        "
      >
        {menuGroups.map((group) => (
          <div
            key={group.title}
            className="mb-6"
          >
            {!collapsed && (
              <p
                className="
                  mb-2
                  px-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
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
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    className={`
                      flex
                      items-center
                      gap-4
                      rounded-xl
                      px-4
                      py-3
                      transition-all
                      duration-200

                      ${
                        active
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }

                      ${collapsed ? "justify-center" : ""}
                    `}
                  >
                    <Icon
                      size={20}
                      className="shrink-0"
                    />

                    {!collapsed && (
                      <span className="font-medium">
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

      {/* Authenticated User */}

      <div
        className="
          shrink-0
          border-t
          border-slate-700
          p-5
        "
      >
        {collapsed ? (
          <div className="flex justify-center">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-blue-600
                text-sm
                font-bold
              "
            >
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-900 p-3">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-600
                  text-sm
                  font-bold
                "
              >
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {loading
                    ? "Loading..."
                    : user?.username || "User"}
                </p>

                <p className="truncate text-xs capitalize text-slate-400">
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
