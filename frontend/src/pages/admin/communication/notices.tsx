// src/pages/admin/communication/AdminNotices.tsx
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import DataTable from "../../../components/common/DataTable";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import FilterSelect from "../../../components/common/FilterSelect";
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

const today = new Date().toISOString().slice(0, 10);

const initialNotices: Notice[] = [];

const categories = ["General", "Exam", "Holiday", "Fee", "Event", "Transport"];
const pageSizeOptions = [5, 10, 25, 50].map((size) => ({
  label: `${size}`,
  value: String(size),
}));

const emptyForm: NoticeForm = {
  title: "",
  category: "General",
  description: "",
  issueDate: today,
  expiryDate: "",
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

function isExpired(notice: Notice): boolean {
  return notice.expiryDate < today;
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
  const [notices, setNotices] = usePersistentState<Notice[]>('schoolerp:pages_admin_communication_notices_tsx:notices', []);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NoticeForm>(emptyForm);
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

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pagedNotices = useMemo(
    () =>
      filteredNotices.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize,
      ),
    [filteredNotices, safePage, pageSize],
  );

  const nextId = (): string => {
    const max = notices.reduce(
      (highest, notice) =>
        Math.max(highest, Number(notice.id.replace(/^N/, "")) || 0),
      0,
    );
    return `N${String(max + 1).padStart(3, "0")}`;
  };

  const openForm = () => {
    setForm({ ...emptyForm, issueDate: today });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
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
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      issueDate: form.issueDate,
      expiryDate: form.expiryDate,
    };

    setNotices((current) => [newNotice, ...current]);
    setSearch("");
    setPage(1);
    closeForm();
  };

  const columns: {
    key: string;
    header: string;
    render: (notice: Notice) => ReactNode;
    className?: string;
  }[] = [
    {
      key: "id",
      header: "No.",
      className: "whitespace-nowrap text-gray-500",
      render: (notice) => notice.id,
    },
    {
      key: "title",
      header: "Title",
      render: (notice) => (
        <div className="min-w-[180px]">
          <p className="font-semibold text-gray-900">{notice.title}</p>
          <p className="mt-1 max-w-[340px] truncate text-xs text-gray-500">
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
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            + Add Notice
          </button>
        }
      />

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by title, category, ID, or description..."
          />
          
        </div>

        <DataTable<Notice>
          data={pagedNotices}
          columns={columns}
          rowKey={(notice) => notice.id}
          emptyState="No notices found."
          tableClassName="min-w-[850px]"
        />

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterSelect
            value={String(pageSize)}
            onChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
            options={pageSizeOptions}
           
          />
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredNotices.length}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="notices"
          />
        </div>
      </section>

      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={closeForm}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-notice-title"
            className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 id="add-notice-title" className="text-lg font-bold text-gray-900">
                Add Notice
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Close add notice form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
              <div>
                <label htmlFor="notice-title" className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  Title
                </label>
                <input
                  id="notice-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="e.g. Diwali Holidays"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label htmlFor="notice-category" className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  Category
                </label>
                <select
                  id="notice-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
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
                <label htmlFor="notice-description" className="mb-1 block text-xs font-semibold uppercase text-gray-500">
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="notice-issue-date" className="mb-1 block text-xs font-semibold uppercase text-gray-500">
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
                      }))
                    }
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="notice-expiry-date" className="mb-1 block text-xs font-semibold uppercase text-gray-500">
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

              {error && (
                <p role="alert" className="text-sm text-red-600">
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
