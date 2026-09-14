"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Timer,
  Users,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import {
  Attendance,
  AttendanceStatus,
  checkIn,
  checkOut,
  getAttendance,
  getAttendanceSummary,
  getTodayAttendance,
} from "@/services/attendanceService";

type Summary = {
  total_records: number;
  early: number;
  on_time: number;
  late: number;
  very_late: number;
  location_verified: number;
  location_not_verified: number;
};

type VerificationFilter = "all" | "verified" | "unverified";

type ManagementFilters = {
  startDate: string;
  endDate: string;
  statusFilter: AttendanceStatus | "all";
  verificationFilter: VerificationFilter;
  search: string;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getApiErrorMessage(
  err: any,
  fallback = "Something went wrong.",
) {
  const data = err?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.detail) {
    return String(data.detail);
  }

  if (data?.message) {
    return String(data.message);
  }

  if (data && typeof data === "object") {
    const messages = Object.entries(data)
      .flatMap(([field, value]) => {
        if (Array.isArray(value)) {
          return value.map((item) => {
            const cleanField = field.replace(/_/g, " ");
            return `${cleanField}: ${String(item)}`;
          });
        }

        const cleanField = field.replace(/_/g, " ");
        return [`${cleanField}: ${String(value)}`];
      })
      .join(" • ");

    if (messages) {
      return messages;
    }
  }

  if (err?.message) {
    return String(err.message);
  }

  return fallback;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";

  /*
   * Django TimeField values arrive as:
   * "08:00:00"
   *
   * new Date("08:00:00") is invalid in the browser,
   * so handle time-only values separately.
   */
  const timeOnly = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (timeOnly) {
    const hours = Number(timeOnly[1]);
    const minutes = Number(timeOnly[2]);

    if (
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59
    ) {
      const localDate = new Date(
        2000,
        0,
        1,
        hours,
        minutes,
      );

      return localDate.toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  /*
   * Work dates are date-only strings from Django:
   * YYYY-MM-DD
   */
  const dateOnly = value.match(
    /^(\d{4})-(\d{2})-(\d{2})$/,
  );

  if (dateOnly) {
    const localDate = new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
    );

    return localDate.toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMinutes(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  const absolute = Math.abs(value);

  if (absolute < 60) {
    return `${absolute} min`;
  }

  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;

  return minutes
    ? `${hours}h ${minutes}m`
    : `${hours}h`;
}

function formatDistance(
  value: string | number | null | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const distance = Number(value);

  if (Number.isNaN(distance)) {
    return String(value);
  }

  return `${distance.toFixed(2)} m`;
}

function formatAccuracy(
  value: string | number | null | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const accuracy = Number(value);

  if (Number.isNaN(accuracy)) {
    return String(value);
  }

  return `${accuracy.toFixed(1)} m`;
}

function statusLabel(status: AttendanceStatus | string) {
  switch (status) {
    case "early":
      return "Early";

    case "on_time":
      return "On Time";

    case "late":
      return "Late";

    case "very_late":
      return "Very Late";

    default:
      return status || "Unknown";
  }
}

function statusClasses(status: AttendanceStatus | string) {
  switch (status) {
    case "early":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case "on_time":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "late":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "very_late":
      return "bg-red-50 text-red-700 ring-red-600/20";

    default:
      return "bg-slate-100 text-slate-600 ring-slate-500/20";
  }
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          {description && (
            <p className="mt-1 truncate text-[10px] text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

function LocationBadge({
  verified,
}: {
  verified: boolean;
}) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-600/20">
        <ShieldCheck size={12} />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-amber-600/20">
      <MapPin size={12} />
      Unverified
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AttendancePage() {
  const [attendance, setAttendance] =
    useState<Attendance | null>(null);

  const [summary, setSummary] =
    useState<Summary | null>(null);

  const [records, setRecords] =
    useState<Attendance[]>([]);

  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [applyingFilters, setApplyingFilters] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [managementAvailable, setManagementAvailable] =
    useState(false);

  /*
   * Draft filter values.
   *
   * These can change freely without immediately hitting
   * the API. The user clicks "Apply Filters" to execute
   * the query.
   */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<AttendanceStatus | "all">("all");

  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("all");

  const [search, setSearch] = useState("");

  /*
   * These are the filters actually being used by the
   * management register.
   *
   * This prevents every keystroke in Search from causing
   * another API request.
   */
  const [appliedFilters, setAppliedFilters] =
    useState<ManagementFilters>({
      startDate: "",
      endDate: "",
      statusFilter: "all",
      verificationFilter: "all",
      search: "",
    });

  /* ---------------------------------------------------------------------- */
  /* Browser GPS                                                            */
  /* ---------------------------------------------------------------------- */

  const getBrowserLocation = useCallback(
    (): Promise<{
      latitude: number;
      longitude: number;
      gps_accuracy?: number;
    } | null> => {
      return new Promise((resolve) => {
        if (
          typeof navigator === "undefined" ||
          !navigator.geolocation
        ) {
          resolve(null);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              gps_accuracy: position.coords.accuracy,
            });
          },
          () => {
            /*
             * GPS is deliberately optional.
             *
             * If the employee denies permission, the browser
             * has no location service, or the request times out,
             * attendance can still be recorded.
             */
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      });
    },
    [],
  );

  /* ---------------------------------------------------------------------- */
  /* Today's Attendance                                                     */
  /* ---------------------------------------------------------------------- */

  const loadToday = useCallback(async () => {
    const result = await getTodayAttendance();

    setAttendance(result.attendance ?? null);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Management Data                                                        */
  /* ---------------------------------------------------------------------- */

  const loadManagementData = useCallback(
    async (filters: ManagementFilters) => {
      const params = {
        ...(filters.startDate
          ? { start_date: filters.startDate }
          : {}),

        ...(filters.endDate
          ? { end_date: filters.endDate }
          : {}),

        ...(filters.statusFilter !== "all"
          ? { status: filters.statusFilter }
          : {}),

        ...(filters.verificationFilter !== "all"
          ? {
              location_verified:
                filters.verificationFilter === "verified",
            }
          : {}),

        ...(filters.search.trim()
          ? { search: filters.search.trim() }
          : {}),
      };

      /*
       * Summary intentionally follows the selected date period.
       * The register itself follows all selected filters.
       */
      const summaryParams = {
        ...(filters.startDate
          ? { start_date: filters.startDate }
          : {}),

        ...(filters.endDate
          ? { end_date: filters.endDate }
          : {}),
      };

      const [list, stats] = await Promise.all([
        getAttendance(params),
        getAttendanceSummary(summaryParams),
      ]);

      setRecords(list);
      setSummary(stats);
      setManagementAvailable(true);
    },
    [],
  );

  /* ---------------------------------------------------------------------- */
  /* Initial Page Load                                                      */
  /* ---------------------------------------------------------------------- */

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await loadToday();

      try {
        await loadManagementData(appliedFilters);
      } catch {
        /*
         * Ordinary employees may not have management
         * permissions. Their personal attendance should
         * still load normally.
         */
        setManagementAvailable(false);
      }
    } catch (err: any) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to load attendance.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [
    loadToday,
    loadManagementData,
    appliedFilters,
  ]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  /* ---------------------------------------------------------------------- */
  /* Check In                                                               */
  /* ---------------------------------------------------------------------- */

  const handleCheckIn = async () => {
    /*
     * Prevent duplicate check-in attempts from the UI.
     *
     * The backend remains the final authority and also protects
     * against duplicate attendance records.
     */
    if (attendance) {
      setMessage(
        "Attendance has already been recorded for today.",
      );
      setError("");
      return;
    }

    setCheckingIn(true);
    setMessage("");
    setError("");

    try {
      /*
       * Request browser GPS once at the point of check-in.
       *
       * GPS is optional. If it is unavailable, the attendance
       * record is still submitted using location_method = "none".
       */
      const location = await getBrowserLocation();

      const result = await checkIn(
        location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              gps_accuracy: location.gps_accuracy,
              location_method: "gps",
            }
          : {
              location_method: "none",
            },
      );

      /*
       * Backend response is authoritative.
       */
      setAttendance(result.attendance);
      setMessage(result.message);

      /*
       * Refresh management data after a successful check-in.
       * This is optional for ordinary employees.
       */
      try {
        await loadManagementData(appliedFilters);
      } catch {
        // Management view is optional.
      }
    } catch (err: any) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to record attendance.",
        ),
      );
    } finally {
      setCheckingIn(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Check Out                                                              */
  /* ---------------------------------------------------------------------- */

  const handleCheckOut = async () => {
    setCheckingOut(true);
    setMessage("");
    setError("");

    try {
      const result = await checkOut();

      setAttendance(result.attendance);
      setMessage(result.message);

      try {
        await loadManagementData(appliedFilters);
      } catch {
        // Management view is optional.
      }
    } catch (err: any) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to record checkout.",
        ),
      );
    } finally {
      setCheckingOut(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Refresh                                                                */
  /* ---------------------------------------------------------------------- */

  const refresh = async () => {
    setRefreshing(true);
    setMessage("");
    setError("");

    try {
      await loadToday();

      if (managementAvailable) {
        await loadManagementData(appliedFilters);
      }

      setMessage("Attendance refreshed.");
    } catch (err: any) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to refresh attendance.",
        ),
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Filters                                                                 */
  /* ---------------------------------------------------------------------- */

  const applyFilters = async () => {
    const filters: ManagementFilters = {
      startDate,
      endDate,
      statusFilter,
      verificationFilter,
      search,
    };

    setAppliedFilters(filters);
    setApplyingFilters(true);
    setMessage("");
    setError("");

    try {
      await loadManagementData(filters);
      setMessage("Attendance filters applied.");
    } catch (err: any) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to apply attendance filters.",
        ),
      );
    } finally {
      setApplyingFilters(false);
    }
  };

  const clearFilters = async () => {
    const filters: ManagementFilters = {
      startDate: "",
      endDate: "",
      statusFilter: "all",
      verificationFilter: "all",
      search: "",
    };

    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setVerificationFilter("all");
    setSearch("");
    setAppliedFilters(filters);

    setApplyingFilters(true);
    setMessage("");
    setError("");

    try {
      await loadManagementData(filters);
      setMessage("Attendance filters cleared.");
    } catch (err: any) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to clear attendance filters.",
        ),
      );
    } finally {
      setApplyingFilters(false);
    }
  };

  const hasDraftFilters =
    Boolean(startDate) ||
    Boolean(endDate) ||
    statusFilter !== "all" ||
    verificationFilter !== "all" ||
    Boolean(search.trim());

  const hasAppliedFilters =
    Boolean(appliedFilters.startDate) ||
    Boolean(appliedFilters.endDate) ||
    appliedFilters.statusFilter !== "all" ||
    appliedFilters.verificationFilter !== "all" ||
    Boolean(appliedFilters.search.trim());

  /* ---------------------------------------------------------------------- */
  /* Attendance State                                                       */
  /* ---------------------------------------------------------------------- */

  const attendanceState = useMemo(() => {
    if (!attendance) {
      return "not_checked_in";
    }

    if (attendance.logout_at) {
      return "checked_out";
    }

    return "checked_in";
  }, [attendance]);

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <AppShell
      title="Attendance"
      subtitle="Monitor staff resumption, working hours and workplace location verification."
      breadcrumbs={[
        { label: "Administration" },
        { label: "Attendance" },
      ]}
      actions={[
        {
          label: refreshing ? "Refreshing..." : "Refresh",
          href: "#refresh",
        },
      ]}
    >
      {loading ? (
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200/70" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 7 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl bg-slate-200/70"
                />
              ),
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ---------------------------------------------------------------- */}
          {/* Messages                                                         */}
          {/* ---------------------------------------------------------------- */}

          {message && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={17} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />
              <span>{error}</span>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* TODAY'S ATTENDANCE                                               */}
          {/* ---------------------------------------------------------------- */}

          <section
            id="refresh"
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)]"
          >
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-black text-slate-950">
                        Today&apos;s Attendance
                      </h2>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        {attendance?.work_date
                          ? formatDate(
                              attendance.work_date,
                            )
                          : "Today"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Official server attendance and
                      workplace verification.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={refresh}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>
              </div>
            </div>

            {!attendance ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Timer size={28} />
                </div>

                <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">
                  You have not checked in today
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Check in to record the official server
                  timestamp. If browser location is
                  available, the system will also verify
                  your distance from the nearest registered
                  office.
                </p>

                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="mt-7 inline-flex min-w-48 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkingIn ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                      Checking in...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Check In
                    </>
                  )}
                </button>

                <p className="mt-3 text-[11px] text-slate-400">
                  Location permission is optional.
                  Attendance can still be recorded if GPS is
                  unavailable.
                </p>
              </div>
            ) : (
              <div className="p-5 sm:p-6">
                {/* ---------------------------------------------------------- */}
                {/* Attendance Header                                           */}
                {/* ---------------------------------------------------------- */}

                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ${statusClasses(
                          attendance.status,
                        )}`}
                      >
                        {statusLabel(
                          attendance.status,
                        )}
                      </span>

                      <LocationBadge
                        verified={
                          attendance.location_verified
                        }
                      />

                      {attendanceState ===
                        "checked_out" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-500/10">
                          <CheckCircle2 size={13} />
                          Day Completed
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
                      {attendanceState ===
                      "checked_out"
                        ? "Attendance completed for today"
                        : "You are checked in"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {attendance.schedule_name
                        ? `${attendance.schedule_name} · Scheduled ${formatTime(
                            attendance.scheduled_resumption,
                          )}`
                        : `Scheduled ${formatTime(
                            attendance.scheduled_resumption,
                          )}`}
                    </p>
                  </div>

                  {attendanceState ===
                    "checked_in" && (
                    <button
                      type="button"
                      onClick={handleCheckOut}
                      disabled={checkingOut}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {checkingOut ? (
                        <>
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />
                          Checking out...
                        </>
                      ) : (
                        <>
                          <Clock3 size={16} />
                          Check Out
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* ---------------------------------------------------------- */}
                {/* Attendance Metrics                                          */}
                {/* ---------------------------------------------------------- */}

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      label: "Scheduled",
                      value: formatTime(
                        attendance.scheduled_resumption,
                      ),
                    },
                    {
                      label: "Check In",
                      value: formatTime(
                        attendance.login_at,
                      ),
                    },
                    {
                      label: "Check Out",
                      value: formatTime(
                        attendance.logout_at,
                      ),
                    },
                    {
                      label:
                        attendance.status ===
                        "early"
                          ? "Early By"
                          : "Late By",
                      value: formatMinutes(
                        attendance.minutes_difference,
                      ),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {item.label}
                      </p>

                      <p className="mt-2 text-lg font-black text-slate-950">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ---------------------------------------------------------- */}
                {/* Workplace Location                                          */}
                {/* ---------------------------------------------------------- */}

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                        <MapPin size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-950">
                          Workplace Location
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {attendance.office_name ||
                            attendance.location_name ||
                            "Location unavailable"}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {attendance.location_verified
                            ? "Attendance location is within a registered office radius."
                            : "Location could not be verified. Attendance was still recorded."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5 sm:min-w-[300px]">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Distance
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {formatDistance(
                            attendance.distance_from_office,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          GPS Accuracy
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {formatAccuracy(
                            attendance.gps_accuracy,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Method
                        </p>

                        <p className="mt-1 text-sm font-bold uppercase text-slate-800">
                          {attendance.location_method ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* MANAGEMENT VIEW                                                  */}
          {/* ---------------------------------------------------------------- */}

          {managementAvailable && summary && (
            <>
              {/* ------------------------------------------------------------ */}
              {/* Attendance Overview                                          */}
              {/* ------------------------------------------------------------ */}

              <section>
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Users
                        size={18}
                        className="text-blue-500"
                      />

                      <h2 className="font-black text-slate-950">
                        Attendance Overview
                      </h2>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Management and HR attendance
                      register.
                    </p>
                  </div>

                  <p className="text-[11px] font-medium text-slate-400">
                    {summary.total_records} attendance
                    record
                    {summary.total_records === 1
                      ? ""
                      : "s"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                  <StatCard
                    label="Total"
                    value={summary.total_records}
                    icon={<Users size={17} />}
                    description="Records in selected period"
                  />

                  <StatCard
                    label="Early"
                    value={summary.early}
                    icon={<Timer size={17} />}
                  />

                  <StatCard
                    label="On Time"
                    value={summary.on_time}
                    icon={
                      <CheckCircle2 size={17} />
                    }
                  />

                  <StatCard
                    label="Late"
                    value={summary.late}
                    icon={<Clock3 size={17} />}
                  />

                  <StatCard
                    label="Very Late"
                    value={summary.very_late}
                    icon={<XCircle size={17} />}
                  />

                  <StatCard
                    label="Verified"
                    value={summary.location_verified}
                    icon={
                      <ShieldCheck size={17} />
                    }
                  />

                  <StatCard
                    label="Unverified"
                    value={
                      summary.location_not_verified
                    }
                    icon={<MapPin size={17} />}
                  />
                </div>
              </section>

              {/* ------------------------------------------------------------ */}
              {/* FILTERS                                                       */}
              {/* ------------------------------------------------------------ */}

              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] sm:p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Filter
                      size={17}
                      className="text-blue-500"
                    />

                    <div>
                      <h2 className="text-sm font-black text-slate-950">
                        Attendance Filters
                      </h2>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Narrow the register without
                        changing the underlying attendance
                        records.
                      </p>
                    </div>
                  </div>

                  {hasDraftFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      disabled={applyingFilters}
                      className="text-xs font-bold text-blue-600 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  {/* Start Date */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) =>
                        setStartDate(
                          event.target.value,
                        )
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      onChange={(event) =>
                        setEndDate(
                          event.target.value,
                        )
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Status
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(
                          event.target
                            .value as
                            | AttendanceStatus
                            | "all",
                        )
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                    >
                      <option value="all">
                        All statuses
                      </option>

                      <option value="early">
                        Early
                      </option>

                      <option value="on_time">
                        On Time
                      </option>

                      <option value="late">
                        Late
                      </option>

                      <option value="very_late">
                        Very Late
                      </option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Location
                    </label>

                    <select
                      value={verificationFilter}
                      onChange={(event) =>
                        setVerificationFilter(
                          event.target
                            .value as VerificationFilter,
                        )
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                    >
                      <option value="all">
                        All locations
                      </option>

                      <option value="verified">
                        Verified
                      </option>

                      <option value="unverified">
                        Unverified
                      </option>
                    </select>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Search
                    </label>

                    <div className="relative mt-1.5">
                      <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                          setSearch(
                            event.target.value,
                          )
                        }
                        placeholder="Staff or workplace..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[11px] text-slate-400">
                    {hasAppliedFilters
                      ? "Register is showing the currently applied filters."
                      : "Showing all available attendance records."}
                  </div>

                  <button
                    type="button"
                    onClick={applyFilters}
                    disabled={applyingFilters}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {applyingFilters ? (
                      <>
                        <RefreshCw
                          size={14}
                          className="animate-spin"
                        />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Filter size={14} />
                        Apply Filters
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* ------------------------------------------------------------ */}
              {/* ATTENDANCE REGISTER                                          */}
              {/* ------------------------------------------------------------ */}

              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)]">
                <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-sm font-black text-slate-950">
                      Attendance Register
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Staff attendance records and
                      location verification.
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                    {records.length} record
                    {records.length === 1
                      ? ""
                      : "s"}
                  </div>
                </div>

                {records.length === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                      <Users size={20} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      No attendance records found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try adjusting the selected filters.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-[980px] w-full text-left">
                      <thead className="bg-slate-50">
                        <tr className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          <th className="px-5 py-3">
                            Staff
                          </th>

                          <th className="px-5 py-3">
                            Date
                          </th>

                          <th className="px-5 py-3">
                            Scheduled
                          </th>

                          <th className="px-5 py-3">
                            Check In
                          </th>

                          <th className="px-5 py-3">
                            Check Out
                          </th>

                          <th className="px-5 py-3">
                            Status
                          </th>

                          <th className="px-5 py-3">
                            Location
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {records.map(
                          (record) => (
                            <tr
                              key={record.id}
                              className="transition hover:bg-slate-50/80"
                            >
                              {/* Staff */}
                              <td className="px-5 py-4">
                                <div className="font-semibold text-slate-900">
                                  {
                                    record.staff_name
                                  }
                                </div>

                                <div className="mt-0.5 text-[11px] text-slate-400">
                                  {
                                    record.staff_username
                                  }
                                </div>
                              </td>

                              {/* Date */}
                              <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                                {formatDate(
                                  record.work_date,
                                )}
                              </td>

                              {/* Scheduled */}
                              <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                                {formatTime(
                                  record.scheduled_resumption,
                                )}
                              </td>

                              {/* Check In */}
                              <td className="whitespace-nowrap px-5 py-4 text-xs font-bold text-slate-700">
                                {formatTime(
                                  record.login_at,
                                )}
                              </td>

                              {/* Check Out */}
                              <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                                {formatTime(
                                  record.logout_at,
                                )}
                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClasses(
                                    record.status,
                                  )}`}
                                >
                                  {statusLabel(
                                    record.status,
                                  )}
                                </span>
                              </td>

                              {/* Location */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <LocationBadge
                                    verified={
                                      record.location_verified
                                    }
                                  />

                                  {record.office_name && (
                                    <span className="max-w-44 truncate text-[10px] text-slate-400">
                                      {
                                        record.office_name
                                      }
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
}