// src/pages/admin/communication/AdminMessages.tsx
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import DataTable from "../../../components/common/DataTable";
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

const today = new Date().toISOString().slice(0, 10);

const initialMessages: Message[] = [
  { id: "MS001", box: "Inbox", person: "Mrs. Sunita Rao (Teacher)", subject: "Lab equipment request", body: "We need 10 new microscopes for the Class 9 science lab.", date: "2026-10-11", read: false },
  { id: "MS002", box: "Inbox", person: "Mr. Verma (Parent of Priya, 10-B)", subject: "Fee receipt not received", body: "I paid the second quarter fee on 5th October but have not received the receipt.", date: "2026-10-10", read: false },
  { id: "MS003", box: "Inbox", person: "Rohit Gupta (Student, 6-C)", subject: "Request for bonafide certificate", body: "Please issue a bonafide certificate for my scholarship form.", date: "2026-10-08", read: true },
  { id: "MS004", box: "Sent", person: "All Teachers", subject: "Staff meeting on Friday", body: "Kindly attend the staff meeting at 3 PM in the main hall.", date: "2026-10-09", read: true },
];

const emptyForm: ComposeForm = { to: "", subject: "", body: "" };
const PAGE_SIZES = [5, 10, 25, 50];

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeBox, setActiveBox] = useState<Box>("Inbox");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ComposeForm>(emptyForm);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState<Message | null>(null);

  const unreadCount = messages.filter((m) => m.box === "Inbox" && !m.read).length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return messages.filter(
      (m) =>
        m.box === activeBox &&
        (!query ||
          m.person.toLowerCase().includes(query) ||
          m.subject.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query) ||
          m.body.toLowerCase().includes(query))
    );
  }, [messages, activeBox, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function nextId() {
    const max = messages.reduce((currentMax, message) => {
      const number = Number(message.id.slice(2));
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
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.to.trim() || !form.subject.trim() || !form.body.trim()) {
      setError("To, subject and message are required.");
      return;
    }

    const newMessage: Message = {
      id: nextId(),
      box: "Sent",
      person: form.to.trim(),
      subject: form.subject.trim(),
      body: form.body.trim(),
      date: today,
      read: true,
    };

    setMessages((current) => [newMessage, ...current]);
    setActiveBox("Sent");
    setSearch("");
    setPage(1);
    setShowForm(false);
    setForm(emptyForm);
    setError("");
  }

  function openMessage(message: Message) {
    setMessages((current) =>
      current.map((item) => item.id === message.id ? { ...item, read: true } : item)
    );
    setViewing({ ...message, read: true });
  }

  const columns = [
    {
      key: "person",
      header: activeBox === "Inbox" ? "From" : "To",
      render: (message: Message) => (
        <span className={!message.read ? "font-semibold text-gray-900" : "text-gray-700"}>
          {message.person}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (message: Message) => (
        <div>
          <p className={!message.read ? "font-semibold text-gray-900" : "text-gray-700"}>
            {message.subject}
          </p>
          <p className="mt-1 max-w-sm truncate text-xs text-gray-500">{message.body}</p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (message: Message) => <span className="whitespace-nowrap">{message.date}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (message: Message) => {
        const status = message.box === "Sent" ? "Sent" : message.read ? "Read" : "Unread";
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
      render: (message: Message) => (
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
            <button type="button" onClick={() => switchBox("Inbox")} className={tabClass("Inbox")}>
              Inbox
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button type="button" onClick={() => switchBox("Sent")} className={tabClass("Sent")}>
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
          rowKey={(message: Message) => message.id}
          emptyState="No messages found."
          tableClassName="min-w-[760px]"
          rowClassName={(message: Message) => !message.read ? "bg-blue-50/40" : ""}
        />

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span>
              Showing <strong>{filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}</strong>
              {"–"}
              <strong>{Math.min(safePage * pageSize, filtered.length)}</strong> of{" "}
              <strong>{filtered.length}</strong>
            </span>
            <div className="w-32">
              <FilterSelect
                value={String(pageSize)}
                onChange={(value: string) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
                options={PAGE_SIZES.map((size) => ({ label: `${size} / page`, value: String(size) }))}
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <div className="w-full max-w-[520px] rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">New Message</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Close compose form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
              <div>
                <label htmlFor="message-to" className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  To
                </label>
                <input
                  id="message-to"
                  value={form.to}
                  onChange={(event) => setForm((current) => ({ ...current, to: event.target.value }))}
                  placeholder="e.g. All Teachers, or Priya Verma (10-B)"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="message-subject" className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  Subject
                </label>
                <input
                  id="message-subject"
                  value={form.subject}
                  onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                  placeholder="e.g. Staff meeting on Friday"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="message-body" className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  Message
                </label>
                <textarea
                  id="message-body"
                  value={form.body}
                  onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  required
                />
              </div>

              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setViewing(null);
          }}
        >
          <div className="w-full max-w-[520px] rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">{viewing.subject}</h2>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
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
              <p className="whitespace-pre-wrap">{viewing.body}</p>
            </div>
            <div className="flex justify-end border-t border-gray-200 px-5 py-3">
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
