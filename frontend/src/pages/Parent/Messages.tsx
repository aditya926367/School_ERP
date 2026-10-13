import { useMemo, useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  UserRound,
  Clock,
  Plus,
  ArrowLeft,
  CheckCheck,
} from "lucide-react";

type Message = {
  id: number;
  sender: "parent" | "teacher";
  text: string;
  time: string;
};

type Conversation = {
  id: number;
  teacher: string;
  subject: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: 1,
    teacher: "Priya Sharma",
    subject: "Class Teacher · Class 8-A",
    initials: "PS",
    lastMessage: "Aarav is doing well in class.",
    time: "10:30 AM",
    unread: 1,
    messages: [
      {
        id: 1,
        sender: "teacher",
        text: "Hello! I wanted to share an update about Aarav's progress.",
        time: "10:15 AM",
      },
      {
        id: 2,
        sender: "parent",
        text: "Hello ma'am, please tell me how he is doing in class.",
        time: "10:22 AM",
      },
      {
        id: 3,
        sender: "teacher",
        text: "Aarav is doing well in class. Please encourage him to continue practising Mathematics at home.",
        time: "10:30 AM",
      },
    ],
  },
  {
    id: 2,
    teacher: "Rahul Verma",
    subject: "Mathematics Teacher",
    initials: "RV",
    lastMessage: "Please revise Chapter 5 before the test.",
    time: "Yesterday",
    unread: 0,
    messages: [
      {
        id: 1,
        sender: "teacher",
        text: "The Mathematics test will cover Chapters 4 and 5.",
        time: "Yesterday",
      },
      {
        id: 2,
        sender: "parent",
        text: "Thank you, sir. We will help Aarav prepare.",
        time: "Yesterday",
      },
      {
        id: 3,
        sender: "teacher",
        text: "Please revise Chapter 5 before the test.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    teacher: "Anjali Singh",
    subject: "Science Teacher",
    initials: "AS",
    lastMessage: "The science project is due on Friday.",
    time: "Oct 10",
    unread: 0,
    messages: [
      {
        id: 1,
        sender: "teacher",
        text: "Please remember that the science project is due on Friday.",
        time: "Oct 10",
      },
      {
        id: 2,
        sender: "parent",
        text: "Thank you for informing me. We will complete it on time.",
        time: "Oct 10",
      },
    ],
  },
  {
    id: 4,
    teacher: "School Administration",
    subject: "General Enquiries",
    initials: "SA",
    lastMessage: "Your fee receipt is available.",
    time: "Oct 8",
    unread: 0,
    messages: [
      {
        id: 1,
        sender: "teacher",
        text: "Your latest fee receipt is available in the Fee Details section.",
        time: "Oct 8",
      },
    ],
  },
];

export default function ParentMessages() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newTeacher, setNewTeacher] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newText, setNewText] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return conversations.filter(
      (conversation) =>
        conversation.teacher.toLowerCase().includes(query) ||
        conversation.subject.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query),
    );
  }, [conversations, search]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId,
  );

  const totalUnread = conversations.reduce(
    (total, conversation) => total + conversation.unread,
    0,
  );

  function openConversation(id: number) {
    setSelectedId(id);
    setMobileChatOpen(true);

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: 0 } : conversation,
      ),
    );
  }

  function sendReply() {
    const text = reply.trim();

    if (!text || !selectedConversation) return;

    const message: Message = {
      id: Date.now(),
      sender: "parent",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              lastMessage: text,
              time: "Just now",
              messages: [...conversation.messages, message],
            }
          : conversation,
      ),
    );

    setReply("");
  }

  function startConversation() {
    const teacher = newTeacher.trim();
    const subject = newSubject.trim();
    const text = newText.trim();

    if (!teacher || !subject || !text) return;

    const id = Date.now();

    const conversation: Conversation = {
      id,
      teacher,
      subject,
      initials: teacher
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join(""),
      lastMessage: text,
      time: "Just now",
      unread: 0,
      messages: [
        {
          id,
          sender: "parent",
          text,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };

    setConversations((previous) => [conversation, ...previous]);
    setSelectedId(id);
    setReply("");
    setNewTeacher("");
    setNewSubject("");
    setNewText("");
    setShowNewMessage(false);
    setMobileChatOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Communicate with teachers and school staff.
          </p>
        </div>

        <button
          onClick={() => setShowNewMessage(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          New Message
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Conversation list */}
        <section
          className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${
            mobileChatOpen ? "hidden lg:block" : "block"
          }`}
        >
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
              {totalUnread > 0 && (
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {totalUnread} unread
                </span>
              )}
            </div>

            <div className="relative mt-4">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => openConversation(conversation.id)}
                  className={`flex w-full gap-3 border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 ${
                    selectedId === conversation.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                    {conversation.initials || <UserRound size={20} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {conversation.teacher}
                      </p>
                      <span className="shrink-0 text-xs text-gray-400">
                        {conversation.time}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {conversation.subject}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-gray-600">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs text-white">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Active conversation */}
        <section
          className={`overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2 ${
            mobileChatOpen ? "block" : "hidden lg:block"
          }`}
        >
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-200 p-4">
                <button
                  onClick={() => setMobileChatOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {selectedConversation.initials}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-gray-900">
                    {selectedConversation.teacher}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.subject}
                  </p>
                </div>

                <div className="ml-auto hidden items-center gap-1 text-xs text-green-600 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Conversation
                </div>
              </div>

              <div className="flex h-[420px] flex-col gap-4 overflow-y-auto bg-gray-50 p-4 sm:p-6">
                <div className="mx-auto flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-gray-500 shadow-sm">
                  <Clock size={13} />
                  Conversation history
                </div>

                {selectedConversation.messages.map((message) => {
                  const isParent = message.sender === "parent";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isParent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                          isParent
                            ? "rounded-br-sm bg-blue-600 text-white"
                            : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                          {message.text}
                        </p>
                        <div
                          className={`mt-2 flex items-center justify-end gap-1 text-xs ${
                            isParent ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          {message.time}
                          {isParent && <CheckCheck size={14} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendReply();
                }}
                className="border-t border-gray-200 bg-white p-4"
              >
                <div className="flex items-end gap-3">
                  <textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        sendReply();
                      }
                    }}
                    rows={2}
                    placeholder="Type your message..."
                    className="min-h-[48px] flex-1 resize-none rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="submit"
                    disabled={!reply.trim()}
                    className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={17} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Demo mode: messages are only stored in the current page state.
                </p>
              </form>
            </>
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <MessageSquare size={40} className="text-gray-300" />
              <h3 className="mt-4 font-semibold text-gray-900">
                Select a conversation
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a teacher or staff member to view messages.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* New message modal */}
      {showNewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">New Message</h2>
              <button
                onClick={() => setShowNewMessage(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close new message"
              >
                ×
              </button>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                startConversation();
              }}
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Teacher or Staff Name
                </label>
                <input
                  value={newTeacher}
                  onChange={(event) => setNewTeacher(event.target.value)}
                  required
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  value={newSubject}
                  onChange={(event) => setNewSubject(event.target.value)}
                  required
                  placeholder="e.g. Homework enquiry"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={newText}
                  onChange={(event) => setNewText(event.target.value)}
                  required
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewMessage(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Send size={16} />
                  Create Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
