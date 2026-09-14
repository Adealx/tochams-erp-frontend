import api from "./api";

export type AttendanceStatus =
  | "early"
  | "on_time"
  | "late"
  | "very_late";

export type LocationMethod = "gps" | "ip" | "none";

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

/*
 * Django REST Framework pagination response.
 */
interface PaginatedAttendanceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Attendance[];
}

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
  const response = await api.post<AttendanceCheckInResponse>(
    "/attendance/check-in/",
    data
  );

  return response.data;
}

export async function checkOut(): Promise<AttendanceCheckOutResponse> {
  const response = await api.post<AttendanceCheckOutResponse>(
    "/attendance/check-out/"
  );

  return response.data;
}

export async function getAttendance(
  params?: AttendanceListParams
): Promise<Attendance[]> {
  const response = await api.get<
    Attendance[] | PaginatedAttendanceResponse
  >("/attendance/", {
    params,
  });

  const data = response.data;

  /*
   * Support both:
   *
   * 1. Non-paginated:
   *    [...]
   *
   * 2. Django REST Framework pagination:
   *    {
   *      count,
   *      next,
   *      previous,
   *      results
   *    }
   */
  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.results) ? data.results : [];
}

export async function getAttendanceSummary(
  params?: Omit<
    AttendanceListParams,
    "status" | "search" | "location_verified"
  >
): Promise<AttendanceSummary> {
  const response = await api.get<AttendanceSummary>(
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
  const response = await api.get<Attendance>(
    `/attendance/${id}/`
  );

  return response.data;
}