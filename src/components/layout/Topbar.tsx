"use client";

import {
  Bell,
  Search,
  CalendarDays,
  UserCircle2,
  Settings,
  ChevronDown,
  PanelLeft,
} from "lucide-react";

import { useSidebar } from "@/context/SidebarContext";

const today = new Date().toLocaleDateString("en-NG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Topbar() {

  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">

      {/* Left */}

      <div className="flex items-center gap-6">

        <button
          onClick={toggleSidebar}
          className="
            rounded-xl
            p-2
            hover:bg-slate-100
            transition
          "
        >
          <PanelLeft size={22} />
        </button>

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            placeholder="Search anything..."
            className="
              w-80
              rounded-xl
              border
              border-slate-200
              py-2.5
              pl-10
              pr-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <div className="hidden md:flex items-center gap-2 text-slate-500">

          <CalendarDays size={18} />

          <span>{today}</span>

        </div>

        <button className="relative">

          <Bell size={22} />

          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />

        </button>

        <button>

          <Settings size={22} />

        </button>

        <div className="flex items-center gap-2 cursor-pointer">

          <UserCircle2 size={36} />

          <div>

            <p className="text-sm font-semibold">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              Super Admin
            </p>

          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>
  );
}