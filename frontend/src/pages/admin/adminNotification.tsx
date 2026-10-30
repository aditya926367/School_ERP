import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  Bell,
  CheckCheck,
  Search,
  Trash2,
  Check,
  Info,
  AlertTriangle,
  CircleCheck,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Megaphone,
  Settings,
  X,
} from "lucide-react";

type NotificationType = "info" | "success" | "warning" | "announcement";
type NotificationStatus = "unread" | "read";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: string;
  createdAt: string;
  status: NotificationStatus;
};

const STORAGE_KEY = "schoolerp:admin:notifications:v1";

const initialNotifications: NotificationItem[] = [
 

];

function loadNotifications(): NotificationItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as NotificationItem[]) : initialNotifications;
  } catch {
    return initialNotifications;
  }
}

function timeAgo(value: string): string {
  const difference = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(value).toLocaleDateString();
}

function TypeIcon({ type }: { type: NotificationType }) {
  if (type === "success") return <CircleCheck size={18} />;
  if (type === "warning") return <AlertTriangle size={18} />;
  if (type === "announcement") return <Megaphone size={18} />;
  return <Info size={18} />;
}

function typeStyles(type: NotificationType): string {
  if (type === "success") return "bg-emerald-50 text-emerald-700";
  if (type === "warning") return "bg-amber-50 text-amber-700";
  if (type === "announcement") return "bg-violet-50 text-violet-700";
  return "bg-blue-50 text-blue-700";
}

export default function adminNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(loadNotifications);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Unread" | "Read">("All");
  const [category, setCategory] = useState("All categories");
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [newCategory, setNewCategory] = useState("Announcements");
  const [newType, setNewType] = useState<NotificationType>("announcement");
  const [error, setError] = useState("");

  const persist = (next: NotificationItem[]) => {
    setNotifications(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the UI usable if browser storage is unavailable.
    }
  };

  const unreadCount = notifications.filter((item) => item.status === "unread").length;
  const readCount = notifications.length - unreadCount;

  const categories = useMemo(
    () => ["All categories", ...Array.from(new Set(notifications.map((item) => item.category)))],
    [notifications]
  );

  const filteredNotifications = notifications.filter((item) => {
    const matchesSearch = `${item.title} ${item.message} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Unread" && item.status === "unread") ||
      (filter === "Read" && item.status === "read");
    const matchesCategory = category === "All categories" || item.category === category;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  const markRead = (id: string) => {
    persist(notifications.map((item) => item.id === id ? { ...item, status: "read" } : item));
  };

  const markUnread = (id: string) => {
    persist(notifications.map((item) => item.id === id ? { ...item, status: "unread" } : item));
  };

  const markAllRead = () => {
    persist(notifications.map((item) => ({ ...item, status: "read" })));
  };

  const deleteNotification = (id: string) => {
    persist(notifications.filter((item) => item.id !== id));
  };

const createNotification = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

    if (!title.trim() || !message.trim()) {
      setError("Please enter both a title and a message.");
      return;
    }

    const item: NotificationItem = {
      id: `n-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      type: newType,
      category: newCategory,
      createdAt: new Date().toISOString(),
      status: "unread",
    };

    persist([item, ...notifications]);
    setTitle("");
    setMessage("");
    setError("");
    setShowCreate(false);
    setFilter("All");
    setCategory("All categories");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Bell size={16} />
              Administration <span>/</span> Notifications
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
            <p className="mt-1 text-slate-500">
              Review important school updates, reminders, and system activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={17} /> Mark all read
            </button>
            <button
              onClick={() => { setShowCreate(true); setError(""); }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white "
            >
              <Bell size={17} /> Create notification
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total notifications" value={notifications.length} icon={<Bell size={20} />} />
          <StatCard label="Unread" value={unreadCount} icon={<Info size={20} />} />
          <StatCard label="Read" value={readCount} icon={<Check size={20} />} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["All", "Unread", "Read"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                    filter === item
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item}
                  {item === "Unread" && unreadCount > 0 && (
                    <span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${filter === item ? "bg-white/20" : "bg-white"}`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search notifications"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 sm:w-64"
                />
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((item) => (
              <article
                key={item.id}
                className={`flex gap-3 p-4 transition hover:bg-slate-50 sm:gap-4 sm:p-5 ${item.status === "unread" ? "bg-indigo-50/30" : ""}`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${typeStyles(item.type)}`}>
                  <TypeIcon type={item.type} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm ${item.status === "unread" ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                      {item.title}
                    </h3>
                    {item.status === "unread" && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600" title="Unread" />
                    )}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{item.category}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{timeAgo(item.createdAt)}</p>
                </div>

                <div className="flex shrink-0 items-start gap-1">
                  {item.status === "unread" ? (
                    <button
                      onClick={() => markRead(item.id)}
                      title="Mark as read"
                      aria-label={`Mark ${item.title} as read`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Check size={17} />
                    </button>
                  ) : (
                    <button
                      onClick={() => markUnread(item.id)}
                      title="Mark as unread"
                      aria-label={`Mark ${item.title} as unread`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Bell size={17} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item.id)}
                    title="Delete notification"
                    aria-label={`Delete ${item.title}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Bell size={32} className="mx-auto text-slate-300" />
                <h3 className="mt-3 font-semibold text-slate-800">No notifications found</h3>
                <p className="mt-1 text-sm text-slate-500">Try changing your search or filter.</p>
              </div>
            )}
          </div>
        </section>

        <p className="text-xs leading-5 text-slate-500">
          Prototype note: notifications are stored in this browser's localStorage. Connect the backend to deliver real notifications across accounts and devices.
        </p>
      </div>

      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowCreate(false);
          }}
        >
          <form onSubmit={createNotification} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create notification</h2>
                <p className="mt-1 text-sm text-slate-500">Add a notice to the local notification center.</p>
              </div>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <label className="block text-sm font-medium text-slate-700">
                Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={100}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400"
                  placeholder="Notification title"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Message
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={3}
                  maxLength={500}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400"
                  placeholder="Write a short message..."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Category
                  <select
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-400"
                  >
                    {["Announcements", "Students", "Academics", "Attendance", "Finance", "System"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Type
                  <select
                    value={newType}
                    onChange={(event) => setNewType(event.target.value as NotificationType)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-400"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="info">Information</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                  </select>
                </label>
              </div>

              {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                Publish notification
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
