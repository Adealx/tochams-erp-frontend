"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

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

    return (

        <aside
          className={`
            bg-[#0f172a]
            text-white
            flex
            flex-col
            transition-all
            duration-300
            ${collapsed ? "w-20" : "w-72"}
          `}
        >

            {/* Logo */}

            <div
                className="
                h-20
                border-b
                border-slate-700
                flex
                items-center
                px-8
                "
            >

                {collapsed ? (

    <h1 className="text-2xl font-bold mx-auto">
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

            {/* Menu */}

            <nav
                className="
                flex-1
                px-4
                py-6
                space-y-2
                overflow-y-auto
                "
            >

                {menuGroups.map((group) => (

                  <div key={group.title} className="mb-6">

                    {!collapsed && (
                      <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {group.title}
                      </p>
                    )}

                    <div className="space-y-2">

                      {group.items.map((item) => {

                        const Icon = item.icon;
                        const active = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`
                              flex items-center gap-4 rounded-xl px-4 py-3
                              transition-all duration-200
                              ${
                                active
                                  ? "bg-blue-600 text-white shadow-lg"
                                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                              }
                           `}
                         >
                           <Icon size={20} />

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

            {/* User */}

            <div
                className="
                border-t
                border-slate-700
                p-5
                "
            >

                {!collapsed && (

                    <>

                        <p className="text-sm font-semibold">
                            Administrator
                        </p>

                        <p className="text-xs text-slate-400">
                            Super Admin
                        </p>

                    </>

                )}

            </div>

        </aside>

    );

}