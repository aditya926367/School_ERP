
import { useState } from "react";
import type { FormEvent } from "react";

type Award = {
  id: string;
  title: string;
  recipient: string;
  category: string;
  awardDate: string;
  level: "School" | "District" | "State" | "National";
};

const initialAwards: Award[] = [
  { id: "A001", title: "Best Student of the Year", recipient: "Priya Verma (10-B)", category: "Academic", awardDate: "2026-08-15", level: "School" },
  { id: "A002", title: "Inter-School Football Champion", recipient: "Aarav Sharma (8-A)", category: "Sports", awardDate: "2026-09-02", level: "District" },
  { id: "A003", title: "Science Exhibition Winner", recipient: "Rohit Gupta (6-C)", category: "Science", awardDate: "2026-09-20", level: "State" },
];

const categories = ["Academic", "Sports", "Science", "Arts", "Cultural", "Discipline", "Other"];
const levels: Award["level"][] = ["School", "District", "State", "National"];

// Form ki khaali state
const emptyForm = {
  title: "",
  recipient: "",
  category: "Academic",
  awardDate: new Date().toISOString().slice(0, 10),
  level: "School" as Award["level"],
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

// Level ke hisaab se badge ka rang
const levelColor: Record<Award["level"], string> = {
  School: "bg-gray-200 text-gray-700",
  District: "bg-blue-100 text-blue-700",
  State: "bg-purple-100 text-purple-700",
  National: "bg-yellow-100 text-yellow-700",
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

  // Pagination ka hisaab
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Naya ID: sabse bada number + 1  (A003 -> A004)
  function nextId(): string {
    const max = awards.reduce((m, a) => Math.max(m, Number(a.id.slice(1))), 0);
    return "A" + String(max + 1).padStart(3, "0");
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
    setPage(1); // nayi entry sabse upar hai
    closeForm();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Awards</h1>
        <p className="text-sm text-gray-500">Record awards won by students and staff</p>
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
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{a.id}</td>
                  <td className="px-4 py-3 font-semibold">{a.title}</td>
                  <td className="px-4 py-3">{a.recipient}</td>
                  <td className="px-4 py-3">{a.category}</td>
                  <td className="px-4 py-3">{a.awardDate}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColor[a.level]}`}>
                      {a.level}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No awards found
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

      {/* ================= ADD AWARD POPUP ================= */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={closeForm}
        >
          <div
            className="w-full max-w-[480px] rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Add Award</h2>
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
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Award Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Best Student of the Year"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Recipient</label>
                <input
                  value={form.recipient}
                  onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  placeholder="e.g. Priya Verma (10-B)"
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as Award["level"] })}
                    className={inputStyle}
                  >
                    {levels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Award Date</label>
                <input
                  type="date"
                  value={form.awardDate}
                  onChange={(e) => setForm({ ...form, awardDate: e.target.value })}
                  className={inputStyle}
                />
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