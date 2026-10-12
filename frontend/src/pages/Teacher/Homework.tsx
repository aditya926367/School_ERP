
import { useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  CalendarDays,
  Clock3,
  Users,
  FileText,
  Pencil,
  Trash2,
  X,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type HomeworkStatus = "Active" | "Completed" | "Overdue";

type HomeworkItem = {
  id: number;
  title: string;
  description: string;
  className: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  totalStudents: number;
  submitted: number;
  status: HomeworkStatus;
};

const initialHomework: HomeworkItem[] = [
  {
    id: 1,
    title: "Algebra Practice Questions",
    description: "Complete exercise 4.2, questions 1 to 15 in your mathematics notebook.",
    className: "Class 8-A",
    subject: "Mathematics",
    assignedDate: "2026-10-10",
    dueDate: "2026-10-14",
    totalStudents: 35,
    submitted: 24,
    status: "Active",
  },
  {
    id: 2,
    title: "Essay on Environmental Protection",
    description: "Write a 300-word essay on environmental protection.",
    className: "Class 8-A",
    subject: "English",
    assignedDate: "2026-10-08",
    dueDate: "2026-10-12",
    totalStudents: 35,
    submitted: 29,
    status: "Overdue",
  },
  {
    id: 3,
    title: "Chemical Reactions Worksheet",
    description: "Answer the questions on chemical reactions from chapter 3.",
    className: "Class 9-B",
    subject: "Science",
    assignedDate: "2026-10-09",
    dueDate: "2026-10-15",
    totalStudents: 32,
    submitted: 18,
    status: "Active",
  },
  {
    id: 4,
    title: "History Chapter Summary",
    description: "Prepare short notes for chapter 5 and answer all review questions.",
    className: "Class 9-B",
    subject: "Social Studies",
    assignedDate: "2026-10-04",
    dueDate: "2026-10-09",
    totalStudents: 32,
    submitted: 32,
    status: "Completed",
  },
  {
    id: 5,
    title: "Trigonometry Exercises",
    description: "Solve exercise 8.1 and show all working steps.",
    className: "Class 10-A",
    subject: "Mathematics",
    assignedDate: "2026-10-11",
    dueDate: "2026-10-16",
    totalStudents: 30,
    submitted: 12,
    status: "Active",
  },
  {
    id: 6,
    title: "Grammar Worksheet",
    description: "Complete the worksheet on tenses and active/passive voice.",
    className: "Class 10-A",
    subject: "English",
    assignedDate: "2026-10-02",
    dueDate: "2026-10-07",
    totalStudents: 30,
    submitted: 30,
    status: "Completed",
  },
];

const statusStyles: Record<HomeworkStatus, string> = {
  Active: "border-blue-200 bg-blue-50 text-blue-700",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Overdue: "border-red-200 bg-red-50 text-red-700",
};

const emptyForm = {
  title: "",
  description: "",
  className: "Class 8-A",
  subject: "Mathematics",
  assignedDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  totalStudents: "35",
};

export default function TeacherHomework() {
  const [homework, setHomework] = useState<HomeworkItem[]>(initialHomework);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const filteredHomework = useMemo(() => {
    const query = search.trim().toLowerCase();

    return homework.filter((item) => {
      const matchesSearch =
        !query ||
        `${item.title} ${item.description} ${item.subject} ${item.className}`
          .toLowerCase()
          .includes(query);

      const matchesClass =
        classFilter === "All Classes" || item.className === classFilter;

      const matchesSubject =
        subjectFilter === "All Subjects" || item.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || item.status === statusFilter;

      return matchesSearch && matchesClass && matchesSubject && matchesStatus;
    });
  }, [homework, search, classFilter, subjectFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: homework.length,
    active: homework.filter((item) => item.status === "Active").length,
    completed: homework.filter((item) => item.status === "Completed").length,
    overdue: homework.filter((item) => item.status === "Overdue").length,
    submissions: homework.reduce((sum, item) => sum + item.submitted, 0),
  }), [homework]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      assignedDate: new Date().toISOString().slice(0, 10),
    });
    setMessage("");
    setShowModal(true);
  };

  const openEditModal = (item: HomeworkItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      className: item.className,
      subject: item.subject,
      assignedDate: item.assignedDate,
      dueDate: item.dueDate,
      totalStudents: String(item.totalStudents),
    });
    setMessage("");
    setShowModal(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.dueDate < form.assignedDate) {
      setMessage("Due date cannot be earlier than the assigned date.");
      return;
    }

    const existing = editingId
      ? homework.find((item) => item.id === editingId)
      : undefined;

    const totalStudents = Number(form.totalStudents);
    const submitted = existing
      ? Math.min(existing.submitted, totalStudents)
      : 0;

    const item: HomeworkItem = {
      id: editingId ?? Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      className: form.className,
      subject: form.subject,
      assignedDate: form.assignedDate,
      dueDate: form.dueDate,
      totalStudents,
      submitted,
      status:
        submitted === totalStudents && totalStudents > 0
          ? "Completed"
          : form.dueDate < new Date().toISOString().slice(0, 10)
            ? "Overdue"
            : "Active",
    };

    if (editingId) {
      setHomework((current) =>
        current.map((homeworkItem) =>
          homeworkItem.id === editingId ? item : homeworkItem
        )
      );
      setMessage("Homework updated successfully.");
    } else {
      setHomework((current) => [item, ...current]);
      setMessage("Homework assigned successfully.");
    }

    setShowModal(false);
    setEditingId(null);
  };

  const deleteHomework = (id: number) => {
    const item = homework.find((homeworkItem) => homeworkItem.id === id);
    if (!item) return;

    const confirmed = window.confirm(
      `Delete "${item.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setHomework((current) =>
      current.filter((homeworkItem) => homeworkItem.id !== id)
    );
    setMessage("Homework deleted.");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <BookOpen size={18} />
              Teacher Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Homework Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create assignments, manage deadlines, and track submissions.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Assign Homework
          </button>
        </div>

        {message && (
          <div role="status" className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Assignments" value={stats.total} icon={<ClipboardList size={20} />} tone="indigo" />
          <StatCard title="Active" value={stats.active} icon={<Clock3 size={20} />} tone="blue" />
          <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 size={20} />} tone="green" />
          <StatCard title="Overdue" value={stats.overdue} icon={<AlertCircle size={20} />} tone="red" />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Find Homework
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <label htmlFor="homework-search" className="mb-2 block text-sm font-medium text-slate-700">
                Search
              </label>
              <Search size={17} className="absolute left-3 top-[43px] text-slate-400" />
              <input
                id="homework-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Title, subject or class"
                className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="homework-class" className="mb-2 block text-sm font-medium text-slate-700">
                Class
              </label>
              <select
                id="homework-class"
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Classes</option>
                <option>Class 8-A</option>
                <option>Class 9-B</option>
                <option>Class 10-A</option>
              </select>
            </div>

            <div>
              <label htmlFor="homework-subject" className="mb-2 block text-sm font-medium text-slate-700">
                Subject
              </label>
              <select
                id="homework-subject"
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Subjects</option>
                <option>Mathematics</option>
                <option>English</option>
                <option>Science</option>
                <option>Social Studies</option>
              </select>
            </div>

            <div>
              <label htmlFor="homework-status" className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="homework-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Overdue</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Assignments</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredHomework.length} assignment(s) found
              </p>
            </div>
          </div>

          {filteredHomework.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
              <Search size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-700">No homework found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing the filters or create a new assignment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredHomework.map((item) => {
                const submissionPercentage = item.totalStudents
                  ? Math.round((item.submitted / item.totalStudents) * 100)
                  : 0;

                return (
                  <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <BookOpen size={23} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900">{item.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {item.subject} · {item.className}
                          </p>
                        </div>
                      </div>

                      <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <InfoItem
                        icon={<CalendarDays size={16} />}
                        label="Assigned"
                        value={item.assignedDate}
                      />
                      <InfoItem
                        icon={<Clock3 size={16} />}
                        label="Due Date"
                        value={item.dueDate}
                      />
                      <InfoItem
                        icon={<Users size={16} />}
                        label="Class Strength"
                        value={`${item.totalStudents} students`}
                      />
                      <InfoItem
                        icon={<FileText size={16} />}
                        label="Submissions"
                        value={`${item.submitted}/${item.totalStudents}`}
                      />
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="font-medium text-slate-500">Submission progress</span>
                        <span className="font-bold text-slate-700">{submissionPercentage}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${submissionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHomework(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowModal(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="homework-modal-title"
              className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 id="homework-modal-title" className="text-lg font-bold text-slate-900">
                    {editingId ? "Edit Homework" : "Assign New Homework"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the assignment details below.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
                <div>
                  <label htmlFor="hw-title" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Homework Title *
                  </label>
                  <input
                    id="hw-title"
                    required
                    maxLength={120}
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    placeholder="Enter homework title"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="hw-description" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description *
                  </label>
                  <textarea
                    id="hw-description"
                    required
                    rows={3}
                    maxLength={1000}
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="Explain the homework task..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="hw-class" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Class *
                    </label>
                    <select
                      id="hw-class"
                      value={form.className}
                      onChange={(event) => {
                        const className = event.target.value;
                        const totalStudents =
                          className === "Class 8-A" ? "35" :
                          className === "Class 9-B" ? "32" : "30";
                        setForm({ ...form, className, totalStudents });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option>Class 8-A</option>
                      <option>Class 9-B</option>
                      <option>Class 10-A</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="hw-subject" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Subject *
                    </label>
                    <select
                      id="hw-subject"
                      value={form.subject}
                      onChange={(event) => setForm({ ...form, subject: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option>Mathematics</option>
                      <option>English</option>
                      <option>Science</option>
                      <option>Social Studies</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="hw-assigned-date" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Assigned Date *
                    </label>
                    <input
                      id="hw-assigned-date"
                      type="date"
                      required
                      value={form.assignedDate}
                      onChange={(event) => setForm({ ...form, assignedDate: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="hw-due-date" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Due Date *
                    </label>
                    <input
                      id="hw-due-date"
                      type="date"
                      required
                      min={form.assignedDate}
                      value={form.dueDate}
                      onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="hw-strength" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Number of Students *
                    </label>
                    <input
                      id="hw-strength"
                      type="number"
                      required
                      min={1}
                      max={200}
                      value={form.totalStudents}
                      onChange={(event) => setForm({ ...form, totalStudents: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    {editingId ? "Save Changes" : "Assign Homework"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
  value: number;
  icon: React.ReactNode;
  tone: "indigo" | "blue" | "green" | "red";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
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

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
