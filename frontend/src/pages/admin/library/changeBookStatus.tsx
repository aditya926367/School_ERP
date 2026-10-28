
import { useState } from "react";

type CopyStatus = "Available" | "Issued" | "Lost" | "Damaged" | "Under Repair";

type BookCopy = {
  id: string; // copy ID, for example B001-01
  title: string;
  status: CopyStatus;
};

const statuses: CopyStatus[] = ["Available", "Issued", "Lost", "Damaged", "Under Repair"];

const initialCopies: BookCopy[] = [];

// Badge color for each status
const statusColor: Record<CopyStatus, string> = {
  Available: "bg-green-100 text-green-700",
  Issued: "bg-yellow-100 text-yellow-700",
  Lost: "bg-red-100 text-red-700",
  Damaged: "bg-orange-100 text-orange-700",
  "Under Repair": "bg-blue-100 text-blue-700",
};

// ---------- Pagination helpers ----------
const PAGE_SIZES = [5, 10, 25, 50];
const pageBtn = "h-8 rounded-lg border px-3 text-sm font-semibold";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function ChangeBookStatus() {
  const [copies, setCopies] = useState<BookCopy[]>(initialCopies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | CopyStatus>("All");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = copies.filter(
    (c) =>
      (statusFilter === "All" || c.status === statusFilter) &&
      (c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  function changeStatus(id: string, status: CopyStatus) {
    setCopies(copies.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Change Book Status</h1>
        <p className="text-sm text-gray-500">Mark book copies as available, issued, lost or damaged</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Top bar: search + status filter */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title or copy ID..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[320px]"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "All" | CopyStatus);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]"
          >
            <option value="All">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Copy ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3">Change To</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{c.id}</td>
                  <td className="px-4 py-3 font-semibold">{c.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={c.status}
                      onChange={(e) => changeStatus(c.id, e.target.value as CopyStatus)}
                      className="h-9 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-[#27348b]"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No book copies found
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