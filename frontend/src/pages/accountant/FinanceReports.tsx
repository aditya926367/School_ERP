
import { useMemo, useState } from "react";
import Pagination from "../../components/common/Pagination";
import {
  Banknote,
  Download,
  Search,
  TrendingUp,
  Wallet,
  Clock,
  Users,
  CalendarDays,
} from "lucide-react";

type Payment = {
  id: number;
  receiptNo: string;
  studentName: string;
  admissionNo: string;
  className: string;
  category: string;
  amount: number;
  mode: "Cash" | "UPI" | "Card" | "Bank Transfer";
  date: string;
  status: "Paid" | "Partial" | "Refunded";
};

const demoPayments: Payment[] = [
  {
    id: 1,
    receiptNo: "REC-2026-001",
    studentName: "Aarav Sharma",
    admissionNo: "ADM001",
    className: "Class 10",
    category: "Tuition Fee",
    amount: 12000,
    mode: "UPI",
    date: "2026-10-12",
    status: "Paid",
  },
  {
    id: 2,
    receiptNo: "REC-2026-002",
    studentName: "Ananya Singh",
    admissionNo: "ADM002",
    className: "Class 9",
    category: "Transport Fee",
    amount: 3500,
    mode: "Cash",
    date: "2026-10-12",
    status: "Paid",
  },
  {
    id: 3,
    receiptNo: "REC-2026-003",
    studentName: "Rohan Kumar",
    admissionNo: "ADM003",
    className: "Class 10",
    category: "Tuition Fee",
    amount: 6000,
    mode: "Bank Transfer",
    date: "2026-10-11",
    status: "Partial",
  },
  {
    id: 4,
    receiptNo: "REC-2026-004",
    studentName: "Priya Verma",
    admissionNo: "ADM004",
    className: "Class 8",
    category: "Exam Fee",
    amount: 1500,
    mode: "UPI",
    date: "2026-10-10",
    status: "Paid",
  },
  {
    id: 5,
    receiptNo: "REC-2026-005",
    studentName: "Kabir Gupta",
    admissionNo: "ADM005",
    className: "Class 9",
    category: "Tuition Fee",
    amount: 8000,
    mode: "Card",
    date: "2026-10-09",
    status: "Refunded",
  },
  {
    id: 6,
    receiptNo: "REC-2026-006",
    studentName: "Meera Patel",
    admissionNo: "ADM006",
    className: "Class 8",
    category: "Tuition Fee",
    amount: 10000,
    mode: "UPI",
    date: "2026-10-08",
    status: "Paid",
  },
  {
    id: 7,
    receiptNo: "REC-2026-007",
    studentName: "Dev Raj",
    admissionNo: "ADM007",
    className: "Class 10",
    category: "Transport Fee",
    amount: 2500,
    mode: "Cash",
    date: "2026-10-07",
    status: "Paid",
  },
  {
    id: 8,
    receiptNo: "REC-2026-008",
    studentName: "Ishita Das",
    admissionNo: "ADM008",
    className: "Class 9",
    category: "Exam Fee",
    amount: 1800,
    mode: "UPI",
    date: "2026-10-06",
    status: "Partial",
  },
];

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const today = new Date().toISOString().slice(0, 10);

export default function FinanceReports() {
  const [payments] = useState<Payment[]>(demoPayments);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("2026-10-01");
  const [toDate, setToDate] = useState(today);
  const [classFilter, setClassFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.studentName.toLowerCase().includes(search.toLowerCase()) ||
        payment.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
        payment.admissionNo.toLowerCase().includes(search.toLowerCase());

      const matchesDate =
        (!fromDate || payment.date >= fromDate) &&
        (!toDate || payment.date <= toDate);

      const matchesClass =
        classFilter === "All" || payment.className === classFilter;

      const matchesMode =
        modeFilter === "All" || payment.mode === modeFilter;

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      return (
        matchesSearch &&
        matchesDate &&
        matchesClass &&
        matchesMode &&
        matchesStatus
      );
    });
  }, [
    payments,
    search,
    fromDate,
    toDate,
    classFilter,
    modeFilter,
    statusFilter,
  ]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visiblePayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalCollected = filteredPayments
    .filter((payment) => payment.status !== "Refunded")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const refundedAmount = filteredPayments
    .filter((payment) => payment.status === "Refunded")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const netCollection = totalCollected - refundedAmount;

  const paymentCount = filteredPayments.length;
  const studentCount = new Set(
    filteredPayments.map((payment) => payment.admissionNo)
  ).size;

  const classTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    filteredPayments.forEach((payment) => {
      if (payment.status !== "Refunded") {
        totals[payment.className] =
          (totals[payment.className] || 0) + payment.amount;
      }
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [filteredPayments]);

  const modeTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    filteredPayments.forEach((payment) => {
      if (payment.status !== "Refunded") {
        totals[payment.mode] =
          (totals[payment.mode] || 0) + payment.amount;
      }
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [filteredPayments]);

  const exportCSV = () => {
    const headers = [
      "Receipt No",
      "Student",
      "Admission No",
      "Class",
      "Category",
      "Amount",
      "Payment Mode",
      "Date",
      "Status",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.receiptNo,
      payment.studentName,
      payment.admissionNo,
      payment.className,
      payment.category,
      payment.amount,
      payment.mode,
      payment.date,
      payment.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "school-finance-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm";
  const labelClass = "mb-1 block text-sm font-medium text-gray-600";
  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Finance Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review fee collections, refunds and payment trends.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white "
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className={cardClass}>
        <h2 className="mb-4 font-semibold text-gray-800">
          Report Filters
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Search</label>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Student, admission or receipt..."
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>From Date</label>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>To Date</label>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Class</label>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              <option value="All">All Classes</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Payment Mode</label>
            <select
              value={modeFilter}
              onChange={(e) => {
                setModeFilter(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              <option value="All">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Payment Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Collection</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {currency(netCollection)}
              </p>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Refunded Amount</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {currency(refundedAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-red-100 p-3 text-red-700">
              <Wallet size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {paymentCount}
              </p>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <Banknote size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Students Included</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {studentCount}
              </p>
            </div>
            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
              <Users size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Collection Breakdown */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className={cardClass}>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
            <CalendarDays size={19} className="text-blue-600" />
            Collection by Class
          </h2>

          {classTotals.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No collection data for the selected filters.
            </p>
          ) : (
            <div className="space-y-5">
              {classTotals.map(([className, amount]) => {
                const maximum = Math.max(
                  ...classTotals.map((item) => item[1])
                );
                const percentage = maximum
                  ? (amount / maximum) * 100
                  : 0;

                return (
                  <div key={className}>
                    <div className="mb-2 flex justify-between gap-3 text-sm">
                      <span className="font-medium text-gray-700">
                        {className}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {currency(amount)}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
            <Clock size={19} className="text-green-600" />
            Collection by Payment Mode
          </h2>

          {modeTotals.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No collection data for the selected filters.
            </p>
          ) : (
            <div className="space-y-5">
              {modeTotals.map(([mode, amount]) => {
                const total = modeTotals.reduce(
                  (sum, item) => sum + item[1],
                  0
                );
                const percentage = total ? (amount / total) * 100 : 0;

                return (
                  <div key={mode}>
                    <div className="mb-2 flex justify-between gap-3 text-sm">
                      <span className="font-medium text-gray-700">
                        {mode}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {currency(amount)}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-green-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-800">
              Transaction Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredPayments.length} transaction(s) found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Receipt</th>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Class</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Mode</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                visiblePayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">
                      {payment.receiptNo}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">
                        {payment.studentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.admissionNo}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {payment.className}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {payment.category}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {currency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {payment.mode}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {payment.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          payment.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "Partial"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPayments.length}
          pageSize={pageSize}
          onPageChange={setPage}
          itemLabel="transactions"
        />
      </div>
    </div>
  );
}
