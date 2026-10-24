
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  BookOpen,
  MapPin,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";

type ClassStatus = "Completed" | "Upcoming";

type TimetableEntry = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  className: string;
  room: string;
  status: ClassStatus;
};

const timetable: TimetableEntry[] = [
  { id: 1, day: "Monday", startTime: "09:00 AM", endTime: "09:45 AM", subject: "Mathematics", className: "Class 8-A", room: "Room 204", status: "Completed" },
  { id: 2, day: "Monday", startTime: "11:00 AM", endTime: "11:45 AM", subject: "Mathematics", className: "Class 9-B", room: "Room 206", status: "Upcoming" },
  { id: 3, day: "Monday", startTime: "01:00 PM", endTime: "01:45 PM", subject: "Mathematics", className: "Class 10-A", room: "Room 208", status: "Upcoming" },
  { id: 4, day: "Tuesday", startTime: "09:00 AM", endTime: "09:45 AM", subject: "Science", className: "Class 8-B", room: "Science Lab", status: "Completed" },
  { id: 5, day: "Tuesday", startTime: "10:00 AM", endTime: "10:45 AM", subject: "Mathematics", className: "Class 7-B", room: "Room 202", status: "Upcoming" },
  { id: 6, day: "Tuesday", startTime: "01:00 PM", endTime: "01:45 PM", subject: "Mathematics", className: "Class 10-A", room: "Room 208", status: "Upcoming" },
  { id: 7, day: "Wednesday", startTime: "09:00 AM", endTime: "09:45 AM", subject: "Mathematics", className: "Class 8-A", room: "Room 204", status: "Completed" },
  { id: 8, day: "Wednesday", startTime: "10:00 AM", endTime: "10:45 AM", subject: "Science", className: "Class 8-B", room: "Science Lab", status: "Upcoming" },
  { id: 9, day: "Wednesday", startTime: "12:00 PM", endTime: "12:45 PM", subject: "Mathematics", className: "Class 9-B", room: "Room 206", status: "Upcoming" },
  { id: 10, day: "Thursday", startTime: "09:00 AM", endTime: "09:45 AM", subject: "Mathematics", className: "Class 7-B", room: "Room 202", status: "Completed" },
  { id: 11, day: "Thursday", startTime: "11:00 AM", endTime: "11:45 AM", subject: "Science", className: "Class 9-A", room: "Science Lab", status: "Upcoming" },
  { id: 12, day: "Friday", startTime: "09:00 AM", endTime: "09:45 AM", subject: "Mathematics", className: "Class 8-A", room: "Room 204", status: "Upcoming" },
  { id: 13, day: "Friday", startTime: "11:00 AM", endTime: "11:45 AM", subject: "Mathematics", className: "Class 10-A", room: "Room 208", status: "Upcoming" },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function MyTimetable() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [view, setView] = useState<"Day" | "Week">("Week");

  const dayEntries = useMemo(
    () => timetable.filter((item) => item.day === selectedDay),
    [selectedDay]
  );

  const completedCount = dayEntries.filter(
    (item) => item.status === "Completed"
  ).length;

  const upcomingCount = dayEntries.filter(
    (item) => item.status === "Upcoming"
  ).length;

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Heading */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <GraduationCap size={17} />
          <span>Teacher Portal</span>
          <span>/</span>
          <span>Timetable</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          My Timetable
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View your weekly teaching schedule and classroom assignments.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Classes This Day"
          value={dayEntries.length}
          icon={<BookOpen size={21} />}
          color="bg-indigo-100 text-indigo-600"
        />
        <SummaryCard
          title="Completed"
          value={completedCount}
          icon={<CheckCircle2 size={21} />}
          color="bg-emerald-100 text-emerald-600"
        />
        <SummaryCard
          title="Upcoming"
          value={upcomingCount}
          icon={<CalendarClock size={21} />}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Timetable controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">Teaching Schedule</h2>
            <p className="mt-1 text-sm text-gray-500">
              Select a weekday to see your classes.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-xl bg-gray-100 p-1">
            {(["Day", "Week"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  view === item
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {item} View
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {weekdays.map((day) => {
            const count = timetable.filter((item) => item.day === day).length;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedDay === day
                    ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    selectedDay === day ? "text-indigo-700" : "text-gray-800"
                  }`}
                >
                  {day}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {count} {count === 1 ? "class" : "classes"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day view */}
      {view === "Day" && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 p-5">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <CalendarDays size={22} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{selectedDay}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {dayEntries.length} scheduled classes
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {dayEntries.length > 0 ? (
              dayEntries.map((item) => <ClassRow key={item.id} item={item} />)
            ) : (
              <EmptyDay />
            )}
          </div>
        </div>
      )}

      {/* Week view */}
      {view === "Week" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {weekdays.map((day) => {
            const entries = timetable.filter((item) => item.day === day);

            return (
              <div
                key={day}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => {
                    setSelectedDay(day);
                    setView("Day");
                  }}
                  className="flex w-full items-center justify-between border-b border-gray-100 p-5 text-left transition hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                      <CalendarDays size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">{day}</h2>
                      <p className="mt-1 text-xs text-gray-500">
                        {entries.length} scheduled classes
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={19} className="text-gray-400" />
                </button>

                <div className="divide-y divide-gray-100">
                  {entries.length > 0 ? (
                    entries.map((item) => (
                      <ClassRow key={item.id} item={item} />
                    ))
                  ) : (
                    <EmptyDay />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClassRow({ item }: { item: TimetableEntry }) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="min-w-[88px] rounded-lg bg-gray-50 px-3 py-2 text-center">
          <p className="text-xs font-bold text-gray-800">{item.startTime}</p>
          <p className="mt-1 text-[11px] text-gray-500">{item.endTime}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">{item.subject}</h3>
          <p className="mt-1 text-sm text-gray-500">{item.className}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={13} />
            {item.room}
          </p>
        </div>
      </div>

      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
          item.status === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status === "Completed" && <CheckCircle2 size={14} />}
        {item.status}
      </span>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function EmptyDay() {
  return (
    <div className="px-5 py-8 text-center">
      <Clock className="mx-auto mb-2 text-gray-300" size={25} />
      <p className="text-sm font-medium text-gray-700">No classes scheduled</p>
      <p className="mt-1 text-xs text-gray-500">
        There are no classes assigned for this day.
      </p>
    </div>
  );
}
