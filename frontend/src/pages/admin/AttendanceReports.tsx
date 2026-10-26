import { useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  FileBarChart,
} from "lucide-react";

type ReportType = "Students" | "Teachers" | "Staff";
type Status = "Present" | "Absent" | "Late" | "Leave";

type AttendanceRecord = {
  id: number;
  personId: string;
  name: string;
  group: string;
  type: ReportType;
  date: string;
  status: Status;
};

const sampleRecords: AttendanceRecord[] = [
  {
    id: 1,
    personId: "STU1001",
    name: "Aarav Sharma",
    group: "Class 10",
    type: "Students",
    date: "2026-10-12",
    status: "Present",
  },
  {
    id: 2,
    personId: "STU1002",
    name: "Priya Verma",
    group: "Class 10",
    type: "Students",
    date: "2026-10-12",
    status: "Absent",
  },
  {
    id: 3,
    personId: "STU1003",
    name: "Rahul Kumar",
    group: "Class 9",
    type: "Students",
    date: "2026-10-12",
    status: "Present",
  },
  {
    id: 4,
    personId: "STU1004",
    name: "Ananya Singh",
    group: "Class 8",
    type: "Students",
    date: "2026-10-12",
    status: "Late",
  },
  {
    id: 5,
    personId: "STU1001",
    name: "Aarav Sharma",
    group: "Class 10",
    type: "Students",
    date: "2026-10-11",
    status: "Present",
  },
  {
    id: 6,
    personId: "STU1002",
    name: "Priya Verma",
    group: "Class 10",
    type: "Students",
    date: "2026-10-11",
    status: "Present",
  },
  {
    id: 7,
    personId: "TCH1001",
    name: "Amit Kumar",
    group: "Mathematics",
    type: "Teachers",
    date: "2026-10-12",
    status: "Present",
  },
  {
    id: 8,
    personId: "TCH1002",
    name: "Neha Singh",
    group: "English",
    type: "Teachers",
    date: "2026-10-12",
    status: "Late",
  },
  {
    id: 9,
    personId: "EMP1003",
    name: "Rajesh Verma",
    group: "Administration",
    type: "Staff",
    date: "2026-10-12",
    status: "Absent",
  },
  {
    id: 10,
    personId: "TCH1001",
    name: "Amit Kumar",
    group: "Mathematics",
    type: "Teachers",
    date: "2026-10-11",
    status: "Present",
  },
];

const statusStyles: Record<Status, string> = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Late: "bg-amber-100 text-amber-700",
  Leave: "bg-blue-100 text-blue-700",
};

// Shared styling to match FinanceReports.tsx
const cardClass =
  "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm";

const labelClass = "mb-1 block text-sm font-medium text-gray-600";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function StatCard({
  title,
  value,
  icon,
  color,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description: string;
}) {
  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>

      <p className="mt-3 text-xs text-gray-500">{description}</p>
    </div>
  );
}

export default function AttendanceReports() {
  const [records] = useState<AttendanceRecord[]>(sampleRecords);

  const [type, setType] = useState<"All" | ReportType>("All");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [fromDate, setFromDate] = useState("2026-10-11");
  const [toDate, setToDate] = useState("2026-10-12");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");

  const groups = useMemo(() => {
    return [
      ...new Set(
        records
          .filter((record) => type === "All" || record.type === type)
          .map((record) => record.group),
      ),
    ].sort();
  }, [records, type]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesType = type === "All" || record.type === type;
      const matchesStatus = status === "All" || record.status === status;
      const matchesFrom = !fromDate || record.date >= fromDate;
      const matchesTo = !toDate || record.date <= toDate;
      const matchesGroup = group === "All" || record.group === group;

      const matchesSearch = `${record.personId} ${record.name} ${record.group}`
        .toLowerCase()
        .includes(query);

      return (
        matchesType &&
        matchesStatus &&
        matchesFrom &&
        matchesTo &&
        matchesGroup &&
        matchesSearch
      );
    });
  }, [records, type, status, fromDate, toDate, group, search]);

  const present = filteredRecords.filter(
    (record) => record.status === "Present",
  ).length;

  const absent = filteredRecords.filter(
    (record) => record.status === "Absent",
  ).length;

  const late = filteredRecords.filter(
    (record) => record.status === "Late",
  ).length;

  const leave = filteredRecords.filter(
    (record) => record.status === "Leave",
  ).length;

  const attendanceRate = filteredRecords.length
    ? ((present + late) / filteredRecords.length) * 100
    : 0;

  function exportCSV() {
    const rows = [
      ["Date", "Type", "ID", "Name", "Class / Department", "Status"],
      ...filteredRecords.map((record) => [
        record.date,
        record.type,
        record.personId,
        record.name,
        record.group,
        record.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "attendance-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Attendance Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review attendance trends and export filtered attendance records.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#202b75] focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Download size={17} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Records"
          value={filteredRecords.length}
          icon={<FileBarChart size={22} />}
          color="bg-blue-100 text-blue-600"
          description="Records matching your filters"
        />

        <StatCard
          title="Present"
          value={present}
          icon={<CheckCircle2 size={22} />}
          color="bg-green-100 text-green-600"
          description="Marked present"
        />

        <StatCard
          title="Absent"
          value={absent}
          icon={<XCircle size={22} />}
          color="bg-red-100 text-red-600"
          description="Marked absent"
        />

        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate.toFixed(1)}%`}
          icon={<Users size={22} />}
          color="bg-purple-100 text-purple-600"
          description="Present and late records ÷ all records"
        />
      </div>

      {/* Report Filters */}
      <div className={cardClass}>
        <h2 className="mb-4 font-semibold text-gray-800">Report Filters</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="reportType" className={labelClass}>
              Report For
            </label>

            <select
              id="reportType"
              value={type}
              onChange={(event) => {
                setType(event.target.value as "All" | ReportType);
                setGroup("All");
              }}
              className={inputClass}
            >
              <option value="All">Everyone</option>
              <option value="Students">Students</option>
              <option value="Teachers">Teachers</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div>
            <label htmlFor="fromDate" className={labelClass}>
              From Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="toDate" className={labelClass}>
              To Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="attendanceGroup" className={labelClass}>
              Class / Department
            </label>

            <select
              id="attendanceGroup"
              value={group}
              onChange={(event) => setGroup(event.target.value)}
              className={inputClass}
            >
              <option value="All">All Classes / Departments</option>

              {groups.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="attendanceStatus" className={labelClass}>
              Attendance Status
            </label>

            <select
              id="attendanceStatus"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "All" | Status)
              }
              className={inputClass}
            >
              <option value="All">All statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          <div>
            <label htmlFor="attendanceSearch" className={labelClass}>
              Search
            </label>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="attendanceSearch"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or ID..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Distribution */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Present", count: present, color: "bg-green-500" },
          { label: "Absent", count: absent, color: "bg-red-500" },
          { label: "Late", count: late, color: "bg-amber-500" },
          { label: "Leave", count: leave, color: "bg-blue-500" },
        ].map((item) => (
          <div key={item.label} className={cardClass}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.label}</span>

              <span className="text-lg font-bold text-gray-800">
                {item.count}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{
                  width: `${
                    filteredRecords.length
                      ? (item.count / filteredRecords.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              {filteredRecords.length
                ? (
                    (item.count / filteredRecords.length) *
                    100
                  ).toFixed(1)
                : "0.0"}
              % of filtered records
            </p>
          </div>
        ))}
      </div>

      {/* Attendance Details Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-800">Attendance Details</h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredRecords.length} matching records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase">
                  Person
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase">
                  Type
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase">
                  Class / Department
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-5 py-4 text-gray-600">{record.date}</td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">
                      {record.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {record.personId}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-600">{record.type}</td>

                  <td className="px-5 py-4 text-gray-600">{record.group}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[record.status]}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    <FileBarChart className="mx-auto mb-2" size={28} />

                    <p className="font-medium text-gray-700">
                      No records found
                    </p>

                    <p className="mt-1 text-sm">
                      Try changing your filters or search query.
                    </p>
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
