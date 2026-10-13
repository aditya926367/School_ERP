
import { useMemo, useState } from "react";
import {
  Search,
  Download,
  IndianRupee,
  Users,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react";

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
  const [dues] = useState(initialDues);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");

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
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Dues</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track unpaid student fees and outstanding balances.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Download size={18} />
          Export Dues
        </button>
      </div>

      {message && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <p>{message}</p>
          <button
            onClick={() => setMessage("")}
            className="font-semibold"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Outstanding Amount</p>
            <IndianRupee size={22} className="text-red-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {money(totalOutstanding)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Based on current filters</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Students With Dues</p>
            <Users size={22} className="text-blue-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {filteredDues.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Overdue Records</p>
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {overdueCount}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Due Within 7 Days</p>
            <Clock size={22} className="text-amber-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {dueSoonCount}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">Filter Dues</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-gray-700">
              Search Student
            </span>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, ID, class or fee type..."
                className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm"
              />
            </div>
          </label>

          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-gray-700">
              Class
            </span>
            <select
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
            >
              <option value="All">All Classes</option>
              {Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`).map(
                (className) => (
                  <option key={className}>{className}</option>
                ),
              )}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-gray-700">
              Due Status
            </span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Overdue">Overdue</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">Students With Pending Fees</h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredDues.length} matching records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Fee Type</th>
                <th className="px-5 py-4">Total Fee</th>
                <th className="px-5 py-4">Paid</th>
                <th className="px-5 py-4">Outstanding</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredDues.map((due) => {
                const outstanding = Math.max(0, due.totalFee - due.paid);
                const status = getDueStatus(due.dueDate);

                const badgeClass =
                  status === "Overdue"
                    ? "bg-red-100 text-red-700"
                    : status === "Due Soon"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700";

                return (
                  <tr key={due.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {due.studentName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{due.studentId}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{due.className}</td>
                    <td className="px-5 py-4 text-gray-600">{due.feeType}</td>
                    <td className="px-5 py-4">{money(due.totalFee)}</td>
                    <td className="px-5 py-4 font-medium text-green-700">
                      {money(due.paid)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-red-600">
                      {money(outstanding)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{due.dueDate}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => remindStudent(due.studentName)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        <Send size={14} />
                        Remind
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredDues.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-500">
                    No pending dues match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="border-t px-5 py-3 text-xs text-gray-500">
          Demo data only. Reminder delivery is not configured, and dues are not loaded from PostgreSQL.
        </p>
      </div>
    </div>
  );
}
