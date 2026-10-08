import {
  Plus,
  Pencil,
  KeyRound,
  UserX,
  UserCheck,
  Search,
  Users as UsersIcon,
} from "lucide-react";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  userId: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Admin User",
      userId: "ADM001",
      email: "admin@school.edu.in",
      role: "Administrator",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      userId: "TCH001",
      email: "rahul.sharma@school.edu.in",
      role: "Teacher",
      status: "Active",
    },
    {
      id: 3,
      name: "Priya Singh",
      userId: "TCH002",
      email: "priya.singh@school.edu.in",
      role: "Teacher",
      status: "Active",
    },
    {
      id: 4,
      name: "Aarav Sharma",
      userId: "STU001",
      email: "aarav.sharma@student.school.edu.in",
      role: "Student",
      status: "Active",
    },
    {
      id: 5,
      name: "Rajesh Sharma",
      userId: "PAR001",
      email: "rajesh.sharma@gmail.com",
      role: "Parent",
      status: "Active",
    },
    {
      id: 6,
      name: "Former Teacher",
      userId: "TCH003",
      email: "former.teacher@school.edu.in",
      role: "Teacher",
      status: "Inactive",
    },
  ]);

  const toggleStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(searchValue) ||
      user.userId.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue);

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage school user accounts, roles and account status.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {users.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
              <UsersIcon size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {activeUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive Users</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {inactiveUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <UserX size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              User List
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage all registered users.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
              />
            </div>

            {/* Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#27348b]"
            >
              <option value="All">All Roles</option>
              <option value="Administrator">Administrator</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#27348b]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  User ID
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#27348b]/10 text-sm font-semibold text-[#27348b]">
                        {user.name.charAt(0)}
                      </div>

                      <span className="text-sm font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* User ID */}
                  <td className="px-5 py-4 text-sm font-medium text-gray-600">
                    {user.userId}
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      {/* Edit */}
                      <button
                        type="button"
                        title="Edit User"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#27348b]"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Reset Password */}
                      <button
                        type="button"
                        title="Reset Password"
                        className="rounded-lg p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <KeyRound size={16} />
                      </button>

                      {/* Activate / Deactivate */}
                      <button
                        type="button"
                        title={
                          user.status === "Active"
                            ? "Deactivate User"
                            : "Activate User"
                        }
                        onClick={() => toggleStatus(user.id)}
                        className={`rounded-lg p-2 ${
                          user.status === "Active"
                            ? "text-gray-400 hover:bg-red-50 hover:text-red-600"
                            : "text-gray-400 hover:bg-green-50 hover:text-green-600"
                        }`}
                      >
                        {user.status === "Active" ? (
                          <UserX size={16} />
                        ) : (
                          <UserCheck size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;