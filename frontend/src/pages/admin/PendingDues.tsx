// PendingDues.tsx

import { useMemo, useState } from "react";
import {
  Download,
  IndianRupee,
  Users,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import SummaryCard from "../../components/common/SummaryCard";

type DueStatus = "Overdue" | "Due Soon" | "Upcoming";

type DueRecord = {
  id: number;
  studentId: string;
  studentName: string;
  className: string;
  feeType: string;
  totalFee: number;
  paid: number;
  dueDate: string;
};

const initialDues: DueRecord[] = [
  {
    id: 1,
    studentId: "STU1001",
    studentName: "Aarav Sharma",
    className: "Class 10",
    feeType: "Tuition Fee",
    totalFee: 45000,
    paid: 30000,
    dueDate: "2026-10-05",
  },
  {
    id: 2,
    studentId: "STU1003",
    studentName: "Rahul Kumar",
    className: "Class 9",
    feeType: "Tuition Fee",
    totalFee: 40000,
    paid: 25000,
    dueDate: "2026-10-10",
  },
  {
    id: 3,
    studentId: "STU1004",
    studentName: "Ananya Singh",
    className: "Class 8",
    feeType: "Transport Fee",
    totalFee: 35000,
    paid: 20000,
    dueDate: "2026-10-20",
  },
  {
    id: 4,
    studentId: "STU1005",
    studentName: "Rohan Gupta",
    className: "Class 7",
    feeType: "Annual Fee",
    totalFee: 30000,
    paid: 10000,
    dueDate: "2026-10-15",
  },
  {
    id: 5,
    studentId: "STU1006",
    studentName: "Meera Singh",
    className: "Class 6",
    feeType: "Examination Fee",
    totalFee: 5000,
    paid: 0,
    dueDate: "2026-11-05",
  },
  {
    id: 6,
    studentId: "STU1007",
    studentName: "Kabir Verma",
    className: "Class 9",
    feeType: "Tuition Fee",
    totalFee: 40000,
    paid: 20000,
    dueDate: "2026-10-12",
  },
];

const money = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function getDueStatus(dueDate: string): DueStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${dueDate}T00:00:00`);

  const daysUntilDue = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilDue < 0) return "Overdue";
  if (daysUntilDue <= 7) return "Due Soon";

  return "Upcoming";
}

export default function PendingDues() {
  const [dues] = useState<DueRecord[]>(initialDues);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const filteredDues = useMemo(() => {
    const query = search.trim().toLowerCase();

    return dues.filter((due) => {
      const outstanding = Math.max(0, due.totalFee - due.paid);
      const status = getDueStatus(due.dueDate);

      const matchesSearch = [
        due.studentId,
        due.studentName,
        due.className,
        due.feeType,
      ].some((value) => value.toLowerCase().includes(query));

      return (
        outstanding > 0 &&
        matchesSearch &&
        (classFilter === "All" || due.className === classFilter) &&
        (statusFilter === "All" || status === statusFilter)
      );
    });
  }, [dues, search, classFilter, statusFilter]);

  const totalOutstanding = filteredDues.reduce(
    (sum, due) => sum + Math.max(0, due.totalFee - due.paid),
    0,
  );

  const overdueCount = filteredDues.filter(
    (due) => getDueStatus(due.dueDate) === "Overdue",
  ).length;

  const dueSoonCount = filteredDues.filter(
    (due) => getDueStatus(due.dueDate) === "Due Soon",
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDues.length / pageSize),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedDues = filteredDues.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function exportCSV() {
    const rows = [
      [
        "Student ID",
        "Student Name",
        "Class",
        "Fee Type",
        "Total Fee",
        "Paid",
        "Outstanding",
        "Due Date",
        "Status",
      ],
      ...filteredDues.map((due) => [
        due.studentId,
        due.studentName,
        due.className,
        due.feeType,
        due.totalFee,
        due.paid,
        Math.max(0, due.totalFee - due.paid),
        due.dueDate,
        getDueStatus(due.dueDate),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pending-fees.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function remindStudent(studentName: string) {
    setMessage(
      `Reminder prepared for ${studentName}. No message was sent; connect an SMS, email, or WhatsApp service to enable delivery.`,
    );
  }

  const columns = [
    {
      key: "student",
      header: "Student",
      render: (due: DueRecord) => (
        <div>
          <p className="font-semibold text-gray-900">{due.studentName}</p>
          <p className="mt-1 text-xs text-gray-500">{due.studentId}</p>
        </div>
      ),
    },
    {
      key: "className",
      header: "Class",
      render: (due: DueRecord) => (
        <span className="text-gray-600">{due.className}</span>
      ),
    },
    {
      key: "feeType",
      header: "Fee Type",
      render: (due: DueRecord) => (
        <span className="text-gray-600">{due.feeType}</span>
      ),
    },
    {
      key: "totalFee",
      header: "Total Fee",
      render: (due: DueRecord) => money(due.totalFee),
    },
    {
      key: "paid",
      header: "Paid",
      render: (due: DueRecord) => (
        <span className="font-medium text-green-700">
          {money(due.paid)}
        </span>
      ),
    },
    {
      key: "outstanding",
      header: "Outstanding",
      render: (due: DueRecord) => (
        <span className="font-semibold text-red-600">
          {money(Math.max(0, due.totalFee - due.paid))}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (due: DueRecord) => (
        <span className="text-gray-600">{due.dueDate}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (due: DueRecord) => {
        const status = getDueStatus(due.dueDate);

        const tone =
          status === "Overdue"
            ? "bg-red-100 text-red-700"
            : status === "Due Soon"
              ? "bg-amber-100 text-amber-700"
              : "bg-green-100 text-green-700";

        return <StatusBadge status={status} className={tone} />;
      },
    },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (due: DueRecord) => (
        <button
          type="button"
          onClick={() => remindStudent(due.studentName)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
        >
          <Send size={14} />
          Remind
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Dues"
        description="Track unpaid student fees and outstanding balances."
        actions={
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Download size={18} />
            Export Dues
          </button>
        }
      />

      {message && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <p>{message}</p>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="font-semibold"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Pending dues summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Outstanding Amount"
          value={money(totalOutstanding)}
          icon={<IndianRupee size={22} />}
          iconClassName="text-red-600"
          iconBackgroundClassName="bg-red-50"
        />

        <SummaryCard
          label="Students With Dues"
          value={filteredDues.length}
          icon={<Users size={22} />}
          iconClassName="text-blue-600"
          iconBackgroundClassName="bg-blue-50"
        />

        <SummaryCard
          label="Overdue Records"
          value={overdueCount}
          icon={<AlertTriangle size={22} />}
          iconClassName="text-red-600"
          iconBackgroundClassName="bg-red-50"
        />

        <SummaryCard
          label="Due Within 7 Days"
          value={dueSoonCount}
          icon={<Clock size={22} />}
          iconClassName="text-amber-600"
          iconBackgroundClassName="bg-amber-50"
        />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm ">
        <h2 className="mb-4 font-semibold text-gray-900">Filter Dues</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-gray-700">
              Search Student
            </span>

            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              placeholder="Name, ID, class or fee type..."
            />
          </label>

          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-gray-700">
              Class
            </span>

            <FilterSelect
              value={classFilter}
              onChange={(value) => {
                setClassFilter(value);
                setCurrentPage(1);
              }}
              placeholder="All Classes"
              options={Array.from(
                { length: 12 },
                (_, index) => `Class ${index + 1}`,
              )}
            />
          </label>

          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-gray-700">
              Due Status
            </span>

            <FilterSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              placeholder="All Statuses"
              options={["Overdue", "Due Soon", "Upcoming"]}
            />
          </label>
        </div>
      </div>

      {/* Pending dues table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-slate-900 shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Students With Pending Fees
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredDues.length} matching records
          </p>
        </div>

        <DataTable
          data={paginatedDues}
          columns={columns}
          rowKey={(due) => due.id}
          tableClassName="min-w-[1000px] text-sm "
          emptyState={
<p className="border-b border-gray-100 px-5 py-12 text-center text-gray-500">              No pending dues match your filters.
            </p>
          }
        />

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filteredDues.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="records"
        />


      </div>
    </div>
  );
}