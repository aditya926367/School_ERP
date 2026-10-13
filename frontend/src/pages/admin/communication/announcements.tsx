// src/pages/admin/communication/AdminAnnouncements.tsx
import { useState } from "react";
import type { FormEvent } from "react";

type Audience = "All" | "Students" | "Teachers" | "Parents";
type Priority = "Normal" | "Important" | "Urgent";
type Status = "Published" | "Draft";

type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: Audience;
  priority: Priority;
  date: string;
  status: Status;
};

const today = new Date().toISOString().slice(0, 10);

const initialAnnouncements: Announcement[] = [
  { id: "AN001", title: "Annual Day Celebration", message: "Annual Day will be held on 20th December.", audience: "All", priority: "Important", date: "2026-10-05", status: "Published" },
  { id: "AN002", title: "Mid-term Exam Schedule", message: "Mid-term exams start from 3rd November.", audience: "Students", priority: "Urgent", date: "2026-10-08", status: "Published" },
  { id: "AN003", title: "Staff Meeting", message: "Staff meeting on Friday at 3 PM in the main hall.", audience: "Teachers", priority: "Normal", date: "2026-10-10", status: "Draft" },
];

const audiences: Audience[] = ["All", "Students", "Teachers", "Parents"];
const priorities: Priority[] = ["Normal", "Important", "Urgent"];

// Form ki khaali state
const emptyForm = {
  title: "",
  message: "",
  audience: "All" as Audience,
  priority: "Normal" as Priority,
  status: "Published" as Status,
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

// Priority ke hisaab se badge ka rang
const priorityColor: Record<Priority, string> = {
  Normal: "bg-gray-200 text-gray-700",
  Important: "bg-yellow-100 text-yellow-700",
  Urgent: "bg-red-100 text-red-700",
};

// ---------- Pagination helpers ----------
const PAGE_SIZES = [5, 10, 25, 50];

// Page numbers ki list: 1 ... 4 5 6 ... 20
function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("...");

  pages.push(totalPages);
  return pages;
}

const pageBtn = "h-8 min-w-8 rounded-lg border px-2 text-sm font-semibold";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnActive = `${pageBtn} border-[#27348b] bg-[#27348b] text-white`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Popup form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.audience.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination ka hisaab
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Naya ID: sabse bada number + 1  (AN003 -> AN004)
  function nextId(): string {
    const max = announcements.reduce((m, a) => Math.max(m, Number(a.id.slice(2))), 0);
    return "AN" + String(max + 1).padStart(3, "0");
  }

  function openForm() {
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      setError("Title and message are required");
      return;
    }

    const newAnnouncement: Announcement = {
      id: nextId(),
      title: form.title.trim(),
      message: form.message.trim(),
      audience: form.audience,
      priority: form.priority,
      date: today,
      status: form.status,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setPage(1); // nayi entry sabse upar hai
    closeForm();
  }

  // Draft ko Published karna
  function publish(id: string) {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, status: "Published" } : a))
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-sm text-gray-500">Share updates with students, teachers and parents</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Top bar: search + add button */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title or audience..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[320px]"
          />
          <button
            onClick={openForm}
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            + New Announcement
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{a.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{a.title}</div>
                    <div className="max-w-[320px] truncate text-xs text-gray-500">{a.message}</div>
                  </td>
                  <td className="px-4 py-3">{a.audience}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColor[a.priority]}`}>
                      {a.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">{a.date}</td>
                  <td className="px-4 py-3">
                    {a.status === "Published" ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {a.status === "Draft" && (
                      <button
                        onClick={() => publish(a.id)}
                        className="rounded-lg border border-[#27348b] px-3 py-1 text-xs font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
                      >
                        Publish
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No announcements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span>
              Showing <b>{from}</b>-<b>{to}</b> of <b>{filtered.length}</b>
            </span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-8 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-[#27348b]"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              className={safePage === 1 ? pageBtnDisabled : pageBtnNormal}
            >
              Prev
            </button>

            {getPageNumbers(safePage, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="px-1 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={p === safePage ? pageBtnActive : pageBtnNormal}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              className={safePage === totalPages ? pageBtnDisabled : pageBtnNormal}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ================= NEW ANNOUNCEMENT POPUP ================= */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={closeForm}
        >
          <div
            className="w-full max-w-[520px] rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">New Announcement</h2>
              <button
                onClick={closeForm}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Annual Day Celebration"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  placeholder="Write the announcement here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Audience</label>
                  <select
                    value={form.audience}
                    onChange={(e) => setForm({ ...form, audience: e.target.value as Audience })}
                    className={inputStyle}
                  >
                    {audiences.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                    className={inputStyle}
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                    className={inputStyle}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}