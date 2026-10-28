
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  Search,
  Users,
  XCircle,
  Clock3,
  CalendarCheck,
  Filter,
} from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

type AttendanceRecord = {
  id: number;
  date: string;
  className: string;
  rollNo: number;
  admissionNo: string;
  studentName: string;
  status: AttendanceStatus;
};

const initialRecords: AttendanceRecord[] = [];

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Absent: "bg-red-50 text-red-700 border-red-200",
  Late: "bg-amber-50 text-amber-700 border-amber-200",
  Leave: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function TeacherAttendanceHistory() {
  const [records] = useState<AttendanceRecord[]>(initialRecords);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [startDate, setStartDate] = useState("2026-10-09");
  const [endDate, setEndDate] = useState("2026-10-12");
  const [search, setSearch] = useState("");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesClass =
        selectedClass === "All Classes" ||
        record.className === selectedClass;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        record.status === statusFilter;

      const matchesDate =
        (!startDate || record.date >= startDate) &&
        (!endDate || record.date <= endDate);

      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        `${record.studentName} ${record.admissionNo} ${record.rollNo} ${record.className}`
          .toLowerCase()
          .includes(query);

      return matchesClass && matchesStatus && matchesDate && matchesSearch;
    });
  }, [records, selectedClass, statusFilter, startDate, endDate, search]);

  const stats = useMemo(() => ({
    total: filteredRecords.length,
    present: filteredRecords.filter((r) => r.status === "Present").length,
    absent: filteredRecords.filter((r) => r.status === "Absent").length,
    late: filteredRecords.filter((r) => r.status === "Late").length,
    leave: filteredRecords.filter((r) => r.status === "Leave").length,
  }), [filteredRecords]);

  const attendancePercentage = stats.total
    ? Math.round((stats.present / stats.total) * 100)
    : 0;

  const resetFilters = () => {
    setSelectedClass("All Classes");
    setStatusFilter("All Statuses");
    setStartDate("");
    setEndDate("");
    setSearch("");
  };

  const exportCSV = () => {
    const header = [
      "Date",
      "Class",
      "Roll No",
      "Admission No",
      "Student Name",
      "Status",
    ];

    const rows = filteredRecords.map((record) => [
      record.date,
      record.className,
      record.rollNo,
      record.admissionNo,
      record.studentName,
      record.status,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teacher-attendance-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CalendarCheck size={18} />
              Teacher Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Attendance History
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review student attendance records and export reports.
            </p>
          </div>

          <button
            onClick={exportCSV}
            disabled={filteredRecords.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Total Records" value={stats.total} icon={<ClipboardList size={20} />} tone="indigo" />
          <StatCard title="Present" value={stats.present} icon={<CheckCircle2 size={20} />} tone="green" />
          <StatCard title="Absent" value={stats.absent} icon={<XCircle size={20} />} tone="red" />
          <StatCard title="Late" value={stats.late} icon={<Clock3 size={20} />} tone="amber" />
          <StatCard title="Attendance Rate" value={`${attendancePercentage}%`} icon={<Users size={20} />} tone="blue" />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Filter size={19} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Filter Records
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div>
              <label htmlFor="history-class" className="mb-2 block text-sm font-medium text-slate-700">
                Class
              </label>
              <select
                id="history-class"
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Classes</option>
                <option>Class 8-A</option>
                <option>Class 9-B</option>
                <option>Class 10-A</option>
              </select>
            </div>

            <div>
              <label htmlFor="history-status" className="mb-2 block text-sm font-medium text-slate-700">
                Attendance Status
              </label>
              <select
                id="history-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Statuses</option>
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
                <option>Leave</option>
              </select>
            </div>

            <div>
              <label htmlFor="history-start" className="mb-2 block text-sm font-medium text-slate-700">
                From Date
              </label>
              <input
                id="history-start"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="history-end" className="mb-2 block text-sm font-medium text-slate-700">
                To Date
              </label>
              <input
                id="history-end"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="history-search" className="mb-2 block text-sm font-medium text-slate-700">
                Search Student
              </label>
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="history-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name or admission no."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filteredRecords.length}</span> matching records
            </p>
            <button
              onClick={resetFilters}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              Reset Filters
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Attendance Records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Student-wise attendance history based on the selected filters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Admission No.</th>
                  <th className="px-6 py-4 font-semibold">Class</th>
                  <th className="px-6 py-4 font-semibold">Roll No.</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {new Date(`${record.date}T00:00:00`).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                          {record.studentName
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {record.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{record.admissionNo}</td>
                    <td className="px-6 py-4 text-slate-600">{record.className}</td>
                    <td className="px-6 py-4 text-slate-600">{record.rollNo}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <CalendarDays size={32} className="mx-auto mb-3 text-slate-300" />
                      <p className="font-semibold text-slate-700">No attendance records found</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Adjust your filters or reset them to see more records.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500 sm:px-6">
            Demo records only. Connect this page to your attendance API to display actual school records.
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tone: "indigo" | "green" | "red" | "amber" | "blue";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
