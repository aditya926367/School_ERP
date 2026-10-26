// src/pages/admin/certificates/Awards.tsx
import { useState } from "react";
import type { FormEvent } from "react";

// ---------- Fake data (replace with backend data later) ----------
type Level = "School" | "District" | "State" | "National";

type Award = {
  id: string;
  title: string;
  recipient: string;
  category: string;
  awardDate: string;
  level: Level;
};

const initialAwards: Award[] = [
  { id: "AW001", title: "Best Student of the Year", recipient: "Priya Verma (10-B)", category: "Academic", awardDate: "2026-08-15", level: "School" },
  { id: "AW002", title: "Inter-School Football Champion", recipient: "Aarav Sharma (8-A)", category: "Sports", awardDate: "2026-09-02", level: "District" },
  { id: "AW003", title: "Science Exhibition Winner", recipient: "Rohit Gupta (6-A)", category: "Science", awardDate: "2026-09-20", level: "State" },
  { id: "AW004", title: "Painting Competition Gold", recipient: "Diya Patel (7-B)", category: "Arts", awardDate: "2026-10-04", level: "National" },
];

const categories = ["Academic", "Sports", "Science", "Arts", "Cultural", "Discipline", "Other"];
const levels: Level[] = ["School", "District", "State", "National"];

const levelColor: Record<Level, string> = {
  School: "bg-gray-200 text-gray-700",
  District: "bg-blue-100 text-blue-700",
  State: "bg-purple-100 text-purple-700",
  National: "bg-yellow-100 text-yellow-700",
};

// ---------- Helpers ----------
// Today as yyyy-mm-dd
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// 2026-10-14 -> 14 October 2026
function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const emptyForm = {
  title: "",
  recipient: "",
  category: "Academic",
  awardDate: todayIso(),
  level: "School" as Level,
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";
const labelStyle = "mb-1 block text-xs font-semibold uppercase text-gray-500";

// ---------- Pagination helpers ----------
const PAGE_SIZES = [5, 10, 25, 50];
const pageBtn = "h-8 rounded-lg border px-3 text-sm font-semibold";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function Awards() {
  const [awards, setAwards] = useState<Award[]>(initialAwards);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Popup form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = awards.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.recipient.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Next ID: highest number + 1
  function nextId(): string {
    const max = awards.reduce((m, a) => Math.max(m, Number(a.id.slice(2))), 0);
    return "AW" + String(max + 1).padStart(3, "0");
  }

  function openForm() {
    setForm({ ...emptyForm, awardDate: todayIso() });
    setError("");
    setShowForm(true);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim() || !form.recipient.trim()) {
      setError("Award title and recipient are required");
      return;
    }
    if (!form.awardDate) {
      setError("Award date is required");
      return;
    }

    const newAward: Award = {
      id: nextId(),
      title: form.title.trim(),
      recipient: form.recipient.trim(),
      category: form.category,
      awardDate: form.awardDate,
      level: form.level,
    };

    setAwards([newAward, ...awards]);
    setPage(1); // new entry is at the top
    setShowForm(false);
  }

  function handleDelete(a: Award) {
    if (!window.confirm(`Delete award "${a.title}"?`)) return;
    setAwards(awards.filter((x) => x.id !== a.id));
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Awards Distribution</h1>
        <p className="text-sm text-gray-500">Manage and distribute awards, track achievements</p>
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
            placeholder="Search by award, recipient or category..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[320px]"
          />
          <button
            onClick={openForm}
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            + Add Award
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Award</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{a.id}</td>
                  <td className="px-4 py-3 font-semibold">{a.title}</td>
                  <td className="px-4 py-3">{a.recipient}</td>
                  <td className="px-4 py-3">{a.category}</td>
                  <td className="px-4 py-3">{formatDate(a.awardDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColor[a.level]}`}>
                      {a.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(a)}
                      className="rounded-lg border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No awards found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              className={safePage === 1 ? pageBtnDisabled : pageBtnNormal}
            >
              Prev
            </button>
            <span>
              Page <b>{safePage}</b> of <b>{totalPages}</b>
            </span>
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

      {/* Add award popup */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-[520px] rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Add Award</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
              <div>
                <label className={labelStyle}>Award Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Best Student of the Year"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Recipient</label>
                <input
                  value={form.recipient}
                  onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  placeholder="e.g. Priya Verma (10-B)"
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelStyle}>Category</label>
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
                  <label className={labelStyle}>Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
                    className={inputStyle}
                  >
                    {levels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Date</label>
                  <input
                    type="date"
                    value={form.awardDate}
                    onChange={(e) => setForm({ ...form, awardDate: e.target.value })}
                    className={inputStyle}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
                >
                  Save Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}