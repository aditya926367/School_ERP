// src/pages/admin/communication/AdminMessages.tsx
import { useState } from "react";
import type { FormEvent } from "react";

type Box = "Inbox" | "Sent";

type Message = {
  id: string;
  box: Box;
  person: string; // Inbox mein "From", Sent mein "To"
  subject: string;
  body: string;
  date: string;
  read: boolean;
};

const today = new Date().toISOString().slice(0, 10);

const initialMessages: Message[] = [
  { id: "MS001", box: "Inbox", person: "Mrs. Sunita Rao (Teacher)", subject: "Lab equipment request", body: "We need 10 new microscopes for the Class 9 science lab.", date: "2026-10-11", read: false },
  { id: "MS002", box: "Inbox", person: "Mr. Verma (Parent of Priya, 10-B)", subject: "Fee receipt not received", body: "I paid the second quarter fee on 5th October but have not received the receipt.", date: "2026-10-10", read: false },
  { id: "MS003", box: "Inbox", person: "Rohit Gupta (Student, 6-C)", subject: "Request for bonafide certificate", body: "Please issue a bonafide certificate for my scholarship form.", date: "2026-10-08", read: true },
  { id: "MS004", box: "Sent", person: "All Teachers", subject: "Staff meeting on Friday", body: "Kindly attend the staff meeting at 3 PM in the main hall.", date: "2026-10-09", read: true },
];

// Form ki khaali state
const emptyForm = { to: "", subject: "", body: "" };

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

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeBox, setActiveBox] = useState<Box>("Inbox");
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Compose popup state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // View popup state (kaunsa message khula hai)
  const [viewing, setViewing] = useState<Message | null>(null);

  const unreadCount = messages.filter((m) => m.box === "Inbox" && !m.read).length;

  // Pehle tab (Inbox/Sent) se, fir search se filter
  const filtered = messages.filter(
    (m) =>
      m.box === activeBox &&
      (m.person.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination ka hisaab
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Naya ID: sabse bada number + 1  (MS004 -> MS005)
  function nextId(): string {
    const max = messages.reduce((m, x) => Math.max(m, Number(x.id.slice(2))), 0);
    return "MS" + String(max + 1).padStart(3, "0");
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

  function closeForm() {
    setShowForm(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.to.trim() || !form.subject.trim() || !form.body.trim()) {
      setError("To, subject and message are required");
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

    setMessages([newMessage, ...messages]);
    setActiveBox("Sent"); // bheja hua message Sent tab mein dikhao
    setPage(1);
    closeForm();
  }

  // Message kholna aur read mark karna
  function openMessage(m: Message) {
    setMessages(messages.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
    setViewing({ ...m, read: true });
  }

  const tabBtn = "h-9 rounded-lg px-4 text-sm font-semibold";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500">Read and send messages to teachers, parents and students</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Top bar: tabs + search + compose */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Inbox / Sent tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => switchBox("Inbox")}
              className={`${tabBtn} ${
                activeBox === "Inbox" ? "bg-[#27348b] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Inbox
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => switchBox("Sent")}
              className={`${tabBtn} ${
                activeBox === "Sent" ? "bg-[#27348b] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sent
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or subject..."
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[280px]"
            />
            <button
              onClick={openForm}
              className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
            >
              + Compose
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">{activeBox === "Inbox" ? "From" : "To"}</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((m) => (
                <tr
                  key={m.id}
                  className={`border-t border-gray-200 hover:bg-gray-50 ${!m.read ? "bg-blue-50/40" : ""}`}
                >
                  <td className={`px-4 py-3 ${!m.read ? "font-bold" : ""}`}>{m.person}</td>
                  <td className={`px-4 py-3 ${!m.read ? "font-bold" : ""}`}>{m.subject}</td>
                  <td className="px-4 py-3">{m.date}</td>
                  <td className="px-4 py-3">
                    {m.box === "Sent" ? (
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        Sent
                      </span>
                    ) : m.read ? (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        Read
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        Unread
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openMessage(m)}
                      className="rounded-lg border border-[#27348b] px-3 py-1 text-xs font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No messages found
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

      {/* ================= COMPOSE POPUP ================= */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={closeForm}
        >
          <div
            className="w-full max-w-[520px] rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">New Message</h2>
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
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">To</label>
                <input
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  placeholder="e.g. All Teachers, or Priya Verma (10-B)"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Subject</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Staff meeting on Friday"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Message</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b]"
                />
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
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW MESSAGE POPUP ================= */}
      {viewing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="w-full max-w-[520px] rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">{viewing.subject}</h2>
              <button
                onClick={() => setViewing(null)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 px-5 py-4 text-sm text-gray-800">
              <div className="text-xs text-gray-500">
                {viewing.box === "Inbox" ? "From" : "To"}: <b className="text-gray-800">{viewing.person}</b>
                {" · "}
                {viewing.date}
              </div>
              <p className="whitespace-pre-wrap">{viewing.body}</p>
            </div>

            <div className="flex justify-end border-t border-gray-200 px-5 py-3">
              <button
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