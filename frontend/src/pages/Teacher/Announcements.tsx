
import { useMemo, useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Bell,
  CalendarDays,
  Users,
  Pencil,
  Trash2,
  X,
  Pin,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

type Priority = "Normal" | "Important" | "Urgent";
type Audience = "All Classes" | "Class 8-A" | "Class 9-B" | "Class 10-A";

type Announcement = {
  id: number;
  title: string;
  message: string;
  audience: Audience;
  priority: Priority;
  date: string;
  author: string;
  pinned: boolean;
};

const initialAnnouncements: Announcement[] = [];

const priorityStyles: Record<Priority, string> = {
  Normal: "border-slate-200 bg-slate-50 text-slate-700",
  Important: "border-amber-200 bg-amber-50 text-amber-700",
  Urgent: "border-red-200 bg-red-50 text-red-700",
};

const emptyForm = {
  title: "",
  message: "",
  audience: "All Classes" as Audience,
  priority: "Normal" as Priority,
  date: new Date().toISOString().slice(0, 10),
  pinned: false,
};

export default function TeacherAnnouncements() {
  const [announcements, setAnnouncements] = usePersistentState<Announcement[]>('schoolerp:pages_teacher_announcements_tsx:announcements', []);
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("All Audiences");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return announcements
      .filter((item) => {
        const matchesSearch =
          !query ||
          `${item.title} ${item.message} ${item.author}`
            .toLowerCase()
            .includes(query);

        const matchesAudience =
          audienceFilter === "All Audiences" ||
          item.audience === audienceFilter;

        const matchesPriority =
          priorityFilter === "All Priorities" ||
          item.priority === priorityFilter;

        return matchesSearch && matchesAudience && matchesPriority;
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.date.localeCompare(a.date);
      });
  }, [announcements, search, audienceFilter, priorityFilter]);

  const stats = useMemo(
    () => ({
      total: announcements.length,
      urgent: announcements.filter((item) => item.priority === "Urgent").length,
      important: announcements.filter((item) => item.priority === "Important").length,
      pinned: announcements.filter((item) => item.pinned).length,
    }),
    [announcements]
  );

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
    setMessage("");
    setShowModal(true);
  };

  const openEditModal = (item: Announcement) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      message: item.message,
      audience: item.audience,
      priority: item.priority,
      date: item.date,
      pinned: item.pinned,
    });
    setMessage("");
    setShowModal(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const announcement: Announcement = {
      id: editingId ?? Date.now(),
      title: form.title.trim(),
      message: form.message.trim(),
      audience: form.audience,
      priority: form.priority,
      date: form.date,
      author: "Teacher",
      pinned: form.pinned,
    };

    if (editingId !== null) {
      setAnnouncements((current) =>
        current.map((item) =>
          item.id === editingId ? announcement : item
        )
      );
      setMessage("Announcement updated successfully.");
    } else {
      setAnnouncements((current) => [announcement, ...current]);
      setMessage("Announcement published successfully.");
    }

    setShowModal(false);
    setEditingId(null);
  };

  const deleteAnnouncement = (item: Announcement) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    setAnnouncements((current) =>
      current.filter((announcement) => announcement.id !== item.id)
    );
    setMessage("Announcement deleted.");
  };

  const togglePinned = (item: Announcement) => {
    setAnnouncements((current) =>
      current.map((announcement) =>
        announcement.id === item.id
          ? { ...announcement, pinned: !announcement.pinned }
          : announcement
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <Megaphone size={18} />
              Teacher Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Announcements
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Publish notices and share important information with students.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Create Announcement
          </button>
        </div>

        {message && (
          <div
            role="status"
            className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Announcements"
            value={stats.total}
            icon={<Bell size={20} />}
            tone="indigo"
          />
          <StatCard
            title="Urgent Notices"
            value={stats.urgent}
            icon={<AlertTriangle size={20} />}
            tone="red"
          />
          <StatCard
            title="Important Notices"
            value={stats.important}
            icon={<Info size={20} />}
            tone="amber"
          />
          <StatCard
            title="Pinned Notices"
            value={stats.pinned}
            icon={<Pin size={20} />}
            tone="blue"
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Find Announcements
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                htmlFor="announcement-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Search
              </label>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="announcement-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title or message"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="announcement-audience"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Audience
              </label>
              <select
                id="announcement-audience"
                value={audienceFilter}
                onChange={(event) => setAudienceFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Audiences</option>
                <option>All Classes</option>
                <option>Class 8-A</option>
                <option>Class 9-B</option>
                <option>Class 10-A</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="announcement-priority"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Priority
              </label>
              <select
                id="announcement-priority"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Priorities</option>
                <option>Normal</option>
                <option>Important</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Published Notices
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredAnnouncements.length} announcement(s) found
              </p>
            </div>
          </div>

          {filteredAnnouncements.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
              <Search size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-700">
                No announcements found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Change your filters or create a new announcement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 ${
                    item.priority === "Urgent"
                      ? "border-l-4 border-l-red-500"
                      : item.priority === "Important"
                        ? "border-l-4 border-l-amber-400"
                        : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          item.priority === "Urgent"
                            ? "bg-red-50 text-red-600"
                            : item.priority === "Important"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {item.priority === "Urgent" ? (
                          <AlertTriangle size={21} />
                        ) : item.priority === "Important" ? (
                          <Info size={21} />
                        ) : (
                          <Megaphone size={21} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {item.title}
                          </h3>
                          {item.pinned && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                              <Pin size={12} />
                              Pinned
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short", year: "numeric" }
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users size={14} />
                            {item.audience}
                          </span>
                          <span>{item.author}</span>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {item.message}
                        </p>

                        <div className="mt-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${priorityStyles[item.priority]}`}
                          >
                            {item.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-start gap-2 sm:justify-end">
                      <button
                        onClick={() => togglePinned(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        <Pin size={15} />
                        {item.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        aria-label={`Edit ${item.title}`}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(item)}
                        aria-label={`Delete ${item.title}`}
                        className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p>
            <strong>Demo mode:</strong> Announcements can be created, edited,
            pinned, and deleted in this session. They are not yet saved to
            PostgreSQL or sent as notifications to students.
          </p>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="announcement-modal-title"
              className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2
                    id="announcement-modal-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    {editingId ? "Edit Announcement" : "Create Announcement"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Share a notice with your students.
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

              <form
                onSubmit={(event) => {
                  handleSubmit(event);
                }}
                className="space-y-4 p-5 sm:p-6"
              >
                <div>
                  <label
                    htmlFor="notice-title"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Announcement Title *
                  </label>
                  <input
                    id="notice-title"
                    required
                    maxLength={150}
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder="Enter announcement title"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notice-message"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Message *
                  </label>
                  <textarea
                    id="notice-message"
                    required
                    rows={5}
                    maxLength={3000}
                    value={form.message}
                    onChange={(event) =>
                      setForm({ ...form, message: event.target.value })
                    }
                    placeholder="Write your announcement..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="notice-audience"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Audience *
                    </label>
                    <select
                      id="notice-audience"
                      value={form.audience}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          audience: event.target.value as Audience,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option>All Classes</option>
                      <option>Class 8-A</option>
                      <option>Class 9-B</option>
                      <option>Class 10-A</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="notice-priority"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Priority *
                    </label>
                    <select
                      id="notice-priority"
                      value={form.priority}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          priority: event.target.value as Priority,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option>Normal</option>
                      <option>Important</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="notice-date"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Publish Date *
                    </label>
                    <input
                      id="notice-date"
                      type="date"
                      required
                      value={form.date}
                      onChange={(event) =>
                        setForm({ ...form, date: event.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={(event) =>
                      setForm({ ...form, pinned: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Pin this announcement
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Pinned announcements appear first in the list.
                    </span>
                  </span>
                </label>

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
                    {editingId ? "Save Changes" : "Publish Announcement"}
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
  tone: "indigo" | "red" | "amber" | "blue";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
