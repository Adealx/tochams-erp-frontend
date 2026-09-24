import api from "./api";

export type AttendanceStatus =
  | "early"
  | "on_time"
  | "late"
  | "very_late";

export type LocationMethod =
  | "gps"
  | "ip"
  | "none";

export interface Attendance {
  id: number;
  staff: number;
  staff_name: string;
  staff_username: string;

  work_date: string;
  schedule: number | null;
  schedule_name: string | null;

  scheduled_resumption: string | null;
  login_at: string | null;
  logout_at: string | null;

  status: AttendanceStatus;
  minutes_difference: number | null;

  latitude: string | number | null;
  longitude: string | number | null;
  gps_accuracy: string | number | null;

  location_name: string | null;
  location_method: LocationMethod;
  location_verified: boolean;

  office_location: number | null;
  office_name: string | null;
  distance_from_office: string | number | null;

  ip_address: string | null;
  device_info: string | null;

  created_at: string;
  updated_at: string;
}

/* =========================================================
   ATTENDANCE
========================================================= */

export interface AttendanceTodayResponse {
  attendance: Attendance | null;
  message?: string;
}

export interface AttendanceCheckInData {
  latitude?: number;
  longitude?: number;
  gps_accuracy?: number;
  location_name?: string;
  location_method?: LocationMethod;
}

export interface AttendanceCheckInResponse {
  created: boolean;
  message: string;
  attendance: Attendance;
}

export interface AttendanceCheckOutResponse {
  message: string;
  attendance: Attendance;
}

export interface AttendanceSummary {
  total_records: number;
  early: number;
  on_time: number;
  late: number;
  very_late: number;
  location_verified: number;
  location_not_verified: number;
}

export interface AttendanceListParams {
  staff?: number;
  status?: AttendanceStatus;
  start_date?: string;
  end_date?: string;
  office?: number;
  location_verified?: boolean;
  search?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function extractResults<T>(
  data: T[] | PaginatedResponse<T>
): T[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    data &&
    Array.isArray(
      (data as PaginatedResponse<T>).results
    )
  ) {
    return (
      (data as PaginatedResponse<T>)
        .results
    );
  }

  return [];
}

/* =========================================================
   ATTENDANCE API
========================================================= */

export async function getTodayAttendance(): Promise<AttendanceTodayResponse> {
  const response =
    await api.get<AttendanceTodayResponse>(
      "/attendance/today/"
    );

  return response.data;
}

export async function checkIn(
  data: AttendanceCheckInData = {}
): Promise<AttendanceCheckInResponse> {
  const response =
    await api.post<AttendanceCheckInResponse>(
      "/attendance/check-in/",
      data
    );

  return response.data;
}

export async function checkOut(): Promise<AttendanceCheckOutResponse> {
  const response =
    await api.post<AttendanceCheckOutResponse>(
      "/attendance/check-out/"
    );

  return response.data;
}

export async function getAttendance(
  params?: AttendanceListParams
): Promise<Attendance[]> {
  const response = await api.get<
    Attendance[] | PaginatedResponse<Attendance>
  >("/attendance/", {
    params,
  });

  return extractResults(
    response.data
  );
}

export async function getAttendanceSummary(
  params?: Omit<
    AttendanceListParams,
    "status" | "search" | "location_verified"
  >
): Promise<AttendanceSummary> {
  const response =
    await api.get<AttendanceSummary>(
      "/attendance/summary/",
      {
        params,
      }
    );

  return response.data;
}

export async function getAttendanceById(
  id: number
): Promise<Attendance> {
  const response =
    await api.get<Attendance>(
      `/attendance/${id}/`
    );

  return response.data;
}

/* =========================================================
   WORK SCHEDULES
========================================================= */

export interface WorkSchedule {
  id: number;
  name: string;

  resumption_time: string;
  closing_time: string;

  grace_period_minutes: number;

  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;

  is_active: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface WorkSchedulePayload {
  name: string;

  resumption_time: string;
  closing_time: string;

  grace_period_minutes: number;

  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;

  is_active: boolean;
}

export async function getWorkSchedules(): Promise<
  WorkSchedule[]
> {
  const response =
    await api.get<
      WorkSchedule[] |
      PaginatedResponse<WorkSchedule>
    >(
      "/attendance/work-schedules/"
    );

  return extractResults(
    response.data
  );
}

export async function createWorkSchedule(
  data: WorkSchedulePayload
): Promise<WorkSchedule> {
  const response =
    await api.post<WorkSchedule>(
      "/attendance/work-schedules/",
      data
    );

  return response.data;
}

export async function updateWorkSchedule(
  id: number,
  data: Partial<WorkSchedulePayload>
): Promise<WorkSchedule> {
  const response =
    await api.patch<WorkSchedule>(
      `/attendance/work-schedules/${id}/`,
      data
    );

  return response.data;
}

export async function deleteWorkSchedule(
  id: number
): Promise<void> {
  await api.delete(
    `/attendance/work-schedules/${id}/`
  );
}

/* =========================================================
   STAFF
========================================================= */

export interface AttendanceStaff {
  id: number;

  username: string;

  first_name: string;

  last_name: string;

  name?: string;
}

export async function getAttendanceStaff(): Promise<
  AttendanceStaff[]
> {
  const response =
    await api.get<
      AttendanceStaff[] |
      PaginatedResponse<AttendanceStaff>
    >(
      "/attendance/staff/"
    );

  return extractResults(
    response.data
  );
}

/* =========================================================
   STAFF SCHEDULE ASSIGNMENTS
========================================================= */

export interface StaffScheduleAssignment {
  id: number;

  staff: number;

  staff_name?: string;

  staff_username?: string;

  schedule: number;

  schedule_name?: string;

  effective_from: string | null;

  is_active: boolean;

  created_at?: string;

  updated_at?: string;
}

export interface StaffSchedulePayload {
  staff: number;

  schedule: number;

  effective_from?: string | null;

  is_active: boolean;
}

export async function getStaffSchedules(): Promise<
  StaffScheduleAssignment[]
> {
  const response =
    await api.get<
      StaffScheduleAssignment[] |
      PaginatedResponse<StaffScheduleAssignment>
    >(
      "/attendance/staff-schedules/"
    );

  return extractResults(
    response.data
  );
}

export async function createStaffSchedule(
  data: StaffSchedulePayload
): Promise<StaffScheduleAssignment> {
  const response =
    await api.post<StaffScheduleAssignment>(
      "/attendance/staff-schedules/",
      data
    );

  return response.data;
}

export async function updateStaffSchedule(
  id: number,
  data: Partial<StaffSchedulePayload>
): Promise<StaffScheduleAssignment> {
  const response =
    await api.patch<StaffScheduleAssignment>(
      `/attendance/staff-schedules/${id}/`,
      data
    );

  return response.data;
}

export async function deleteStaffSchedule(
  id: number
): Promise<void> {
  await api.delete(
    `/attendance/staff-schedules/${id}/`
  );
}