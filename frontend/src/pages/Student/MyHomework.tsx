import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Paperclip,
  Search,
  Send,
  Upload,
  UserRound,
  X,
  AlertCircle,
} from "lucide-react";

type HomeworkStatus = "Pending" | "Submitted" | "Overdue";

type Homework = {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  assignedDate: string;
  dueDate: string;
  instructions: string;
  status: HomeworkStatus;
  marks?: number;
  feedback?: string;
  submittedAnswer?: string;
  submittedFileName?: string;
  submittedAt?: string;
};

type FilterType = "All" | HomeworkStatus;

function dateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(dateString: string): string {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitialHomework(): Homework[] {
  return [
    {
      id: 1,
      title: "Algebra Practice Questions",
      subject: "Mathematics",
      teacher: "Mrs. Priya Sharma",
      assignedDate: dateOffset(-3),
      dueDate: dateOffset(2),
      instructions:
        "Solve questions 1–15 from Chapter 4. Show all calculation steps clearly in your answer.",
      status: "Pending",
    },
    {
      id: 2,
      title: "Science: Human Digestive System",
      subject: "Science",
      teacher: "Mr. Rahul Verma",
      assignedDate: dateOffset(-5),
      dueDate: dateOffset(1),
      instructions:
        "Explain the human digestive system and describe the function of its major organs. Include a labelled diagram.",
      status: "Pending",
    },
    {
      id: 3,
      title: "English Essay Writing",
      subject: "English",
      teacher: "Mrs. Neha Singh",
      assignedDate: dateOffset(-7),
      dueDate: dateOffset(-2),
      instructions:
        "Write an essay of 250–300 words on the importance of education. Submit your original work.",
      status: "Overdue",
    },
    {
      id: 4,
      title: "Computer Fundamentals",
      subject: "Computer Science",
      teacher: "Mr. Vikash Gupta",
      assignedDate: dateOffset(-6),
      dueDate: dateOffset(4),
      instructions:
        "Answer the questions on computer hardware, software, input devices, and output devices.",
      status: "Pending",
    },
    {
      id: 5,
      title: "History Chapter Summary",
      subject: "Social Science",
      teacher: "Mr. Amit Kumar",
      assignedDate: dateOffset(-10),
      dueDate: dateOffset(-1),
      instructions:
        "Prepare a short summary of the chapter covered in class, including five key points.",
      status: "Submitted",
      submittedAnswer: "I have completed and reviewed the chapter summary.",
      submittedAt: dateOffset(-2),
    },
  ];
}

function getEffectiveStatus(homework: Homework): HomeworkStatus {
  if (homework.status === "Submitted") return "Submitted";

  if (homework.dueDate < dateOffset(0)) return "Overdue";

  return "Pending";
}

function statusStyles(status: HomeworkStatus): string {
  switch (status) {
    case "Submitted":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "Overdue":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-amber-50 text-amber-700 ring-amber-200";
  }
}

export default function MyHomework() {
  const [homeworkList, setHomeworkList] = useState<Homework[]>(
    getInitialHomework
  );
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [selectedHomework, setSelectedHomework] =
    useState<Homework | null>(null);
  const [answer, setAnswer] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const homeworkWithStatus = useMemo(
    () =>
      homeworkList.map((item) => ({
        ...item,
        status: getEffectiveStatus(item),
      })),
    [homeworkList]
  );

  const counts = useMemo(() => {
    const all = homeworkWithStatus.length;
    const pending = homeworkWithStatus.filter(
      (item) => item.status === "Pending"
    ).length;
    const submitted = homeworkWithStatus.filter(
      (item) => item.status === "Submitted"
    ).length;
    const overdue = homeworkWithStatus.filter(
      (item) => item.status === "Overdue"
    ).length;

    return { all, pending, submitted, overdue };
  }, [homeworkWithStatus]);

  const filteredHomework = homeworkWithStatus.filter((item) => {
    const matchesFilter =
      activeFilter === "All" || item.status === activeFilter;

    const searchText =
      `${item.title} ${item.subject} ${item.teacher}`.toLowerCase();

    return matchesFilter && searchText.includes(search.toLowerCase());
  });

  function openHomework(homework: Homework) {
    setSelectedHomework(homework);
    setAnswer(homework.submittedAnswer ?? "");
    setSelectedFile(null);
    setFormError("");
    setSuccessMessage("");
  }

  function closeHomework() {
    setSelectedHomework(null);
    setSelectedFile(null);
    setFormError("");
    setSuccessMessage("");
  }

  function handleSubmit() {
    if (!selectedHomework) return;

    const current = homeworkWithStatus.find(
      (item) => item.id === selectedHomework.id
    );

    if (current?.status === "Submitted") {
      setFormError("This homework has already been submitted.");
      return;
    }

    if (current?.status === "Overdue") {
      setFormError(
        "The due date has passed. Please contact your teacher to request permission to submit."
      );
      return;
    }

    if (!answer.trim() && !selectedFile) {
      setFormError("Enter your answer or attach a file before submitting.");
      return;
    }

    const submittedAt = dateOffset(0);

    setHomeworkList((previous) =>
      previous.map((item) =>
        item.id === selectedHomework.id
          ? {
              ...item,
              status: "Submitted",
              submittedAnswer: answer.trim(),
              submittedFileName: selectedFile?.name,
              submittedAt,
            }
          : item
      )
    );

    setSelectedHomework((previous) =>
      previous
        ? {
            ...previous,
            status: "Submitted",
            submittedAnswer: answer.trim(),
            submittedFileName: selectedFile?.name,
            submittedAt,
          }
        : null
    );

    setFormError("");
    setSuccessMessage("Homework submitted successfully in this demo.");
  }

  const filters: { label: FilterType; count: number }[] = [
    { label: "All", count: counts.all },
    { label: "Pending", count: counts.pending },
    { label: "Submitted", count: counts.submitted },
    { label: "Overdue", count: counts.overdue },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Homework
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your assignments, track deadlines, and submit your work.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            icon={<BookOpen size={21} />}
            label="Total Homework"
            value={counts.all}
            iconClass="bg-blue-50 text-blue-600"
          />
          <SummaryCard
            icon={<Clock size={21} />}
            label="Pending"
            value={counts.pending}
            iconClass="bg-amber-50 text-amber-600"
          />
          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Submitted"
            value={counts.submitted}
            iconClass="bg-emerald-50 text-emerald-600"
          />
          <SummaryCard
            icon={<AlertCircle size={21} />}
            label="Overdue"
            value={counts.overdue}
            iconClass="bg-red-50 text-red-600"
          />
        </div>

        {/* Search and filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search homework or subjects..."
              aria-label="Search homework"
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filter.label)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter.label
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
                <span className="ml-2 opacity-80">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Homework list */}
        <div className="space-y-4">
          {filteredHomework.map((homework) => (
            <HomeworkCard
              key={homework.id}
              homework={homework}
              onView={() => openHomework(homework)}
            />
          ))}

          {filteredHomework.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <FileText
                size={36}
                className="mx-auto text-gray-400"
              />
              <h2 className="mt-3 font-semibold text-gray-900">
                No homework found
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Try another filter or search term.
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Demo data only. Submissions are kept in page state and are not
          saved to the server. Attachments are selected locally and are not
          uploaded.
        </p>
      </div>

      {/* Homework details and submission modal */}
      {selectedHomework && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onClick={closeHomework}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="homework-dialog-title"
            className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  {selectedHomework.subject}
                </p>
                <h2
                  id="homework-dialog-title"
                  className="mt-1 text-xl font-bold text-gray-900"
                >
                  {selectedHomework.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeHomework}
                aria-label="Close homework details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge
                  status={getEffectiveStatus(selectedHomework)}
                />
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CalendarDays size={16} />
                  Due {formatDate(selectedHomework.dueDate)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                <InfoItem
                  icon={<UserRound size={17} />}
                  label="Assigned by"
                  value={selectedHomework.teacher}
                />
                <InfoItem
                  icon={<CalendarDays size={17} />}
                  label="Assigned on"
                  value={formatDate(selectedHomework.assignedDate)}
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Instructions
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {selectedHomework.instructions}
                </p>
              </div>

              {selectedHomework.status === "Submitted" ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 font-semibold text-emerald-800">
                    <CheckCircle2 size={20} />
                    Homework submitted
                  </div>
                  <p className="mt-2 text-sm text-emerald-800">
                    Submitted on{" "}
                    {selectedHomework.submittedAt
                      ? formatDate(selectedHomework.submittedAt)
                      : "a previous date"}
                  </p>

                  {selectedHomework.submittedAnswer && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        Your answer
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                        {selectedHomework.submittedAnswer}
                      </p>
                    </div>
                  )}

                  {selectedHomework.submittedFileName && (
                    <p className="mt-3 flex items-center gap-2 break-all text-sm text-gray-700">
                      <Paperclip size={16} />
                      {selectedHomework.submittedFileName}
                    </p>
                  )}

                  {selectedHomework.marks !== undefined && (
                    <p className="mt-3 text-sm font-medium text-emerald-800">
                      Marks: {selectedHomework.marks}
                    </p>
                  )}

                  {selectedHomework.feedback && (
                    <p className="mt-2 text-sm text-emerald-800">
                      Teacher feedback: {selectedHomework.feedback}
                    </p>
                  )}
                </div>
              ) : getEffectiveStatus(selectedHomework) === "Overdue" ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="font-semibold text-red-800">
                    Submission deadline has passed
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    Contact your teacher to ask whether a late submission is
                    allowed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="homework-answer"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Your answer
                    </label>
                    <textarea
                      id="homework-answer"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      rows={5}
                      placeholder="Type your answer here..."
                      className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <span className="block text-sm font-semibold text-gray-800">
                      Attach a file (optional)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      onChange={(event) =>
                        setSelectedFile(event.target.files?.[0] ?? null)
                      }
                      className="sr-only"
                      aria-label="Choose homework attachment"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-blue-50"
                    >
                      <Upload size={18} />
                      Choose file
                    </button>

                    {selectedFile && (
                      <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
                        <span className="flex min-w-0 items-center gap-2 text-sm text-gray-700">
                          <Paperclip
                            size={16}
                            className="shrink-0"
                          />
                          <span className="truncate">{selectedFile.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          aria-label="Remove selected file"
                          className="rounded p-1 text-gray-500 hover:bg-gray-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      Accepted: PDF, Word, images, or TXT. The file is not
                      uploaded in this demo.
                    </p>
                  </div>

                  {formError && (
                    <p role="alert" className="text-sm text-red-600">
                      {formError}
                    </p>
                  )}

                  {successMessage && (
                    <p
                      role="status"
                      className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700"
                    >
                      {successMessage}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Send size={17} />
                    Submit Homework
                  </button>
                </div>
              )}

              {successMessage &&
                selectedHomework.status !== "Submitted" && (
                  <p role="status" className="text-sm text-emerald-700">
                    {successMessage}
                  </p>
                )}

              <button
                type="button"
                onClick={closeHomework}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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

function SummaryCard({
  icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className={`rounded-lg p-3 ${iconClass}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: HomeworkStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(status)}`}
    >
      {status}
    </span>
  );
}

function HomeworkCard({
  homework,
  onView,
}: {
  homework: Homework;
  onView: () => void;
}) {
  const status = getEffectiveStatus(homework);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="h-fit rounded-lg bg-blue-50 p-3 text-blue-600">
            <FileText size={23} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {homework.subject}
              </span>
              <StatusBadge status={status} />
            </div>

            <h2 className="mt-2 text-base font-bold text-gray-900 sm:text-lg">
              {homework.title}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <UserRound size={15} />
              {homework.teacher}
            </p>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
              {homework.instructions}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <div className="text-sm">
            <p className="text-xs text-gray-400">Due date</p>
            <p
              className={`mt-1 flex items-center gap-1.5 font-semibold ${
                status === "Overdue" ? "text-red-600" : "text-gray-700"
              }`}
            >
              <CalendarDays size={15} />
              {formatDate(homework.dueDate)}
            </p>
          </div>

          <button
            type="button"
            onClick={onView}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {status === "Submitted" ? "View Submission" : "View / Submit"}
          </button>
        </div>
      </div>
    </article>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-gray-400">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}