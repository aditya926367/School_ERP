import {
  ArrowDownLeft,
  ArrowUpRight,
  Barcode,
  BookMarked,
  BookOpen,
  BookPlus,
  CalendarClock,
  ChevronRight,
  CircleAlert,
  Clock3,
  LibraryBig,
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePersistentState } from "../utils/usePersistentState";

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  available: number;
};

type Member = {
  id: string;
  name: string;
  type: "Student" | "Staff";
  className: string;
  booksIssued: number;
  active: boolean;
};

type Transaction = {
  id: number;
  memberId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returned: boolean;
};

type TransactionStatus = "Issued" | "Returned" | "Overdue";

function getStatus(transaction: Transaction): TransactionStatus {
  if (transaction.returned) return "Returned";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(`${transaction.dueDate}T00:00:00`);

  return dueDate < today ? "Overdue" : "Issued";
}

function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDaysOverdue(dueDate: string): number {
  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(due.getTime())) return 0;
  return Math.max(0, Math.floor((today.getTime() - due.getTime()) / 86400000));
}

// -------------------- Quick Actions --------------------

const quickActions = [
  { title: "Issue / Return Book", icon: ArrowDownLeft, path: "/issueReturn" },
  { title: "Book Catalogue", icon: BookOpen, path: "/books" },
  { title: "Library Members", icon: Users, path: "/members" },
  { title: "Acquire New Books", icon: BookPlus, path: "/acquireBook" },
];

// -------------------- Reusable Section Heading --------------------

function SectionHeading({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
        >
          {action}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

// -------------------- Library Dashboard --------------------

export default function LibraryDashboard() {
  const navigate = useNavigate();

  // Use the exact same localStorage keys as the Library Books, Members,
  // and Issue / Return pages so dashboard values stay in sync with them.
  const [books] = usePersistentState<Book[]>(
    "schoolerp:pages_admin_library_books_tsx:books",
    [],
  );
  const [members] = usePersistentState<Member[]>(
    "schoolerp:pages_admin_library_members_tsx:members",
    [],
  );
  const [transactions] = usePersistentState<Transaction[]>(
    "schoolerp:pages_admin_library_issuereturn_tsx:transactions",
    [],
  );

  const totalBookCopies = books.reduce(
    (total, book) => total + (Number(book.copies) || 0),
    0,
  );
  const activeTransactions = transactions.filter(
    (transaction) => !transaction.returned,
  );
  const currentlyIssued = activeTransactions.length;
  const availableCopies = Math.max(0, totalBookCopies - currentlyIssued);
  const overdueTransactions = activeTransactions.filter(
    (transaction) => getStatus(transaction) === "Overdue",
  );

  const memberById = new Map(members.map((member) => [member.id, member]));
  const bookById = new Map(books.map((book) => [book.id, book]));

  const recentActivity = [...transactions]
    .sort((a, b) => {
      const dateDifference =
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      return dateDifference || b.id - a.id;
    })
    .slice(0, 5)
    .map((transaction) => ({
      ...transaction,
      member: memberById.get(transaction.memberId),
      book: bookById.get(transaction.bookId),
      status: getStatus(transaction),
    }));

  const overdueBooks = [...overdueTransactions]
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 5)
    .map((transaction) => ({
      ...transaction,
      member: memberById.get(transaction.memberId),
      book: bookById.get(transaction.bookId),
      daysOverdue: getDaysOverdue(transaction.dueDate),
    }));

  const summaryCards = [
    {
      label: "Total book copies",
      value: totalBookCopies,
      note: "Across all book records",
      icon: LibraryBig,
    },
    {
      label: "Currently issued",
      value: currentlyIssued,
      note: "Books not yet returned",
      icon: BookMarked,
    },
    {
      label: "Available copies",
      value: availableCopies,
      note: "Calculated from total stock and active issues",
      icon: BookOpen,
    },
    {
      label: "Overdue books",
      value: overdueTransactions.length,
      note: "Active issues past their due date",
      icon: Clock3,
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Library Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of library inventory and daily circulation.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {card.value.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{card.note}</p>
                </div>
                <div className="shrink-0 rounded-lg bg-blue-50 p-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                type="button"
                onClick={() => navigate(action.path)}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
              >
                <Icon className="h-5 w-5 shrink-0 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Activity and Overdue Books */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Issue / Return Activity */}
        <section className="min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Issue / Return Activity
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Latest transactions recorded in the library.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/issueReturn")}
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:underline sm:inline-flex"
            >
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Student / Member
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Book
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Issue date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivity.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {row.member?.name || row.memberId}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {row.member?.className || row.member?.type || "Member ID"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.book?.title || row.bookId}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.status === "Returned"
                            ? "bg-emerald-50 text-emerald-700"
                            : row.status === "Overdue"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {row.status === "Returned" ? (
                          <ArrowDownLeft className="mr-1" size={13} />
                        ) : (
                          <ArrowUpRight className="mr-1" size={13} />
                        )}
                        {row.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {formatDate(row.issueDate)}
                    </td>
                  </tr>
                ))}
                {recentActivity.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No issue or return activity yet. Transactions will appear here
                      after a book is issued.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 px-6 py-3 sm:hidden">
            <button
              type="button"
              onClick={() => navigate("/issueReturn")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
            >
              View all transactions
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* Overdue Books */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Overdue Books"
            action="View all"
            onAction={() => navigate("/issueReturn")}
          />
          <div className="divide-y divide-gray-200">
            {overdueBooks.map((row) => (
              <div
                key={row.id}
                className="flex gap-3 py-4 first:pt-1 last:pb-1"
              >
                <div className="h-fit shrink-0 rounded-lg bg-blue-50 p-2">
                  <CircleAlert className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {row.member?.name || row.memberId}
                    </p>
                    <span className="text-xs font-semibold text-red-600">
                      {row.daysOverdue} {row.daysOverdue === 1 ? "day" : "days"} overdue
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {row.book?.title || row.bookId}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {row.member?.className || row.member?.type || "Member"} · Due{" "}
                    {formatDate(row.dueDate)}
                  </p>
                </div>
              </div>
            ))}
            {overdueBooks.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">
                No overdue books. All active issues are within their due dates.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate("/fines")}
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white"
          >
            <ReceiptText size={17} />
            Manage Fines
          </button>
        </section>
      </div>

      {/* Library Tools */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeading title="Library Tools" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => navigate("/stockVerification")}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
          >
            <PackageCheck className="h-5 w-5 shrink-0 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Stock Verification
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/barcodeGenerator")}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
          >
            <Barcode className="h-5 w-5 shrink-0 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Barcode Generator
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/librarySetup")}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
          >
            <CalendarClock className="h-5 w-5 shrink-0 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Library Setup
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/acquireBook")}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
          >
            <ShoppingCart className="h-5 w-5 shrink-0 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Purchase / Add Stock
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
