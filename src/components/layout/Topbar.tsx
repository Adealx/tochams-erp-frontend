"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

import { useSidebar } from "@/components/layout/SidebarContext";
import { useAuth } from "@/context/AuthContext";

/* =========================================================
   CONFIGURATION
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

const notificationApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================================
   TYPES
========================================================= */

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  related_object_type?: string | null;
  related_object_id?: number | null;
  action_url?: string | null;
  is_read: boolean;
  created_at: string;
}

interface SearchItem {
  label: string;
  href: string;
  description: string;
}

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  description?: string;
  href?: string;
  danger?: boolean;
  onClick?: () => void;
}

/* =========================================================
   SEARCH ITEMS
========================================================= */

const searchItems: SearchItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Overview and business performance",
  },
  {
    label: "Customers",
    href: "/customers",
    description: "Manage customer records",
  },
  {
    label: "Sales Orders",
    href: "/sales-orders",
    description: "Create and manage sales orders",
  },
  {
    label: "Invoices",
    href: "/invoices",
    description: "Manage customer invoices",
  },
  {
    label: "Payments",
    href: "/payments",
    description: "Track incoming payments",
  },
  {
    label: "Inventory",
    href: "/inventory",
    description: "Products and stock levels",
  },
  {
    label: "Procurement",
    href: "/procurement",
    description: "Manage purchase requests",
  },
  {
    label: "Vendors",
    href: "/vendors",
    description: "Supplier management",
  },
  {
    label: "Warehouse",
    href: "/warehouse",
    description: "Warehouse operations",
  },
  {
    label: "Accounting",
    href: "/accounting",
    description: "Financial records and accounts",
  },
  {
    label: "Expenses",
    href: "/expenses",
    description: "Track business expenses",
  },
  {
    label: "Transaction Tracker",
    href: "/transactions",
    description: "Monitor business transactions",
  },
  {
    label: "Reports",
    href: "/reports",
    description: "Business and financial reports",
  },
  {
    label: "Users",
    href: "/users",
    description: "Manage system users",
  },
  {
    label: "Attendance",
    href: "/attendance",
    description: "Employee attendance records",
  },
  {
    label: "Settings",
    href: "/settings",
    description: "Configure your workspace",
  },
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access");
}

function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const difference = Math.max(
    0,
    Date.now() - date.getTime()
  );

  const seconds = Math.floor(difference / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() !== new Date().getFullYear()
        ? "numeric"
        : undefined,
  });
}

function getNotificationInitial(
  notification: NotificationItem
): string {
  return (
    notification.title?.charAt(0) || "N"
  ).toUpperCase();
}

function getNotificationItems(
  data: unknown
): NotificationItem[] {
  if (Array.isArray(data)) {
    return data as NotificationItem[];
  }

  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray(data.results)
  ) {
    return data.results as NotificationItem[];
  }

  return [];
}

/* =========================================================
   MENU ITEM COMPONENT
========================================================= */

function MenuItem({
  icon,
  label,
  description,
  href,
  danger = false,
  onClick,
}: MenuItemProps) {
  const className = [
    "flex w-full items-center gap-3",
    "rounded-xl px-3 py-2.5",
    "text-left transition-colors",
    danger
      ? "text-red-600 hover:bg-red-50"
      : "text-gray-700 hover:bg-gray-100",
  ].join(" ");

  const content = (
    <>
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center",
          "justify-center rounded-lg",
          danger
            ? "bg-red-50 text-red-600"
            : "bg-gray-100 text-gray-600",
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">
          {label}
        </span>

        {description && (
          <span className="mt-0.5 block text-xs text-gray-500">
            {description}
          </span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}

/* =========================================================
   TOPBAR COMPONENT
========================================================= */

export default function Topbar() {
  const router = useRouter();

  const { toggleSidebar } = useSidebar();

  const { user, loading, logout } = useAuth();

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const [notificationError, setNotificationError] =
    useState(false);

  const [markingAllRead, setMarkingAllRead] =
    useState(false);

  /* -------------------------------------------------------
     REFS
  ------------------------------------------------------- */

  const profileRef = useRef<HTMLDivElement>(null);

  const notificationRef = useRef<HTMLDivElement>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  /* -------------------------------------------------------
     DATE AND USER DETAILS
  ------------------------------------------------------- */

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const username = user?.username || "User";

  const displayName = username;

  const userRole = user?.role
    ? user.role.replace(/_/g, " ")
    : "Team Member";

  const avatarLetter = displayName
    .charAt(0)
    .toUpperCase();

  /* -------------------------------------------------------
     SEARCH FILTERING
  ------------------------------------------------------- */

  const filteredSearchItems = searchItems.filter(
    (item) => {
      const query = searchQuery.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
  );

  /* =======================================================
     NOTIFICATION API
  ======================================================= */

  const loadNotifications = useCallback(async () => {
    if (loading || !user) {
      setNotifications([]);
      setUnreadCount(0);
      setNotificationError(false);
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setNotificationsLoading(true);
    setNotificationError(false);

    try {
      const response = await notificationApi.get(
        "/notifications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const items = getNotificationItems(data);

      setNotifications(items);

      const serverUnreadCount =
        data &&
        typeof data === "object" &&
        "unread_count" in data
          ? data.unread_count
          : undefined;

      setUnreadCount(
        typeof serverUnreadCount === "number"
          ? serverUnreadCount
          : items.filter((item) => !item.is_read).length
      );
    } catch (error) {
      setNotificationError(true);

      if (axios.isAxiosError(error)) {
        console.error(
          "Unable to load notifications:",
          error.response?.status,
          error.message
        );
      } else {
        console.error(
          "Unable to load notifications:",
          error
        );
      }
    } finally {
      setNotificationsLoading(false);
    }
  }, [user, loading]);

  /* -------------------------------------------------------
     INITIAL LOAD AND AUTOMATIC REFRESH
  ------------------------------------------------------- */

useEffect(() => {
  if (loading || !user) {
    return;
  }

  const timeout = window.setTimeout(() => {
    void loadNotifications();
  }, 0);

  const interval = window.setInterval(() => {
    void loadNotifications();
  }, 30_000);

  return () => {
    window.clearTimeout(timeout);
    window.clearInterval(interval);
  };
}, [user, loading, loadNotifications]);

  /* -------------------------------------------------------
     MARK ONE NOTIFICATION AS READ
  ------------------------------------------------------- */

  const markNotificationAsRead = useCallback(
    async (notificationId: number) => {
      const token = getAuthToken();

      if (!token) {
        return false;
      }

      const targetNotification = notifications.find(
        (item) => item.id === notificationId
      );

      if (
        !targetNotification ||
        targetNotification.is_read
      ) {
        return true;
      }

      try {
        await notificationApi.post(
          `/notifications/${notificationId}/read/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications((current) =>
          current.map((item) =>
            item.id === notificationId
              ? { ...item, is_read: true }
              : item
          )
        );

        setUnreadCount((current) =>
          Math.max(0, current - 1)
        );

        return true;
      } catch (error) {
        console.error(
          "Unable to mark notification as read:",
          error
        );

        void loadNotifications();

        return false;
      }
    },
    [notifications, loadNotifications]
  );

  /* -------------------------------------------------------
     MARK ALL NOTIFICATIONS AS READ
  ------------------------------------------------------- */

  const markAllNotificationsAsRead =
    useCallback(async () => {
      const token = getAuthToken();

      if (
        !token ||
        unreadCount === 0 ||
        markingAllRead
      ) {
        return;
      }

      setMarkingAllRead(true);

      try {
        await notificationApi.post(
          "/notifications/read-all/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications((current) =>
          current.map((item) => ({
            ...item,
            is_read: true,
          }))
        );

        setUnreadCount(0);
      } catch (error) {
        console.error(
          "Unable to mark all notifications as read:",
          error
        );

        void loadNotifications();
      } finally {
        setMarkingAllRead(false);
      }
    }, [
      unreadCount,
      markingAllRead,
      loadNotifications,
    ]);

  /* -------------------------------------------------------
     OPEN A NOTIFICATION
  ------------------------------------------------------- */

  const handleNotificationClick = useCallback(
    async (notification: NotificationItem) => {
      if (!notification.is_read) {
        await markNotificationAsRead(
          notification.id
        );
      }

      setNotificationOpen(false);

      const actionUrl = notification.action_url;
      console.log("Clicked notification action_url:", actionUrl);

      // Only navigate to internal application paths.
      if (
        actionUrl &&
        actionUrl.startsWith("/") &&
        !actionUrl.startsWith("//")
      ) {
        router.push(actionUrl);
      }
    },
    [markNotificationAsRead, router]
  );

  /* =======================================================
     DROPDOWN AND KEYBOARD BEHAVIOUR
  ======================================================= */

  /* -------------------------------------------------------
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ------------------------------------------------------- */

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
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
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* -------------------------------------------------------
     KEYBOARD SHORTCUTS
  ------------------------------------------------------- */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMac = navigator.platform
        .toUpperCase()
        .includes("MAC");

      const modifierPressed = isMac
        ? event.metaKey
        : event.ctrlKey;

      if (
        modifierPressed &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setSearchOpen(true);
        setProfileOpen(false);
        setNotificationOpen(false);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    }

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

  /* -------------------------------------------------------
     FOCUS SEARCH INPUT
  ------------------------------------------------------- */

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      searchRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchOpen]);

  /* -------------------------------------------------------
     LOGOUT
  ------------------------------------------------------- */

  async function handleLogout() {
    setProfileOpen(false);
    setNotificationOpen(false);
    setSearchOpen(false);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.replace("/login");
    }
  }

  /* -------------------------------------------------------
     OPEN SEARCH
  ------------------------------------------------------- */

  function openSearch() {
    setSearchOpen(true);
    setProfileOpen(false);
    setNotificationOpen(false);
  }

  /* -------------------------------------------------------
     OPEN NOTIFICATIONS
  ------------------------------------------------------- */

  function toggleNotifications() {
    const shouldOpen = !notificationOpen;

    setNotificationOpen(shouldOpen);
    setProfileOpen(false);

    if (shouldOpen) {
      void loadNotifications();
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <header className="sticky top-0 z-40 flex h-[70px] items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
        {/* LEFT SECTION */}

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu size={21} />
          </button>

          {/* Desktop Search */}

          <button
            type="button"
            onClick={openSearch}
            className="hidden h-11 w-full max-w-[390px] items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-left transition hover:border-gray-300 hover:bg-gray-100 md:flex"
          >
            <Search
              size={18}
              className="shrink-0 text-gray-400"
            />

            <span className="flex-1 truncate text-sm text-gray-500">
              Search anything...
            </span>

            <span className="flex shrink-0 items-center gap-1 rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-500">
              <Command size={12} />
              <span>K</span>
            </span>
          </button>

          {/* Mobile Search */}

          <button
            type="button"
            onClick={openSearch}
            aria-label="Open search"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 md:hidden"
          >
            <Search size={20} />
          </button>

          <div className="ml-2 hidden items-center gap-2 xl:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-gray-500">
              ERP Workspace
            </span>
          </div>
        </div>

        {/* RIGHT SECTION */}

        <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Date */}

          <div className="hidden items-center gap-2 border-r border-gray-200 pr-4 text-gray-500 lg:flex">
            <CalendarDays size={17} />

            <span className="text-xs font-medium">
              {today}
            </span>
          </div>

          {/* System Status */}

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-xs font-semibold text-emerald-700">
              System Online
            </span>
          </div>

          {/* NOTIFICATIONS */}

          <div
            className="relative"
            ref={notificationRef}
          >
            <button
              type="button"
              onClick={toggleNotifications}
              aria-label={`Notifications${
                unreadCount > 0
                  ? `, ${unreadCount} unread`
                  : ""
              }`}
              aria-expanded={notificationOpen}
              className={[
                "relative flex h-10 w-10",
                "items-center justify-center",
                "rounded-xl transition",
                notificationOpen
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100",
              ].join(" ")}
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-12 z-50 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60">
                {/* Notification Header */}

                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Notifications
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${
                            unreadCount === 1 ? "" : "s"
                          }`
                        : "You're all caught up"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void markAllNotificationsAsRead()
                    }
                    disabled={
                      unreadCount === 0 ||
                      notificationsLoading ||
                      markingAllRead
                    }
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                  >
                    <CheckCheck size={14} />

                    <span>
                      {markingAllRead
                        ? "Updating..."
                        : "Mark all read"}
                    </span>
                  </button>
                </div>

                {/* Notification List */}

                <div className="max-h-[390px] overflow-y-auto">
                  {notificationsLoading &&
                    notifications.length === 0 && (
                      <div className="flex flex-col items-center justify-center px-5 py-12">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

                        <p className="mt-3 text-sm text-gray-500">
                          Loading notifications...
                        </p>
                      </div>
                    )}

                  {notificationError &&
                    notifications.length === 0 && (
                      <div className="px-5 py-10 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
                          <Bell size={20} />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-gray-800">
                          Unable to load notifications
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Check your connection and try again.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            void loadNotifications()
                          }
                          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
                        >
                          Try again
                        </button>
                      </div>
                    )}

                  {!notificationsLoading &&
                    !notificationError &&
                    notifications.length === 0 && (
                      <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                          <Bell size={24} />
                        </div>

                        <h4 className="mt-4 text-sm font-semibold text-gray-800">
                          No notifications yet
                        </h4>

                        <p className="mt-1 max-w-[240px] text-xs leading-5 text-gray-500">
                          Notifications about sales,
                          approvals, invoices, and other
                          activities will appear here.
                        </p>
                      </div>
                    )}

                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() =>
                        void handleNotificationClick(
                          notification
                        )
                      }
                      className={[
                        "flex w-full gap-3",
                        "border-b border-gray-100",
                        "px-4 py-3.5 text-left",
                        "transition hover:bg-gray-50",
                        notification.is_read
                          ? "bg-white"
                          : "bg-blue-50/40",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0",
                          "items-center justify-center",
                          "rounded-xl text-sm font-bold",
                          notification.is_read
                            ? "bg-gray-100 text-gray-500"
                            : "bg-blue-100 text-blue-700",
                        ].join(" ")}
                      >
                        {getNotificationInitial(
                          notification
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span
                            className={[
                              "text-sm",
                              notification.is_read
                                ? "font-medium text-gray-700"
                                : "font-bold text-gray-900",
                            ].join(" ")}
                          >
                            {notification.title}
                          </span>

                          {!notification.is_read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-gray-500">
                          {notification.message}
                        </span>

                        <span className="mt-2 block text-[11px] font-medium text-gray-400">
                          {formatNotificationTime(
                            notification.created_at
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                {/* Notification Footer */}

                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      void loadNotifications()
                    }
                    disabled={notificationsLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                  >
                    <span
                      className={
                        notificationsLoading
                          ? "animate-spin"
                          : ""
                      }
                    >
                      ↻
                    </span>

                    <span>
                      {notificationsLoading
                        ? "Refreshing..."
                        : "Refresh notifications"}
                    </span>
                  </button>

                  <p className="mt-1 text-center text-[10px] text-gray-400">
                    Automatically refreshes every 30 seconds
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SETTINGS SHORTCUT */}

          <Link
            href="/settings"
            aria-label="Settings"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 sm:flex"
          >
            <Settings size={20} />
          </Link>

          {/* PROFILE DROPDOWN */}

          <div
            className="relative border-l border-gray-200 pl-3"
            ref={profileRef}
          >
            <button
              type="button"
              onClick={() => {
                setProfileOpen((current) => !current);
                setNotificationOpen(false);
              }}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-100 sm:gap-3 sm:pl-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                {avatarLetter}
              </span>

              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-[130px] truncate text-sm font-bold text-gray-900">
                  {displayName}
                </span>

                <span className="mt-0.5 block max-w-[130px] truncate text-[11px] capitalize text-gray-500">
                  {userRole}
                </span>
              </span>

              <ChevronDown
                size={16}
                className={[
                  "hidden text-gray-400 transition-transform sm:block",
                  profileOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-[270px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/60">
                {/* User Information */}

                <div className="border-b border-gray-100 px-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white">
                      {avatarLetter}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-gray-900">
                        {displayName}
                      </span>

                      <span className="mt-1 block truncate text-xs text-gray-500">
                        @{username}
                      </span>

                      <span className="mt-1 block text-[11px] capitalize text-gray-400">
                        {userRole}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Profile Menu Items */}

                <div className="space-y-1 py-2">
                  <MenuItem
                    icon={<User size={17} />}
                    label="My Profile"
                    description="View your profile"
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                  />

                  <MenuItem
                    icon={<ShieldCheck size={17} />}
                    label="Security"
                    description="Account security settings"
                    href="/settings/security"
                    onClick={() => setProfileOpen(false)}
                  />

                  <MenuItem
                    icon={<KeyRound size={17} />}
                    label="Account Settings"
                    description="Manage your account"
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                  />

                  <MenuItem
                    icon={<Settings size={17} />}
                    label="System Settings"
                    description="Configure ERP preferences"
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                  />
                </div>

                {/* Logout */}

                <div className="border-t border-gray-100 pt-2">
                  <MenuItem
                    icon={<LogOut size={17} />}
                    label="Sign Out"
                    description="Sign out of your account"
                    danger
                    onClick={() => void handleLogout()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* GLOBAL SEARCH MODAL */}

      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-gray-950/40 px-3 pt-[12vh] backdrop-blur-[2px] sm:px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSearchOpen(false);
            }
          }}
        >
          <div className="w-full max-w-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {/* Search Input */}

            <div className="flex items-center gap-3 border-b border-gray-100 px-4">
              <Search
                size={20}
                className="shrink-0 text-gray-400"
              />

              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search pages, modules, and features..."
                className="h-14 min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearchOpen(false);
                  }

                  if (
                    event.key === "Enter" &&
                    filteredSearchItems.length > 0
                  ) {
                    router.push(
                      filteredSearchItems[0].href
                    );

                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                aria-label="Close search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Results Header */}

            <div className="flex items-center justify-between px-4 pb-2 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Quick Navigation
              </span>

              <span className="text-[11px] text-gray-400">
                {filteredSearchItems.length} results
              </span>
            </div>

            {/* Search Results */}

            <div className="max-h-[55vh] overflow-y-auto px-2 pb-2">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      router.push(item.href);

                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-gray-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Search size={17} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-800">
                        {item.label}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-gray-500">
                        {item.description}
                      </span>
                    </span>

                    <ExternalLink
                      size={15}
                      className="shrink-0 text-gray-300 transition group-hover:text-blue-600"
                    />
                  </button>
                ))
              ) : (
                <div className="px-4 py-10 text-center">
                  <Search
                    size={25}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Try another search term.
                  </p>
                </div>
              )}
            </div>

            {/* Search Footer */}

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3">
              <span className="text-[11px] text-gray-500">
                Navigate your ERP workspace
              </span>

              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <kbd className="rounded border border-gray-200 bg-white px-1.5 py-1">
                  ESC
                </kbd>

                <span>to close</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}