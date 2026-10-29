import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import DataTable from "../../../components/common/DataTable";
import type { DataTableColumn } from "../../../components/common/DataTable";
import PageHeader from "../../../components/common/PageHeader";
import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import StatusBadge from "../../../components/common/StatusBadge";

type Audience = "All" | "Students" | "Teachers" | "Parents";
type Priority = "Normal" | "Important" | "Urgent";
type Status = "Published" | "Draft";

type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: Audience;
  priority: Priority;
  date: string;
  status: Status;
};

type AnnouncementForm = {
  title: string;
  message: string;
  audience: Audience;
  priority: Priority;
  status: Status;
};

const STORAGE_KEY =
  "schoolerp:pages_admin_communication_announcements_tsx:announcements";

const audiences: Audience[] = ["All", "Students", "Teachers", "Parents"];
const priorities: Priority[] = ["Normal", "Important", "Urgent"];
const pageSizes = [5, 10, 25, 50];

const emptyForm: AnnouncementForm = {
  title: "",
  message: "",
  audience: "All",
  priority: "Normal",
  status: "Published",
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100";

const priorityColor: Record<Priority, string> = {
  Normal: "bg-gray-100 text-gray-700",
  Important: "bg-amber-100 text-amber-700",
  Urgent: "bg-red-100 text-red-700",
};

function getToday(): string {
  // Use the local calendar date rather than UTC to avoid date changes near midnight.
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = usePersistentState<Announcement[]>(
    STORAGE_KEY,
    [],
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AnnouncementForm>({ ...emptyForm });
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return announcements;

    return announcements.filter((announcement) =>
      [
        announcement.title,
        announcement.audience,
        announcement.id,
        announcement.message,
        announcement.priority,
        announcement.status,
        announcement.date,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [announcements, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function nextId(): string {
    const max = announcements.reduce((highest, item) => {
      const numericPart = Number(item.id.replace(/^AN/i, ""));
      return Number.isFinite(numericPart)
        ? Math.max(highest, numericPart)
        : highest;
    }, 0);

    return `AN${String(max + 1).padStart(3, "0")}`;
  }

  function openForm() {
    setForm({ ...emptyForm });
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
    const message = form.message.trim();

    if (!title || !message) {
      setError("Title and message are required.");
      return;
    }

    const announcement: Announcement = {
      id: nextId(),
      title,
      message,
      audience: form.audience,
      priority: form.priority,
      date: getToday(),
      status: form.status,
    };

    setAnnouncements((current) => [announcement, ...current]);
    setPage(1);
    closeForm();
  }

  function publish(id: string) {
    setAnnouncements((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Published" } : item,
      ),
    );
  }

  const columns: DataTableColumn<Announcement>[] = [
    {
      key: "id",
      header: "ID",
      className: "whitespace-nowrap text-gray-500",
      render: (item) => item.id,
    },
    {
      key: "title",
      header: "Title",
      className: "min-w-[220px]",
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">{item.title}</p>
          <p
            className="mt-1 max-w-[320px] truncate text-xs text-gray-500"
            title={item.message}
          >
            {item.message}
          </p>
        </div>
      ),
    },
    {
      key: "audience",
      header: "Audience",
      render: (item) => item.audience,
    },
    {
      key: "priority",
      header: "Priority",
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityColor[item.priority]}`}
        >
          {item.priority}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      className: "whitespace-nowrap",
      render: (item) => item.date,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge
          status={item.status === "Published" ? "Active" : "Draft"}
          className={
            item.status === "Draft" ? "bg-gray-100 text-gray-600" : ""
          }
        />
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (item) =>
        item.status === "Draft" ? (
          <button
            type="button"
            onClick={() => publish(item.id)}
            className="rounded-lg border border-[#27348b] px-3 py-1.5 text-xs font-semibold text-[#27348b] transition hover:bg-[#27348b] hover:text-white"
          >
            Publish
          </button>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        title="Announcements"
        description="Share updates with students, teachers and parents"
        actions={
          <button
            type="button"
            onClick={openForm}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2a73]"
          >
            + New Announcement
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
            placeholder="Search by title, audience or ID..."
            className="sm:max-w-[360px]"
          />

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <span className="whitespace-nowrap">Rows per page</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#27348b]"
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        <DataTable
          data={paged}
          columns={columns}
          rowKey={(item) => item.id}
          tableClassName="text-sm text-gray-800"
          emptyState={
            <div>
              <p className="font-medium text-gray-700">
                No announcements found
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {search.trim()
                  ? "Try changing your search."
                  : "Create your first announcement using the button above."}
              </p>
            </div>
          }
        />

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          itemLabel="announcements"
        />
      </section>

      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-modal-title"
            className="my-8 w-full max-w-[560px] rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2
                id="announcement-modal-title"
                className="text-lg font-bold text-gray-900"
              >
                New Announcement
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md px-2 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <div>
                <label
                  htmlFor="announcement-title"
                  className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                >
                  Title
                </label>
                <input
                  id="announcement-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Annual Day Celebration"
                  className={inputStyle}
                  maxLength={150}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="announcement-message"
                  className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                >
                  Message
                </label>
                <textarea
                  id="announcement-message"
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Write the announcement here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100"
                  maxLength={5000}
                  required
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {form.message.length}/5000
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="announcement-audience"
                    className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                  >
                    Audience
                  </label>
                  <select
                    id="announcement-audience"
                    value={form.audience}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        audience: event.target.value as Audience,
                      }))
                    }
                    className={inputStyle}
                  >
                    {audiences.map((audience) => (
                      <option key={audience} value={audience}>
                        {audience}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="announcement-priority"
                    className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                  >
                    Priority
                  </label>
                  <select
                    id="announcement-priority"
                    value={form.priority}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        priority: event.target.value as Priority,
                      }))
                    }
                    className={inputStyle}
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="announcement-status"
                    className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                  >
                    Status
                  </label>
                  <select
                    id="announcement-status"
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as Status,
                      }))
                    }
                    className={inputStyle}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
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
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2a73]"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
