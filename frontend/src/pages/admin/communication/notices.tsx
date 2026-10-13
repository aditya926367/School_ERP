// src/pages/admin/communication/AdminNotices.tsx
import { useState } from "react";
import type { FormEvent } from "react";

type Notice = {
  id: string;
  title: string;
  category: string;
  description: string;
  issueDate: string;
  expiryDate: string;
};

const today = new Date().toISOString().slice(0, 10);

const initialNotices: Notice[] = [
  { id: "N001", title: "Diwali Holidays", category: "Holiday", description: "School will remain closed from 9th to 13th November.", issueDate: "2026-10-01", expiryDate: "2026-11-13" },
  { id: "N002", title: "Fee Submission Last Date", category: "Fee", description: "Second quarter fee must be paid before 15th October.", issueDate: "2026-09-25", expiryDate: "2026-10-15" },
  { id: "N003", title: "Unit Test Schedule", category: "Exam", description: "Unit test for classes 6 to 8 held in September.", issueDate: "2026-09-01", expiryDate: "2026-09-30" },
];

const categories = ["General", "Exam", "Holiday", "Fee", "Event", "Transport"];

// Form ki khaali state
const emptyForm = {
  title: "",
  category: "General",
  description: "",
  issueDate: today,
  expiryDate: "",
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

// Expiry nikal gayi ho to Expired, warna Active (apne aap nikalta hai)
function isExpired(n: Notice): boolean {
  return n.expiryDate < today;
}

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

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Popup form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase()) ||
      n.id.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination ka hisaab
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Naya ID: sabse bada number + 1  (N003 -> N004)
  function nextId(): string {
    const max = notices.reduce((m, n) => Math.max(m, Number(n.id.slice(1))), 0);
    return "N" + String(max + 1).padStart(3, "0");
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

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      return;
    }
    if (!form.issueDate || !form.expiryDate) {
      setError("Issue date and expiry date are required");
      return;
    }
    if (form.expiryDate < form.issueDate) {
      setError("Expiry date cannot be before issue date");
      return;
    }

    const newNotice: Notice = {
      id: nextId(),
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      issueDate: form.issueDate,
      expiryDate: form.expiryDate,
    };

    setNotices([newNotice, ...notices]);
    setPage(1); // nayi entry sabse upar hai
    closeForm();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
        <p className="text-sm text-gray-500">Official school notices with an expiry date</p>
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
            placeholder="Search by title or category..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[320px]"
          />
          <button
            onClick={openForm}
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            + Add Notice
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Expiry Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((n) => (
                <tr key={n.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{n.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{n.title}</div>
                    <div className="max-w-[340px] truncate text-xs text-gray-500">{n.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {n.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{n.issueDate}</td>
                  <td className="px-4 py-3">{n.expiryDate}</td>
                  <td className="px-4 py-3">
                    {isExpired(n) ? (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        Expired
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No notices found
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

      {/* ================= ADD NOTICE POPUP ================= */}
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
              <h2 className="text-lg font-bold text-gray-900">Add Notice</h2>
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
                  placeholder="e.g. Diwali Holidays"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputStyle}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Write the notice details here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Issue Date</label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className={inputStyle}
                  />
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
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}