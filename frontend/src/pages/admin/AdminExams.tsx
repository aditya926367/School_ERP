import { useMemo, useState, useEffect } from "react";
import type { FormEvent, ReactNode, SetStateAction } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  X,
  FileText,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  EditButton,
  DeleteButton,
} from "../../components/common/ActionButtons";
import Pagination from "../../components/common/Pagination";

// Persist component state in localStorage and restore it on reload.
function usePersistentState<T>(
  storageKey: string,
  initialValue: T,
): [T, React.Dispatch<SetStateAction<T>>] {
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
    } catch {
      // Keep the component usable if browser storage is unavailable.
    }
  }, [storageKey, value]);

  return [value, setValue];
}

type ExamStatus = "Upcoming" | "Ongoing" | "Completed";

type Exam = {
  id: number;
  name: string;
  className: string;
  subject: string;
  examDate: string;
  startTime: string;
  duration: number;
  totalMarks: number;
  status: ExamStatus;
};

const initialExams: Exam[] = [];

const emptyExam: Omit<Exam, "id"> = {
  name: "",
  className: "",
  subject: "",
  examDate: "",
  startTime: "09:00",
  duration: 60,
  totalMarks: 100,
  status: "Upcoming",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function formatDate(date: string) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: ExamStatus }) {
  const styles: Record<ExamStatus, string> = {
    Upcoming: "bg-blue-100 text-blue-700",
    Ongoing: "bg-amber-100 text-amber-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
    </div>
  );
}

export default function AdminExams() {
  const [exams, setExams] = usePersistentState<Exam[]>('schoolerp:pages_admin_adminexams_tsx:exams', []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Exam, "id">>(emptyExam);
  const [error, setError] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesSearch = [
        exam.name,
        exam.className,
        exam.subject,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || exam.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [exams, search, statusFilter]);

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / pageSize));

  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredExams.slice(start, start + pageSize);
  }, [filteredExams, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = {
    total: exams.length,
    upcoming: exams.filter((exam) => exam.status === "Upcoming").length,
    ongoing: exams.filter((exam) => exam.status === "Ongoing").length,
    completed: exams.filter((exam) => exam.status === "Completed").length,
  };

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyExam });
    setError("");
    setShowModal(true);
  }

  function openEditModal(exam: Exam) {
    setEditingId(exam.id);
    setForm({
      name: exam.name,
      className: exam.className,
      subject: exam.subject,
      examDate: exam.examDate,
      startTime: exam.startTime,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      status: exam.status,
    });
    setError("");
    setShowModal(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.className.trim() ||
      !form.subject.trim() ||
      !form.examDate ||
      !form.startTime
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.duration <= 0 || form.totalMarks <= 0) {
      setError("Duration and total marks must be greater than zero.");
      return;
    }

    if (editingId !== null) {
      setExams((current) =>
        current.map((exam) =>
          exam.id === editingId ? { ...form, id: editingId } : exam,
        ),
      );
    } else {
      setExams((current) => [
        ...current,
        { ...form, id: Date.now() },
      ]);
    }

    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyExam });
    setError("");
  }

  function deleteExam(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exam?",
    );

    if (confirmed) {
      setExams((current) => current.filter((exam) => exam.id !== id));
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Exam Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule examinations and manage exam details.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white "
        >
          <Plus size={18} />
          Create Exam
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Exams"
          value={stats.total}
          icon={<FileText size={22} />}
          iconClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcoming}
          icon={<CalendarDays size={22} />}
          iconClass="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Ongoing"
          value={stats.ongoing}
          icon={<Clock size={22} />}
          iconClass="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 size={22} />}
          iconClass="bg-green-100 text-green-600"
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by exam, class, or subject..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className={`${inputClass} md:w-48`}
            aria-label="Filter exams by status"
          >
            <option value="All">All status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Exam table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">Scheduled Exams</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredExams.length} exam
              {filteredExams.length === 1 ? "" : "s"} found
            </p>
          </div>
          <Users size={21} className="text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Exam</th>
                <th className="px-5 py-4 font-semibold">Class</th>
                <th className="px-5 py-4 font-semibold">Subject</th>
                <th className="px-5 py-4 font-semibold">Date & Time</th>
                <th className="px-5 py-4 font-semibold">Duration</th>
                <th className="px-5 py-4 font-semibold">Total Marks</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedExams.map((exam) => (
                <tr key={exam.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {exam.name}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {exam.className}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{exam.subject}</td>
                  <td className="px-5 py-4">
                    <p className="text-gray-800">{formatDate(exam.examDate)}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {exam.startTime}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {exam.duration} min
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {exam.totalMarks}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={exam.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <EditButton
                        title="Edit Exam"
                        onClick={() => openEditModal(exam)}
                      />

                      <DeleteButton
                        title="Delete Exam"
                        onClick={() => deleteExam(exam.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <FileText
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-medium text-gray-700">No exams found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Change your search or create a new exam.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredExams.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          pageSizes={[5, 10, 20, 50]}
        />
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exam-modal-title"
            className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2
                  id="exam-modal-title"
                  className="text-lg font-bold text-gray-900"
                >
                  {editingId !== null ? "Edit Exam" : "Create New Exam"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the examination details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Exam Name *
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="e.g. First Term Examination"
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Class *
                  </span>
                  <select
                    required
                    value={form.className}
                    onChange={(event) =>
                      setForm({ ...form, className: event.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="">Select class</option>
                    {[
                      "Class 1",
                      "Class 2",
                      "Class 3",
                      "Class 4",
                      "Class 5",
                      "Class 6",
                      "Class 7",
                      "Class 8",
                      "Class 9",
                      "Class 10",
                      "Class 11",
                      "Class 12",
                    ].map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Subject *
                  </span>
                  <input
                    required
                    value={form.subject}
                    onChange={(event) =>
                      setForm({ ...form, subject: event.target.value })
                    }
                    placeholder="e.g. Mathematics"
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Exam Date *
                  </span>
                  <input
                    required
                    type="date"
                    value={form.examDate}
                    onChange={(event) =>
                      setForm({ ...form, examDate: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Start Time *
                  </span>
                  <input
                    required
                    type="time"
                    value={form.startTime}
                    onChange={(event) =>
                      setForm({ ...form, startTime: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Duration (minutes) *
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        duration: Number(event.target.value),
                      })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Total Marks *
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.totalMarks}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        totalMarks: Number(event.target.value),
                      })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Status *
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as ExamStatus,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#27348b] px-5 py-2.5 text-sm font-semibold text-white "
                >
                  {editingId !== null ? "Save Changes" : "Create Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}