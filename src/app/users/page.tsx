"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";
import AppShell from "@/components/layout/AppShell";

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
      const response = await api.get(
        "/accounts/me/"
      );

      setRole(
        response.data.role
      );

    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {

      const response =
        await api.get(
          "/accounts/users/"
        );

      setUsers(
        response.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const approveUser = async (
    id: number
  ) => {

    try {

      await api.put(
        `/accounts/users/${id}/role/`,
        {
          role: "sales",
        }
      );

      toast.success(
        "User Approved"
      );

      fetchUsers();

    } catch (error) {

      console.error(error);

      toast.error(
        "Approval Failed"
      );
    }
  };

  const disableUser = async (
  userId: number
) => {

  const confirmed = confirm(
    "Disable this user?"
  );

  if (!confirmed) return;

  try {

    await api.put(
      `/accounts/users/${userId}/disable/`
    );

    toast.success(
      "User Disabled"
    );

    fetchUsers();

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed To Disable User"
    );
  }
};

const deleteUser = async (
  userId: number
) => {

  const confirmed = confirm(
    "Delete this user?"
  );

  if (!confirmed) return;

  try {

    await api.delete(
      `/accounts/users/${userId}/delete/`
    );

    toast.success(
      "User Deleted"
    );

    fetchUsers();

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed To Delete User"
    );
  }
};

  const updateRole = async (
    id: number,
    newRole: string
  ) => {

    try {

      await api.put(
        `/accounts/users/${id}/role/`,
        {
          role: newRole,
        }
      );

      toast.success(
        "Role Updated"
      );

      fetchUsers();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed To Update Role"
      );
    }
  };

  if (role && role !== "admin") {
  return (
    <AppShell
      title="User Management"
      subtitle="Manage system users and permissions."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Users",
        },
      ]}
    >
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-semibold text-red-700">
          Unauthorized Access
        </h2>

        <p className="mt-2 text-red-600">
          You do not have permission to access this page.
        </p>
      </div>
    </AppShell>
  );
}

  if (loading) {
  return (
    <AppShell
      title="User Management"
      subtitle="Manage system users and permissions."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Users",
        },
      ]}
    >
      <div>Loading users...</div>
    </AppShell>
  );
}

  return (
  <AppShell
    title="User Management"
    subtitle="Manage user accounts, roles and permissions."
    breadcrumbs={[
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Users",
      },
    ]}
  >
    <div className="space-y-6">

      <div className="flex justify-end">
        <button

          onClick={() =>
            router.push(
              "/users/create"
            )
          }
          className="
          rounded-lg
          bg-blue-600
          px-5
          py-2.5
          font-medium
          text-white
          transition
          hover:bg-blue-700
          "
        >
          Add User
        </button>

      </div>

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead className="bg-slate-100">

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

              <th className="text-left p-4">
                Change Role
              </th>

              <th className="text-left p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b hover:bg-slate-50"
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

                <td className="p-4">

                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(
                        user.id,
                        e.target.value
                      )
                    }
                    className="border rounded px-3 py-2"
                  >

                    <option value="pending">
                      Pending
                    </option>

                    <option value="sales">
                      Sales
                    </option>

                    <option value="sales_head">
                      Sales Head
                    </option>

                    <option value="accountant">
                      Accountant
                    </option>

                    <option value="manager">
                      Manager
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </td>

                <td className="p-4 flex gap-2">

                  {user.role ===
                    "pending" && (

                    <button
                      onClick={() =>
                        approveUser(
                          user.id
                        )
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                  )}

                  <button
                    onClick={() =>
                      disableUser(
                        user.id
                      )
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Disable
                  </button>

                  <button
                    onClick={() =>
                      deleteUser(
                        user.id
                      )

                    }
                    className="bg-red-800 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  </AppShell>
);
}