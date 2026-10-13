
import { useState } from "react";
import type { FormEvent } from "react";

type Certificate = {
  id: string;
  studentName: string;
  className: string;
  type: string;
  issueDate: string;
  status: "Issued" | "Pending";
};

const initialCertificates: Certificate[] = [
  { id: "C001", studentName: "Aarav Sharma", className: "8-A", type: "Bonafide", issueDate: "2026-10-01", status: "Issued" },
  { id: "C002", studentName: "Priya Verma", className: "10-B", type: "Character", issueDate: "2026-10-05", status: "Issued" },
  { id: "C003", studentName: "Rohit Gupta", className: "6-C", type: "Transfer", issueDate: "2026-10-09", status: "Pending" },
];

const certificateTypes = ["Bonafide", "Character", "Transfer", "Merit", "Participation", "Other"];

// Form ki khaali state
const emptyForm = {
  studentName: "",
  className: "",
  type: "Bonafide",
  issueDate: new Date().toISOString().slice(0, 10),
  status: "Issued" as "Issued" | "Pending",
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

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Popup form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = certificates.filter(
    (c) =>
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination ka hisaab
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Naya ID: sabse bada number + 1  (C003 -> C004)
  function nextId(): string {
    const max = certificates.reduce((m, c) => Math.max(m, Number(c.id.slice(1))), 0);
    return "C" + String(max + 1).padStart(3, "0");
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

    if (!form.studentName.trim() || !form.className.trim()) {
      setError("Student name and class are required");
      return;
    }
    if (!form.issueDate) {
      setError("Issue date is required");
      return;
    }

    const newCertificate: Certificate = {
      id: nextId(),
      studentName: form.studentName.trim(),
      className: form.className.trim(),
      type: form.type,
      issueDate: form.issueDate,
      status: form.status,
    };

    setCertificates([newCertificate, ...certificates]);
    setPage(1); // nayi entry sabse upar hai
    closeForm();
  }

  // Pending certificate ko Issued mark karna
  function markIssued(id: string) {
    setCertificates(
      certificates.map((c) => (c.id === id ? { ...c, status: "Issued" } : c))
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
        <p className="text-sm text-gray-500">Issue and manage student certificates</p>
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
            placeholder="Search by student, type or ID..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[320px]"
          />
          <button
            onClick={openForm}
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            + Issue Certificate
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#27348b] text-xs font-bold text-white">
                        {c.studentName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold">{c.studentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.className}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">{c.issueDate}</td>
                  <td className="px-4 py-3">
                    {c.status === "Issued" ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Issued
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.status === "Pending" && (
                      <button
                        onClick={() => markIssued(c.id)}
                        className="rounded-lg border border-[#27348b] px-3 py-1 text-xs font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
                      >
                        Mark Issued
                      </button>
                    )}
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

      {/* ================= ISSUE CERTIFICATE POPUP ================= */}
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
              <h2 className="text-lg font-bold text-gray-900">Issue Certificate</h2>
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
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Student Name</label>
                <input
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Class</label>
                  <input
                    value={form.className}
                    onChange={(e) => setForm({ ...form, className: e.target.value })}
                    placeholder="e.g. 8-A"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputStyle}
                  >
                    {certificateTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Issue Date</label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "Issued" | "Pending" })}
                    className={inputStyle}
                  >
                    <option value="Issued">Issued</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
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
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}