
import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Search,
  Megaphone,
  Pin,
  BookOpen,
  Trophy,
  CalendarCheck,
  FileText,
  Paperclip,
  CheckCheck,
  Clock,
  X,
} from "lucide-react";

type Category = "All" | "Academic" | "Events" | "Exams" | "General";
type Priority = "Urgent" | "Important" | "Normal";

type Announcement = {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, "All">;
  priority: Priority;
  date: string;
  author: string;
  pinned?: boolean;
  attachment?: string;
  read: boolean;
};

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Mid-Term Examination Results Published",
    description:
      "The mid-term examination results are now available in the My Results section. Please review your marks and contact your class teacher if you notice any discrepancy.",
    category: "Exams",
    priority: "Urgent",
    date: "October 5, 2026",
    author: "Examination Department",
    pinned: true,
    attachment: "Examination Guidelines.pdf",
    read: false,
  },
  {
    id: 2,
    title: "Annual Sports Day Registration",
    description:
      "Students interested in participating in the Annual Sports Day can register with their sports teacher. Events include athletics, football, badminton, and indoor games.",
    category: "Events",
    priority: "Important",
    date: "October 10, 2026",
    author: "Sports Department",
    pinned: true,
    read: false,
  },
  {
    id: 3,
    title: "Homework Submission Reminder",
    description:
      "Please submit all pending homework before the deadlines displayed on your My Homework page. Late submissions may require approval from the subject teacher.",
    category: "Academic",
    priority: "Important",
    date: "October 11, 2026",
    author: "Academic Coordinator",
    read: true,
  },
  {
    id: 4,
    title: "School Holiday Notice",
    description:
      "The school will remain closed on the notified holiday. Regular classes will resume according to the published timetable. Please check the school calendar for updates.",
    category: "General",
    priority: "Normal",
    date: "October 8, 2026",
    author: "School Administration",
    attachment: "Holiday Notice.pdf",
    read: true,
  },
  {
    id: 5,
    title: "Science Project Exhibition",
    description:
      "Students are invited to present their science projects at the upcoming exhibition. Interested students should contact their science teacher for participation details.",
    category: "Events",
    priority: "Normal",
    date: "October 7, 2026",
    author: "Science Department",
    read: false,
  },
  {
    id: 6,
    title: "Updated Class Timetable",
    description:
      "Please review the latest class timetable in the My Timetable section. Check the subject, room number, and period timings before attending classes.",
    category: "Academic",
    priority: "Normal",
    date: "October 3, 2026",
    author: "Academic Coordinator",
    attachment: "Class Timetable.pdf",
    read: true,
  },
];

const categories: Category[] = [
  "All",
  "Academic",
  "Events",
  "Exams",
  "General",
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Unread" | "Read"
  >("All");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const unreadCount = announcements.filter((item) => !item.read).length;

  const filteredAnnouncements = useMemo(() => {
    return [...announcements]
      .filter((item) => {
        const query = searchTerm.trim().toLowerCase();

        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query);

        const matchesCategory =
          activeCategory === "All" || item.category === activeCategory;

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Unread" && !item.read) ||
          (statusFilter === "Read" && item.read);

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return (
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });
  }, [announcements, searchTerm, activeCategory, statusFilter]);

  const markAsRead = (id: number) => {
    setAnnouncements((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );

    setSelectedAnnouncement((previous) =>
      previous?.id === id ? { ...previous, read: true } : previous
    );
  };

  const markAllAsRead = () => {
    setAnnouncements((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
    setSelectedAnnouncement((previous) =>
      previous ? { ...previous, read: true } : previous
    );
  };

  const priorityStyle: Record<Priority, string> = {
    Urgent: "bg-red-100 text-red-700",
    Important: "bg-amber-100 text-amber-700",
    Normal: "bg-gray-100 text-gray-600",
  };

  const categoryStyle: Record<Exclude<Category, "All">, string> = {
    Academic: "bg-blue-100 text-blue-700",
    Events: "bg-purple-100 text-purple-700",
    Exams: "bg-rose-100 text-rose-700",
    General: "bg-gray-100 text-gray-700",
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    if (category === "Academic") return <BookOpen size={17} />;
    if (category === "Events") return <Trophy size={17} />;
    if (category === "Exams") return <FileText size={17} />;
    return <Megaphone size={17} />;
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Bell size={16} />
            <span>Student Portal</span>
            <span>/</span>
            <span>Announcements</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Announcements
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with the latest school notices and important
            information.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Announcements"
          value={announcements.length}
          icon={<Megaphone size={21} />}
          color="bg-indigo-100 text-indigo-600"
        />

        <SummaryCard
          title="Unread Notices"
          value={unreadCount}
          icon={<Bell size={21} />}
          color="bg-amber-100 text-amber-600"
        />

        <SummaryCard
          title="Pinned Notices"
          value={announcements.filter((item) => item.pinned).length}
          icon={<Pin size={21} />}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search announcements..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          <span className="mr-1 text-sm text-gray-500">Status:</span>
          {(["All", "Unread", "Read"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === status
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Announcement list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            School Notices
          </h2>
          <span className="text-sm text-gray-500">
            {filteredAnnouncements.length} found
          </span>
        </div>

        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 ${
                !item.read
                  ? "border-l-4 border-l-indigo-500 border-y-gray-200 border-r-gray-200"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="hidden rounded-xl bg-indigo-50 p-3 text-indigo-600 sm:block">
                  <CategoryIcon category={item.category} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.pinned && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                        <Pin size={13} />
                        Pinned
                      </span>
                    )}

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryStyle[item.category]}`}
                    >
                      {item.category}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyle[item.priority]}`}
                    >
                      {item.priority}
                    </span>

                    {!item.read && (
                      <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white">
                        New
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAnnouncement(item);
                      if (!item.read) markAsRead(item.id);
                    }}
                    className="mt-3 text-left text-base font-bold text-gray-900 transition hover:text-indigo-600 sm:text-lg"
                  >
                    {item.title}
                  </button>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {item.date}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} />
                      {item.author}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    {item.attachment ? (
                      <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                        <Paperclip size={14} />
                        {item.attachment}
                        <span className="text-gray-400">(Demo)</span>
                      </span>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-2">
                      {!item.read && (
                        <button
                          onClick={() => markAsRead(item.id)}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedAnnouncement(item);
                          if (!item.read) markAsRead(item.id);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Read more
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center">
            <div className="mx-auto mb-4 w-fit rounded-full bg-gray-100 p-4 text-gray-400">
              <Search size={28} />
            </div>
            <h3 className="font-semibold text-gray-900">
              No announcements found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try a different search term or category.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
                setStatusFilter("All");
              }}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Announcement detail modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryStyle[selectedAnnouncement.category]}`}
                  >
                    {selectedAnnouncement.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyle[selectedAnnouncement.priority]}`}
                  >
                    {selectedAnnouncement.priority}
                  </span>
                </div>
                <h2
                  id="announcement-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {selectedAnnouncement.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedAnnouncement(null)}
                aria-label="Close announcement"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {selectedAnnouncement.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  {selectedAnnouncement.author}
                </span>
              </div>

              <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                {selectedAnnouncement.description}
              </p>

              {selectedAnnouncement.attachment && (
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="rounded-lg bg-white p-2 text-indigo-600">
                    <FileText size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {selectedAnnouncement.attachment}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Sample attachment name only
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
