// src/pages/admin/library/Fines.tsx
import { useState } from "react";

type Fine = {
  id: number;
  member: string;
  book: string;
  daysLate: number;
  paid: boolean;
};

const RATE_PER_DAY = 5; // ₹5 per day

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

export default function Fines() {
  const [fines, setFines] = useState<Fine[]>([
    { id: 1, member: "Aarav Sharma (M101)", book: "Wings of Fire", daysLate: 6, paid: false },
    { id: 2, member: "Priya Verma (M102)", book: "Discovery of India", daysLate: 3, paid: true },
    { id: 3, member: "Mrs. Sunita Rao (M201)", book: "Gitanjali", daysLate: 10, paid: false },
  ]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  function markPaid(id: number) {
    setFines(fines.map((f) => (f.id === id ? { ...f, paid: true } : f)));
  }

  // Summary cards: SAARI fines ka hisaab (sirf current page ka nahi)
  const pendingTotal = fines
    .filter((f) => !f.paid)
    .reduce((sum, f) => sum + f.daysLate * RATE_PER_DAY, 0);

  const collectedTotal = fines
    .filter((f) => f.paid)
    .reduce((sum, f) => sum + f.daysLate * RATE_PER_DAY, 0);

  // Pagination ka hisaab
  const totalPages = Math.max(1, Math.ceil(fines.length / pageSize));
  const safePage = Math.min(page, totalPages); // page kabhi total se bada na ho
  const paged = fines.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = fines.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, fines.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fines</h1>
        <p className="text-sm text-gray-500">Late return fines (₹{RATE_PER_DAY} per day)</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">Pending Fine</div>
          <div className="mt-1 text-2xl font-bold text-red-600">₹{pendingTotal}</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">Collected</div>
          <div className="mt-1 text-2xl font-bold text-green-600">₹{collectedTotal}</div>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Days Late</th>
                <th className="px-4 py-3">Fine</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((f) => (
                <tr key={f.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{f.member}</td>
                  <td className="px-4 py-3">{f.book}</td>
                  <td className="px-4 py-3">{f.daysLate}</td>
                  <td className="px-4 py-3">₹{f.daysLate * RATE_PER_DAY}</td>
                  <td className="px-4 py-3">
                    {f.paid ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Paid
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!f.paid && (
                      <button
                        onClick={() => markPaid(f.id)}
                        className="rounded-lg border border-[#27348b] px-3 py-1 text-xs font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {fines.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No fines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Showing 1-5 of 12 + rows per page */}
          <div className="flex items-center gap-3">
            <span>
              Showing <b>{from}</b>-<b>{to}</b> of <b>{fines.length}</b>
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

          {/* Right: Prev, 1 2 3, Next */}
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
    </div>
  );
}