// src/pages/admin/library/IssueReturn.tsx
import { useState } from "react";

type Txn = {
  id: number;
  memberId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returned: boolean;
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

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

export default function IssueReturn() {
  const [txns, setTxns] = useState<Txn[]>([
    { id: 1, memberId: "M101", bookId: "B001", issueDate: "2026-10-01", dueDate: "2026-10-15", returned: false },
    { id: 2, memberId: "M102", bookId: "B004", issueDate: "2026-09-20", dueDate: "2026-10-04", returned: true },
  ]);

  // Issue form state
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Pagination ka hisaab
  const totalPages = Math.max(1, Math.ceil(txns.length / pageSize));
  const safePage = Math.min(page, totalPages); // page kabhi total se bada na ho
  const paged = txns.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = txns.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, txns.length);

  // Naya issue add karna
  function handleIssue() {
    if (!memberId.trim() || !bookId.trim() || !dueDate) {
      alert("Please fill all fields");
      return;
    }

    const newTxn: Txn = {
      id: Date.now(),
      memberId: memberId.trim(),
      bookId: bookId.trim(),
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate,
      returned: false,
    };

    setTxns([newTxn, ...txns]);
    setPage(1); // nayi entry sabse upar hai, isliye page 1 par jao
    setMemberId("");
    setBookId("");
    setDueDate("");
  }

  // Book return mark karna
  function handleReturn(id: number) {
    setTxns(txns.map((t) => (t.id === id ? { ...t, returned: true } : t)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue / Return</h1>
        <p className="text-sm text-gray-500">Issue books to members and record returns</p>
      </div>

      {/* Issue form card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-900">Issue a Book</h2>

        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Member ID</label>
            <input
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="M101"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Book ID</label>
            <input
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="B001"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputStyle}
            />
          </div>

          <button
            onClick={handleIssue}
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            Issue Book
          </button>
        </div>
      </div>

      {/* Transactions table card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((t) => (
                <tr key={t.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{t.memberId}</td>
                  <td className="px-4 py-3">{t.bookId}</td>
                  <td className="px-4 py-3">{t.issueDate}</td>
                  <td className="px-4 py-3">{t.dueDate}</td>
                  <td className="px-4 py-3">
                    {t.returned ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Returned
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                        Issued
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!t.returned && (
                      <button
                        onClick={() => handleReturn(t.id)}
                        className="rounded-lg border border-[#27348b] px-3 py-1 text-xs font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {txns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No transactions yet
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
              Showing <b>{from}</b>-<b>{to}</b> of <b>{txns.length}</b>
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