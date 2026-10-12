
import { useMemo, useState } from "react";
import {
  Mail,
  MailOpen,
  Search,
  Send,
  Inbox,
  Star,
  Plus,
  ArrowLeft,
  X,
  Paperclip,
  Clock,
  User,
  CheckCheck,
  MessageSquare,
} from "lucide-react";

type MessageStatus = "Unread" | "Read";
type MessageFolder = "Inbox" | "Sent";

type SchoolMessage = {
  id: number;
  sender: string;
  recipient: string;
  role: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  status: MessageStatus;
  folder: MessageFolder;
  starred: boolean;
};

const initialMessages: SchoolMessage[] = [
  {
    id: 1,
    sender: "Priya Sharma",
    recipient: "Aditya Raj",
    role: "Class Teacher",
    subject: "Tomorrow's Mathematics Assignment",
    message:
      "Dear Aditya,\n\nPlease complete Exercise 5.2 from your Mathematics textbook before tomorrow's class. Focus especially on questions 4 to 10.\n\nIf you have any doubts, please bring them to the next class.\n\nRegards,\nPriya Sharma",
    date: "October 12, 2026",
    time: "10:30 AM",
    status: "Unread",
    folder: "Inbox",
    starred: true,
  },
  {
    id: 2,
    sender: "Examination Department",
    recipient: "Aditya Raj",
    role: "School Administration",
    subject: "Mid-Term Examination Results",
    message:
      "Dear Student,\n\nYour mid-term examination results have been published. Please visit the My Results section of the student portal to review your marks.\n\nContact the examination department if you have any questions.",
    date: "October 10, 2026",
    time: "09:15 AM",
    status: "Unread",
    folder: "Inbox",
    starred: false,
  },
  {
    id: 3,
    sender: "Rahul Verma",
    recipient: "Aditya Raj",
    role: "Class Teacher",
    subject: "Science Project Submission",
    message:
      "Please submit your science project according to the schedule shared in class. Remember to include your name, class, and project title.",
    date: "October 9, 2026",
    time: "01:20 PM",
    status: "Read",
    folder: "Inbox",
    starred: false,
  },
  {
    id: 4,
    sender: "Aditya Raj",
    recipient: "Priya Sharma",
    role: "Sent message",
    subject: "Doubt Regarding Homework",
    message:
      "Dear Ma'am,\n\nI have a doubt regarding question 6 of the Mathematics homework. Could you please explain the steps required to solve it?\n\nThank you.",
    date: "October 8, 2026",
    time: "04:10 PM",
    status: "Read",
    folder: "Sent",
    starred: false,
  },
];

export default function Messages() {
  const [messages, setMessages] = useState(initialMessages);
  const [folder, setFolder] = useState<MessageFolder>("Inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] =
    useState<SchoolMessage | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [filter, setFilter] = useState<"All" | "Unread" | "Starred">("All");
  const [notice, setNotice] = useState("");

  const inboxCount = messages.filter(
    (message) => message.folder === "Inbox" && message.status === "Unread"
  ).length;

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      if (message.folder !== folder) return false;

      const query = searchTerm.trim().toLowerCase();

      const matchesSearch =
        message.subject.toLowerCase().includes(query) ||
        message.sender.toLowerCase().includes(query) ||
        message.recipient.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "Unread" && message.status === "Unread") ||
        (filter === "Starred" && message.starred);

      return matchesSearch && matchesFilter;
    });
  }, [messages, folder, searchTerm, filter]);

  const openMessage = (message: SchoolMessage) => {
    setSelectedMessage(message);
    setNotice("");

    if (message.folder === "Inbox" && message.status === "Unread") {
      setMessages((previous) =>
        previous.map((item) =>
          item.id === message.id ? { ...item, status: "Read" } : item
        )
      );

      setSelectedMessage({ ...message, status: "Read" });
    }
  };

  const toggleStar = (id: number) => {
    setMessages((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );

    setSelectedMessage((previous) =>
      previous?.id === id
        ? { ...previous, starred: !previous.starred }
        : previous
    );
  };

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newMessage: SchoolMessage = {
      id: Date.now(),
      sender: "Aditya Raj",
      recipient: recipient.trim(),
      role: "Student",
      subject: subject.trim(),
      message: messageBody.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Read",
      folder: "Sent",
      starred: false,
    };

    setMessages((previous) => [newMessage, ...previous]);
    setFolder("Sent");
    setFilter("All");
    setSearchTerm("");
    setShowCompose(false);
    setSelectedMessage(newMessage);
    setRecipient("");
    setSubject("");
    setMessageBody("");
    setNotice("Message saved to Sent in this demo.");
  };

  const markAllAsRead = () => {
    setMessages((previous) =>
      previous.map((message) =>
        message.folder === "Inbox"
          ? { ...message, status: "Read" }
          : message
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Mail size={16} />
            <span>Student Portal</span>
            <span>/</span>
            <span>Messages</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Messages
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Communicate with your teachers and school administration.
          </p>
        </div>

        <button
          onClick={() => {
            setNotice("");
            setShowCompose(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Compose Message
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Inbox Messages"
          value={messages.filter((item) => item.folder === "Inbox").length}
          icon={<Inbox size={21} />}
          color="bg-indigo-100 text-indigo-600"
        />
        <SummaryCard
          title="Unread Messages"
          value={inboxCount}
          icon={<Mail size={21} />}
          color="bg-amber-100 text-amber-600"
        />
        <SummaryCard
          title="Sent Messages"
          value={messages.filter((item) => item.folder === "Sent").length}
          icon={<Send size={21} />}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Mail folders */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <button
            onClick={() => {
              setFolder("Inbox");
              setSelectedMessage(null);
              setFilter("All");
            }}
            className={`mb-2 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
              folder === "Inbox"
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-3">
              <Inbox size={18} />
              Inbox
            </span>
            {inboxCount > 0 && (
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                {inboxCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setFolder("Sent");
              setSelectedMessage(null);
              setFilter("All");
            }}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              folder === "Sent"
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Send size={18} />
            Sent
          </button>

          <div className="my-4 border-t border-gray-100" />

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Filter Messages
          </p>

          {(["All", "Unread", "Starred"] as const).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                filter === value
                  ? "bg-gray-100 font-semibold text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {value === "Starred" ? (
                <Star size={17} />
              ) : value === "Unread" ? (
                <Mail size={17} />
              ) : (
                <MessageSquare size={17} />
              )}
              {value}
            </button>
          ))}

          <button
            onClick={markAllAsRead}
            disabled={inboxCount === 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <CheckCheck size={15} />
            Mark all as read
          </button>
        </aside>

        {/* Inbox or message detail */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {selectedMessage ? (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600"
                >
                  <ArrowLeft size={17} />
                  Back to {folder}
                </button>

                <button
                  onClick={() => toggleStar(selectedMessage.id)}
                  aria-label="Toggle star"
                  className={`rounded-lg p-2 ${
                    selectedMessage.starred
                      ? "text-amber-500"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <Star
                    size={19}
                    fill={selectedMessage.starred ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="p-5 sm:p-7">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {selectedMessage.subject}
                </h2>

                <div className="mt-5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                    {(folder === "Inbox"
                      ? selectedMessage.sender
                      : selectedMessage.recipient
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {folder === "Inbox"
                        ? selectedMessage.sender
                        : "Aditya Raj"}
                    </p>
                    <p className="mt-1 break-all text-xs text-gray-500">
                      {folder === "Inbox"
                        ? `To: ${selectedMessage.recipient}`
                        : `To: ${selectedMessage.recipient}`}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {selectedMessage.date} · {selectedMessage.time}
                    </p>
                  </div>
                </div>

                <div className="mt-7 whitespace-pre-line text-sm leading-7 text-gray-700">
                  {selectedMessage.message}
                </div>

                <div className="mt-8 border-t border-gray-100 pt-5">
                  <button
                    onClick={() => {
                      setRecipient(
                        folder === "Inbox"
                          ? selectedMessage.sender
                          : selectedMessage.recipient
                      );
                      setSubject(`Re: ${selectedMessage.subject}`);
                      setMessageBody("");
                      setSelectedMessage(null);
                      setShowCompose(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <Send size={16} />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:p-5">
                <div>
                  <h2 className="font-bold text-gray-900">{folder}</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {filteredMessages.length} messages
                  </p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search messages..."
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 p-4 transition hover:bg-gray-50 sm:gap-4 sm:p-5 ${
                        message.status === "Unread" &&
                        folder === "Inbox"
                          ? "bg-indigo-50/40"
                          : ""
                      }`}
                    >
                      <button
                        onClick={() => toggleStar(message.id)}
                        aria-label="Toggle star"
                        className={`mt-1 shrink-0 ${
                          message.starred
                            ? "text-amber-500"
                            : "text-gray-300 hover:text-amber-500"
                        }`}
                      >
                        <Star
                          size={17}
                          fill={message.starred ? "currentColor" : "none"}
                        />
                      </button>

                      <button
                        onClick={() => openMessage(message)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                          <p
                            className={`truncate text-sm ${
                              message.status === "Unread" &&
                              folder === "Inbox"
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {folder === "Inbox"
                              ? message.sender
                              : `To: ${message.recipient}`}
                          </p>
                          <span className="shrink-0 text-xs text-gray-400">
                            {message.date}
                          </span>
                        </div>

                        <p
                          className={`mt-1 truncate text-sm ${
                            message.status === "Unread" &&
                            folder === "Inbox"
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {message.subject}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                          {message.message}
                        </p>
                      </button>

                      <div className="mt-1 shrink-0 text-gray-400">
                        {message.status === "Unread" &&
                        folder === "Inbox" ? (
                          <Mail size={17} className="text-indigo-600" />
                        ) : (
                          <MailOpen size={17} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-14 text-center">
                    <div className="mx-auto mb-4 w-fit rounded-full bg-gray-100 p-4 text-gray-400">
                      <Inbox size={28} />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      No messages found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try another search or filter.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Compose message modal */}
      {showCompose && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowCompose(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="compose-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2
                  id="compose-title"
                  className="text-lg font-bold text-gray-900"
                >
                  Compose Message
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Send a message to your teacher or school.
                </p>
              </div>
              <button
                onClick={() => setShowCompose(false)}
                aria-label="Close compose message"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={sendMessage} className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="recipient"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Recipient
                </label>
                <input
                  id="recipient"
                  required
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder="Teacher or department name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Enter message subject"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="messageBody"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="messageBody"
                  required
                  rows={6}
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  placeholder="Write your message..."
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
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
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
