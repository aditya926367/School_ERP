import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Holiday";

type AttendanceRecord = {
  date: string;
  status: AttendanceStatus;
  remark?: string;
};

const today = new Date();

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function createDemoRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  for (
    let date = new Date(start);
    date <= end && date <= today;
    date = shiftDate(date, 1)
  ) {
    const day = date.getDay();

    if (day === 0) continue;

    if (day === 6) {
      records.push({
        date: dateKey(date),
        status: "Holiday",
        remark: "Saturday holiday",
      });
      continue;
    }

    const dayOfMonth = date.getDate();

    // Deterministic sample data for demonstration.
    let status: AttendanceStatus = "Present";

    if (dayOfMonth % 13 === 0) {
      status = "Absent";
    } else if (dayOfMonth % 9 === 0) {
      status = "Late";
    }

    records.push({
      date: dateKey(date),
      status,
      remark:
        status === "Absent"
          ? "Absent for the school day"
          : status === "Late"
            ? "Arrived after the scheduled time"
            : "Attendance recorded",
    });
  }

  return records;
}

const initialRecords = createDemoRecords();

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status: AttendanceStatus) {
  switch (status) {
    case "Present":
      return "bg-emerald-100 text-emerald-700";
    case "Absent":
      return "bg-red-100 text-red-700";
    case "Late":
      return "bg-amber-100 text-amber-700";
    case "Holiday":
      return "bg-gray-100 text-gray-500";
  }
}

function getCalendarDot(status?: AttendanceStatus) {
  switch (status) {
    case "Present":
      return "bg-emerald-500";
    case "Absent":
      return "bg-red-500";
    case "Late":
      return "bg-amber-500";
    case "Holiday":
      return "bg-gray-400";
    default:
      return "";
  }
}

export default function MyAttendance() {
  const [records] = useState<AttendanceRecord[]>(initialRecords);
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(
    dateKey(today)
  );
  const [filter, setFilter] = useState<"All" | AttendanceStatus>("All");

  const recordMap = useMemo(
    () => new Map(records.map((record) => [record.date, record])),
    [records]
  );

  const stats = useMemo(() => {
    const schoolDays = records.filter(
      (record) => record.status !== "Holiday"
    );
    const present = schoolDays.filter(
      (record) => record.status === "Present"
    ).length;
    const absent = schoolDays.filter(
      (record) => record.status === "Absent"
    ).length;
    const late = schoolDays.filter(
      (record) => record.status === "Late"
    ).length;

    return {
      present,
      absent,
      late,
      total: schoolDays.length,
      percentage:
        schoolDays.length > 0
          ? Math.round(((present + late) / schoolDays.length) * 100)
          : 0,
    };
  }, [records]);

  const monthRecords = useMemo(
    () =>
      records.filter((record) => {
        const date = new Date(`${record.date}T00:00:00`);
        return (
          date.getFullYear() === month.getFullYear() &&
          date.getMonth() === month.getMonth()
        );
      }),
    [records, month]
  );

  const visibleRecords = useMemo(() => {
    let result = monthRecords;

    if (selectedDate) {
      result = result.filter((record) => record.date === selectedDate);
    }

    if (filter !== "All") {
      result = result.filter((record) => record.status === filter);
    }

    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [monthRecords, selectedDate, filter]);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    ).getDay();

    const daysInMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    ).getDate();

    return [
      ...Array.from({ length: firstDay }, () => null as number | null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [month]);

  function changeMonth(amount: number) {
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
    setSelectedDate(null);
  }

  function goToCurrentMonth() {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(dateKey(today));
    setFilter("All");
  }

  function selectCalendarDay(day: number) {
    const selected = dateKey(
      new Date(month.getFullYear(), month.getMonth(), day)
    );

    setSelectedDate(selected);
    setFilter("All");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Attendance
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your attendance, view your monthly calendar, and review
            daily records.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <SummaryCard
            icon={<ClipboardCheck size={22} />}
            title="Attendance Rate"
            value={`${stats.percentage}%`}
            subtitle="Present and late days"
            color="blue"
          />
          <SummaryCard
            icon={<CheckCircle2 size={22} />}
            title="Present"
            value={String(stats.present)}
            subtitle="Days present"
            color="green"
          />
          <SummaryCard
            icon={<XCircle size={22} />}
            title="Absent"
            value={String(stats.absent)}
            subtitle="Days absent"
            color="red"
          />
          <SummaryCard
            icon={<Clock size={22} />}
            title="Late"
            value={String(stats.late)}
            subtitle="Late arrivals"
            color="amber"
          />
        </div>

        {/* Attendance progress */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Overall Attendance
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {stats.present + stats.late} attended out of {stats.total} school days
              </p>
            </div>
            <span className="text-2xl font-bold text-blue-700">
              {stats.percentage}%
            </span>
          </div>

          <div
            className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-label="Overall attendance"
            aria-valuenow={stats.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-gray-400">
            This percentage uses the demo records currently displayed.
          </p>
        </section>

        {/* Calendar */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-900">
                Monthly Calendar
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select a date to view its attendance record.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goToCurrentMonth}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <h3 className="mb-4 mt-5 text-center text-lg font-semibold text-gray-800">
            {month.toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </h3>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-semibold text-gray-500 sm:text-sm"
                >
                  {day}
                </div>
              )
            )}

            {calendarCells.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const date = dateKey(
                new Date(month.getFullYear(), month.getMonth(), day)
              );
              const record = recordMap.get(date);
              const selected = selectedDate === date;
              const isToday = date === dateKey(today);

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => selectCalendarDay(day)}
                  aria-label={`${formatDate(date)}${record ? `, ${record.status}` : ", no attendance record"}`}
                  className={`flex min-h-[58px] flex-col items-center justify-center rounded-lg border p-1 transition sm:min-h-[70px] ${
                    selected
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : isToday
                        ? "border-blue-300"
                        : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      selected
                        ? "font-bold text-blue-700"
                        : isToday
                          ? "font-semibold text-blue-600"
                          : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                  {record && (
                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${getCalendarDot(record.status)}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4">
            {(
              [
                ["Present", "bg-emerald-500"],
                ["Absent", "bg-red-500"],
                ["Late", "bg-amber-500"],
                ["Holiday", "bg-gray-400"],
              ] as const
            ).map(([label, color]) => (
              <span
                key={label}
                className="flex items-center gap-2 text-xs text-gray-600"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* Attendance history */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
            <div>
              <h2 className="font-semibold text-gray-900">
                Attendance History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {selectedDate
                  ? `Records for ${formatDate(selectedDate)}`
                  : "Records for the selected month"}
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as "All" | AttendanceStatus)
              }
              aria-label="Filter attendance status"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Holiday">Holiday</option>
            </select>
          </div>

          {visibleRecords.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold">Day</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visibleRecords.map((record) => (
                      <tr key={record.date} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {new Date(
                            `${record.date}T00:00:00`
                          ).toLocaleDateString("en-IN", {
                            weekday: "long",
                          })}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {record.remark ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="divide-y divide-gray-100 sm:hidden">
                {visibleRecords.map((record) => (
                  <div
                    key={record.date}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(record.date)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {record.remark ?? "No remarks"}
                      </p>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-10 text-center">
              <CalendarDays
                size={32}
                className="mx-auto text-gray-400"
              />
              <p className="mt-3 font-semibold text-gray-800">
                No attendance records found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Choose another date or change the status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  setFilter("All");
                }}
                className="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                View whole month
              </button>
            </div>
          )}
        </section>

        <p className="text-xs text-gray-400">
          Demo data only. Official attendance must be retrieved from your
          school's backend and database.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: "blue" | "green" | "red" | "amber";
}) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-3 ${colorStyles[color]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 sm:text-sm">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
    >
      {status}
    </span>
  );
}
