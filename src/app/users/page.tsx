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
  is_active: boolean;
}


export default function UsersPage() {

  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [role, setRole] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

  const [processingUserId, setProcessingUserId] =
    useState<number | null>(null);


  // ============================================================
  // FETCH CURRENT USER
  // ============================================================

  useEffect(() => {

    fetchCurrentUser();
    fetchUsers();

  }, []);


  const fetchCurrentUser = async () => {

    try {

      const response =
        await api.get(
          "/accounts/me/"
        );

      setRole(
        response.data.role
      );

      setCurrentUserId(
        response.data.id
      );

    } catch (error) {

      console.error(
        "Failed to fetch current user:",
        error
      );

    }
  };


  // ============================================================
  // FETCH USERS
  // ============================================================

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

      console.error(
        "Failed to fetch users:",
        error
      );

      toast.error(
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // APPROVE USER
  // ============================================================

  const approveUser = async (
    id: number
  ) => {

    try {

      setProcessingUserId(id);

      await api.put(
        `/accounts/users/${id}/role/`,
        {
          role: "sales",
        }
      );

      toast.success(
        "User Approved"
      );

      await fetchUsers();

    } catch (error) {

      console.error(
        "Approval failed:",
        error
      );

      toast.error(
        "Approval Failed"
      );

    } finally {

      setProcessingUserId(null);

    }
  };


  // ============================================================
  // DISABLE USER
  // ============================================================

  const disableUser = async (
    userId: number
  ) => {

    if (
      userId === currentUserId
    ) {

      toast.error(
        "You cannot disable your own account"
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Disable this user?"
      );

    if (!confirmed) return;

    try {

      setProcessingUserId(
        userId
      );

      await api.put(
        `/accounts/users/${userId}/disable/`
      );

      // Immediately update screen
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_active: false,
              }
            : user
        )
      );

      toast.success(
        "User Disabled"
      );

    } catch (error) {

      console.error(
        "Disable failed:",
        error
      );

      toast.error(
        "Failed To Disable User"
      );

    } finally {

      setProcessingUserId(null);

    }
  };


  // ============================================================
  // ACTIVATE USER
  // ============================================================

  const activateUser = async (
    userId: number
  ) => {

    const confirmed =
      window.confirm(
        "Activate this user?"
      );

    if (!confirmed) return;

    try {

      setProcessingUserId(
        userId
      );

      await api.put(
        `/accounts/users/${userId}/activate/`
      );

      // Immediately update screen
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_active: true,
              }
            : user
        )
      );

      toast.success(
        "User Activated"
      );

    } catch (error) {

      console.error(
        "Activation failed:",
        error
      );

      toast.error(
        "Failed To Activate User"
      );

    } finally {

      setProcessingUserId(null);

    }
  };


  // ============================================================
  // DELETE USER
  // ============================================================

  const deleteUser = async (
    userId: number
  ) => {

    if (
      userId === currentUserId
    ) {

      toast.error(
        "You cannot delete your own account"
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Delete this user permanently?"
      );

    if (!confirmed) return;

    try {

      setProcessingUserId(
        userId
      );

      await api.delete(
        `/accounts/users/${userId}/delete/`
      );

      // Remove immediately from screen
      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) =>
            user.id !== userId
        )
      );

      toast.success(
        "User Deleted"
      );

    } catch (error) {

      console.error(
        "Delete failed:",
        error
      );

      toast.error(
        "Failed To Delete User"
      );

    } finally {

      setProcessingUserId(null);

    }
  };


  // ============================================================
  // UPDATE ROLE
  // ============================================================

  const updateRole = async (
    id: number,
    newRole: string
  ) => {

    if (
      id === currentUserId
    ) {

      toast.error(
        "You cannot change your own role"
      );

      return;

    }

    try {

      setProcessingUserId(id);

      await api.put(
        `/accounts/users/${id}/role/`,
        {
          role: newRole,
        }
      );

      // Immediately update role
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === id
            ? {
                ...user,
                role: newRole,

                // If this was a pending user
                // being approved, activate it.
                is_active:
                  user.role === "pending"
                    ? true
                    : user.is_active,
              }
            : user
        )
      );

      toast.success(
        "Role Updated"
      );

    } catch (error) {

      console.error(
        "Role update failed:",
        error
      );

      toast.error(
        "Failed To Update Role"
      );

    } finally {

      setProcessingUserId(null);

    }
  };


  // ============================================================
  // UNAUTHORIZED
  // ============================================================

  if (
    role &&
    role !== "admin"
  ) {

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

        <div className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-6
        ">

          <h2 className="
            text-xl
            font-semibold
            text-red-700
          ">
            Unauthorized Access
          </h2>

          <p className="
            mt-2
            text-red-600
          ">
            You do not have permission
            to access this page.
          </p>

        </div>

      </AppShell>
    );
  }


  // ============================================================
  // LOADING
  // ============================================================

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

        <div className="
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          text-center
          text-sm
          text-slate-500
        ">
          Loading users...
        </div>

      </AppShell>
    );
  }


  // ============================================================
  // MAIN PAGE
  // ============================================================

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


        {/* ================================================== */}
        {/* TOP ACTION */}
        {/* ================================================== */}

        <div className="
          flex
          justify-end
        ">

          <button
            onClick={() =>
              router.push(
                "/users/create"
              )
            }
            className="
              inline-flex
              items-center
              rounded-xl
              bg-indigo-600
              px-5
              py-2.5
              font-medium
              text-white
              shadow-[0_8px_18px_rgba(79,70,229,.22)]
              transition
              hover:bg-indigo-700
            "
          >
            Add User
          </button>

        </div>


        {/* ================================================== */}
        {/* USERS TABLE */}
        {/* ================================================== */}

        <div className="
          overflow-hidden
          rounded-[20px]
          border
          border-slate-200
          bg-white
          shadow-[0_6px_20px_rgba(15,23,42,.035)]
        ">

          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              min-w-[1100px]
            ">


              {/* ================================================== */}
              {/* HEADER */}
              {/* ================================================== */}

              <thead className="
                bg-slate-50
              ">

                <tr>

                  <th className="
                    px-6
                    py-3.5
                    text-left
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[.08em]
                    text-slate-500
                  ">
                    Username
                  </th>


                  <th className="
                    px-6
                    py-3.5
                    text-left
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[.08em]
                    text-slate-500
                  ">
                    Email
                  </th>


                  <th className="
                    px-6
                    py-3.5
                    text-left
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[.08em]
                    text-slate-500
                  ">
                    Role
                  </th>


                  <th className="
                    px-6
                    py-3.5
                    text-left
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[.08em]
                    text-slate-500
                  ">
                    Status
                  </th>


                  <th className="
                    px-6
                    py-3.5
                    text-left
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[.08em]
                    text-slate-500
                  ">
                    Change Role
                  </th>


                  <th className="
                    px-6
                    py-3.5
                    text-left
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[.08em]
                    text-slate-500
                  ">
                    Actions
                  </th>

                </tr>

              </thead>


              {/* ================================================== */}
              {/* BODY */}
              {/* ================================================== */}

              <tbody>

                {users.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="
                        px-6
                        py-12
                        text-center
                        text-sm
                        text-slate-500
                      "
                    >
                      No users found.
                    </td>

                  </tr>

                ) : (

                  users.map(
                    (user) => (

                      <tr
                        key={user.id}
                        className="
                          border-b
                          border-slate-100
                          transition
                          hover:bg-slate-50/70
                        "
                      >


                        {/* ======================================== */}
                        {/* USERNAME */}
                        {/* ======================================== */}

                        <td className="
                          px-6
                          py-4
                          text-sm
                          font-semibold
                          text-slate-800
                        ">

                          {user.username}

                        </td>


                        {/* ======================================== */}
                        {/* EMAIL */}
                        {/* ======================================== */}

                        <td className="
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                        ">

                          {user.email}

                        </td>


                        {/* ======================================== */}
                        {/* ROLE */}
                        {/* ======================================== */}

                        <td className="
                          px-6
                          py-4
                        ">

                          <span className="
                            rounded-full
                            bg-slate-100
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            capitalize
                            text-slate-600
                          ">

                            {user.role ===
                            "sales_head"
                              ? "Sales Head"
                              : user.role}

                          </span>

                        </td>


                        {/* ======================================== */}
                        {/* STATUS */}
                        {/* ======================================== */}

                        <td className="
                          px-6
                          py-4
                        ">

                          {user.is_active ? (

                            <span className="
                              inline-flex
                              items-center
                              rounded-full
                              bg-emerald-50
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              text-emerald-700
                            ">

                              <span className="
                                mr-1.5
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                              " />

                              Active

                            </span>

                          ) : (

                            <span className="
                              inline-flex
                              items-center
                              rounded-full
                              bg-rose-50
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              text-rose-700
                            ">

                              <span className="
                                mr-1.5
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-rose-500
                              " />

                              Disabled

                            </span>

                          )}

                        </td>


                        {/* ======================================== */}
                        {/* CHANGE ROLE */}
                        {/* ======================================== */}

                        <td className="
                          px-6
                          py-4
                        ">

                          <select
                            value={
                              user.role
                            }
                            disabled={
                              processingUserId ===
                                user.id ||
                              user.id ===
                                currentUserId
                            }
                            onChange={(e) =>
                              updateRole(
                                user.id,
                                e.target.value
                              )
                            }
                            className="
                              rounded-xl
                              border
                              border-slate-200
                              bg-white
                              px-3
                              py-2
                              text-sm
                              text-slate-700
                              outline-none
                              focus:border-indigo-300
                              focus:ring-4
                              focus:ring-indigo-100
                              disabled:cursor-not-allowed
                              disabled:bg-slate-100
                              disabled:text-slate-400
                            "
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


                        {/* ======================================== */}
                        {/* ACTIONS */}
                        {/* ======================================== */}

                        <td className="
                          px-6
                          py-4
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                          ">


                            {/* ================================== */}
                            {/* APPROVE */}
                            {/* ================================== */}

                            {user.role ===
                              "pending" && (

                              <button
                                disabled={
                                  processingUserId ===
                                  user.id
                                }
                                onClick={() =>
                                  approveUser(
                                    user.id
                                  )
                                }
                                className="
                                  rounded-lg
                                  bg-emerald-600
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-semibold
                                  text-white
                                  transition
                                  hover:bg-emerald-700
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >

                                {processingUserId ===
                                user.id
                                  ? "Processing..."
                                  : "Approve"}

                              </button>

                            )}


                            {/* ================================== */}
                            {/* ACTIVE / DISABLED */}
                            {/* ================================== */}

                            {user.id ===
                            currentUserId ? (

                              <span className="
                                rounded-lg
                                bg-slate-100
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-slate-400
                              ">
                                Current User
                              </span>

                            ) : user.is_active ? (

                              <button
                                disabled={
                                  processingUserId ===
                                  user.id
                                }
                                onClick={() =>
                                  disableUser(
                                    user.id
                                  )
                                }
                                className="
                                  rounded-lg
                                  border
                                  border-rose-200
                                  bg-rose-50
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-semibold
                                  text-rose-700
                                  transition
                                  hover:bg-rose-100
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >

                                {processingUserId ===
                                user.id
                                  ? "Processing..."
                                  : "Disable"}

                              </button>

                            ) : (

                              <button
                                disabled={
                                  processingUserId ===
                                  user.id
                                }
                                onClick={() =>
                                  activateUser(
                                    user.id
                                  )
                                }
                                className="
                                  rounded-lg
                                  border
                                  border-emerald-200
                                  bg-emerald-50
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-semibold
                                  text-emerald-700
                                  transition
                                  hover:bg-emerald-100
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >

                                {processingUserId ===
                                user.id
                                  ? "Processing..."
                                  : "Activate"}

                              </button>

                            )}


                            {/* ================================== */}
                            {/* DELETE */}
                            {/* ================================== */}

                            {user.id !==
                              currentUserId && (

                              <button
                                disabled={
                                  processingUserId ===
                                  user.id
                                }
                                onClick={() =>
                                  deleteUser(
                                    user.id
                                  )
                                }
                                className="
                                  rounded-lg
                                  bg-rose-600
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-semibold
                                  text-white
                                  transition
                                  hover:bg-rose-700
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >

                                Delete

                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AppShell>
  );
}