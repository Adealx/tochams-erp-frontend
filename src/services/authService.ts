import axios from "axios";

const authApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const loginUser = async (
  username: string,
  password: string
) => {
  const response = await authApi.post(
    "/accounts/login/",
    {
      username,
      password,
    }
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("access");

  const response = await authApi.get(
    "/accounts/me/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};