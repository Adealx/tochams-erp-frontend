"use client";

import { useEffect, useRef, useState } from "react";

import {
  Bell,
  Search,
  CalendarDays,
  Settings,
  ChevronDown,
  PanelLeft,
  User,
  KeyRound,
  LogOut,
  ShieldCheck,
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

  const { user, logout, loading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

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
        {/* ============================= */}
        {/* LEFT */}
        {/* ============================= */}

        <div className="flex items-center gap-6">

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

        {/* ============================= */}
        {/* RIGHT */}
        {/* ============================= */}

        <div className="flex items-center gap-4">

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

          {/* ============================= */}
          {/* USER MENU */}
          {/* ============================= */}

          <div
            className="relative"
            ref={menuRef}
          >

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
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
                  text-lg
                  font-bold
                "
              >
                {user?.username
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>

              <div className="text-left">

                {loading ? (
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                ) : (
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-900
                    "
                  >
                    {user?.username}
                  </p>
                )}

                {loading ? (
                  <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-200" />
                ) : (
                  <p
                    className="
                      text-xs
                      capitalize
                      text-slate-500
                    "
                  >
                    {user?.role?.replace("_", " ")}
                  </p>
                )}

              </div>

              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  menuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {menuOpen && (
                            <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-72
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-2xl
                  animate-in
                  fade-in
                  zoom-in-95
                  duration-200
                "
              >
                {/* Header */}

                <div className="border-b border-slate-100 p-5">

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-600
                        text-xl
                        font-bold
                        text-white
                      "
                    >
                      {user?.username
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        {user?.username}
                      </p>

                      <p className="text-sm text-slate-500">
                        {user?.email}
                      </p>

                      <span
                        className="
                          mt-2
                          inline-flex
                          rounded-full
                          bg-blue-100
                          px-2
                          py-1
                          text-xs
                          font-semibold
                          capitalize
                          text-blue-700
                        "
                      >
                        {user?.role?.replace("_", " ")}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Menu */}

                <div className="py-2">

                  <button
                    onClick={() => setMenuOpen(false)}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-5
                      py-3
                      text-sm
                      text-slate-700
                      transition-colors
                      hover:bg-slate-100
                    "
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => setMenuOpen(false)}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-5
                      py-3
                      text-sm
                      text-slate-700
                      transition-colors
                      hover:bg-slate-100
                    "
                  >
                    <KeyRound size={18} />
                    <span>Change Password</span>
                  </button>

                  <button
                    onClick={() => setMenuOpen(false)}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-5
                      py-3
                      text-sm
                      text-slate-700
                      transition-colors
                      hover:bg-slate-100
                    "
                  >
                    <ShieldCheck size={18} />
                    <span>Account Settings</span>
                  </button>

                </div>

                {/* Footer */}

                <div className="border-t border-slate-100 p-2">

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-red-600
                      transition-all
                      hover:bg-red-50
                    "
                  >
                    <LogOut size={18} />

                    <span>Logout</span>

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>

  );

}