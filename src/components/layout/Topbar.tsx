"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
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
  const { toggleMobileSidebar } = useSidebar();
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
    <header
      className="
        sticky
        top-0
        z-30
        h-[70px]
        shrink-0
        border-b
        border-slate-200/80
        bg-white/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          h-full
          items-center
          justify-between
          gap-4
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}

          <button
            type="button"
            onClick={toggleMobileSidebar}
            aria-label="Open navigation"
            className="
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-sm
              transition
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
              md:hidden
            "
          >
            <Menu size={19} />
          </button>

          {/* Search */}

          <div className="relative hidden lg:block">
            <Search
              size={16}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              aria-label="Search workspace"
              placeholder="Search anything..."
              className="
                h-10
                w-[320px]
                rounded-xl
                border
                border-slate-200
                bg-slate-50/70
                pl-10
                pr-16
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-300
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            />

            <span
              className="
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                rounded-md
                border
                border-slate-200
                bg-white
                px-1.5
                py-0.5
                text-[9px]
                font-semibold
                text-slate-400
                shadow-sm
              "
            >
              Ctrl + K
            </span>
          </div>

          {/* Mobile workspace indicator */}

          <div
            className="
              hidden
              items-center
              gap-2
              md:flex
              lg:hidden
            "
          >
            <div
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-500
                shadow-[0_0_0_4px_rgba(16,185,129,0.10)]
              "
            />

            <span
              className="
                text-xs
                font-semibold
                text-slate-500
              "
            >
              ERP Operational
            </span>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Date */}

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-xs
              font-medium
              text-slate-500
              shadow-sm
              xl:flex
            "
          >
            <CalendarDays
              size={15}
              className="text-blue-500"
            />

            {today}
          </div>

          {/* System status */}

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-3
              py-2
              text-[10px]
              font-bold
              text-emerald-700
              xl:flex
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500
              "
            />

            Operational
          </div>

          {/* Notifications */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              grid
              h-10
              w-10
              place-items-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-500
              shadow-sm
              transition
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <Bell size={18} />

            <span
              className="
                absolute
                right-2
                top-2
                h-1.5
                w-1.5
                rounded-full
                bg-rose-500
                ring-2
                ring-white
              "
            />
          </button>

          {/* Settings */}

          <Link
            href="/settings"
            aria-label="Settings"
            className="
              hidden
              h-10
              w-10
              place-items-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-500
              shadow-sm
              transition
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
              sm:grid
            "
          >
            <Settings size={18} />
          </Link>

          {/* =================================================
              USER MENU
          ================================================== */}

          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setMenuOpen((open) => !open)
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                py-1.5
                pl-1.5
                pr-2
                shadow-sm
                transition
                hover:border-blue-200
                hover:bg-blue-50/40
              "
            >
              <span
                className="
                  grid
                  h-7
                  w-7
                  place-items-center
                  rounded-lg
                  bg-gradient-to-br
                  from-blue-500
                  to-indigo-600
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                "
              >
                {initial}
              </span>

              <span className="hidden text-left sm:block">
                <span
                  className="
                    block
                    max-w-28
                    truncate
                    text-xs
                    font-bold
                    text-slate-800
                  "
                >
                  {loading
                    ? "Loading..."
                    : user?.username || "User"}
                </span>

                <span
                  className="
                    block
                    max-w-28
                    truncate
                    text-[10px]
                    capitalize
                    text-slate-400
                  "
                >
                  {user?.role?.replace("_", " ") || ""}
                </span>
              </span>

              <ChevronDown
                size={15}
                className={`
                  hidden
                  text-slate-400
                  transition
                  sm:block
                  ${menuOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* User dropdown */}

            {menuOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-64
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-1.5
                  shadow-2xl
                  shadow-slate-900/15
                "
              >
                {/* User identity */}

                <div
                  className="
                    mb-1
                    border-b
                    border-slate-100
                    px-3
                    py-3
                  "
                >
                  <p
                    className="
                      text-xs
                      font-bold
                      text-slate-800
                    "
                  >
                    {user?.username || "User"}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      capitalize
                      text-slate-400
                    "
                  >
                    {user?.role?.replace("_", " ") ||
                      "ERP User"}
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-1">
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
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="
                    mt-1
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-rose-600
                    transition
                    hover:bg-rose-50
                  "
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
    <button
      type="button"
      className="
        flex
        w-full
        items-center
        gap-2
        rounded-xl
        px-3
        py-2.5
        text-left
        text-sm
        text-slate-600
        transition
        hover:bg-slate-50
        hover:text-slate-900
      "
    >
      {icon}

      {label}
    </button>
  );
}