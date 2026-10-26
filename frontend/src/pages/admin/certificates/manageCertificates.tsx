// src/pages/admin/certificates/ManageCertificates.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

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

// 2026-10-14 -> 14 October 2026
function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

// ---------- Pagination helpers ----------
const PAGE_SIZES = [5, 10, 25, 50];
const pageBtn = "h-8 rounded-lg border px-3 text-sm font-semibold";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function ManageCertificates() {
  const navigate = useNavigate();

  const [items, setItems] = useState<IssuedCertificate[]>(initialIssued);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Edit popup state
  const [editing, setEditing] = useState<IssuedCertificate | null>(null);
  const [form, setForm] = useState({ type: "", issueDate: "" });
  const [error, setError] = useState("");

  const filtered = items.filter(
    (c) =>
      (typeFilter === "All" || c.type === typeFilter) &&
      (c.studentName.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  function openEdit(c: IssuedCertificate) {
    setEditing(c);
    setForm({ type: c.type, issueDate: c.issueDate });
    setError("");
  }

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    if (!form.issueDate) {
      setError("Issue date is required");
      return;
    }

    setItems(
      items.map((c) =>
        c.id === editing.id ? { ...c, type: form.type, issueDate: form.issueDate } : c
      )
    );
    setEditing(null);
  }

  function handleDelete(c: IssuedCertificate) {
    if (!window.confirm(`Delete certificate ${c.id} of ${c.studentName}?`)) return;
    setItems(items.filter((x) => x.id !== c.id));
  }

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Certificates</h1>
        <p className="text-sm text-gray-500">Edit, update or delete issued certificates</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Top bar: search + filter + new button */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by student or certificate no..."
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[300px]"
            />

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
            onClick={() => navigate("/certificates/individual")}
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            + New Certificate
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
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{c.id}</td>
                  <td className="px-4 py-3 font-semibold">{c.studentName}</td>
                  <td className="px-4 py-3">{c.className}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatDate(c.issueDate)}</td>
                  <td className="px-4 py-3">
                    {c.locked ? (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        Locked
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Editable
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.locked ? (
                      <span className="text-xs text-gray-400">Unlock to edit</span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="rounded-lg border border-[#27348b] px-3 py-1 text-xs font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="rounded-lg border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
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

      {/* Edit popup */}
      {editing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-[460px] rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Edit {editing.id}</h2>
              <button
                onClick={() => setEditing(null)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 px-5 py-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Student</label>
                <input
                  value={`${editing.studentName} (${editing.className})`}
                  disabled
                  className={`${inputStyle} bg-gray-100 text-gray-500`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputStyle}
                  >
                    {certTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Issue Date</label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    className={inputStyle}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}