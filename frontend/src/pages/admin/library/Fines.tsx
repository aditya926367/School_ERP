
import { useState } from "react";
import { useFines } from "../../../store/libraryStore";

const RATE_PER_DAY = 5;

const PAGE_SIZES = [5, 10, 25, 50];

function getPageNumbers(
  page: number,
  totalPages: number
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push("...");

  pages.push(totalPages);

  return pages;
}

const pageBtn = "h-8 min-w-8 rounded-lg border px-2 text-sm font-semibold";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnActive = `${pageBtn} border-[#27348b] bg-[#27348b] text-white`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function Fines() {
  const [fines, setFines] = useFines();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  function markPaid(id: number) {
    setFines(
      fines.map((fine) =>
        fine.id === id ? { ...fine, paid: true } : fine
      )
    );
  }

  const pendingTotal = fines
    .filter((fine) => !fine.paid)
    .reduce(
      (sum, fine) => sum + fine.daysLate * RATE_PER_DAY,
      0
    );

  const collectedTotal = fines
    .filter((fine) => fine.paid)
    .reduce(
      (sum, fine) => sum + fine.daysLate * RATE_PER_DAY,
      0
    );

  const totalPages = Math.max(
    1,
    Math.ceil(fines.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const paged = fines.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const from =
    fines.length === 0 ? 0 : (safePage - 1) * pageSize + 1;

  const to = Math.min(safePage * pageSize, fines.length);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Fines
        </h1>

        <p className="text-sm text-gray-500">
          Late return fines (₹{RATE_PER_DAY} per day)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">
            Pending Fine
          </div>

          <div className="mt-1 text-2xl font-bold text-red-600">
            ₹{pendingTotal}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-gray-500">
            Collected
          </div>

          <div className="mt-1 text-2xl font-bold text-green-600">
            ₹{collectedTotal}
          </div>
        </div>
      </div>

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
              {paged.map((fine) => (
                <tr
                  key={fine.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-semibold">
                    {fine.member}
                  </td>

                  <td className="px-4 py-3">{fine.book}</td>

                  <td className="px-4 py-3">{fine.daysLate}</td>

                  <td className="px-4 py-3">
                    ₹{fine.daysLate * RATE_PER_DAY}
                  </td>

                  <td className="px-4 py-3">
                    {fine.paid ? (
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
                    {!fine.paid && (
                      <button
                        onClick={() => markPaid(fine.id)}
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
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No fines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
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
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              className={
                safePage === 1 ? pageBtnDisabled : pageBtnNormal
              }
            >
              Prev
            </button>

            {getPageNumbers(safePage, totalPages).map((number, index) =>
              number === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="px-1 text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={
                    number === safePage
                      ? pageBtnActive
                      : pageBtnNormal
                  }
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              className={
                safePage === totalPages
                  ? pageBtnDisabled
                  : pageBtnNormal
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
