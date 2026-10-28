import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export interface ERPNotification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  related_object_type: string;
  related_object_id: number | null;
  action_url: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationResponse {
  results: ERPNotification[];
  count: number;
  unread_count: number;
}

export async function getNotifications() {
  const response = await api.get<NotificationResponse>(
    "/notifications/"
  );

  return response.data;
}

export async function markNotificationRead(id: number) {
  return api.post(`/notifications/${id}/read/`);
}

export async function markAllNotificationsRead() {
  return api.post("/notifications/read-all/");
}