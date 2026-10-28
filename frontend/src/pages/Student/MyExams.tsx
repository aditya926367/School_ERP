import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  BookOpen,
  Search,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type ExamStatus = "Upcoming" | "Completed";

type Exam = {
  id: number;
  name: string;
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
  totalMarks: number;
  status: ExamStatus;
  marks?: number;
  resultPublished: boolean;
};

function dateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const initialExams: Exam[] = [];

type Filter = "All" | ExamStatus;

export default function MyExams() {
  const [exams] = useState<Exam[]>(initialExams);
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      all: exams.length,
      upcoming: exams.filter((exam) => exam.status === "Upcoming").length,
      completed: exams.filter((exam) => exam.status === "Completed").length,
      results: exams.filter((exam) => exam.resultPublished).length,
    }),
    [exams]
  );

  const filteredExams = exams
    .filter((exam) => filter === "All" || exam.status === filter)
    .filter((exam) =>
      `${exam.name} ${exam.subject}`.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.examDate.localeCompare(b.examDate));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Exams</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your examination schedule and check published results.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            icon={<ClipboardList size={22} />}
            title="Total Exams"
            value={counts.all}
            color="blue"
          />
          <SummaryCard
            icon={<CalendarDays size={22} />}
            title="Upcoming"
            value={counts.upcoming}
            color="amber"
          />
          <SummaryCard
            icon={<CheckCircle2 size={22} />}
            title="Completed"
            value={counts.completed}
            color="green"
          />
          <SummaryCard
            icon={<BookOpen size={22} />}
            title="Results Published"
            value={counts.results}
            color="purple"
          />
        </div>

        {/* Search and filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search exams or subjects..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(["All", "Upcoming", "Completed"] as Filter[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  filter === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Exam list */}
        <div className="space-y-4">
          {filteredExams.map((exam) => (
            <article
              key={exam.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="flex gap-4">
                  <div className="h-fit rounded-lg bg-blue-50 p-3 text-blue-600">
                    <BookOpen size={24} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase text-blue-600">
                        {exam.subject}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          exam.status === "Upcoming"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>

                    <h2 className="mt-2 text-lg font-bold text-gray-900">
                      {exam.name}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {formatDate(exam.examDate)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        {exam.startTime} - {exam.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="min-w-40 rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Total Marks</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {exam.totalMarks}
                  </p>
                  <p className="mt-3 text-xs text-gray-500">Room</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {exam.room}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <div className="text-sm">
                  {exam.resultPublished ? (
                    <span className="font-medium text-emerald-700">
                      Result published: {exam.marks ?? "—"} / {exam.totalMarks}
                    </span>
                  ) : exam.status === "Completed" ? (
                    <span className="flex items-center gap-2 text-amber-700">
                      <AlertCircle size={16} />
                      Result not yet published
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Be prepared for your upcoming exam.
                    </span>
                  )}
                </div>

                {exam.status === "Upcoming" && (
                  <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                    Scheduled
                  </span>
                )}
              </div>
            </article>
          ))}

          {filteredExams.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <CalendarDays
                size={34}
                className="mx-auto text-gray-400"
              />
              <h2 className="mt-3 font-semibold text-gray-900">
                No exams found
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Demo data only. Official exam schedules and marks should come from
          your school backend.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: "blue" | "amber" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-3 ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-500 sm:text-sm">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}