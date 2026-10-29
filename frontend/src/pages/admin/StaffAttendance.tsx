import { useMemo, useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  CalendarDays,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  BriefcaseBusiness,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import SummaryCard from "../../components/common/SummaryCard";
import Pagination from "../../components/common/Pagination";

type Status = "Present" | "Absent" | "Late" | "Leave";

type Staff = {
  id: number;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  status: Status;
};

const initialStaff: Staff[] = [];
const statuses: Status[] = ["Present", "Absent", "Late", "Leave"];
const PAGE_SIZES = [5, 10, 20, 50];

function usePersistentState<T>(
  storageKey: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const storedValue = window.localStorage.getItem(storageKey);
      return storedValue === null ? initialValue : (JSON.parse(storedValue) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save ${storageKey} to local storage.`, error);
    }
  }, [storageKey, value]);

  return [value, setValue];
}

function getToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function StaffAttendance() {
  const [staff, setStaff] = usePersistentState<Staff[]>(
    "schoolerp:pages_admin_staffattendance_tsx:staff",
    initialStaff,
  );
  const [date, setDate] = useState(getToday());
  const [department, setDepartment] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const departments = [...new Set(staff.map((person) => person.department.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staff.filter((person) => {
      const matchesDepartment = department === "All" || person.department === department;
      const matchesSearch = `${person.employeeId} ${person.name} ${person.role} ${person.department}`
        .toLowerCase()
        .includes(query);
      return matchesDepartment && matchesSearch;
    });
  }, [staff, department, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [department, search, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const present = filtered.filter((person) => person.status === "Present").length;
  const absent = filtered.filter((person) => person.status === "Absent").length;
  const late = filtered.filter((person) => person.status === "Late").length;
  const leave = filtered.filter((person) => person.status === "Leave").length;

  function updateStatus(id: number, status: Status) {
    setStaff((current) => current.map((person) => (person.id === id ? { ...person, status } : person)));
  }

  function exportCSV() {
    const rows = [
      ["Date", "Employee ID", "Name", "Role", "Department", "Status"],
      ...filtered.map((person) => [date, person.employeeId, person.name, person.role, person.department, person.status]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `staff-attendance-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (person: Staff) => (
        <div>
          <p className="font-semibold text-gray-900">{person.name}</p>
          <p className="mt-1 text-xs text-gray-500">{person.employeeId}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (person: Staff) => <span className="text-gray-600">{person.role}</span>,
    },
    {
      key: "department",
      header: "Department",
      render: (person: Staff) => <span className="text-gray-600">{person.department}</span>,
    },
    {
      key: "attendanceStatus",
      header: "Attendance Status",
      render: (person: Staff) => (
        <select
          aria-label={`Attendance status for ${person.name}`}
          value={person.status}
          onChange={(event) => updateStatus(person.id, event.target.value as Status)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      ),
    },
    {
      key: "statusLabel",
      header: "Status Label",
      render: (person: Staff) => <StatusBadge status={person.status} />,
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageHeader title="Staff Attendance" description="Manage daily attendance for teachers and school staff." />
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Present" value={present} icon={<CheckCircle2 size={22} />} iconClassName="text-green-600" iconBackgroundClassName="bg-green-100" />
        <SummaryCard label="Absent" value={absent} icon={<XCircle size={22} />} iconClassName="text-red-600" iconBackgroundClassName="bg-red-100" />
        <SummaryCard label="Late Arrivals" value={late} icon={<Clock size={22} />} iconClassName="text-amber-600" iconBackgroundClassName="bg-amber-100" />
        <SummaryCard label="On Leave" value={leave} icon={<BriefcaseBusiness size={22} />} iconClassName="text-blue-600" iconBackgroundClassName="bg-blue-100" />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="min-w-0 space-y-1">
            <span className="block text-sm font-medium text-gray-700">Attendance Date</span>
            <div className="relative">
              <CalendarDays size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
          </label>
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
            <FilterSelect value={department} onChange={setDepartment} options={[{ label: "All Departments", value: "All" }, ...departments.map((value) => ({ label: value, value }))]} placeholder="All Departments" />
          </div>
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">Search Staff</label>
            <SearchBar value={search} onChange={setSearch} placeholder="Name, ID, role, or department..." />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Staff Register</h2>
          <p className="mt-1 text-sm text-gray-500">{filtered.length} staff members · {date}</p>
        </div>
        <DataTable<Staff>
          data={paginatedStaff}
          columns={columns}
          rowKey={(person) => person.id}
          tableClassName="min-w-[900px] text-sm text-gray-800"
          emptyState={<div className="flex flex-col items-center gap-2 text-gray-500"><Users size={22} /><span>No staff found.</span></div>}
        />
        {filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizes={PAGE_SIZES}
          />
        )}
      </section>
    </div>
  );
}
