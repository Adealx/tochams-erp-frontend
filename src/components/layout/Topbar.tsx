"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";

import {
  Bell,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  Command,
  ExternalLink,
  KeyRound,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

/* =========================================================
   DATE
========================================================= */

const today = new Date().toLocaleDateString("en-NG", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

/* =========================================================
   SEARCH ITEMS
========================================================= */

const searchItems = [
  {
    label: "Dashboard",
    description: "ERP overview",
    href: "/dashboard",
  },
  {
    label: "Customers",
    description: "Customer management",
    href: "/customers",
  },
  {
    label: "Sales Orders",
    description: "Sales order management",
    href: "/sales-orders",
  },
  {
    label: "Invoices",
    description: "Invoices and receivables",
    href: "/invoices",
  },
  {
    label: "Payments",
    description: "Payment records",
    href: "/payments",
  },
  {
    label: "Inventory",
    description: "Stock and inventory",
    href: "/inventory",
  },
  {
    label: "Procurement",
    description: "Procurement management",
    href: "/procurement",
  },
  {
    label: "Vendors",
    description: "Vendor management",
    href: "/vendors",
  },
  {
    label: "Warehouse",
    description: "Warehouse operations",
    href: "/warehouse",
  },
  {
    label: "Accounting",
    description: "Financial accounting",
    href: "/accounting",
  },
  {
    label: "Expenses",
    description: "Expense management",
    href: "/expenses",
  },
  {
    label: "Transaction Tracker",
    description: "Financial transaction tracking",
    href: "/transaction-tracker",
  },
  {
    label: "Reports",
    description: "Business reports and analytics",
    href: "/reports",
  },
  {
    label: "Users",
    description: "User management",
    href: "/users",
  },
  {
    label: "Attendance",
    description: "Employee attendance",
    href: "/attendance",
  },
  {
    label: "Settings",
    description: "System configuration",
    href: "/settings",
  },
];

/* =========================================================
   TOPBAR
========================================================= */

export default function Topbar() {
  const { toggleMobileSidebar } = useSidebar();

  const { user, logout, loading } = useAuth();

  /* =======================================================
     STATE
  ======================================================= */

  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  /* =======================================================
     REFS
  ======================================================= */

  const profileRef = useRef<HTMLDivElement>(null);

  const notificationRef =
    useRef<HTMLDivElement>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  /* =======================================================
     SEARCH RESULTS
  ======================================================= */

  const filteredSearchItems = searchItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      item.label.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  /* =======================================================
     INITIAL
  ======================================================= */

  const initial =
    user?.username?.charAt(0).toUpperCase() || "U";

  /* =======================================================
     CLOSE OUTSIDE MENUS
  ======================================================= */

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleMouseDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown
      );
    };
  }, []);

  /* =======================================================
     KEYBOARD SHORTCUTS

     IMPORTANT:
     Use globalThis.KeyboardEvent here because
     document.addEventListener expects the native browser
     KeyboardEvent, not React.KeyboardEvent.
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: globalThis.KeyboardEvent
    ) => {
      const modifier =
        event.ctrlKey || event.metaKey;

      /* Ctrl/Cmd + K */

      if (
        modifier &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setSearchOpen(true);
        setProfileOpen(false);
        setNotificationOpen(false);

        setTimeout(() => {
          searchRef.current?.focus();
        }, 50);
      }

      /* Escape */

      if (event.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* =======================================================
     SEARCH OPEN
  ======================================================= */

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 50);
    }
  }, [searchOpen]);

  /* =======================================================
     PROFILE
  ======================================================= */

  function handleLogout() {
    setProfileOpen(false);
    logout();
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          TOPBAR
      =================================================== */}

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
              LEFT
          ================================================= */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
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
                transition-all
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600
                md:hidden
              "
            >
              <Menu size={19} />
            </button>

            {/* =================================================
                DESKTOP SEARCH
            ================================================= */}

            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setProfileOpen(false);
                setNotificationOpen(false);
              }}
              className="
                group
                hidden
                h-10
                w-[360px]
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-slate-50/70
                px-3.5
                text-left
                transition-all
                hover:border-blue-200
                hover:bg-white
                hover:shadow-sm
                lg:flex
              "
            >
              <Search
                size={16}
                className="
                  shrink-0
                  text-slate-400
                  transition
                  group-hover:text-blue-500
                "
              />

              <span
                className="
                  min-w-0
                  flex-1
                  truncate
                  text-sm
                  text-slate-400
                "
              >
                Search customers, invoices, orders...
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-0.5
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  px-1.5
                  py-0.5
                  text-[9px]
                  font-bold
                  text-slate-400
                  shadow-sm
                "
              >
                <Command size={9} />
                K
              </span>
            </button>

            {/* =================================================
                TABLET STATUS
            ================================================= */}

            <div
              className="
                hidden
                items-center
                gap-2
                md:flex
                lg:hidden
              "
            >
              <span
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
              RIGHT
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
              sm:gap-3
            "
          >
            {/* =================================================
                DATE
            ================================================= */}

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

            {/* =================================================
                SYSTEM STATUS
            ================================================= */}

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
                  shadow-[0_0_0_3px_rgba(16,185,129,0.12)]
                "
              />

              Operational
            </div>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(
                    (open) => !open
                  );

                  setProfileOpen(false);
                }}
                aria-label="Notifications"
                aria-expanded={notificationOpen}
                aria-haspopup="true"
                className={`
                  relative
                  grid
                  h-10
                  w-10
                  place-items-center
                  rounded-xl
                  border
                  bg-white
                  shadow-sm
                  transition-all
                  ${
                    notificationOpen
                      ? "border-blue-300 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
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

              {/* Notification panel */}

              {notificationOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    mt-3
                    w-[340px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    shadow-slate-900/10
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-slate-100
                      px-4
                      py-3.5
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-sm
                          font-bold
                          text-slate-900
                        "
                      >
                        Notifications
                      </h3>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          text-slate-400
                        "
                      >
                        Recent ERP activity
                      </p>
                    </div>

                    <button
                      type="button"
                      className="
                        inline-flex
                        items-center
                        gap-1
                        text-[10px]
                        font-semibold
                        text-blue-600
                        hover:text-blue-700
                      "
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </button>
                  </div>

                  <div
                    className="
                      border-b
                      border-slate-100
                      px-4
                      py-3
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <div className="flex gap-3">
                      <div
                        className="
                          grid
                          h-9
                          w-9
                          shrink-0
                          place-items-center
                          rounded-xl
                          bg-amber-50
                          text-amber-600
                        "
                      >
                        <Bell size={16} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            text-xs
                            font-semibold
                            text-slate-800
                          "
                        >
                          Notifications are ready
                        </p>

                        <p
                          className="
                            mt-1
                            text-[11px]
                            leading-5
                            text-slate-500
                          "
                        >
                          Your ERP notification center
                          is ready for live workflow
                          events.
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            font-medium
                            text-slate-400
                          "
                        >
                          System
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="
                      px-4
                      py-3
                      text-center
                    "
                  >
                    <button
                      type="button"
                      className="
                        inline-flex
                        items-center
                        gap-1
                        text-xs
                        font-semibold
                        text-blue-600
                        hover:text-blue-700
                      "
                    >
                      View all notifications
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                SETTINGS
            ================================================= */}

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
                transition-all
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600
                sm:grid
              "
            >
              <Settings size={18} />
            </Link>

            {/* =================================================
                PROFILE
            ================================================= */}

            <div
              ref={profileRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(
                    (open) => !open
                  );

                  setNotificationOpen(false);
                }}
                aria-label="Open user menu"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className={`
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  bg-white
                  py-1.5
                  pl-1.5
                  pr-2
                  shadow-sm
                  transition-all
                  ${
                    profileOpen
                      ? "border-blue-300 bg-blue-50/40"
                      : "border-slate-200 hover:border-blue-200 hover:bg-blue-50/40"
                  }
                `}
              >
                {/* Avatar */}

                <span
                  className="
                    grid
                    h-8
                    w-8
                    place-items-center
                    rounded-lg
                    bg-gradient-to-br
                    from-blue-600
                    to-indigo-700
                    text-xs
                    font-black
                    text-white
                    shadow-sm
                  "
                >
                  {initial}
                </span>

                {/* Identity */}

                <span
                  className="
                    hidden
                    text-left
                    sm:block
                  "
                >
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
                    {user?.role?.replace("_", " ") ||
                      "ERP User"}
                  </span>
                </span>

                <ChevronDown
                  size={15}
                  className={`
                    hidden
                    text-slate-400
                    transition-transform
                    sm:block
                    ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    mt-3
                    w-72
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
                  {/* Identity header */}

                  <div
                    className="
                      mb-1
                      rounded-xl
                      bg-slate-50
                      px-3
                      py-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className="
                          grid
                          h-10
                          w-10
                          shrink-0
                          place-items-center
                          rounded-xl
                          bg-gradient-to-br
                          from-blue-600
                          to-indigo-700
                          text-sm
                          font-black
                          text-white
                        "
                      >
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-sm
                            font-bold
                            text-slate-800
                          "
                        >
                          {user?.username || "User"}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[10px]
                            capitalize
                            text-slate-400
                          "
                        >
                          {user?.role?.replace(
                            "_",
                            " "
                          ) || "ERP User"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile actions */}

                  <div
                    className="
                      border-b
                      border-slate-100
                      pb-1
                    "
                  >
                    <MenuItem
                      icon={<User size={16} />}
                      label="My profile"
                    />

                    <MenuItem
                      icon={<KeyRound size={16} />}
                      label="Security"
                    />

                    <MenuItem
                      icon={
                        <ShieldCheck size={16} />
                      }
                      label="Account settings"
                    />

                    <Link
                      href="/settings"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        text-slate-600
                        transition
                        hover:bg-slate-50
                        hover:text-slate-900
                      "
                    >
                      <Settings size={16} />
                      System settings
                    </Link>
                  </div>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
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

      {/* =====================================================
          GLOBAL SEARCH OVERLAY
      ====================================================== */}

      {searchOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-start
            justify-center
            bg-slate-950/40
            px-4
            pt-[12vh]
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setSearchOpen(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              shadow-slate-950/20
            "
          >
            {/* Search header */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-slate-100
                px-4
                py-3
              "
            >
              <Search
                size={19}
                className="text-slate-400"
              />

              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search the TOCHAMS ERP..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-sm
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                "
              />

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                aria-label="Close search"
                className="
                  grid
                  h-7
                  w-7
                  place-items-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <X size={15} />
              </button>
            </div>

            {/* Search results */}

            <div
              className="
                max-h-[60vh]
                overflow-y-auto
                p-2
              "
            >
              {filteredSearchItems.length > 0 ? (
                <>
                  <div
                    className="
                      px-3
                      py-2
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-slate-400
                    "
                  >
                    ERP navigation
                  </div>

                  {filteredSearchItems.map(
                    (item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="
                          group
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          transition
                          hover:bg-blue-50
                        "
                      >
                        <div
                          className="
                            grid
                            h-9
                            w-9
                            shrink-0
                            place-items-center
                            rounded-lg
                            bg-slate-100
                            text-slate-500
                            transition
                            group-hover:bg-blue-100
                            group-hover:text-blue-600
                          "
                        >
                          <Search size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              text-sm
                              font-semibold
                              text-slate-800
                            "
                          >
                            {item.label}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[10px]
                              text-slate-400
                            "
                          >
                            {item.description}
                          </p>
                        </div>

                        <ExternalLink
                          size={14}
                          className="
                            text-slate-300
                            transition
                            group-hover:text-blue-500
                          "
                        />
                      </Link>
                    )
                  )}
                </>
              ) : (
                <div
                  className="
                    px-6
                    py-12
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      mb-3
                      grid
                      h-12
                      w-12
                      place-items-center
                      rounded-2xl
                      bg-slate-100
                      text-slate-400
                    "
                  >
                    <Search size={20} />
                  </div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    No results found
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    Try another search term.
                  </p>
                </div>
              )}
            </div>

            {/* Search footer */}

            <div
              className="
                flex
                items-center
                justify-between
                border-t
                border-slate-100
                bg-slate-50/70
                px-4
                py-2.5
                text-[9px]
                text-slate-400
              "
            >
              <span>
                Navigate through your ERP
              </span>

              <span className="font-semibold">
                ESC to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   MENU ITEM
========================================================= */

function MenuItem({
  icon,
  label,
}: {
  icon: ReactNode;
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