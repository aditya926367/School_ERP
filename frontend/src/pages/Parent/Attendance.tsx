
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

type AttendanceRecord = {
  id: number;
  date: string;
  day: string;
  subject: string;
  status: AttendanceStatus;
  remarks: string;
};

const demoAttendance: AttendanceRecord[] = [];

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Late: "bg-amber-100 text-amber-700",
  Leave: "bg-blue-100 text-blue-700",
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ParentAttendance() {
  const [records] = useState<AttendanceRecord[]>(demoAttendance);
  const [monthFilter, setMonthFilter] = useState("2026-10");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesMonth = record.date.startsWith(monthFilter);
      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;
      const matchesSearch =
        record.date.toLowerCase().includes(search.toLowerCase()) ||
        record.day.toLowerCase().includes(search.toLowerCase()) ||
        record.remarks.toLowerCase().includes(search.toLowerCase());

      return matchesMonth && matchesStatus && matchesSearch;
    });
  }, [records, monthFilter, statusFilter, search]);

  const monthRecords = records.filter((record) =>
    record.date.startsWith(monthFilter)
  );

  const presentCount = monthRecords.filter(
    (record) => record.status === "Present" || record.status === "Late"
  ).length;

  const absentCount = monthRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const leaveCount = monthRecords.filter(
    (record) => record.status === "Leave"
  ).length;

  const attendancePercentage = monthRecords.length
    ? (presentCount / monthRecords.length) * 100
    : 0;

  const exportCSV = () => {
    const headers = ["Date", "Day", "Session", "Status", "Remarks"];
    const rows = filteredRecords.map((record) => [
      record.date,
      record.day,
      record.subject,
      record.status,
      record.remarks,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "child-attendance-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardClass =
    "rounded-xl border border-gray-200 bg-white p-5 shadow-sm";
  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-indigo-100";

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Attendance
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your child's attendance and daily records.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202b75]"
        >
          <ClipboardCheck size={18} />
          Export Report
        </button>
      </div>

      {/* Child Profile */}
      <div className={`${cardClass} flex flex-col justify-between gap-4 sm:flex-row sm:items-center`}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#27348b] font-bold text-white">
            AS
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Aarav Sharma</h2>
            <p className="mt-1 text-sm text-gray-500">
              Class 8-A · Roll No. 24
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
          Academic Year 2026-27
        </span>
      </div>

      {/* Filters */}
      <div className={cardClass}>
        <h2 className="mb-4 font-semibold text-gray-800">
          Attendance Filters
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Month
            </label>
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search Records
            </label>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search date or remarks"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {attendancePercentage.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-gray-500">Selected month</p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3 text-[#27348b]">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Present / Late</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {presentCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">Days attended</p>
            </div>
            <CheckCircle2 size={22} className="text-green-600" />
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {absentCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">Days absent</p>
            </div>
            <XCircle size={22} className="text-red-600" />
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Leave</p>
              <p className="mt-2 text-2xl font-bold text-blue-700">
                {leaveCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">Leave records</p>
            </div>
            <CalendarDays size={22} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            Daily Attendance Records
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {filteredRecords.length} record(s) found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Day</th>
                <th className="px-5 py-3 font-semibold">Session</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Remarks</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No attendance records found for these filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{record.day}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {record.subject}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status]}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {record.remarks}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <Clock size={19} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-semibold">Note:</span> These are sample
          attendance records. Actual attendance will be fetched from the
          school database after backend integration.
        </p>
      </div>
    </div>
  );
}
