import { useState } from "react";
import Pagination from "../../../components/common/Pagination";

type StockRow = {
  id: string;
  title: string;
  system: number;
  physical: string;
};

const initialRows: StockRow[] = [];

const PAGE_SIZES = [5, 10, 25, 50];

function getResult(r: StockRow): {
  label: string;
  className: string;
  diff: number;
} {
  if (r.physical === "") {
    return {
      label: "Not counted",
      className: "bg-gray-200 text-gray-600",
      diff: 0,
    };
  }

  const diff = Number(r.physical) - r.system;
  if (diff === 0) {
    return { label: "Match", className: "bg-green-100 text-green-700", diff };
  }
  if (diff < 0) {
    return {
      label: `Missing ${Math.abs(diff)}`,
      className: "bg-red-100 text-red-700",
      diff,
    };
  }
  return { label: `Extra ${diff}`, className: "bg-yellow-100 text-yellow-700", diff };
}

export default function StockVerification() {
  const [rows, setRows] = usePersistentState<StockRow[]>('schoolerp:pages_admin_library_stockverification_tsx:rows', []);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredRows = rows.filter(
    (row) =>
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const countedRows = rows.filter((row) => row.physical !== "");
  const mismatchCount = countedRows.filter(
    (row) => getResult(row).diff !== 0
  ).length;

  function setPhysical(id: string, value: string) {
    setMessage("");
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id ? { ...row, physical: value } : row
      )
    );
  }

  function handleSave() {
    const today = new Date().toISOString().slice(0, 10);
    setMessage(
      `Verification saved on ${today}: ${countedRows.length} counted, ${mismatchCount} mismatches`
    );
  }

  function handleReset() {
    setMessage("");
    setRows((currentRows) =>
      currentRows.map((row) => ({ ...row, physical: "" }))
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Verification</h1>
        <p className="text-sm text-gray-500">
          Compare the physical stock with the system records
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">
            Total Titles
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {rows.length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">
            Counted
          </div>
          <div className="mt-1 text-2xl font-bold text-[#27348b]">
            {countedRows.length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">
            Mismatches
          </div>
          <div className="mt-1 text-2xl font-bold text-red-600">
            {mismatchCount}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search and actions */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
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
          <p className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-green-700">
            {message}
          </p>
        )}

        {/* Stock table */}
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
              {pagedRows.map((row) => {
                const result = getResult(row);

                return (
                  <tr
                    key={row.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-500">{row.id}</td>
                    <td className="px-4 py-3 font-semibold">{row.title}</td>
                    <td className="px-4 py-3">{row.system}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        value={row.physical}
                        onChange={(event) =>
                          setPhysical(row.id, event.target.value)
                        }
                        className="h-9 w-24 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-[#27348b]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${result.className}`}
                      >
                        {result.label}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Use the shared Pagination component only; no separate page-size dropdown */}
        <div className="border-t border-gray-200 px-5 py-3">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredRows.length}
            pageSize={pageSize}
            onPageChange={(page: number) => setCurrentPage(page)}
            onPageSizeChange={(size: number) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSizes={PAGE_SIZES}
          />
        </div>
      </div>
    </div>
  );
}
