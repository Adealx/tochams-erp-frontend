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
          inline-flex items-center rounded-xl
          bg-indigo-600
          px-5
          py-2.5
          font-medium
          text-white
          transition
          shadow-[0_8px_18px_rgba(79,70,229,.22)] hover:bg-indigo-700
          "
        >
          Add User
        </button>

      </div>

      <div
        className="
          overflow-hidden rounded-[20px]
          border
          border-slate-200
          bg-white
          shadow-[0_6px_20px_rgba(15,23,42,.035)]
        "
      >

        <table className="w-full">

        <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">
                Username
              </th>

              <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">
                Email
              </th>

              <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">
                Role
              </th>

              <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">
                Change Role
              </th>

              <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/70"
              >

                <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                  {user.username}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.email}
                </td>

                <td className="px-6 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">{user.role}</span>
                </td>

                <td className="px-6 py-4">

                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(
                        user.id,
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
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

                <td className="flex gap-2 px-6 py-4">

                  {user.role ===
                    "pending" && (

                    <button
                      onClick={() =>
                        approveUser(
                          user.id
                        )
                      }
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
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
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Disable
                  </button>

                  <button
                    onClick={() =>
                      deleteUser(
                        user.id
                      )

                    }
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
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
