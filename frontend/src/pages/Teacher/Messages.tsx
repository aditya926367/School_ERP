
import { useMemo, useState } from "react";
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  X,
  ArrowLeft,
  Users,
  Clock3,
  CheckCheck,
} from "lucide-react";

type MessageFolder = "Inbox" | "Sent";

type TeacherMessage = {
  id: number;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  date: string;
  folder: MessageFolder;
  unread: boolean;
};

const initialMessages: TeacherMessage[] = [
  {
    id: 1,
    sender: "Priya Singh (Parent)",
    recipient: "Teacher",
    subject: "Regarding Aarav's homework",
    body: "Hello Teacher, could you please clarify question 5 in the mathematics homework? Aarav is having difficulty understanding the method. Thank you.",
    date: "2026-10-12T09:30:00",
    folder: "Inbox",
    unread: true,
  },
  {
    id: 2,
    sender: "School Administration",
    recipient: "Teacher",
    subject: "Staff meeting reminder",
    body: "This is a reminder that the staff meeting will be held on Friday at 2 PM in the conference room. Please bring your class progress reports.",
    date: "2026-10-12T08:15:00",
    folder: "Inbox",
    unread: true,
  },
  {
    id: 3,
    sender: "Rahul Sharma (Parent)",
    recipient: "Teacher",
    subject: "Attendance clarification",
    body: "My child was present yesterday, but the attendance portal shows absent. Could you please verify the record?",
    date: "2026-10-11T14:45:00",
    folder: "Inbox",
    unread: false,
  },
  {
    id: 4,
    sender: "Neha Verma (Parent)",
    recipient: "Teacher",
    subject: "Request for extra practice",
    body: "Please suggest some additional science practice questions before the upcoming examination.",
    date: "2026-10-10T11:20:00",
    folder: "Inbox",
    unread: false,
  },
  {
    id: 5,
    sender: "Teacher",
    recipient: "Class 8-A Parents",
    subject: "Weekly homework update",
    body: "Dear Parents, please ensure students complete their mathematics and English homework this week. Thank you for your support.",
    date: "2026-10-11T16:00:00",
    folder: "Sent",
    unread: false,
  },
  {
    id: 6,
    sender: "Teacher",
    recipient: "School Administration",
    subject: "Class progress report",
    body: "Please find the current progress summary for Class 8-A. Most students are on track, with additional support planned for students who need help.",
    date: "2026-10-09T13:00:00",
    folder: "Sent",
    unread: false,
  },
];

export default function TeacherMessages() {
  const [messages, setMessages] =
    useState<TeacherMessage[]>(initialMessages);
  const [folder, setFolder] = useState<MessageFolder>("Inbox");
  const [search, setSearch] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );
  const [showCompose, setShowCompose] = useState(false);
  const [messageNotice, setMessageNotice] = useState("");

  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const inboxUnread = messages.filter(
    (message) => message.folder === "Inbox" && message.unread
  ).length;

  const folderMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages
      .filter((message) => message.folder === folder)
      .filter((message) => {
        if (!query) return true;

        return `${message.sender} ${message.recipient} ${message.subject} ${message.body}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [messages, folder, search]);

  const selectedMessage = messages.find(
    (message) => message.id === selectedMessageId
  );

  const openMessage = (message: TeacherMessage) => {
    setSelectedMessageId(message.id);
    setMessageNotice("");

    if (message.folder === "Inbox" && message.unread) {
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, unread: false } : item
        )
      );
    }
  };

  const openCompose = () => {
    setRecipient("");
    setSubject("");
    setBody("");
    setMessageNotice("");
    setShowCompose(true);
    setSelectedMessageId(null);
  };

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newMessage: TeacherMessage = {
      id: Date.now(),
      sender: "Teacher",
      recipient: recipient.trim(),
      subject: subject.trim(),
      body: body.trim(),
      date: new Date().toISOString(),
      folder: "Sent",
      unread: false,
    };

    setMessages((current) => [newMessage, ...current]);
    setFolder("Sent");
    setSearch("");
    setShowCompose(false);
    setSelectedMessageId(newMessage.id);
    setMessageNotice("Message sent in demo mode.");
    setRecipient("");
    setSubject("");
    setBody("");
  };

  const deleteMessage = (message: TeacherMessage) => {
    if (!window.confirm(`Delete "${message.subject}"?`)) return;

    setMessages((current) =>
      current.filter((item) => item.id !== message.id)
    );

    setSelectedMessageId(null);
    setMessageNotice("Message deleted.");
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <MessageSquare size={18} />
              Teacher Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Messages
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Communicate with parents, students, and school administration.
            </p>
          </div>

          <button
            onClick={openCompose}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Compose Message
          </button>
        </div>

        {messageNotice && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"
          >
            <span>{messageNotice}</span>
            <button
              onClick={() => setMessageNotice("")}
              aria-label="Dismiss message"
              className="rounded-md p-1 hover:bg-indigo-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Inbox Messages"
            value={messages.filter((m) => m.folder === "Inbox").length}
            icon={<Inbox size={20} />}
            tone="indigo"
          />
          <StatCard
            title="Unread Messages"
            value={inboxUnread}
            icon={<Mail size={20} />}
            tone="amber"
          />
          <StatCard
            title="Sent Messages"
            value={messages.filter((m) => m.folder === "Sent").length}
            icon={<Send size={20} />}
            tone="green"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setFolder("Inbox");
                  setSelectedMessageId(null);
                  setSearch("");
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  folder === "Inbox"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Inbox size={17} />
                Inbox
                {inboxUnread > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      folder === "Inbox"
                        ? "bg-white/20 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {inboxUnread}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setFolder("Sent");
                  setSelectedMessageId(null);
                  setSearch("");
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  folder === "Sent"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Send size={17} />
                Sent
              </button>
            </div>

            <div className="relative max-w-xl">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sender, subject or message..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {selectedMessage ? (
            <div className="p-4 sm:p-6">
              <button
                onClick={() => setSelectedMessageId(null)}
                className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                <ArrowLeft size={17} />
                Back to {folder}
              </button>

              <div className="rounded-2xl border border-slate-200 p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedMessage.subject}
                    </h2>
                    <div className="mt-4 flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-700">
                        {(folder === "Inbox"
                          ? selectedMessage.sender
                          : selectedMessage.recipient
                        )
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {folder === "Inbox"
                            ? selectedMessage.sender
                            : "Teacher"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          To:{" "}
                          {folder === "Inbox"
                            ? "Teacher"
                            : selectedMessage.recipient}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(selectedMessage.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMessage(selectedMessage)}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

                <div className="my-6 border-t border-slate-100" />

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {selectedMessage.body}
                </p>

                {folder === "Inbox" && (
                  <div className="mt-7 border-t border-slate-100 pt-5">
                    <button
                      onClick={() => {
                        setRecipient(selectedMessage.sender);
                        setSubject(`Re: ${selectedMessage.subject}`);
                        setBody("");
                        setShowCompose(true);
                        setSelectedMessageId(null);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      <Send size={16} />
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {folderMessages.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <MailOpen
                    size={34}
                    className="mx-auto mb-3 text-slate-300"
                  />
                  <p className="font-semibold text-slate-700">
                    No messages found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try another search or compose a new message.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {folderMessages.map((message) => {
                    const displayName =
                      folder === "Inbox"
                        ? message.sender
                        : message.recipient;

                    return (
                      <button
                        type="button"
                        key={message.id}
                        onClick={() => openMessage(message)}
                        className={`flex w-full flex-col gap-3 px-4 py-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-start sm:px-6 ${
                          message.unread && folder === "Inbox"
                            ? "bg-indigo-50/40"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex shrink-0 items-center gap-3 sm:w-52">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">
                            {displayName
                              .split(" ")
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`truncate text-sm ${
                                message.unread && folder === "Inbox"
                                  ? "font-bold text-slate-900"
                                  : "font-medium text-slate-700"
                              }`}
                            >
                              {displayName}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(message.date)}
                            </p>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 sm:pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-sm ${
                                message.unread && folder === "Inbox"
                                  ? "font-bold text-slate-900"
                                  : "font-semibold text-slate-700"
                              }`}
                            >
                              {message.subject}
                            </span>
                            {message.unread && folder === "Inbox" && (
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                Unread
                              </span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                            {message.body}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 self-end text-xs text-slate-400 sm:self-center">
                          {message.unread && folder === "Inbox" ? (
                            <Mail size={16} className="text-indigo-600" />
                          ) : (
                            <CheckCheck size={16} />
                          )}
                          <Clock3 size={14} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500 sm:px-6">
            Demo mode: messages are stored only in this page's state.
          </div>
        </section>

        {showCompose && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowCompose(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="compose-title"
              className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2
                    id="compose-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    Compose Message
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Write a message to a parent, student, or administrator.
                  </p>
                </div>
                <button
                  onClick={() => setShowCompose(false)}
                  aria-label="Close compose window"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={sendMessage} className="space-y-4 p-5 sm:p-6">
                <div>
                  <label
                    htmlFor="message-recipient"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Recipient *
                  </label>
                  <input
                    id="message-recipient"
                    required
                    maxLength={150}
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    placeholder="Enter recipient name or email"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message-subject"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Subject *
                  </label>
                  <input
                    id="message-subject"
                    required
                    maxLength={180}
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Enter message subject"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message-body"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message-body"
                    required
                    rows={6}
                    maxLength={5000}
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Write your message..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  tone: "indigo" | "amber" | "green";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
