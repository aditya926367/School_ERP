import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Clock,
  Users,
  BookOpen,
  X,
} from "lucide-react";
import { EditButton, DeleteButton } from "../../components/common/ActionButtons";
import Pagination from "../../components/common/Pagination";

type TimetableEntry = {
  id: number;
  className: string;
  section: string;
  day: string;
  period: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
};

const initialEntries: TimetableEntry[] = [];

const emptyForm = {
  className: "Class 8",
  section: "A",
  day: "Monday",
  period: "Period 1",
  startTime: "09:00",
  endTime: "09:45",
  subject: "",
  teacher: "",
  room: "",
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AdminTimetable() {
  const [entries, setEntries] =
    useState<TimetableEntry[]>(initialEntries);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedDay, setSelectedDay] = useState("All Days");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const pageSizes = [5, 10, 25, 50];

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries
      .filter((entry) => {
        const matchesClass =
          selectedClass === "All Classes" ||
          `${entry.className}-${entry.section}` === selectedClass;

        const matchesDay =
          selectedDay === "All Days" || entry.day === selectedDay;

        const matchesSearch =
          !query ||
          `${entry.subject} ${entry.teacher} ${entry.room} ${entry.period}`
            .toLowerCase()
            .includes(query);

        return matchesClass && matchesDay && matchesSearch;
      })
      .sort(
        (a, b) =>
          days.indexOf(a.day) - days.indexOf(b.day) ||
          a.startTime.localeCompare(b.startTime)
      );
  }, [entries, selectedClass, selectedDay, search]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleEntries = filteredEntries.slice(startIndex, startIndex + pageSize);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setNotice("");
    setShowModal(true);
  };

  const openEdit = (entry: TimetableEntry) => {
    setEditingId(entry.id);
    setForm({
      className: entry.className,
      section: entry.section,
      day: entry.day,
      period: entry.period,
      startTime: entry.startTime,
      endTime: entry.endTime,
      subject: entry.subject,
      teacher: entry.teacher,
      room: entry.room,
    });
    setNotice("");
    setShowModal(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.startTime >= form.endTime) {
      setNotice("End time must be later than start time.");
      return;
    }

    const conflict = entries.some(
      (entry) =>
        entry.id !== editingId &&
        entry.className === form.className &&
        entry.section === form.section &&
        entry.day === form.day &&
        entry.period === form.period
    );

    if (conflict) {
      setNotice(
        "This class already has a timetable entry for that day and period."
      );
      return;
    }

    const entry: TimetableEntry = {
      id: editingId ?? Date.now(),
      ...form,
      subject: form.subject.trim(),
      teacher: form.teacher.trim(),
      room: form.room.trim(),
    };

    if (editingId !== null) {
      setEntries((current) =>
        current.map((item) => (item.id === editingId ? entry : item))
      );
      setNotice("Timetable entry updated.");
    } else {
      setEntries((current) => [...current, entry]);
      setPage(1);
      setNotice("Timetable entry created.");
    }

    setShowModal(false);
    setEditingId(null);
  };

  const deleteEntry = (entry: TimetableEntry) => {
    if (!window.confirm(`Delete ${entry.subject} from ${entry.day}?`)) {
      return;
    }

    setEntries((current) =>
      current.filter((item) => item.id !== entry.id)
    );
    setNotice("Timetable entry deleted.");
  };

  const totalClasses = new Set(
    entries.map((entry) => `${entry.className}-${entry.section}`)
  ).size;

  const totalTeachers = new Set(entries.map((entry) => entry.teacher)).size;
  const totalSubjects = new Set(entries.map((entry) => entry.subject)).size;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CalendarDays size={18} />
              Admin Portal
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Timetable Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage class schedules, subjects, teachers, periods, and rooms.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#27348b] px-4 py-3 text-sm font-semibold text-white "
          >
            <Plus size={18} />
            Create Timetable Entry
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"
          >
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Classes"
            value={totalClasses}
            icon={<Users size={20} />}
          />
          <StatCard
            title="Subjects"
            value={totalSubjects}
            icon={<BookOpen size={20} />}
          />
          <StatCard
            title="Teachers"
            value={totalTeachers}
            icon={<Users size={20} />}
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 font-bold text-slate-900">
            Find Timetable Entries
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(event) => { setSelectedClass(event.target.value); setPage(1); }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option>All Classes</option>
                <option value="Class 8-A">Class 8-A</option>
                <option value="Class 9-B">Class 9-B</option>
                <option value="Class 10-A">Class 10-A</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Day
              </label>
              <select
                value={selectedDay}
                onChange={(event) => { setSelectedDay(event.target.value); setPage(1); }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option>All Days</option>
                {days.map((day) => (
                  <option key={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search
              </label>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Subject, teacher, or room"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">Weekly Schedule</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredEntries.length} timetable entries found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Class</th>
                  <th className="px-5 py-4">Day / Period</th>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Teacher</th>
                  <th className="px-5 py-4">Room</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {entry.className}-{entry.section}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800">
                        {entry.day}
                      </div>
                      <div className="text-xs text-slate-500">
                        {entry.period}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} />
                        {entry.startTime} – {entry.endTime}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-indigo-700">
                      {entry.subject}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {entry.teacher}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{entry.room}</td>
                    <td className="px-5 py-4">
  <div className="flex items-center gap-2">
    <EditButton
      title="Edit Timetable Entry"
      onClick={() => openEdit(entry)}
    />

    <DeleteButton
      title="Delete Timetable Entry"
      onClick={() => deleteEntry(entry)}
    />
  </div>
</td>
                  </tr>
                ))}
                {visibleEntries.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No timetable entries found. Adjust the filters or create
                      an entry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEntries.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            pageSizes={pageSizes}
            itemLabel="timetable entries"
          />
        </section>

       

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="timetable-modal-title"
              className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2
                    id="timetable-modal-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    {editingId ? "Edit Timetable Entry" : "Create Timetable Entry"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the schedule details below.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  aria-label="Close modal"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Class">
                    <select
                      value={form.className}
                      onChange={(event) =>
                        setForm({ ...form, className: event.target.value })
                      }
                      className="form-control"
                    >
                      <option>Class 8</option>
                      <option>Class 9</option>
                      <option>Class 10</option>
                    </select>
                  </Field>

                  <Field label="Section">
                    <select
                      value={form.section}
                      onChange={(event) =>
                        setForm({ ...form, section: event.target.value })
                      }
                      className="form-control"
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </Field>

                  <Field label="Day">
                    <select
                      value={form.day}
                      onChange={(event) =>
                        setForm({ ...form, day: event.target.value })
                      }
                      className="form-control"
                    >
                      {days.map((day) => (
                        <option key={day}>{day}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Period">
                    <select
                      value={form.period}
                      onChange={(event) =>
                        setForm({ ...form, period: event.target.value })
                      }
                      className="form-control"
                    >
                      {Array.from({ length: 8 }, (_, i) => (
                        <option key={i + 1}>Period {i + 1}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Start Time">
                    <input
                      type="time"
                      required
                      value={form.startTime}
                      onChange={(event) =>
                        setForm({ ...form, startTime: event.target.value })
                      }
                      className="form-control"
                    />
                  </Field>

                  <Field label="End Time">
                    <input
                      type="time"
                      required
                      value={form.endTime}
                      onChange={(event) =>
                        setForm({ ...form, endTime: event.target.value })
                      }
                      className="form-control"
                    />
                  </Field>

                  <Field label="Subject">
                    <input
                      required
                      value={form.subject}
                      onChange={(event) =>
                        setForm({ ...form, subject: event.target.value })
                      }
                      placeholder="e.g. Mathematics"
                      className="form-control"
                    />
                  </Field>

                  <Field label="Teacher">
                    <input
                      required
                      value={form.teacher}
                      onChange={(event) =>
                        setForm({ ...form, teacher: event.target.value })
                      }
                      placeholder="Teacher name"
                      className="form-control"
                    />
                  </Field>

                  <Field label="Room">
                    <input
                      required
                      value={form.room}
                      onChange={(event) =>
                        setForm({ ...form, room: event.target.value })
                      }
                      placeholder="e.g. Room 101"
                      className="form-control"
                    />
                  </Field>
                </div>

                <p className="text-xs text-slate-500">
                  A class cannot have two entries in the same period on the
                  same day.
                </p>

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
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    {editingId ? "Save Changes" : "Create Entry"}
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
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      <style>{`.form-control { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: white; padding: 0.75rem; font-size: 0.875rem; outline: none; } .form-control:focus { border-color: #6366f1; box-shadow: 0 0 0 2px #e0e7ff; }`}</style>
    </div>
  );
}
