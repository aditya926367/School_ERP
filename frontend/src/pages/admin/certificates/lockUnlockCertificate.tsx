// src/pages/admin/certificates/LockUnlockCertificate.tsx
import { useState } from "react";

// ---------- Fake data (replace with backend data later) ----------
type IssuedCertificate = {
  id: string;
  studentName: string;
  className: string;
  type: string;
  issueDate: string;
  locked: boolean;
};

const initialIssued: IssuedCertificate[] = [
  { id: "CE001", studentName: "Aarav Sharma", className: "8-A", type: "Bonafide", issueDate: "2026-10-01", locked: true },
  { id: "CE002", studentName: "Priya Verma", className: "10-B", type: "Character", issueDate: "2026-10-05", locked: true },
  { id: "CE003", studentName: "Rohit Gupta", className: "6-A", type: "Transfer", issueDate: "2026-10-09", locked: false },
  { id: "CE004", studentName: "Ananya Singh", className: "8-A", type: "Merit", issueDate: "2026-10-10", locked: false },
  { id: "CE005", studentName: "Karan Mehta", className: "8-A", type: "Sports", issueDate: "2026-10-11", locked: false },
  { id: "CE006", studentName: "Sneha Rao", className: "10-B", type: "Participation", issueDate: "2026-10-12", locked: true },
  { id: "CE007", studentName: "Diya Patel", className: "7-B", type: "Bonafide", issueDate: "2026-10-13", locked: false },
];

const certTypes = ["Bonafide", "Character", "Transfer", "Merit", "Participation", "Sports", "Other"];

type Filter = "All" | "Locked" | "Unlocked";

// 2026-10-14 -> 14 October 2026
function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------- Pagination helpers ----------
const PAGE_SIZES = [5, 10, 25, 50];
const pageBtn = "h-8 rounded-lg border px-3 text-sm font-semibold";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function LockUnlockCertificate() {
  const [items, setItems] = useState<IssuedCertificate[]>(initialIssued);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = items.filter(
    (c) =>
      (filter === "All" || (filter === "Locked" ? c.locked : !c.locked)) &&
      (typeFilter === "All" || c.type === typeFilter) &&
      (c.studentName.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()))
  );

  // Summary is calculated on ALL certificates, not only the current page
  const lockedCount = items.filter((c) => c.locked).length;
  const unlockedCount = items.length - lockedCount;

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  function toggle(id: string) {
    setItems(items.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c)));
  }

  function lockAll() {
    if (unlockedCount === 0) return;
    if (!window.confirm(`Lock all ${unlockedCount} unlocked certificates?`)) return;
    setItems(items.map((c) => ({ ...c, locked: true })));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lock-Unlock Certificate</h1>
        <p className="text-sm text-gray-500">Secure certificates from edits, unlock when needed</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">Total</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{items.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">Locked</div>
          <div className="mt-1 text-2xl font-bold text-[#27348b]">{lockedCount}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">Unlocked</div>
          <div className="mt-1 text-2xl font-bold text-yellow-600">{unlockedCount}</div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Top bar: search + filters + lock all */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by student or certificate no..."
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[280px]"
            />

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as Filter);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]"
            >
              <option value="All">All</option>
              <option value="Locked">Locked</option>
              <option value="Unlocked">Unlocked</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]"
            >
              <option value="All">All types</option>
              {certTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={lockAll}
            disabled={unlockedCount === 0}
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Lock all unlocked
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Cert No.</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Lock</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{c.id}</td>
                  <td className="px-4 py-3 font-semibold">{c.studentName}</td>
                  <td className="px-4 py-3">{c.className}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">{formatDate(c.issueDate)}</td>
                  <td className="px-4 py-3">
                    {c.locked ? (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        Locked
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                        Unlocked
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {/* Toggle switch */}
                    <button
                      onClick={() => toggle(c.id)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        c.locked ? "bg-[#27348b]" : "bg-gray-300"
                      }`}
                      aria-label={c.locked ? `Unlock ${c.id}` : `Lock ${c.id}`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                          c.locked ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No certificates found
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
    </div>
  );
}