import { useMemo, useState } from "react";
import {
  Activity,
  Download,
  Eye,
  Filter,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";

type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT";

type AuditStatus = "Success" | "Failed";

type AuditLogEntry = {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: AuditAction;
  module: string;
  description: string;
  ipAddress: string;
  status: AuditStatus;
};

const sampleLogs: AuditLogEntry[] = [
  {
    id: "LOG-1008",
    timestamp: "2026-10-30T09:42:00",
    user: "Admin User",
    role: "Administrator",
    action: "UPDATE",
    module: "System Settings",
    description: "Updated school system preferences",
    ipAddress: "192.168.1.12",
    status: "Success",
  },
  {
    id: "LOG-1007",
    timestamp: "2026-10-30T09:18:00",
    user: "Riya Sharma",
    role: "Teacher",
    action: "LOGIN",
    module: "Authentication",
    description: "Signed in to the portal",
    ipAddress: "192.168.1.18",
    status: "Success",
  },
  {
    id: "LOG-1006",
    timestamp: "2026-10-30T08:55:00",
    user: "Amit Kumar",
    role: "Accountant",
    action: "CREATE",
    module: "Fee Management",
    description: "Created a fee receipt (demo record)",
    ipAddress: "192.168.1.22",
    status: "Success",
  },
  {
    id: "LOG-1005",
    timestamp: "2026-10-29T16:31:00",
    user: "Admin User",
    role: "Administrator",
    action: "EXPORT",
    module: "Student Management",
    description: "Exported student report (demo record)",
    ipAddress: "192.168.1.12",
    status: "Success",
  },
  {
    id: "LOG-1004",
    timestamp: "2026-10-29T15:06:00",
    user: "Neha Singh",
    role: "Teacher",
    action: "UPDATE",
    module: "Attendance",
    description: "Updated attendance records (demo record)",
    ipAddress: "192.168.1.24",
    status: "Success",
  },
  {
    id: "LOG-1003",
    timestamp: "2026-10-29T12:47:00",
    user: "Unknown User",
    role: "Unknown",
    action: "LOGIN",
    module: "Authentication",
    description: "Invalid sign-in attempt (demo record)",
    ipAddress: "192.168.1.99",
    status: "Failed",
  },
  {
    id: "LOG-1002",
    timestamp: "2026-10-28T11:20:00",
    user: "Admin User",
    role: "Administrator",
    action: "DELETE",
    module: "User Management",
    description: "Deleted a test user (demo record)",
    ipAddress: "192.168.1.12",
    status: "Success",
  },
  {
    id: "LOG-1001",
    timestamp: "2026-10-27T10:10:00",
    user: "Riya Sharma",
    role: "Teacher",
    action: "LOGOUT",
    module: "Authentication",
    description: "Signed out of the portal",
    ipAddress: "192.168.1.18",
    status: "Success",
  },
];

const pageSizes = [5, 10, 25, 50];

const actionStyles: Record<AuditAction, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  UPDATE: "bg-blue-50 text-blue-700 ring-blue-200",
  DELETE: "bg-red-50 text-red-700 ring-red-200",
  LOGIN: "bg-violet-50 text-violet-700 ring-violet-200",
  LOGOUT: "bg-gray-100 text-gray-700 ring-gray-200",
  EXPORT: "bg-amber-50 text-amber-700 ring-amber-200",
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Search and filter audit logs.
  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sampleLogs.filter((log) => {
      const matchesSearch =
        !term ||
        [
          log.id,
          log.user,
          log.role,
          log.action,
          log.module,
          log.description,
          log.ipAddress,
        ].some((value) => value.toLowerCase().includes(term));

      const matchesAction =
        actionFilter === "All" || log.action === actionFilter;

      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;

      const logDate = log.timestamp.slice(0, 10);
      const matchesFrom = !fromDate || logDate >= fromDate;
      const matchesTo = !toDate || logDate <= toDate;

      return (
        matchesSearch &&
        matchesAction &&
        matchesStatus &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [search, actionFilter, statusFilter, fromDate, toDate]);

  // Pagination calculations.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const paginatedLogs = filteredLogs.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  // Export filtered records to CSV.
  function downloadCsv() {
    const headers = [
      "Log ID",
      "Timestamp",
      "User",
      "Role",
      "Action",
      "Module",
      "Description",
      "IP Address",
      "Status",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      formatTimestamp(log.timestamp),
      log.user,
      log.role,
      log.action,
      log.module,
      log.description,
      log.ipAddress,
      log.status,
    ]);

    const csvCell = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "school-erp-audit-log.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  // Clear filters and return to the first page.
  function clearFilters() {
    setSearch("");
    setActionFilter("All");
    setStatusFilter("All");
    setFromDate("");
    setToDate("");
    setPage(1);
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        title="Audit Log"
        description="Review user activity and important changes across the school ERP."
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total events</p>
            <Activity className="text-[#27348b]" size={19} />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {sampleLogs.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Sample records shown
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Successful events</p>
            <ShieldCheck className="text-emerald-600" size={19} />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {sampleLogs.filter((log) => log.status === "Success").length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Across all sample activities
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Failed events</p>
            <Activity className="text-red-600" size={19} />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {sampleLogs.filter((log) => log.status === "Failed").length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Includes sign-in failures
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Unique users</p>
            <UserRound className="text-[#27348b]" size={19} />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {new Set(sampleLogs.map((log) => log.user)).size}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            In the sample log data
          </p>
        </div>
      </div>

      {/* Audit history */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Activity history
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search, filter, inspect and export recorded events.
            </p>
          </div>

          <button
            type="button"
            onClick={downloadCsv}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2a73]"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="grid gap-3 border-b border-gray-200 p-4 sm:grid-cols-2 xl:grid-cols-5">
          <label className="relative block xl:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Search logs
            </span>

            <Search
              className="absolute left-3 top-[2.55rem] text-gray-400"
              size={16}
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search user, action, module, IP..."
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Action
            </span>

            <select
              value={actionFilter}
              onChange={(event) => {
                setActionFilter(event.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#27348b]"
            >
              <option value="All">All</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="EXPORT">EXPORT</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </span>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#27348b]"
            >
              <option value="All">All</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Filter size={16} />
            Clear filters
          </button>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              From date
            </span>

            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => {
                setFromDate(event.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#27348b]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              To date
            </span>

            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => {
                setToDate(event.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#27348b]"
            />
          </label>
        </div>

        {/* Audit logs table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">
                  Action / Module
                </th>
                <th className="px-4 py-3 font-semibold">IP address</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <p className="font-semibold text-gray-900">
                      {log.id}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatTimestamp(log.timestamp)}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">
                      {log.user}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {log.role}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${actionStyles[log.action]}`}
                    >
                      {log.action}
                    </span>
                    <p className="mt-2 text-gray-600">
                      {log.module}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                    {log.ipAddress}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        log.status === "Success"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex min-w-44 items-center justify-between gap-3">
                      <span className="text-gray-600">
                        {log.description}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        aria-label={`View details for ${log.id}`}
                        className="rounded-md p-2 text-[#27348b] hover:bg-indigo-50"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedLogs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No audit logs match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - shared component used by other pages */}
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="mb-3 flex justify-end">
            
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredLogs.length}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="audit logs"
          />
        </div>
      </section>

      {/* Audit event details modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLog(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-log-dialog-title"
            className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="audit-log-dialog-title"
                  className="text-lg font-bold text-gray-900"
                >
                  Audit event details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedLog.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["Timestamp", formatTimestamp(selectedLog.timestamp)],
                ["User", selectedLog.user],
                ["Role", selectedLog.role],
                ["Action", selectedLog.action],
                ["Module", selectedLog.module],
                ["IP address", selectedLog.ipAddress],
                ["Status", selectedLog.status],
                ["Description", selectedLog.description],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words text-sm text-gray-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}