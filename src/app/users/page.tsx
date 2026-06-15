"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/accounts/me/");
      setRole(response.data.role);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/accounts/users/");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (role && role !== "admin") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Unauthorized Access
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <button
          onClick={() => router.push("/users/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>

      </div>

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="text-left p-4">
                Username
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Role
              </th>
            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b"
              >

                <td className="p-4">
                  {user.username}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4 capitalize">
                  {user.role}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}