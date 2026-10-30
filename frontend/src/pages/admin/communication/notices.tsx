import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import DataTable from "../../../components/common/DataTable";
import type { DataTableColumn } from "../../../components/common/DataTable";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import Pagination from "../../../components/common/Pagination";
import StatusBadge from "../../../components/common/StatusBadge";

type Notice = {
  id: string;
  title: string;
  category: string;
  description: string;
  issueDate: string;
  expiryDate: string;
};

type NoticeForm = Omit<Notice, "id">;

const STORAGE_KEY =
  "schoolerp:pages_admin_communication_notices_tsx:notices";

const categories = ["General", "Exam", "Holiday", "Fee", "Event", "Transport"];
const pageSizes = [5, 10, 25, 50];

function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const emptyForm: NoticeForm = {
  title: "",
  category: "General",
  description: "",
  issueDate: getToday(),
  expiryDate: "",
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100";

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const saved = window.localStorage.getItem(key);
      return saved === null ? initialValue : (JSON.parse(saved) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save "${key}" to localStorage.`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function isExpired(notice: Notice): boolean {
  return Boolean(notice.expiryDate) && notice.expiryDate < getToday();
}

function formatDate(date: string): string {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function AdminNotices() {
  const [notices, setNotices] = usePersistentState<Notice[]>(
    STORAGE_KEY,
    [],
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NoticeForm>({ ...emptyForm });
  const [error, setError] = useState("");

  const filteredNotices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notices;

    return notices.filter((notice) =>
      [
        notice.id,
        notice.title,
        notice.category,
        notice.description,
        notice.issueDate,
        notice.expiryDate,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [notices, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotices.length / pageSize),
  );

  const safePage = Math.min(page, totalPages);

  // Keep the current page valid when search results change.
  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const pagedNotices = useMemo(
    () =>
      filteredNotices.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize,
      ),
    [filteredNotices, safePage, pageSize],
  );

  function nextId(): string {
    const max = notices.reduce((highest, notice) => {
      const numericPart = Number(notice.id.replace(/^N/i, ""));

      return Number.isFinite(numericPart)
        ? Math.max(highest, numericPart)
        : highest;
    }, 0);

    return `N${String(max + 1).padStart(3, "0")}`;
  }

  function openForm() {
    setForm({ ...emptyForm, issueDate: getToday() });
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    if (!form.issueDate || !form.expiryDate) {
      setError("Issue date and expiry date are required.");
      return;
    }

    if (form.expiryDate < form.issueDate) {
      setError("Expiry date cannot be before issue date.");
      return;
    }

    const newNotice: Notice = {
      id: nextId(),
      title,
      category: form.category,
      description,
      issueDate: form.issueDate,
      expiryDate: form.expiryDate,
    };

    setNotices((current) => [newNotice, ...current]);
    setSearch("");
    setPage(1);
    closeForm();
  }

  const columns: DataTableColumn<Notice>[] = [
    {
      key: "id",
      header: "No.",
      className: "whitespace-nowrap text-gray-500",
      render: (notice) => notice.id,
    },
    {
      key: "title",
      header: "Title",
      className: "min-w-[220px]",
      render: (notice) => (
        <div className="min-w-[180px]">
          <p className="font-semibold text-gray-900">{notice.title}</p>
          <p
            className="mt-1 max-w-[340px] truncate text-xs text-gray-500"
            title={notice.description}
          >
            {notice.description}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (notice) => (
        <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          {notice.category}
        </span>
      ),
    },
    {
      key: "issueDate",
      header: "Issue Date",
      className: "whitespace-nowrap",
      render: (notice) => formatDate(notice.issueDate),
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      className: "whitespace-nowrap",
      render: (notice) => formatDate(notice.expiryDate),
    },
    {
      key: "status",
      header: "Status",
      render: (notice) => (
        <StatusBadge status={isExpired(notice) ? "Expired" : "Active"} />
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        title="Notices"
        description="Official school notices with an expiry date"
        actions={
          <button
            type="button"
            onClick={openForm}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2a73]"
          >
            + Add Notice
          </button>
        }
      />

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search and Rows per page — same layout as Announcements */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by title, category, ID, or description..."
            className="sm:max-w-[360px]"
          />

          
        </div>

        {/* Notices table */}
        <DataTable
          data={pagedNotices}
          columns={columns}
          rowKey={(notice) => notice.id}
          emptyState={
            <div>
              <p className="font-medium text-gray-700">
                No notices found
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {search.trim()
                  ? "Try changing your search."
                  : "Add your first school notice using the button above."}
              </p>
            </div>
          }
          tableClassName="text-sm text-gray-800"
        />

        {/* Same shared Pagination component as Announcements */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filteredNotices.length}
          pageSize={pageSize}
          onPageChange={setPage}
          itemLabel="notices"
        />
      </section>

      {/* Add Notice Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-notice-title"
            className="my-4 max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2
                id="add-notice-title"
                className="text-lg font-bold text-gray-900"
              >
                Add Notice
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-md px-2 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close add notice form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="notice-title"
                  className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                >
                  Title
                </label>

                <input
                  id="notice-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Diwali Holidays"
                  className={inputStyle}
                  maxLength={150}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="notice-category"
                  className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                >
                  Category
                </label>

                <select
                  id="notice-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
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

              {/* Description */}
              <div>
                <label
                  htmlFor="notice-description"
                  className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                >
                  Description
                </label>

                <textarea
                  id="notice-description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Write the notice details here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100"
                  maxLength={5000}
                  required
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {form.description.length}/5000
                </p>
              </div>

              {/* Issue Date and Expiry Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="notice-issue-date"
                    className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                  >
                    Issue Date
                  </label>

                  <input
                    id="notice-issue-date"
                    type="date"
                    value={form.issueDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        issueDate: event.target.value,
                        expiryDate:
                          current.expiryDate &&
                          current.expiryDate < event.target.value
                            ? ""
                            : current.expiryDate,
                      }))
                    }
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="notice-expiry-date"
                    className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                  >
                    Expiry Date
                  </label>

                  <input
                    id="notice-expiry-date"
                    type="date"
                    min={form.issueDate || undefined}
                    value={form.expiryDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        expiryDate: event.target.value,
                      }))
                    }
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Validation Error */}
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2a73]"
                >
                  Save Notice
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}