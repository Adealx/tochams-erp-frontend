"use client";

import {
  Bell,
  Search,
  CalendarDays,
  Settings,
  ChevronDown,
  PanelLeft,
} from "lucide-react";

import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

const today = new Date().toLocaleDateString("en-NG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Topbar() {
  const { toggleSidebar } = useSidebar();

  const { user } = useAuth();

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-[72px]
        border-b
        border-slate-200
        bg-white/95
        backdrop-blur
        shadow-sm
      "
    >
      <div
        className="
          flex
          h-full
          items-center
          justify-between
          px-8
        "
      >
        {/* ================================= */}
        {/* LEFT */}
        {/* ================================= */}

        <div className="flex items-center gap-6">

          {/* Sidebar Toggle */}

          <button
            onClick={toggleSidebar}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              transition-all
              hover:bg-slate-100
              hover:shadow-sm
            "
          >
            <PanelLeft size={20} />
          </button>

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search customers, invoices, products..."
              className="
                h-11
                w-[420px]
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-20
                text-sm
                transition-all
                outline-none

                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <span
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                rounded-lg
                border
                border-slate-200
                bg-white
                px-2
                py-1
                text-[11px]
                font-medium
                text-slate-400
              "
            >
              Ctrl + K
            </span>

          </div>

        </div>

        {/* ================================= */}
        {/* RIGHT */}
        {/* ================================= */}

        <div className="flex items-center gap-4">

          {/* Date */}

          <div
            className="
              hidden
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-2
              lg:flex
            "
          >
            <CalendarDays
              size={18}
              className="text-blue-600"
            />

            <span
              className="
                text-sm
                font-medium
                text-slate-600
              "
            >
              {today}
            </span>

          </div>

          {/* Notifications */}

          <button
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              transition-all
              hover:bg-slate-100
            "
          >
            <Bell size={20} />

            <span
              className="
                absolute
                right-2
                top-2
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-white
                bg-red-500
              "
            />
          </button>

          {/* Settings */}

          <button
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              transition-all
              hover:rotate-90
              hover:bg-slate-100
            "
          >
            <Settings size={20} />
          </button>

          {/* ================================= */}
          {/* Profile */}
          {/* ================================= */}

          <button
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-2
              transition-all
              hover:bg-slate-50
              hover:shadow-sm
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-blue-600
                text-white
                font-bold
              "
            >
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="text-left">

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {user?.username || "Loading..."}
              </p>

              <p
                className="
                  text-xs
                  text-slate-500
                  capitalize
                "
              >
                {user?.role?.replace("_", " ") || ""}
              </p>

            </div>

            <ChevronDown
              size={18}
              className="text-slate-500"
            />

          </button>

        </div>

      </div>
    </header>
  );
}