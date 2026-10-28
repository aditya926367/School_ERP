import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  KeyRound,
  UserX,
  UserCheck,
  Users as UsersIcon,
} from "lucide-react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import SummaryCard from "../../components/common/SummaryCard";

interface User {
  id: number;
  name: string;
  userId: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

const initialUsers: User[] = [];

const actionButtonClass =
  "rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#27348b]";

function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [users, setUsers] = usePersistentState<User[]>('schoolerp:pages_admin_users_tsx:users', []);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name.toLowerCase().includes(searchValue) ||
        user.userId.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const inactiveUsers = users.filter((user) => user.status === "Inactive").length;

  const toggleStatus = (id: number) => {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user
      )
    );
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
    setPage(1);
  };

  const columns = [
    {
      key: "user",
      header: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#27348b]/10 text-sm font-semibold text-[#27348b]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-800">{user.name}</span>
        </div>
      ),
    },
    {
      key: "userId",
      header: "User ID",
      render: (user: User) => (
        <span className="text-sm font-medium text-gray-600">{user.userId}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user: User) => (
        <span className="text-sm text-gray-600">{user.email}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user: User) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (user: User) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            title="Edit User"
            aria-label={`Edit ${user.name}`}
            onClick={() => window.alert("Edit User form will be connected here.")}
            className={actionButtonClass}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            title="Reset Password"
            aria-label={`Reset password for ${user.name}`}
            onClick={() => window.alert(`Password reset for ${user.name} requires backend integration.`)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <KeyRound size={16} />
          </button>
          <button
            type="button"
            title={user.status === "Active" ? "Deactivate User" : "Activate User"}
            aria-label={`${user.status === "Active" ? "Deactivate" : "Activate"} ${user.name}`}
            onClick={() => toggleStatus(user.id)}
            className={`rounded-lg p-2 transition ${
              user.status === "Active"
                ? "text-gray-400 hover:bg-red-50 hover:text-red-600"
                : "text-gray-400 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            {user.status === "Active" ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        breadcrumb="User Management"
        title="Users"
        description="Manage school user accounts, roles and account status."
        actions={
          <button
            type="button"
            onClick={() => window.alert("Add User form will be connected here.")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
          >
            <Plus size={18} /> Add User
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SummaryCard
          label="Total Users"
          value={users.length}
          icon={<UsersIcon size={22} />}
          iconClassName="text-[#27348b]"
          iconBackgroundClassName="bg-[#27348b]/10"
        />
        <SummaryCard
          label="Active Users"
          value={activeUsers}
          icon={<UserCheck size={22} />}
          iconClassName="text-green-600"
          iconBackgroundClassName="bg-green-50"
        />
        <SummaryCard
          label="Inactive Users"
          value={inactiveUsers}
          icon={<UserX size={22} />}
          iconClassName="text-red-600"
          iconBackgroundClassName="bg-red-50"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">User List</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all registered users ({filteredUsers.length} results).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[620px]">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search users..."
            />
            <FilterSelect
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
              placeholder="All Roles"
              options={["Administrator", "Teacher", "Student", "Parent"]}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              placeholder="All Status"
              options={["Active", "Inactive"]}
            />
          </div>
        </div>

        {(search || roleFilter !== "All" || statusFilter !== "All") && (
          <div className="flex justify-end border-b border-gray-100 px-5 py-3">
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-[#27348b] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <DataTable<User>
          data={visibleUsers}
          rowKey={(user) => user.id}
          tableClassName="min-w-[950px]"
          columns={columns}
          emptyState={<p className="text-sm text-gray-500">No users found. Try changing your search or filters.</p>}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={setPage}
          itemLabel="users"
        />
      </section>
    </div>
  );
}

export default Users;
