
import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Search,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react";

type HomeworkStatus = "Pending" | "Submitted" | "Overdue";

type HomeworkItem = {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  status: HomeworkStatus;
  priority: "High" | "Medium" | "Low";
};

const demoHomework: HomeworkItem[] = [];

const statusStyles: Record<HomeworkStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Submitted: "bg-green-100 text-green-700",
  Overdue: "bg-red-100 text-red-700",
};

const priorityStyles = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-gray-100 text-gray-600",
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ParentHomework() {
  const [homework] = useState<HomeworkItem[]>(demoHomework);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [selectedHomework, setSelectedHomework] =
    useState<HomeworkItem | null>(null);

  const filteredHomework = useMemo(() => {
    const query = search.trim().toLowerCase();

    return homework.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.teacher.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesSubject =
        subjectFilter === "All" || item.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [homework, search, statusFilter, subjectFilter]);

  const pendingCount = homework.filter(
    (item) => item.status === "Pending"
  ).length;

  const submittedCount = homework.filter(
    (item) => item.status === "Submitted"
  ).length;

  const overdueCount = homework.filter(
    (item) => item.status === "Overdue"
  ).length;

  const exportCSV = () => {
    const headers = [
      "Title",
      "Subject",
      "Teacher",
      "Assigned Date",
      "Due Date",
      "Priority",
      "Status",
      "Description",
    ];

    const rows = filteredHomework.map((item) => [
      item.title,
      item.subject,
      item.teacher,
      item.assignedDate,
      item.dueDate,
      item.priority,
      item.status,
      item.description,
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
    link.download = "parent-homework-report.csv";
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
          <h1 className="text-2xl font-bold text-gray-800">Homework</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your child's assignments, deadlines and submission status.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202b75]"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Child Information */}
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
        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-[#27348b]">
          Academic Year 2026-27
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Homework</p>
              <p className="mt-2 text-2xl font-bold text-amber-700">
                {pendingCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Awaiting completion
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Submitted</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {submittedCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Completed assignments
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {overdueCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Past the due date
              </p>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={cardClass}>
        <h2 className="mb-4 font-semibold text-gray-800">
          Filter Assignments
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, subject or teacher"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Subjects</option>
              {Array.from(
                new Set(homework.map((item) => item.subject))
              ).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
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
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Homework Cards */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-[#27348b]" />
          <h2 className="font-semibold text-gray-800">
            Assignment List
          </h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {filteredHomework.length}
          </span>
        </div>

        {filteredHomework.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <ClipboardCheck size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 font-semibold text-gray-800">
              No assignments found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredHomework.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2.5 text-[#27348b]">
                      <BookOpen size={21} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.subject}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[item.priority]}`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <CalendarDays
                      size={17}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Assigned Date</p>
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {formatDate(item.assignedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock
                      size={17}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p
                        className={`mt-1 text-sm font-medium ${
                          item.status === "Overdue"
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        {formatDate(item.dueDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500">
                    Assigned by{" "}
                    <span className="font-medium text-gray-700">
                      {item.teacher}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedHomework(item)}
                    className="mt-3 w-full rounded-lg border border-[#27348b] px-4 py-2 text-sm font-semibold text-[#27348b] transition hover:bg-indigo-50"
                  >
                    View Assignment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Details Modal */}
      {selectedHomework && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedHomework(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="homework-title"
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 p-5">
              <h2
                id="homework-title"
                className="text-lg font-bold text-gray-800"
              >
                Assignment Details
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs text-gray-500">Assignment</p>
                <h3 className="mt-1 font-semibold text-gray-800">
                  {selectedHomework.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Subject</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {selectedHomework.subject}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Priority</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {selectedHomework.priority}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Assigned Date</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {formatDate(selectedHomework.assignedDate)}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {formatDate(selectedHomework.dueDate)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Instructions</p>
                <p className="mt-1 text-sm leading-6 text-gray-700">
                  {selectedHomework.description}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Teacher</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {selectedHomework.teacher}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Submission Status</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[selectedHomework.status]}`}
                >
                  {selectedHomework.status}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHomework(null)}
                className="w-full rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202b75]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <p>
          <span className="font-semibold">Note:</span> This page uses sample
          homework records. Submission status and assignment details will be
          connected to the school database during backend integration.
        </p>
      </div>
    </div>
  );
}
