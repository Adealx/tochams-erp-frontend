"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  CreditCard,
  Package,
  Building2,
  Warehouse,
  Calculator,
  Receipt,
  ClipboardList,
  BarChart3,
  UserCog,
  Settings,
  Clock3,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Sales & Distribution",
    items: [
      {
        label: "Customers",
        href: "/customers",
        icon: Users,
      },
      {
        label: "Sales Orders",
        href: "/sales-orders",
        icon: ShoppingCart,
      },
      {
        label: "Invoices",
        href: "/invoices",
        icon: FileText,
      },
      {
        label: "Payments",
        href: "/payments",
        icon: CreditCard,
      },
    ],
  },

  {
    title: "Inventory",
    items: [
      {
        label: "Inventory",
        href: "/inventory",
        icon: Package,
      },
      {
        label: "Procurement",
        href: "/procurement",
        icon: ShoppingCart,
      },
      {
        label: "Vendors",
        href: "/vendors",
        icon: Building2,
      },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        label: "Warehouse",
        href: "/warehouse",
        icon: Warehouse,
      },
    ],
  },

  {
    title: "Finance",
    items: [
      {
        label: "Accounting",
        href: "/accounting",
        icon: Calculator,
      },
      {
        label: "Expenses",
        href: "/expenses",
        icon: Receipt,
      },
      {
        label: "Transaction Tracker",
        href: "/transaction-tracker",
        icon: ClipboardList,
      },
    ],
  },

  {
    title: "Analytics",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "Administration",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: UserCog,
      },
      {
        label: "Attendance",
        href: "/attendance",
        icon: Clock3,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  /*
   * Restore saved sidebar state.
   */
  useEffect(() => {
    const savedState = window.localStorage.getItem(
      "tochams-sidebar-collapsed"
    );

    if (savedState === "true") {
      setCollapsed(true);
    }
  }, []);

  /*
   * Toggle and persist sidebar state.
   */
  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;

      window.localStorage.setItem(
        "tochams-sidebar-collapsed",
        String(next)
      );

      return next;
    });
  }

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <aside
      className={`
        relative
        flex
        h-screen
        shrink-0
        flex-col
        border-r
        border-slate-800/70
        bg-[#071633]
        text-white
        transition-[width]
        duration-300
        ease-in-out
        ${collapsed ? "w-[76px]" : "w-[260px]"}
      `}
    >
      {/* =====================================================
          BRAND
      ====================================================== */}

      <div
        className={`
          relative
          shrink-0
          border-b
          border-white/[0.07]
          transition-all
          duration-300
          ${collapsed ? "px-3 py-5" : "px-5 py-5"}
        `}
      >
        {/* Decorative glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-12
            -top-12
            h-32
            w-32
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <Link
          href="/dashboard"
          title={collapsed ? "TOCHAMS ERP" : undefined}
          className={`
            relative
            flex
            min-w-0
            items-center
            transition-all
            duration-300
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          {/* Logo */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white
              shadow-[0_8px_25px_rgba(0,0,0,0.20)]
            "
          >
            <Image
              src="/logo/tochams-logo.png"
              alt="TOCHAMS"
              width={36}
              height={36}
              priority
              className="h-8 w-8 object-contain"
            />
          </div>

          {/* Brand text */}

          <div
            className={`
              min-w-0
              overflow-hidden
              whitespace-nowrap
              transition-all
              duration-300
              ${
                collapsed
                  ? "w-0 opacity-0"
                  : "w-auto opacity-100"
              }
            `}
          >
            <p
              className="
                truncate
                text-sm
                font-black
                tracking-tight
                text-white
              "
            >
              TOCHAMS ERP
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-[9px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-blue-300/60
              "
            >
              Enterprise Platform
            </p>
          </div>
        </Link>

        {/* =================================================
            COLLAPSE BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="
            absolute
            right-2
            top-1/2
            z-30
            flex
            h-7
            w-7
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-slate-700
            bg-[#0b2147]
            text-slate-400
            shadow-lg
            transition-all
            duration-200
            hover:border-blue-400/40
            hover:bg-blue-600
            hover:text-white
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400/40
          "
        >
          {collapsed ? (
            <ChevronRight
              size={14}
              strokeWidth={2.5}
            />
          ) : (
            <ChevronLeft
              size={14}
              strokeWidth={2.5}
            />
          )}
        </button>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          min-h-0
          flex-1
          overflow-x-hidden
          overflow-y-auto
          px-3
          py-4
          scrollbar-thin
          scrollbar-thumb-white/10
        "
      >
        <div className="space-y-5">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              {/* Group heading */}

              <div
                className={`
                  mb-2
                  overflow-hidden
                  whitespace-nowrap
                  px-3
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.17em]
                  text-slate-500
                  transition-all
                  duration-300
                  ${
                    collapsed
                      ? "h-0 opacity-0"
                      : "h-auto opacity-100"
                  }
                `}
              >
                {group.title}
              </div>

              {/* Navigation items */}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={
                        collapsed
                          ? item.label
                          : undefined
                      }
                      className={`
                        group
                        relative
                        flex
                        min-w-0
                        items-center
                        rounded-xl
                        transition-all
                        duration-200

                        ${
                          collapsed
                            ? "justify-center px-2.5 py-2.5"
                            : "gap-3 px-3 py-2.5"
                        }

                        ${
                          active
                            ? `
                              bg-blue-600/15
                              text-white
                              shadow-[inset_0_0_0_1px_rgba(96,165,250,0.10)]
                            `
                            : `
                              text-slate-400
                              hover:bg-white/[0.045]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {/* Active indicator */}

                      {active && (
                        <span
                          className="
                            absolute
                            left-0
                            top-1/2
                            h-6
                            w-[3px]
                            -translate-y-1/2
                            rounded-r-full
                            bg-gradient-to-b
                            from-cyan-300
                            to-blue-500
                          "
                        />
                      )}

                      {/* Icon */}

                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all
                          duration-200

                          ${
                            active
                              ? "bg-blue-500/15 text-cyan-300"
                              : "text-slate-500 group-hover:bg-white/[0.05] group-hover:text-blue-300"
                          }
                        `}
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.9}
                        />
                      </span>

                      {/* Label */}

                      <span
                        className={`
                          min-w-0
                          overflow-hidden
                          whitespace-nowrap
                          truncate
                          text-[12px]
                          transition-all
                          duration-300
                          ${
                            active
                              ? "font-bold"
                              : "font-medium"
                          }
                          ${
                            collapsed
                              ? "w-0 flex-none opacity-0"
                              : "w-auto flex-1 opacity-100"
                          }
                        `}
                      >
                        {item.label}
                      </span>

                      {/* Active arrow */}

                      {active && !collapsed && (
                        <ChevronRight
                          size={14}
                          className="
                            shrink-0
                            text-blue-300
                          "
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* =====================================================
          SYSTEM STATUS
      ====================================================== */}

      <div
        className={`
          shrink-0
          border-t
          border-white/[0.07]
          transition-all
          duration-300
          ${collapsed ? "px-3 py-3" : "px-4 py-3"}
        `}
      >
        <div
          title={
            collapsed
              ? "System Operational"
              : undefined
          }
          className={`
            flex
            items-center
            rounded-xl
            border
            border-emerald-400/10
            bg-emerald-400/[0.045]
            transition-all
            duration-300
            ${
              collapsed
                ? "justify-center px-2 py-3"
                : "gap-3 px-3 py-2.5"
            }
          `}
        >
          {/* Status indicator */}

          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                animate-ping
                rounded-full
                bg-emerald-400
                opacity-50
              "
            />

            <span
              className="
                relative
                inline-flex
                h-2
                w-2
                rounded-full
                bg-emerald-400
              "
            />
          </span>

          {/* Status text */}

          <div
            className={`
              min-w-0
              overflow-hidden
              whitespace-nowrap
              transition-all
              duration-300
              ${
                collapsed
                  ? "w-0 opacity-0"
                  : "w-auto opacity-100"
              }
            `}
          >
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-emerald-300
              "
            >
              System Operational
            </p>

            <p
              className="
                mt-0.5
                text-[8px]
                text-slate-500
              "
            >
              TOCHAMS ERP v1.0.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}