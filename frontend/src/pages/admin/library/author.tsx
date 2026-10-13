
import { useState } from "react";
import type { FormEvent } from "react";

type Author = {
  id: string;
  name: string;
  country: string;
  books: number;
};

const initialAuthors: Author[] = [
  { id: "AU001", name: "A.P.J. Abdul Kalam", country: "India", books: 3 },
  { id: "AU002", name: "H.C. Verma", country: "India", books: 2 },
  { id: "AU003", name: "Rabindranath Tagore", country: "India", books: 4 },
  { id: "AU004", name: "Jawaharlal Nehru", country: "India", books: 2 },
  { id: "AU005", name: "Robert Kiyosaki", country: "USA", books: 3 },
  { id: "AU006", name: "J.K. Rowling", country: "UK", books: 7 },
];

// Empty form state
const emptyForm = { name: "", country: "India", books: "1" };

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

// ---------- Pagination helpers ----------
const PAGE_SIZES = [5, 10, 25, 50];
const pageBtn = "h-8 rounded-lg border px-3 text-sm font-semibold";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function AuthorList() {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Popup form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.country.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Next ID: highest number + 1
  function nextId(): string {
    const max = authors.reduce((m, a) => Math.max(m, Number(a.id.slice(2))), 0);
    return "AU" + String(max + 1).padStart(3, "0");
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

    const books = Number(form.books);

    if (!form.name.trim() || !form.country.trim()) {
      setError("Name and country are required");
      return;
    }
    if (!Number.isInteger(books) || books < 0) {
      setError("Books must be 0 or more");
      return;
    }

    const newAuthor: Author = {
      id: nextId(),
      name: form.name.trim(),
      country: form.country.trim(),
      books,
    };

    setAuthors([newAuthor, ...authors]);
    setPage(1); // new entry is at the top
    closeForm();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Author List</h1>
        <p className="text-sm text-gray-500">Maintain a database of authors</p>
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
            placeholder="Search by author or country..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[320px]"
          />
          <button
            onClick={openForm}
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            + Add Author
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Books in Library</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{a.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#27348b] text-xs font-bold text-white">
                        {a.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{a.country}</td>
                  <td className="px-4 py-3">{a.books}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No authors found
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

      {/* Add author popup */}
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
              <h2 className="text-lg font-bold text-gray-900">Add Author</h2>
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
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Author Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. A.P.J. Abdul Kalam"
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Country</label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Books</label>
                  <input
                    type="number"
                    min={0}
                    value={form.books}
                    onChange={(e) => setForm({ ...form, books: e.target.value })}
                    className={inputStyle}
                  />
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
                  Save Author
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}