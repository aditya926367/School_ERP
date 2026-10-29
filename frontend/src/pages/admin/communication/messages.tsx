import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import DataTable from "../../../components/common/DataTable";
import type { DataTableColumn } from "../../../components/common/DataTable";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import FilterSelect from "../../../components/common/FilterSelect";
import Pagination from "../../../components/common/Pagination";
import StatusBadge from "../../../components/common/StatusBadge";

type Box = "Inbox" | "Sent";

type Message = {
  id: string;
  box: Box;
  person: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
};

type ComposeForm = { to: string; subject: string; body: string };

const STORAGE_KEY =
  "schoolerp:pages_admin_communication_messages_tsx:messages";
const PAGE_SIZES = [5, 10, 25, 50];

const emptyForm: ComposeForm = { to: "", subject: "", body: "" };

function getToday(): string {
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

export default function AdminMessages() {
  const [messages, setMessages] = usePersistentState<Message[]>(STORAGE_KEY, []);
  const [activeBox, setActiveBox] = useState<Box>("Inbox");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ComposeForm>({ ...emptyForm });
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState<Message | null>(null);

  const unreadCount = messages.filter(
    (message) => message.box === "Inbox" && !message.read,
  ).length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter(
      (message) =>
        message.box === activeBox &&
        (!query ||
          message.person.toLowerCase().includes(query) ||
          message.subject.toLowerCase().includes(query) ||
          message.id.toLowerCase().includes(query) ||
          message.body.toLowerCase().includes(query) ||
          message.date.toLowerCase().includes(query)),
    );
  }, [messages, activeBox, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function nextId(): string {
    const max = messages.reduce((currentMax, message) => {
      const number = Number(message.id.replace(/^MS/i, ""));
      return Number.isFinite(number) ? Math.max(currentMax, number) : currentMax;
    }, 0);

    return `MS${String(max + 1).padStart(3, "0")}`;
  }

  function switchBox(box: Box) {
    setActiveBox(box);
    setPage(1);
    setSearch("");
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

    const to = form.to.trim();
    const subject = form.subject.trim();
    const body = form.body.trim();

    if (!to || !subject || !body) {
      setError("To, subject and message are required.");
      return;
    }

    const newMessage: Message = {
      id: nextId(),
      box: "Sent",
      person: to,
      subject,
      body,
      date: getToday(),
      read: true,
    };

    setMessages((current) => [newMessage, ...current]);
    setActiveBox("Sent");
    setSearch("");
    setPage(1);
    closeForm();
    setForm({ ...emptyForm });
  }

  function openMessage(message: Message) {
    if (message.box === "Inbox" && !message.read) {
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, read: true } : item,
        ),
      );
    }

    setViewing({ ...message, read: true });
  }

  const columns: DataTableColumn<Message>[] = [
    {
      key: "person",
      header: activeBox === "Inbox" ? "From" : "To",
      render: (message) => (
        <span
          className={
            !message.read ? "font-semibold text-gray-900" : "text-gray-700"
          }
        >
          {message.person}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (message) => (
        <div>
          <p
            className={
              !message.read ? "font-semibold text-gray-900" : "text-gray-700"
            }
          >
            {message.subject}
          </p>
          <p className="mt-1 max-w-sm truncate text-xs text-gray-500">
            {message.body}
          </p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (message) => (
        <span className="whitespace-nowrap">{message.date}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (message) => {
        const status =
          message.box === "Sent" ? "Sent" : message.read ? "Read" : "Unread";
        const className =
          status === "Sent"
            ? "bg-blue-100 text-blue-700"
            : status === "Read"
              ? "bg-gray-200 text-gray-600"
              : "bg-red-100 text-red-700";

        return <StatusBadge status={status} className={className} />;
      },
    },
    {
      key: "action",
      header: "Action",
      render: (message) => (
        <button
          type="button"
          onClick={() => openMessage(message)}
          className="rounded-lg border border-[#27348b] px-3 py-1.5 text-xs font-semibold text-[#27348b] transition hover:bg-[#27348b] hover:text-white"
        >
          View
        </button>
      ),
    },
  ];

  const tabClass = (box: Box) =>
    `inline-flex h-9 items-center rounded-lg px-4 text-sm font-semibold transition ${
      activeBox === box
        ? "bg-[#27348b] text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  const inputClass =
    "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10";

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        title="Messages"
        description="Read and send messages to teachers, parents and students"
      />

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => switchBox("Inbox")}
              className={tabClass("Inbox")}
              aria-pressed={activeBox === "Inbox"}
            >
              Inbox
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => switchBox("Sent")}
              className={tabClass("Sent")}
              aria-pressed={activeBox === "Sent"}
            >
              Sent
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[280px]">
              <SearchBar
                value={search}
                onChange={(value: string) => {
                  setSearch(value);
                  setPage(1);
                }}
                placeholder="Search by name, subject, ID or message..."
              />
            </div>
            <button
              type="button"
              onClick={openForm}
              className="h-10 whitespace-nowrap rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2a73]"
            >
              + Compose
            </button>
          </div>
        </div>

        <DataTable
          data={paged}
          columns={columns}
          rowKey={(message) => message.id}
          emptyState={
            <div>
              <p className="font-medium text-gray-700">No messages found.</p>
              <p className="mt-1 text-xs text-gray-500">
                {search.trim()
                  ? "Try changing your search."
                  : activeBox === "Inbox"
                    ? "Messages received will appear here."
                    : "Messages you compose will appear here."}
              </p>
            </div>
          }
          tableClassName="min-w-[760px]"
          rowClassName={(message) => (!message.read ? "bg-blue-50/40" : "")}
        />

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span>
              Showing{" "}
              <strong>
                {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
              </strong>
              {"–"}
              <strong>{Math.min(safePage * pageSize, filtered.length)}</strong>{" "}
              of <strong>{filtered.length}</strong>
            </span>
            <div className="w-36">
              <FilterSelect
                value={String(pageSize)}
                onChange={(value: string) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
                options={PAGE_SIZES.map((size) => ({
                  label: `${size} / page`,
                  value: String(size),
                }))}
                placeholder="Page size"
              />
            </div>
          </div>
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="messages"
          />
        </div>
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
            aria-labelledby="compose-message-title"
            className="my-4 max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2
                id="compose-message-title"
                className="text-lg font-bold text-gray-900"
              >
                New Message
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md px-2 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close compose form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
              <div>
                <label
                  htmlFor="message-to"
                  className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                >
                  To
                </label>
                <input
                  id="message-to"
                  value={form.to}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      to: event.target.value,
                    }))
                  }
                  placeholder="e.g. All Teachers, or Priya Verma (10-B)"
                  className={inputClass}
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message-subject"
                  className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                >
                  Subject
                </label>
                <input
                  id="message-subject"
                  value={form.subject}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subject: event.target.value,
                    }))
                  }
                  placeholder="e.g. Staff meeting on Friday"
                  className={inputClass}
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message-body"
                  className="mb-1 block text-xs font-semibold uppercase text-gray-500"
                >
                  Message
                </label>
                <textarea
                  id="message-body"
                  value={form.body}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      body: event.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  maxLength={10000}
                  required
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {form.body.length}/10000
                </p>
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
                  Send
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {viewing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setViewing(null);
          }}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-message-title"
            className="my-4 max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2
                id="view-message-title"
                className="text-lg font-bold text-gray-900"
              >
                {viewing.subject}
              </h2>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="rounded-md px-2 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close message"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm text-gray-800">
              <div className="text-xs text-gray-500">
                {viewing.box === "Inbox" ? "From" : "To"}:{" "}
                <strong className="text-gray-800">{viewing.person}</strong>
                {" · "}
                {viewing.date}
              </div>
              <p className="whitespace-pre-wrap break-words">{viewing.body}</p>
            </div>
            <div className="flex justify-end border-t border-gray-200 px-5 py-3">
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
