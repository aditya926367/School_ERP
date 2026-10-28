
import {
  ArrowDownLeft,
  ArrowUpRight,
  Barcode,
  BookMarked,
  BookOpen,
  BookPlus,
  CalendarClock,
  ChartNoAxesCombined,
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

// -------------------- Summary Cards --------------------

const summaryCards = [
  {
    label: "Total book copies",
    value: "2,450",
    note: "Across all categories",
    icon: LibraryBig,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    label: "Currently issued",
    value: "386",
    note: "Books with students and staff",
    icon: BookMarked,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    label: "Available copies",
    value: "2,046",
    note: "Ready to issue",
    icon: BookOpen,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    label: "Overdue books",
    value: "18",
    note: "Need follow-up",
    icon: Clock3,
    tone: "bg-blue-50 text-blue-600",
  },
];

// -------------------- Quick Actions --------------------

const quickActions = [
  {
    title: "Issue / Return Book",
    icon: ArrowDownLeft,
    path: "/issueReturns",
  },
  {
    title: "Book Catalogue",
    icon: BookOpen,
    path: "/books",
  },
  {
    title: "Library Members",
    icon: Users,
    path: "/members",
  },
  {
    title: "Acquire New Books",
    icon: BookPlus,
    path: "/acquireBook",
  },
];

// -------------------- Recent Activity --------------------

const recentActivity = [
  {
    member: "Aarav Sharma",
    className: "Class 8-A",
    book: "Wings of Fire",
    action: "Issued",
    date: "Today, 10:15 AM",
    status: "Issued",
  },
  {
    member: "Ananya Singh",
    className: "Class 6-B",
    book: "Gitanjali",
    action: "Returned",
    date: "Today, 09:40 AM",
    status: "Returned",
  },
  {
    member: "Rohan Gupta",
    className: "Class 7-A",
    book: "Concept of Physics",
    action: "Issued",
    date: "Yesterday",
    status: "Issued",
  },
];

// -------------------- Overdue Books --------------------

const overdueBooks = [
  {
    member: "Kabir Mehta",
    className: "Class 9",
    book: "Mathematics — Part I",
    due: "24 Oct 2026",
    days: "3 days overdue",
  },
  {
    member: "Rohan Gupta",
    className: "Class 7",
    book: "The Discovery of India",
    due: "22 Oct 2026",
    days: "5 days overdue",
  },
  {
    member: "Ananya Singh",
    className: "Class 6",
    book: "English Reader",
    due: "20 Oct 2026",
    days: "7 days overdue",
  },
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
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>

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

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Library Dashboard
        </h1>

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
                    {card.value}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {card.note}
                  </p>
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
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

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
                Recently issued and returned books.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/issueReturns")}
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
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {recentActivity.map((row) => (
                  <tr
                    key={`${row.member}-${row.book}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {row.member}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {row.className}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.book}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.status === "Returned"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {row.status === "Returned" ? (
                          <ArrowDownLeft className="mr-1" size={13} />
                        ) : (
                          <ArrowUpRight className="mr-1" size={13} />
                        )}

                        {row.action}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 px-6 py-3 sm:hidden">
            <button
              type="button"
              onClick={() => navigate("/issueReturns")}
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
            onAction={() => navigate("/issueReturns")}
          />

          <div className="divide-y divide-gray-200">
            {overdueBooks.map((row) => (
              <div
                key={`${row.member}-${row.book}`}
                className="flex gap-3 py-4 first:pt-1 last:pb-1"
              >
                <div className="h-fit shrink-0 rounded-lg bg-blue-50 p-2">
                  <CircleAlert className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {row.member}
                    </p>

                    <span className="text-xs font-semibold text-red-600">
                      {row.days}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {row.book}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {row.className} · Due {row.due}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate("/fines")}
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white "
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
