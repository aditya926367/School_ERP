// src/pages/admin/certificates/Awards.tsx

import { useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

type Level = "School" | "District" | "State" | "National";

type Award = {
  id: string;
  title: string;
  recipient: string;
  category: string;
  awardDate: string;
  level: Level;
};

const STORAGE_KEY = "schoolerp:pages_admin_certificates_awards_tsx:awards";
const categories = [
  "Academic",
  "Sports",
  "Science",
  "Arts",
  "Cultural",
  "Discipline",
  "Other",
];
const levels: Level[] = ["School", "District", "State", "National"];

const levelColor: Record<Level, string> = {
  School: "bg-gray-200 text-gray-700",
  District: "bg-blue-100 text-blue-700",
  State: "bg-purple-100 text-purple-700",
  National: "bg-yellow-100 text-yellow-800",
};

function usePersistentState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Could not persist awards:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

function todayIso(): string {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const emptyForm = {
  title: "",
  recipient: "",
  category: "Academic",
  awardDate: todayIso(),
  level: "School" as Level,
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10";
const labelStyle =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500";

const PAGE_SIZES = [5, 10, 25, 50];
const pageBtn = "h-9 rounded-lg border px-3 text-sm font-semibold transition";
const pageBtnNormal = `${pageBtn} border-gray-300 text-gray-700 hover:bg-gray-50`;
const pageBtnDisabled = `${pageBtn} cursor-not-allowed border-gray-200 text-gray-300`;

export default function Awards() {
  const [awards, setAwards] = usePersistentState<Award[]>(STORAGE_KEY, []);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filtered = awards.filter((award) => {
    const query = search.trim().toLowerCase();
    return (
      award.title.toLowerCase().includes(query) ||
      award.recipient.toLowerCase().includes(query) ||
      award.category.toLowerCase().includes(query) ||
      award.level.toLowerCase().includes(query) ||
      award.id.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  function nextId(): string {
    const max = awards.reduce((highest, award) => {
      const number = Number(award.id.replace(/^AW/, ""));
      return Number.isFinite(number) ? Math.max(highest, number) : highest;
    }, 0);
    return `AW${String(max + 1).padStart(3, "0")}`;
  }

  function openForm() {
    setForm({ ...emptyForm, awardDate: todayIso() });
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.recipient.trim()) {
      setError("Award title and recipient are required.");
      return;
    }

    if (!form.awardDate) {
      setError("Award date is required.");
      return;
    }

    const newAward: Award = {
      id: nextId(),
      title: form.title.trim(),
      recipient: form.recipient.trim(),
      category: form.category,
      awardDate: form.awardDate,
      level: form.level,
    };

    setAwards((previous) => [newAward, ...previous]);
    setPage(1);
    setSearch("");
    setShowForm(false);
    setError("");
    setMessage("Award added successfully.");
    setForm({ ...emptyForm, awardDate: todayIso() });
  }

  function handleDelete(award: Award) {
    if (!window.confirm(`Delete award "${award.title}"?`)) return;

    setAwards((previous) =>
      previous.filter((item) => item.id !== award.id),
    );
    setMessage(`Award "${award.title}" deleted.`);
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Awards Distribution
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage awards and track student achievements.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Total awards
          </p>
          <p className="mt-1 text-2xl font-bold text-[#27348b]">
            {awards.length}
          </p>
        </div>
      </header>

      {message && (
        <div
          role="status"
          className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="ml-3 font-bold"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            aria-label="Search awards"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by ID, award, recipient, category or level..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:max-w-md"
          />
          <button
            type="button"
            onClick={openForm}
            className="h-10 shrink-0 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            + Add Award
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Award</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((award) => (
                <tr
                  key={award.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {award.id}
                  </td>
                  <td className="px-4 py-3 font-semibold">{award.title}</td>
                  <td className="px-4 py-3">{award.recipient}</td>
                  <td className="px-4 py-3">{award.category}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDate(award.awardDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${levelColor[award.level]}`}
                    >
                      {award.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(award)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    {search
                      ? "No awards match your search."
                      : "No awards yet. Select “Add Award” to create one."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing <b>{from}</b>–<b>{to}</b> of <b>{filtered.length}</b>
            </span>
            <label className="flex items-center gap-2">
              <span className="sr-only">Rows per page</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-[#27348b]"
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              className={
                safePage === 1 ? pageBtnDisabled : pageBtnNormal
              }
            >
              Prev
            </button>
            <span className="whitespace-nowrap">
              Page <b>{safePage}</b> of <b>{totalPages}</b>
            </span>
            <button
              type="button"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              className={
                safePage === totalPages ? pageBtnDisabled : pageBtnNormal
              }
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-award-title"
            className="my-auto w-full max-w-[560px] rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2
                  id="add-award-title"
                  className="text-lg font-bold text-gray-900"
                >
                  Add Award
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the award and recipient details.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close add award form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <div>
                <label className={labelStyle} htmlFor="award-title">
                  Award title *
                </label>
                <input
                  id="award-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Best Student of the Year"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle} htmlFor="award-recipient">
                  Recipient *
                </label>
                <input
                  id="award-recipient"
                  value={form.recipient}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      recipient: event.target.value,
                    }))
                  }
                  placeholder="e.g. Priya Verma (10-B)"
                  className={inputStyle}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelStyle} htmlFor="award-category">
                    Category
                  </label>
                  <select
                    id="award-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                    className={inputStyle}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyle} htmlFor="award-level">
                    Level
                  </label>
                  <select
                    id="award-level"
                    value={form.level}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        level: event.target.value as Level,
                      }))
                    }
                    className={inputStyle}
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyle} htmlFor="award-date">
                    Award date *
                  </label>
                  <input
                    id="award-date"
                    type="date"
                    value={form.awardDate}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        awardDate: event.target.value,
                      }))
                    }
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
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
                  Save Award
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
