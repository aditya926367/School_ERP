import { useState } from "react";
import {
  Megaphone,
  CalendarDays,
  Search,
  Pin,
  Clock,
} from "lucide-react";

type Announcement = {
  id: number;
  title: string;
  category: string;
  date: string;
  description: string;
  pinned?: boolean;
};

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    category: "Meeting",
    date: "2026-10-20",
    description:
      "A parent-teacher meeting will be held to discuss student performance, attendance, and academic progress. Parents are requested to attend.",
    pinned: true,
  },
  {
    id: 2,
    title: "Annual Sports Day",
    category: "Events",
    date: "2026-10-25",
    description:
      "The school will organize its annual sports day. Students should arrive on time in their sports uniform and follow their class teacher's instructions.",
  },
  {
    id: 3,
    title: "Upcoming Examination",
    category: "Examination",
    date: "2026-10-28",
    description:
      "The next examination is approaching. Parents are requested to help children follow their revision schedule and complete pending assignments.",
  },
  {
    id: 4,
    title: "Fee Payment Reminder",
    category: "Fees",
    date: "2026-10-15",
    description:
      "Parents are requested to check the Fee Details section for outstanding school fees and applicable payment deadlines.",
  },
];

export default function ParentAnnouncements() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Meeting",
    "Events",
    "Examination",
    "Fees",
  ];

  const filteredAnnouncements = announcements.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Stay updated with important school announcements and notices.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <Megaphone className="text-blue-600" size={24} />
          <p className="mt-3 text-sm text-gray-500">
            Total Announcements
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {announcements.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <Pin className="text-orange-600" size={24} />
          <p className="mt-3 text-sm text-gray-500">
            Important Notices
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {announcements.filter((item) => item.pinned).length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <CalendarDays className="text-green-600" size={24} />
          <p className="mt-3 text-sm text-gray-500">
            Upcoming Events
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {announcements.filter(
              (item) =>
                item.category === "Events" ||
                item.category === "Meeting",
            ).length}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search announcements..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            No announcements found.
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="hidden rounded-xl bg-blue-50 p-3 text-blue-600 sm:block">
                  <Megaphone size={24} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      {item.title}
                    </h2>

                    {item.pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
                        <Pin size={12} />
                        Important
                      </span>
                    )}

                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {item.category}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} />
                    {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <p className="text-xs text-gray-400">
        Demo announcements only. Connect this page to your backend to display
        real school notices.
      </p>
    </div>
  );
}
