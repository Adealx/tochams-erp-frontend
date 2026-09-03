"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  PanelLeft,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

const today = new Date().toLocaleDateString("en-NG", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function Topbar() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { user, logout, loading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const initial =
    user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 h-[70px] border-b border-slate-200/80 bg-[#f6f7fb]/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <button
            onClick={toggleMobileSidebar}
            aria-label="Open navigation"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm md:hidden"
          >
            <Menu size={19} />
          </button>

          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="hidden h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 md:grid"
          >
            <PanelLeft size={19} />
          </button>

          <div className="relative hidden lg:block">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              aria-label="Search workspace"
              placeholder="Search anything..."
              className="h-10 w-[310px] rounded-xl border border-slate-200 bg-white pl-10 pr-14 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />

            <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
              Ctrl + K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm xl:flex">
            <CalendarDays size={16} className="text-indigo-500" />
            {today}
          </div>

          <button
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <button
            aria-label="Settings"
            className="hidden h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-indigo-600 sm:grid"
          >
            <Settings size={18} />
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2 shadow-sm transition hover:border-indigo-200"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-bold text-white">
                {initial}
              </span>

              <span className="hidden text-left sm:block">
                <span className="block max-w-28 truncate text-xs font-bold text-slate-800">
                  {loading ? "Loading..." : user?.username || "User"}
                </span>

                <span className="block max-w-28 truncate text-[10px] capitalize text-slate-400">
                  {user?.role?.replace("_", " ") || ""}
                </span>
              </span>

              <ChevronDown
                size={15}
                className={`hidden text-slate-400 transition sm:block ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-900/15">
                <div className="border-b border-slate-100 px-1 py-1">
                  <MenuItem
                    icon={<User size={16} />}
                    label="My profile"
                  />

                  <MenuItem
                    icon={<KeyRound size={16} />}
                    label="Security"
                  />

                  <MenuItem
                    icon={<ShieldCheck size={16} />}
                    label="Account settings"
                  />
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50">
      {icon}
      {label}
    </button>
  );
}