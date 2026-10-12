import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  UserRound,
  BookOpen,
} from "lucide-react";

type Period = {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  color: string;
};

type DaySchedule = {
  day: string;
  date: Date;
  periods: Period[];
};

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const samplePeriods: Record<string, Period[]> = {
  Monday: [
    {
      time: "09:00 - 09:45",
      subject: "Mathematics",
      teacher: "Mrs. Priya Sharma",
      room: "Room 101",
      color: "border-blue-400 bg-blue-50",
    },
    {
      time: "10:00 - 10:45",
      subject: "Science",
      teacher: "Mr. Rahul Verma",
      room: "Science Lab",
      color: "border-emerald-400 bg-emerald-50",
    },
    {
      time: "11:00 - 11:45",
      subject: "English",
      teacher: "Mrs. Neha Singh",
      room: "Room 103",
      color: "border-purple-400 bg-purple-50",
    },
    {
      time: "12:00 - 12:45",
      subject: "Social Science",
      teacher: "Mr. Amit Kumar",
      room: "Room 104",
      color: "border-amber-400 bg-amber-50",
    },
  ],
  Tuesday: [
    {
      time: "09:00 - 09:45",
      subject: "Computer Science",
      teacher: "Mr. Vikash Gupta",
      room: "Computer Lab",
      color: "border-cyan-400 bg-cyan-50",
    },
    {
      time: "10:00 - 10:45",
      subject: "Mathematics",
      teacher: "Mrs. Priya Sharma",
      room: "Room 101",
      color: "border-blue-400 bg-blue-50",
    },
    {
      time: "11:00 - 11:45",
      subject: "Science",
      teacher: "Mr. Rahul Verma",
      room: "Science Lab",
      color: "border-emerald-400 bg-emerald-50",
    },
    {
      time: "12:00 - 12:45",
      subject: "Hindi",
      teacher: "Mrs. Sunita Devi",
      room: "Room 102",
      color: "border-rose-400 bg-rose-50",
    },
  ],
  Wednesday: [
    {
      time: "09:00 - 09:45",
      subject: "English",
      teacher: "Mrs. Neha Singh",
      room: "Room 103",
      color: "border-purple-400 bg-purple-50",
    },
    {
      time: "10:00 - 10:45",
      subject: "Mathematics",
      teacher: "Mrs. Priya Sharma",
      room: "Room 101",
      color: "border-blue-400 bg-blue-50",
    },
    {
      time: "11:00 - 11:45",
      subject: "Hindi",
      teacher: "Mrs. Sunita Devi",
      room: "Room 102",
      color: "border-rose-400 bg-rose-50",
    },
  ],
  Thursday: [
    {
      time: "09:00 - 09:45",
      subject: "Science",
      teacher: "Mr. Rahul Verma",
      room: "Science Lab",
      color: "border-emerald-400 bg-emerald-50",
    },
    {
      time: "10:00 - 10:45",
      subject: "Computer Science",
      teacher: "Mr. Vikash Gupta",
      room: "Computer Lab",
      color: "border-cyan-400 bg-cyan-50",
    },
    {
      time: "11:00 - 11:45",
      subject: "Social Science",
      teacher: "Mr. Amit Kumar",
      room: "Room 104",
      color: "border-amber-400 bg-amber-50",
    },
    {
      time: "12:00 - 12:45",
      subject: "Hindi",
      teacher: "Mrs. Sunita Devi",
      room: "Room 102",
      color: "border-rose-400 bg-rose-50",
    },
  ],
  Friday: [
    {
      time: "09:00 - 09:45",
      subject: "Mathematics",
      teacher: "Mrs. Priya Sharma",
      room: "Room 101",
      color: "border-blue-400 bg-blue-50",
    },
    {
      time: "10:00 - 10:45",
      subject: "English",
      teacher: "Mrs. Neha Singh",
      room: "Room 103",
      color: "border-purple-400 bg-purple-50",
    },
    {
      time: "11:00 - 11:45",
      subject: "Social Science",
      teacher: "Mr. Amit Kumar",
      room: "Room 104",
      color: "border-amber-400 bg-amber-50",
    },
  ],
  Saturday: [
    {
      time: "09:00 - 09:45",
      subject: "Hindi",
      teacher: "Mrs. Sunita Devi",
      room: "Room 102",
      color: "border-rose-400 bg-rose-50",
    },
    {
      time: "10:00 - 10:45",
      subject: "Mathematics Practice",
      teacher: "Mrs. Priya Sharma",
      room: "Room 101",
      color: "border-blue-400 bg-blue-50",
    },
  ],
};

function getMonday(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  const day = result.getDay();
  result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day));

  return result;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString("en-IN", options ?? {
    day: "numeric",
    month: "short",
  });
}

export default function MyTimetable() {
  const [weekStart, setWeekStart] = useState(() =>
    getMonday(new Date())
  );

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today;
  });

  const schedule: DaySchedule[] = useMemo(
    () =>
      weekdays.map((day, index) => ({
        day,
        date: addDays(weekStart, index),
        periods: samplePeriods[day] ?? [],
      })),
    [weekStart]
  );

  const selectedDay = weekdays[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1];

  const selectedPeriods = samplePeriods[selectedDay] ?? [];

  const isCurrentWeek = (date: Date) => {
    const monday = getMonday(date);
    return monday.getTime() === weekStart.getTime();
  };

  const goToWeek = (direction: number) => {
    setWeekStart((current) => addDays(current, direction * 7));
    setSelectedDate((current) => addDays(current, direction * 7));
  };

  const goToToday = () => {
    const today = new Date();
    setWeekStart(getMonday(today));
    setSelectedDate(today);
  };

  const totalPeriods = schedule.reduce(
    (total, day) => total + day.periods.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Timetable
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your weekly classes, period timings, teachers, and classrooms.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Summary
            icon={<CalendarDays size={22} />}
            label="Days Scheduled"
            value={String(schedule.filter((day) => day.periods.length > 0).length)}
          />
          <Summary
            icon={<BookOpen size={22} />}
            label="Periods This Week"
            value={String(totalPeriods)}
          />
          <Summary
            icon={<Clock size={22} />}
            label="Period Duration"
            value="45 minutes"
          />
        </div>

        {/* Week navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Weekly Schedule
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(weekStart, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {" - "}
              {formatDate(addDays(weekStart, 5), {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToWeek(-1)}
              aria-label="Previous week"
              className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => goToWeek(1)}
              aria-label="Next week"
              className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Day selector */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {schedule.map((day) => {
            const selected =
              selectedDate.toDateString() === day.date.toDateString();
            const today =
              new Date().toDateString() === day.date.toDateString();

            return (
              <button
                key={day.day}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                className={`rounded-xl border p-3 text-left transition ${
                  selected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                }`}
              >
                <p className="text-xs font-medium">{day.day.slice(0, 3)}</p>
                <p className="mt-1 text-xl font-bold">
                  {day.date.getDate()}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    selected ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {day.periods.length} periods
                </p>
                {today && (
                  <span className="mt-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day heading */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedDay}{" "}
            <span className="font-normal text-gray-500">
              · {formatDate(selectedDate, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your classes for the selected day.
          </p>
        </div>

        {/* Selected day's periods */}
        {selectedPeriods.length > 0 ? (
          <div className="space-y-3">
            {selectedPeriods.map((period, index) => (
              <div
                key={`${period.time}-${period.subject}`}
                className={`rounded-xl border-l-4 border border-gray-200 bg-white p-4 shadow-sm sm:p-5 ${period.color}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-36">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <Clock size={16} />
                      {period.time}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Period {index + 1}
                    </p>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">
                      {period.subject}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <UserRound size={15} />
                        {period.teacher}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin size={15} />
                        {period.room}
                      </span>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-600">
                    Period {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <CalendarDays
              className="mx-auto text-gray-400"
              size={36}
            />
            <h3 className="mt-3 font-semibold text-gray-900">
              No classes scheduled
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no classes for this day in the sample timetable.
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400">
          Demo data only. Actual schedules will be loaded from the school
          database when the backend integration is implemented.
        </p>
      </div>
    </div>
  );
}

function Summary({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}