
import { useState } from "react";

type StockRow = {
  id: string;
  title: string;
  system: number; // count as per the system
  physical: string; // count entered by the librarian, empty = not counted yet
};

const initialRows: StockRow[] = [
  { id: "B001", title: "Wings of Fire", system: 5, physical: "" },
  { id: "B002", title: "Concept of Physics", system: 8, physical: "" },
  { id: "B003", title: "Gitanjali", system: 4, physical: "" },
  { id: "B004", title: "Discovery of India", system: 3, physical: "" },
  { id: "B005", title: "Rich Dad Poor Dad", system: 6, physical: "" },
  { id: "B006", title: "The Alchemist", system: 4, physical: "" },
];

// Result for one row
function getResult(r: StockRow): { label: string; className: string; diff: number } {
  if (r.physical === "") {
    return { label: "Not counted", className: "bg-gray-200 text-gray-600", diff: 0 };
  }
  const diff = Number(r.physical) - r.system;
  if (diff === 0) return { label: "Match", className: "bg-green-100 text-green-700", diff };
  if (diff < 0) return { label: `Missing ${Math.abs(diff)}`, className: "bg-red-100 text-red-700", diff };
  return { label: `Extra ${diff}`, className: "bg-yellow-100 text-yellow-700", diff };
}

// ---------- Pagination helpers ----------
const PAGE_SIZES = [5, 10, 25, 50];
const pageBtn = "h-8 rounded-lg border px-3 text-sm font-semibold";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function StockVerification() {
  const [rows, setRows] = useState<StockRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = rows.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Summary is calculated on ALL rows, not only the current page
  const countedRows = rows.filter((r) => r.physical !== "");
  const mismatchCount = countedRows.filter((r) => getResult(r).diff !== 0).length;

  function setPhysical(id: string, value: string) {
    setMessage("");
    setRows(rows.map((r) => (r.id === id ? { ...r, physical: value } : r)));
  }

  function handleSave() {
    // Later: send the counts to the backend API here
    const today = new Date().toISOString().slice(0, 10);
    setMessage(`Verification saved on ${today}: ${countedRows.length} counted, ${mismatchCount} mismatches`);
  }

  function handleReset() {
    setMessage("");
    setRows(rows.map((r) => ({ ...r, physical: "" })));
  }

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Verification</h1>
        <p className="text-sm text-gray-500">Compare the physical stock with the system records</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">Total Titles</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{rows.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">Counted</div>
          <div className="mt-1 text-2xl font-bold text-[#27348b]">{countedRows.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">Mismatches</div>
          <div className="mt-1 text-2xl font-bold text-red-600">{mismatchCount}</div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Top bar: search + buttons */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title or ID..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[320px]"
          />

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={countedRows.length === 0}
              className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Save Verification
            </button>
          </div>
        </div>

        {message && (
          <p className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-green-700">{message}</p>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">System Count</th>
                <th className="px-4 py-3">Physical Count</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => {
                const result = getResult(r);

                return (
                  <tr key={r.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{r.id}</td>
                    <td className="px-4 py-3 font-semibold">{r.title}</td>
                    <td className="px-4 py-3">{r.system}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        value={r.physical}
                        onChange={(e) => setPhysical(r.id, e.target.value)}
                        className="h-9 w-24 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-[#27348b]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${result.className}`}>
                        {result.label}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No books found
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