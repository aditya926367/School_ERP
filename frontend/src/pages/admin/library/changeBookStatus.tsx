import { useState } from "react";
import Pagination from "../../../components/common/Pagination";

type CopyStatus = "Available" | "Issued" | "Lost" | "Damaged" | "Under Repair";

type BookCopy = {
  id: string;
  title: string;
  status: CopyStatus;
};

const statuses: CopyStatus[] = [
  "Available",
  "Issued",
  "Lost",
  "Damaged",
  "Under Repair",
];

const PAGE_SIZES = [5, 10, 25, 50];

const initialCopies: BookCopy[] = [
  { id: "B001-01", title: "Wings of Fire", status: "Available" },
  { id: "B001-02", title: "Wings of Fire", status: "Issued" },
  { id: "B002-01", title: "Concept of Physics", status: "Damaged" },
  { id: "B002-02", title: "Concept of Physics", status: "Available" },
  { id: "B003-01", title: "Gitanjali", status: "Available" },
  { id: "B004-01", title: "Discovery of India", status: "Lost" },
  { id: "B004-02", title: "Discovery of India", status: "Under Repair" },
  { id: "B005-01", title: "Rich Dad Poor Dad", status: "Issued" },
];

const statusColor: Record<CopyStatus, string> = {
  Available: "bg-green-100 text-green-700",
  Issued: "bg-yellow-100 text-yellow-700",
  Lost: "bg-red-100 text-red-700",
  Damaged: "bg-orange-100 text-orange-700",
  "Under Repair": "bg-blue-100 text-blue-700",
};

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

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paged = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  function changeStatus(id: string, status: CopyStatus) {
    setCopies((previousCopies) =>
      previousCopies.map((copy) =>
        copy.id === id ? { ...copy, status } : copy
      )
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Change Book Status
        </h1>
        <p className="text-sm text-gray-500">
          Mark book copies as available, issued, lost or damaged
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search and Status Filter */}
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

            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Book Copies Table */}
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
              {paged.map((copy) => (
                <tr
                  key={copy.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">{copy.id}</td>

                  <td className="px-4 py-3 font-semibold">
                    {copy.title}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[copy.status]}`}
                    >
                      {copy.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={copy.status}
                      onChange={(e) =>
                        changeStatus(
                          copy.id,
                          e.target.value as CopyStatus
                        )
                      }
                      className="h-9 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-[#27348b]"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No book copies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Shared Pagination Component */}
        <div className="border-t border-gray-200 px-4 py-3">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={(nextPage: number) => setPage(nextPage)}
            onPageSizeChange={(size: number) => {
              setPageSize(size);
              setPage(1);
            }}
            pageSizes={PAGE_SIZES}
            itemLabel="book copies"
          />
        </div>
      </div>
    </div>
  );
}