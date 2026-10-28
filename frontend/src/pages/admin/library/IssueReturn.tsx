// src/pages/admin/library/IssueReturn.tsx
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeftRight,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";

import DataTable from "../../../components/common/DataTable";
import FilterSelect from "../../../components/common/FilterSelect";
import PageHeader from "../../../components/common/PageHeader";
import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import StatusBadge from "../../../components/common/StatusBadge";
import SummaryCard from "../../../components/common/SummaryCard";

type Transaction = {
  id: number;
  memberId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returned: boolean;
};

type TransactionStatus = "Issued" | "Returned" | "Overdue";

type TransactionColumn = {
  key: string;
  header: string;
  className?: string;
  render: (transaction: Transaction) => ReactNode;
};

const initialTransactions: Transaction[] = [];

const PAGE_SIZES = [5, 10, 25, 50];

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100";

function getStatus(transaction: Transaction): TransactionStatus {
  if (transaction.returned) return "Returned";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${transaction.dueDate}T00:00:00`);

  return dueDate < today ? "Overdue" : "Issued";
}

export default function IssueReturn() {
  const [transactions, setTransactions] = usePersistentState<Transaction[]>('schoolerp:pages_admin_library_issuereturn_tsx:transactions', []);

  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch = [
        transaction.memberId,
        transaction.bookId,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || getStatus(transaction) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize),
  );

  const safePage = Math.min(page, totalPages);

  const pagedTransactions = filteredTransactions.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const activeCount = transactions.filter(
    (transaction) => !transaction.returned,
  ).length;

  const returnedCount = transactions.filter(
    (transaction) => transaction.returned,
  ).length;

  const overdueCount = transactions.filter(
    (transaction) => getStatus(transaction) === "Overdue",
  ).length;

  function handleIssue() {
    setFormError("");
    setNotice("");

    if (!memberId.trim() || !bookId.trim() || !dueDate) {
      setFormError("Please fill in the member ID, book ID, and due date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(`${dueDate}T00:00:00`) < today) {
      setFormError("Due date cannot be in the past.");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      memberId: memberId.trim(),
      bookId: bookId.trim(),
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate,
      returned: false,
    };

    setTransactions((current) => [newTransaction, ...current]);
    setPage(1);
    setMemberId("");
    setBookId("");
    setDueDate("");
    setNotice("Book issue recorded for this page session.");
  }

  function handleReturn(id: number) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id
          ? { ...transaction, returned: true }
          : transaction,
      ),
    );

    setNotice("Book return recorded for this page session.");
  }

  const columns: TransactionColumn[] = [
    {
      key: "memberId",
      header: "Member ID",
      render: (transaction) => (
        <span className="font-semibold text-gray-900">
          {transaction.memberId}
        </span>
      ),
    },
    {
      key: "bookId",
      header: "Book ID",
      render: (transaction) => (
        <span className="font-medium text-indigo-700">
          {transaction.bookId}
        </span>
      ),
    },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (transaction) => transaction.issueDate,
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (transaction) => transaction.dueDate,
    },
    {
  key: "status",
  header: "Status",
  className: "w-[140px] whitespace-nowrap px-3",
  render: (transaction) => (
    <StatusBadge status={getStatus(transaction)} />
  ),
},
{
  key: "action",
  header: "Action",
  className: "w-[140px] whitespace-nowrap text-right px-3",
  render: (transaction) =>
    transaction.returned ? (
      <span className="text-xs text-gray-400">
        Completed
      </span>
    ) : (
      <button
        type="button"
        onClick={() => handleReturn(transaction.id)}
        className="inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-lg border border-[#27348b] bg-white px-3 py-2 text-xs font-semibold text-[#27348b] transition-colors hover:bg-[#27348b] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#27348b] focus:ring-offset-1"
      >
        Mark Returned
      </button>
    ),
},
  ];

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        title="Issue / Return"
        description="Record book issues, monitor due dates, and mark books as returned."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Active Issues"
          value={activeCount}
          icon={<ArrowLeftRight size={21} />}
          iconClassName="text-indigo-700"
          iconBackgroundClassName="bg-indigo-50"
        />

        <SummaryCard
          label="Books Returned"
          value={returnedCount}
          icon={<CheckCircle2 size={21} />}
          iconClassName="text-green-700"
          iconBackgroundClassName="bg-green-50"
        />

        <SummaryCard
          label="Overdue Issues"
          value={overdueCount}
          icon={<Clock size={21} />}
          iconClassName="text-red-700"
          iconBackgroundClassName="bg-red-50"
        />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
            <BookOpenCheck size={20} />
          </span>

          <div>
            <h2 className="font-semibold text-gray-900">Issue a Book</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Enter the member, book, and expected return date.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <label
              htmlFor="memberId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Member ID
            </label>
            <input
              id="memberId"
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              placeholder="e.g. M101"
              className={inputStyle}
            />
          </div>

          <div className="min-w-0">
            <label
              htmlFor="bookId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Book ID
            </label>
            <input
              id="bookId"
              value={bookId}
              onChange={(event) => setBookId(event.target.value)}
              placeholder="e.g. B001"
              className={inputStyle}
            />
          </div>

          <div className="min-w-0">
            <label
              htmlFor="dueDate"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => setDueDate(event.target.value)}
              className={inputStyle}
            />
          </div>

          <button
            type="button"
            onClick={handleIssue}
            className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1f2a73] focus:outline-none focus:ring-2 focus:ring-[#27348b] focus:ring-offset-2 sm:mt-0 sm:w-auto"
          >
            <Plus size={17} />
            Issue Book
          </button>
        </div>

        {formError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {formError}
          </p>
        )}
      </section>

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
        >
          {notice}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Issue History</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredTransactions.length} matching records
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[520px]">
            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Search transactions
              </label>
              <SearchBar
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                placeholder="Search member ID or book ID..."
              />
            </div>

            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Filter by status
              </label>
              <FilterSelect
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
                options={[
                  { label: "All statuses", value: "All" },
                  "Issued",
                  "Returned",
                  "Overdue",
                ]}
                placeholder="All statuses"
              />
            </div>
          </div>
        </div>

        <DataTable<Transaction>
          data={pagedTransactions}
          columns={columns}
          rowKey={(transaction) => transaction.id}
          tableClassName="min-w-[800px] text-sm text-gray-800"
          emptyState="No records match your search or filter."
        />

        <div className="border-t border-gray-200 px-5 py-3">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredTransactions.length}
            pageSize={pageSize}
            onPageChange={(nextPage) => setPage(nextPage)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            pageSizes={PAGE_SIZES}
            itemLabel="records"
          />
        </div>

        <p className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          Sample data only. Changes are kept in React state for this page
          session and are not saved to the database.
        </p>
      </section>
    </div>
  );
}
