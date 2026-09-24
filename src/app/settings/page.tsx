"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Building2,
  CalendarClock,
  Check,
  Clock3,
  CreditCard,
  Globe2,
  Palette,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  AttendanceStaff,
  createStaffSchedule,
  createWorkSchedule,
  deleteStaffSchedule,
  deleteWorkSchedule,
  getAttendanceStaff,
  getStaffSchedules,
  getWorkSchedules,
  StaffScheduleAssignment,
  updateStaffSchedule,
  updateWorkSchedule,
  WorkSchedule,
  WorkSchedulePayload,
} from "@/services/attendanceService";

/* =========================================================
   GENERAL SETTINGS
========================================================= */

type Settings = {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  invoicePrefix: string;
  approvals: boolean;
  lowStock: boolean;
  paymentAlerts: boolean;
};

const defaults: Settings = {
  companyName: "Tochams Distribution Limited",
  email: "accounts@tochams.com",
  phone: "+234",
  address: "Nigeria",
  currency: "NGN — Nigerian Naira",
  timezone: "Africa/Lagos (WAT)",
  invoicePrefix: "INV-",
  approvals: true,
  lowStock: true,
  paymentAlerts: true,
};

const input =
  "mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100";

/* =========================================================
   MAIN SETTINGS PAGE
========================================================= */

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<Settings>(defaults);

  const [active, setActive] =
    useState("Company");

  useEffect(() => {
    const saved = window.localStorage.getItem(
      "tochams-erp-settings"
    );

    if (saved) {
      try {
        setSettings({
          ...defaults,
          ...JSON.parse(saved),
        });
      } catch {
        // Ignore invalid local settings.
      }
    }
  }, []);

  const update = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const save = () => {
    window.localStorage.setItem(
      "tochams-erp-settings",
      JSON.stringify(settings)
    );

    toast.success(
      "Settings saved on this device"
    );
  };

  const nav = [
    {
      label: "Company",
      icon: Building2,
    },
    {
      label: "Finance",
      icon: CreditCard,
    },
    {
      label: "Notifications",
      icon: Bell,
    },
    {
      label: "Access",
      icon: Users,
    },
    {
      label: "Attendance",
      icon: CalendarClock,
    },
    {
      label: "Appearance",
      icon: Palette,
    },
  ];

  return (
    <AppShell
      title="Settings"
      subtitle="Control your organization profile, finance defaults, attendance and workspace preferences."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Settings",
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* SETTINGS SIDEBAR */}

        <aside className="h-fit rounded-[20px] border border-slate-200/90 bg-white p-3 shadow-[0_6px_20px_rgba(15,23,42,.035)]">
          <p className="px-3 pb-3 pt-2 text-[11px] font-bold uppercase tracking-[.1em] text-slate-400">
            Workspace settings
          </p>

          {nav.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() =>
                  setActive(item.label)
                }
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active === item.label
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* SETTINGS CONTENT */}

        <div className="space-y-6">
          {active === "Company" && (
            <CompanySettings
              settings={settings}
              update={update}
              save={save}
            />
          )}

          {active === "Finance" && (
            <FinanceSettings
              settings={settings}
              update={update}
              save={save}
            />
          )}

          {active === "Notifications" && (
            <NotificationSettings
              settings={settings}
              update={update}
              save={save}
            />
          )}

          {active === "Attendance" && (
            <AttendanceSettings />
          )}

          {active === "Access" && (
            <ComingSoon
              icon={UserCog}
              title="Access management"
              description="Manage roles, permissions and employee access to ERP modules."
            />
          )}

          {active === "Appearance" && (
            <ComingSoon
              icon={Palette}
              title="Appearance"
              description="Workspace appearance and interface preferences will be managed here."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* =========================================================
   COMPANY SETTINGS
========================================================= */

function CompanySettings({
  settings,
  update,
  save,
}: {
  settings: Settings;
  update: <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => void;
  save: () => void;
}) {
  return (
    <>
      <SettingsSection
        icon={Building2}
        iconClass="bg-indigo-50 text-indigo-600"
        title="Organization profile"
        description="Business information shown on documents and reports."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Company name">
            <input
              value={settings.companyName}
              onChange={(event) =>
                update(
                  "companyName",
                  event.target.value
                )
              }
              className={input}
            />
          </Field>

          <Field label="Business email">
            <input
              type="email"
              value={settings.email}
              onChange={(event) =>
                update(
                  "email",
                  event.target.value
                )
              }
              className={input}
            />
          </Field>

          <Field label="Phone number">
            <input
              value={settings.phone}
              onChange={(event) =>
                update(
                  "phone",
                  event.target.value
                )
              }
              className={input}
            />
          </Field>

          <Field label="Business address">
            <input
              value={settings.address}
              onChange={(event) =>
                update(
                  "address",
                  event.target.value
                )
              }
              className={input}
            />
          </Field>
        </div>
      </SettingsSection>

      <SaveBar onSave={save} />
    </>
  );
}

/* =========================================================
   FINANCE SETTINGS
========================================================= */

function FinanceSettings({
  settings,
  update,
  save,
}: {
  settings: Settings;
  update: <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => void;
  save: () => void;
}) {
  return (
    <>
      <SettingsSection
        icon={Globe2}
        iconClass="bg-emerald-50 text-emerald-600"
        title="Finance and regional settings"
        description="Set the common defaults used throughout the ERP."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Currency">
            <select
              value={settings.currency}
              onChange={(event) =>
                update(
                  "currency",
                  event.target.value
                )
              }
              className={input}
            >
              <option>
                NGN — Nigerian Naira
              </option>
              <option>
                USD — US Dollar
              </option>
              <option>
                GBP — Pound Sterling
              </option>
            </select>
          </Field>

          <Field label="Timezone">
            <select
              value={settings.timezone}
              onChange={(event) =>
                update(
                  "timezone",
                  event.target.value
                )
              }
              className={input}
            >
              <option>
                Africa/Lagos (WAT)
              </option>
              <option>UTC</option>
            </select>
          </Field>

          <Field label="Invoice prefix">
            <input
              value={settings.invoicePrefix}
              onChange={(event) =>
                update(
                  "invoicePrefix",
                  event.target.value
                )
              }
              className={input}
            />
          </Field>
        </div>
      </SettingsSection>

      <SaveBar onSave={save} />
    </>
  );
}

/* =========================================================
   NOTIFICATION SETTINGS
========================================================= */

function NotificationSettings({
  settings,
  update,
  save,
}: {
  settings: Settings;
  update: <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => void;
  save: () => void;
}) {
  return (
    <>
      <SettingsSection
        icon={Bell}
        iconClass="bg-amber-50 text-amber-600"
        title="Controls and notifications"
        description="Choose which operational events need attention."
      >
        <div className="divide-y divide-slate-100">
          <Toggle
            label="Require purchase-order approval"
            description="New purchase orders must be reviewed before approval."
            checked={settings.approvals}
            onChange={(value) =>
              update("approvals", value)
            }
          />

          <Toggle
            label="Low stock alerts"
            description="Notify relevant team members when stock reaches reorder level."
            checked={settings.lowStock}
            onChange={(value) =>
              update("lowStock", value)
            }
          />

          <Toggle
            label="Payment notifications"
            description="Notify accounts when a customer payment is recorded."
            checked={settings.paymentAlerts}
            onChange={(value) =>
              update(
                "paymentAlerts",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      <SaveBar onSave={save} />
    </>
  );
}

/* =========================================================
   ATTENDANCE SETTINGS
========================================================= */

function AttendanceSettings() {
  const [tab, setTab] =
    useState<"schedules" | "assignments">(
      "schedules"
    );

  const [schedules, setSchedules] =
    useState<WorkSchedule[]>([]);

  const [assignments, setAssignments] =
    useState<StaffScheduleAssignment[]>(
      []
    );

  const [staff, setStaff] =
    useState<AttendanceStaff[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    showScheduleModal,
    setShowScheduleModal,
  ] = useState(false);

  const [
    showAssignmentModal,
    setShowAssignmentModal,
  ] = useState(false);

  const [
    editingSchedule,
    setEditingSchedule,
  ] = useState<WorkSchedule | null>(
    null
  );

  const [
    editingAssignment,
    setEditingAssignment,
  ] =
    useState<StaffScheduleAssignment | null>(
      null
    );

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        scheduleData,
        assignmentData,
        staffData,
      ] = await Promise.all([
        getWorkSchedules(),
        getStaffSchedules(),
        getAttendanceStaff(),
      ]);

      setSchedules(scheduleData);
      setAssignments(assignmentData);
      setStaff(staffData);
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to load attendance settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateSchedule = () => {
    setEditingSchedule(null);
    setShowScheduleModal(true);
  };

  const openEditSchedule = (
    schedule: WorkSchedule
  ) => {
    setEditingSchedule(schedule);
    setShowScheduleModal(true);
  };

  const openCreateAssignment = () => {
    setEditingAssignment(null);
    setShowAssignmentModal(true);
  };

  const openEditAssignment = (
    assignment: StaffScheduleAssignment
  ) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const removeSchedule = async (
    schedule: WorkSchedule
  ) => {
    if (
      !window.confirm(
        `Delete "${schedule.name}"?`
      )
    ) {
      return;
    }

    try {
      await deleteWorkSchedule(
        schedule.id
      );

      toast.success(
        "Work schedule deleted"
      );

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error(
        "This schedule may already be assigned to staff. Deactivate it instead."
      );
    }
  };

  const removeAssignment = async (
    assignment: StaffScheduleAssignment
  ) => {
    if (
      !window.confirm(
        "Remove this staff schedule assignment?"
      )
    ) {
      return;
    }

    try {
      await deleteStaffSchedule(
        assignment.id
      );

      toast.success(
        "Schedule assignment removed"
      );

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to remove assignment"
      );
    }
  };

  const activeSchedules = useMemo(
    () =>
      schedules.filter(
        (schedule) =>
          schedule.is_active
      ),
    [schedules]
  );

  return (
    <>
      {/* ATTENDANCE HEADER */}

      <div className="rounded-[20px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)] sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <CalendarClock size={19} />
            </span>

            <div>
              <h2 className="font-semibold text-slate-900">
                Attendance Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure work schedules and
                assign them to staff members.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">
            {activeSchedules.length} active{" "}
            {activeSchedules.length === 1
              ? "schedule"
              : "schedules"}
          </div>
        </div>

        {/* ATTENDANCE TABS */}

        <div className="mt-6 flex gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() =>
              setTab("schedules")
            }
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === "schedules"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Clock3 size={16} />
            Work Schedules
          </button>

          <button
            onClick={() =>
              setTab("assignments")
            }
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === "assignments"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Users size={16} />
            Staff Assignments
          </button>
        </div>
      </div>

      {/* WORK SCHEDULES */}

      {tab === "schedules" && (
        <div className="rounded-[20px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h3 className="font-semibold text-slate-900">
                Work Schedules
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Define when employees are expected
                to resume and close work.
              </p>
            </div>

            <button
              onClick={openCreateSchedule}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus size={16} />
              Add Schedule
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : schedules.length === 0 ? (
            <EmptyState
              icon={Clock3}
              title="No work schedules"
              description="Create your first work schedule to start managing attendance."
              action="Create Schedule"
              onClick={openCreateSchedule}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {schedules.map(
                (schedule) => (
                  <ScheduleRow
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={() =>
                      openEditSchedule(
                        schedule
                      )
                    }
                    onDelete={() =>
                      removeSchedule(
                        schedule
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* STAFF ASSIGNMENTS */}

      {tab === "assignments" && (
        <div className="rounded-[20px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h3 className="font-semibold text-slate-900">
                Staff Schedule Assignments
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Assign a work schedule to each
                employee.
              </p>
            </div>

            <button
              onClick={openCreateAssignment}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus size={16} />
              Assign Schedule
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : assignments.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No staff assignments"
              description="Assign work schedules to employees so attendance can calculate punctuality."
              action="Assign Schedule"
              onClick={openCreateAssignment}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Staff
                    </th>

                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Schedule
                    </th>

                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Effective From
                    </th>

                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map(
                    (assignment) => (
                      <AssignmentRow
                        key={assignment.id}
                        assignment={
                          assignment
                        }
                        onEdit={() =>
                          openEditAssignment(
                            assignment
                          )
                        }
                        onDelete={() =>
                          removeAssignment(
                            assignment
                          )
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}

      {showScheduleModal && (
        <ScheduleModal
          schedule={editingSchedule}
          onClose={() =>
            setShowScheduleModal(false)
          }
          onSaved={async () => {
            setShowScheduleModal(false);
            await loadData();
          }}
        />
      )}

      {showAssignmentModal && (
        <AssignmentModal
          assignment={editingAssignment}
          staff={staff}
          schedules={activeSchedules}
          onClose={() =>
            setShowAssignmentModal(false)
          }
          onSaved={async () => {
            setShowAssignmentModal(false);
            await loadData();
          }}
        />
      )}
    </>
  );
}

/* =========================================================
   SCHEDULE ROW
========================================================= */

function ScheduleRow({
  schedule,
  onEdit,
  onDelete,
}: {
  schedule: WorkSchedule;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const days = getScheduleDays(schedule);

  return (
    <div className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <Clock3 size={20} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-slate-900">
              {schedule.name}
            </h4>

            <StatusBadge
              active={schedule.is_active}
            />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>
              {formatTime(
                schedule.resumption_time
              )}{" "}
              –{" "}
              {formatTime(
                schedule.closing_time
              )}
            </span>

            <span>
              Grace:{" "}
              <strong className="font-medium text-slate-700">
                {schedule.grace_period_minutes}{" "}
                min
              </strong>
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {days.map((day) => (
              <span
                key={day}
                className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={onDelete}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          title="Delete schedule"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   ASSIGNMENT ROW
   IMPORTANT: RETURNS ONLY <tr>
========================================================= */

function AssignmentRow({
  assignment,
  onEdit,
  onDelete,
}: {
  assignment: StaffScheduleAssignment;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
            {getInitials(
              assignment.staff_name ||
                assignment.staff_username ||
                "ST"
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {assignment.staff_name ||
                assignment.staff_username ||
                `Staff #${assignment.staff}`}
            </p>

            {assignment.staff_username && (
              <p className="text-xs text-slate-400">
                @{assignment.staff_username}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700">
          {assignment.schedule_name ||
            `Schedule #${assignment.schedule}`}
        </span>
      </td>

      <td className="px-5 py-4 text-sm text-slate-600">
        {assignment.effective_from
          ? formatDate(
              assignment.effective_from
            )
          : "Immediately"}
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          active={assignment.is_active}
        />
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            title="Edit assignment"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={onDelete}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Remove assignment"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   WORK SCHEDULE MODAL
========================================================= */

function ScheduleModal({
  schedule,
  onClose,
  onSaved,
}: {
  schedule: WorkSchedule | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] =
    useState<WorkSchedulePayload>(() => ({
      name: schedule?.name || "",
      resumption_time:
        schedule?.resumption_time ||
        "08:00",
      closing_time:
        schedule?.closing_time ||
        "17:00",
      grace_period_minutes:
        schedule?.grace_period_minutes ??
        10,

      monday:
        schedule?.monday ?? true,
      tuesday:
        schedule?.tuesday ?? true,
      wednesday:
        schedule?.wednesday ?? true,
      thursday:
        schedule?.thursday ?? true,
      friday:
        schedule?.friday ?? true,
      saturday:
        schedule?.saturday ?? false,
      sunday:
        schedule?.sunday ?? false,

      is_active:
        schedule?.is_active ?? true,
    }));

  const [saving, setSaving] =
    useState(false);

  const update = <
    K extends keyof WorkSchedulePayload
  >(
    key: K,
    value: WorkSchedulePayload[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error(
        "Schedule name is required"
      );
      return;
    }

    try {
      setSaving(true);

      if (schedule) {
        await updateWorkSchedule(
          schedule.id,
          form
        );

        toast.success(
          "Work schedule updated"
        );
      } else {
        await createWorkSchedule(form);

        toast.success(
          "Work schedule created"
        );
      }

      await onSaved();
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to save work schedule"
      );
    } finally {
      setSaving(false);
    }
  };

  const days = [
    ["monday", "Monday"],
    ["tuesday", "Tuesday"],
    ["wednesday", "Wednesday"],
    ["thursday", "Thursday"],
    ["friday", "Friday"],
    ["saturday", "Saturday"],
    ["sunday", "Sunday"],
  ] as const;

  return (
    <Modal
      title={
        schedule
          ? "Edit Work Schedule"
          : "Create Work Schedule"
      }
      description="Define the working hours and attendance rules for this schedule."
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <Field label="Schedule name">
          <input
            value={form.name}
            onChange={(event) =>
              update(
                "name",
                event.target.value
              )
            }
            placeholder="e.g. Standard Office"
            className={input}
            autoFocus
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Resumption time">
            <input
              type="time"
              value={form.resumption_time}
              onChange={(event) =>
                update(
                  "resumption_time",
                  event.target.value
                )
              }
              className={input}
            />
          </Field>

          <Field label="Closing time">
            <input
              type="time"
              value={form.closing_time}
              onChange={(event) =>
                update(
                  "closing_time",
                  event.target.value
                )
              }
              className={input}
            />
          </Field>
        </div>

        <Field label="Grace period (minutes)">
          <input
            type="number"
            min={0}
            value={
              form.grace_period_minutes
            }
            onChange={(event) =>
              update(
                "grace_period_minutes",
                Number(
                  event.target.value
                )
              )
            }
            className={input}
          />
        </Field>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Working days
          </label>

          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {days.map(
              ([key, label]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                    form[key]
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(event) =>
                      update(
                        key,
                        event.target
                          .checked
                      )
                    }
                    className="accent-indigo-600"
                  />

                  {label}
                </label>
              )
            )}
          </div>
        </div>

        <Toggle
          label="Active schedule"
          description="Inactive schedules cannot be assigned to staff."
          checked={form.is_active}
          onChange={(value) =>
            update(
              "is_active",
              value
            )
          }
        />

        <ModalActions
          onClose={onClose}
          saving={saving}
          label={
            schedule
              ? "Save Changes"
              : "Create Schedule"
          }
        />
      </form>
    </Modal>
  );
}

/* =========================================================
   STAFF ASSIGNMENT MODAL
========================================================= */

function AssignmentModal({
  assignment,
  staff,
  schedules,
  onClose,
  onSaved,
}: {
  assignment: StaffScheduleAssignment | null;
  staff: AttendanceStaff[];
  schedules: WorkSchedule[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [staffId, setStaffId] =
    useState(
      assignment?.staff
        ? String(assignment.staff)
        : ""
    );

  const [scheduleId, setScheduleId] =
    useState(
      assignment?.schedule
        ? String(assignment.schedule)
        : ""
    );

  const [effectiveFrom, setEffectiveFrom] =
    useState(
      assignment?.effective_from ||
        new Date()
          .toISOString()
          .slice(0, 10)
    );

  const [isActive, setIsActive] =
    useState(
      assignment?.is_active ?? true
    );

  const [saving, setSaving] =
    useState(false);

  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!staffId) {
      toast.error(
        "Select a staff member"
      );
      return;
    }

    if (!scheduleId) {
      toast.error(
        "Select a work schedule"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        staff: Number(staffId),
        schedule: Number(scheduleId),
        effective_from:
          effectiveFrom || null,
        is_active: isActive,
      };

      if (assignment) {
        await updateStaffSchedule(
          assignment.id,
          payload
        );

        toast.success(
          "Staff schedule updated"
        );
      } else {
        await createStaffSchedule(
          payload
        );

        toast.success(
          "Schedule assigned successfully"
        );
      }

      await onSaved();
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to save staff schedule assignment"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={
        assignment
          ? "Edit Staff Schedule"
          : "Assign Work Schedule"
      }
      description="Connect an employee to their working hours and attendance schedule."
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <Field label="Staff member">
          <select
            value={staffId}
            onChange={(event) =>
              setStaffId(
                event.target.value
              )
            }
            className={input}
          >
            <option value="">
              Select staff member
            </option>

            {staff.map((person) => (
              <option
                key={person.id}
                value={person.id}
              >
                {person.name ||
                  `${person.first_name} ${person.last_name}`.trim() ||
                  person.username}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Work schedule">
          <select
            value={scheduleId}
            onChange={(event) =>
              setScheduleId(
                event.target.value
              )
            }
            className={input}
          >
            <option value="">
              Select work schedule
            </option>

            {schedules.map(
              (schedule) => (
                <option
                  key={schedule.id}
                  value={schedule.id}
                >
                  {schedule.name} (
                  {formatTime(
                    schedule.resumption_time
                  )}{" "}
                  –{" "}
                  {formatTime(
                    schedule.closing_time
                  )}
                  )
                </option>
              )
            )}
          </select>
        </Field>

        <Field label="Effective from">
          <input
            type="date"
            value={effectiveFrom}
            onChange={(event) =>
              setEffectiveFrom(
                event.target.value
              )
            }
            className={input}
          />
        </Field>

        <Toggle
          label="Active assignment"
          description="Only active assignments are used for attendance scheduling."
          checked={isActive}
          onChange={setIsActive}
        />

        <ModalActions
          onClose={onClose}
          saving={saving}
          label={
            assignment
              ? "Save Assignment"
              : "Assign Schedule"
          }
        />
      </form>
    </Modal>
  );
}

/* =========================================================
   SETTINGS SECTION
========================================================= */

function SettingsSection({
  icon: Icon,
  iconClass,
  title,
  description,
  children,
}: {
  icon: typeof Building2;
  iconClass: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)] sm:p-7">
      <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </span>

        <div>
          <h2 className="font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   SAVE BAR
========================================================= */

function SaveBar({
  onSave,
}: {
  onSave: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[20px] border border-indigo-100 bg-indigo-50/60 px-5 py-4">
      <div className="flex items-center gap-3">
        <ShieldCheck
          className="text-indigo-600"
          size={20}
        />

        <p className="text-sm text-indigo-950">
          Changes are saved locally until
          organization settings are connected
          to the backend.
        </p>
      </div>

      <button
        onClick={onSave}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,.22)] hover:bg-indigo-700"
      >
        <Check size={16} />
        Save changes
      </button>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 py-4">
      <span>
        <span className="block text-sm font-semibold text-slate-800">
          {label}
        </span>

        <span className="mt-1 block text-sm text-slate-500">
          {description}
        </span>
      </span>

      <input
        className="peer sr-only"
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
      />

      <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-indigo-600 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="flex min-h-[180px] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

        Loading attendance settings...
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: typeof Clock3;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={22} />
      </div>

      <h3 className="mt-4 font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <Plus size={16} />
        {action}
      </button>
    </div>
  );
}

/* =========================================================
   COMING SOON
========================================================= */

function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Palette;
  title: string;
  description: string;
}) {
  return (
    <SettingsSection
      icon={Icon}
      iconClass="bg-indigo-50 text-indigo-600"
      title={title}
      description={description}
    >
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
        <p className="text-sm font-medium text-slate-600">
          This settings area is ready for
          the next configuration phase.
        </p>
      </div>
    </SettingsSection>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL ACTIONS
========================================================= */

function ModalActions({
  onClose,
  saving,
  label,
}: {
  onClose: () => void;
  saving: boolean;
  label: string;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <Save size={16} />
        )}

        {saving
          ? "Saving..."
          : label}
      </button>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatTime(value: string) {
  if (!value) {
    return "--";
  }

  const [hour, minute] =
    value.split(":");

  const h = Number(hour);

  const suffix =
    h >= 12 ? "PM" : "AM";

  const displayHour =
    h % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function formatDate(value: string) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(`${value}T00:00:00`)
  );
}

function getScheduleDays(
  schedule: WorkSchedule
) {
  const days: string[] = [];

  if (schedule.monday) {
    days.push("Mon");
  }

  if (schedule.tuesday) {
    days.push("Tue");
  }

  if (schedule.wednesday) {
    days.push("Wed");
  }

  if (schedule.thursday) {
    days.push("Thu");
  }

  if (schedule.friday) {
    days.push("Fri");
  }

  if (schedule.saturday) {
    days.push("Sat");
  }

  if (schedule.sunday) {
    days.push("Sun");
  }

  return days;
}

function getInitials(
  name: string
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase()
    )
    .join("");
}