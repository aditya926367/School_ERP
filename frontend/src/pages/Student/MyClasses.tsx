
import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Users,
  ChevronRight,
  ChevronLeft,
  UserRound,
  CheckCircle2,
} from "lucide-react";

type ClassSubject = {
  id: number;
  name: string;
  code: string;
  teacher: string;
  room: string;
  schedule: string;
  color: string;
  initials: string;
};

const subjects: ClassSubject[] = [
  {
    id: 1,
    name: "Mathematics",
    code: "MAT101",
    teacher: "Mr. Rajesh Verma",
    room: "Room 101",
    schedule: "Mon, Wed, Fri",
    color: "bg-blue-50 text-blue-600",
    initials: "MA",
  },
  {
    id: 2,
    name: "Science",
    code: "SCI102",
    teacher: "Mrs. Priya Singh",
    room: "Science Lab",
    schedule: "Mon, Tue, Thu",
    color: "bg-emerald-50 text-emerald-600",
    initials: "SC",
  },
  {
    id: 3,
    name: "English",
    code: "ENG103",
    teacher: "Ms. Neha Sharma",
    room: "Room 104",
    schedule: "Tue, Wed, Fri",
    color: "bg-violet-50 text-violet-600",
    initials: "EN",
  },
  {
    id: 4,
    name: "Social Science",
    code: "SST104",
    teacher: "Mr. Amit Kumar",
    room: "Room 105",
    schedule: "Mon, Thu, Fri",
    color: "bg-amber-50 text-amber-600",
    initials: "SS",
  },
  {
    id: 5,
    name: "Computer Science",
    code: "CS105",
    teacher: "Mr. Vikash Singh",
    room: "Computer Lab",
    schedule: "Tue, Thu",
    color: "bg-pink-50 text-pink-600",
    initials: "CS",
  },
  {
    id: 6,
    name: "Hindi",
    code: "HIN106",
    teacher: "Mrs. Sunita Kumari",
    room: "Room 102",
    schedule: "Wed, Thu, Sat",
    color: "bg-cyan-50 text-cyan-600",
    initials: "HI",
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getSubjectsForDay(date: Date) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = dayNames[date.getDay()];

  return subjects.filter((subject) =>
    subject.schedule.split(", ").includes(dayName),
  );
}

export default function MyClasses() {
  const [selectedSubject, setSelectedSubject] =
    useState<ClassSubject | null>(null);

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const todayKey = toDateKey(new Date());
  const selectedDateKey = toDateKey(selectedDate);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const monthName = month.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [year, monthIndex]);

  const selectedDaySubjects = useMemo(
    () => getSubjectsForDay(selectedDate),
    [selectedDate],
  );

  function goToToday() {
    const currentDate = new Date();
    setSelectedDate(currentDate);
    setMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    );
  }

  function selectCalendarDate(day: number) {
    const date = new Date(year, monthIndex, day);
    setSelectedDate(date);
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <p className="mb-2 text-sm text-slate-500">
          Student Portal / My Academics / My Classes
        </p>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          My Classes
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          View your subjects, teachers, classrooms, and weekly class schedule.
        </p>
      </div>

      {/* Student class information */}
      <section className="rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-indigo-100">
              <GraduationCap size={20} />
              <span className="text-sm font-medium">
                Current Academic Year
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold">
              Class 10 - Section A
            </h2>

            <p className="mt-2 text-sm text-indigo-100">
              Academic Year 2026–2027
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <BookOpen size={20} />
              <p className="mt-2 text-2xl font-bold">{subjects.length}</p>
              <p className="text-xs text-indigo-100">Subjects</p>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <Users size={20} />
              <p className="mt-2 text-2xl font-bold">35</p>
              <p className="text-xs text-indigo-100">Classmates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays size={20} className="text-indigo-600" />
              <h2 className="font-semibold text-slate-900">
                Class Calendar
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Select a date to view the subjects scheduled for that weekday.
            </p>
          </div>

          <button
            type="button"
            onClick={goToToday}
            className="w-fit rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Go to Today
          </button>
        </div>

        {/* Month navigation */}
        <div className="mx-auto mt-5 flex max-w-md items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() =>
              setMonth(new Date(year, monthIndex - 1, 1))
            }
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
          >
            <ChevronLeft size={18} />
          </button>

          <h3 className="text-sm font-bold text-slate-800 sm:text-base">
            {monthName}
          </h3>

          <button
            type="button"
            aria-label="Next month"
            onClick={() =>
              setMonth(new Date(year, monthIndex + 1, 1))
            }
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="mx-auto mt-3 max-w-md">
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="py-2 text-[10px] font-semibold text-slate-400 sm:text-xs"
                >
                  {day}
                </div>
              ),
            )}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-9 sm:h-10"
                  />
                );
              }

              const date = new Date(year, monthIndex, day);
              const dateKey = toDateKey(date);
              const isSelected = selectedDateKey === dateKey;
              const isToday = todayKey === dateKey;
              const hasClasses = getSubjectsForDay(date).length > 0;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => selectCalendarDate(day)}
                  aria-pressed={isSelected}
                  aria-label={formatLongDate(date)}
                  className={`relative flex h-9 flex-col items-center justify-center rounded-lg text-xs transition sm:h-10 sm:text-sm ${
                    isSelected
                      ? "bg-indigo-600 font-bold text-white shadow-sm"
                      : "text-slate-700 hover:bg-indigo-50"
                  } ${
                    isToday && !isSelected
                      ? "font-bold ring-1 ring-inset ring-indigo-400"
                      : ""
                  }`}
                >
                  {day}

                  {hasClasses && (
                    <span
                      className={`absolute bottom-1 h-1 w-1 rounded-full ${
                        isSelected ? "bg-white" : "bg-emerald-500"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Selected date
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Scheduled subjects
          </span>
        </div>

        {/* Selected date information */}
        <div className="mt-4 rounded-xl bg-indigo-50 p-4">
          <p className="text-xs font-medium text-indigo-600">
            Selected Date
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {formatLongDate(selectedDate)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {selectedDateKey === todayKey
              ? "Today"
              : selectedDateKey < todayKey
                ? "Past date"
                : "Future date"}
            {" · "}
            {selectedDaySubjects.length} scheduled subjects
          </p>
        </div>
      </section>

      {/* Enrolled subjects */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-semibold text-slate-900">
          Enrolled Subjects
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {subjects.length} subjects enrolled
        </p>
      </section>

      {/* Subject cards */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <article
            key={subject.id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold ${subject.color}`}
              >
                {subject.initials}
              </div>

              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Enrolled
              </span>
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              {subject.name}
            </h3>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {subject.code}
            </p>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <UserRound
                  size={17}
                  className="shrink-0 text-slate-400"
                />
                <span>{subject.teacher}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <BookOpen
                  size={17}
                  className="shrink-0 text-slate-400"
                />
                <span>{subject.room}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <CalendarDays
                  size={17}
                  className="shrink-0 text-slate-400"
                />
                <span>{subject.schedule}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSubject(subject)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              View Subject Details
              <ChevronRight size={17} />
            </button>
          </article>
        ))}
      </section>

      {/* Subject details dialog */}
      {selectedSubject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedSubject(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="subject-dialog-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold ${selectedSubject.color}`}
              >
                {selectedSubject.initials}
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubject(null)}
                aria-label="Close subject details"
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <h2
              id="subject-dialog-title"
              className="mt-4 text-xl font-bold text-slate-900"
            >
              {selectedSubject.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Subject Code: {selectedSubject.code}
            </p>

            <div className="mt-5 space-y-4">
              <DetailRow
                icon={<UserRound size={18} />}
                label="Subject Teacher"
                value={selectedSubject.teacher}
              />

              <DetailRow
                icon={<BookOpen size={18} />}
                label="Classroom"
                value={selectedSubject.room}
              />

              <DetailRow
                icon={<CalendarDays size={18} />}
                label="Weekly Schedule"
                value={selectedSubject.schedule}
              />

              <DetailRow
                icon={<Clock3 size={18} />}
                label="Class"
                value="See My Timetable for period timings"
              />
            </div>

            <button
              type="button"
              onClick={() => setSelectedSubject(null)}
              className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        Demo data only · Connect to the school database for actual subjects
        and enrollment.
      </p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}
