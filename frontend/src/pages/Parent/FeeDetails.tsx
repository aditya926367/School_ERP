
import { useMemo, useState } from "react";
import {
  IndianRupee,
  Wallet,
  CheckCircle2,
  Clock,
  Search,
  Download,
  CalendarDays,
  ReceiptText,
} from "lucide-react";

type FeeStatus = "Paid" | "Partial" | "Pending" | "Overdue";

type FeeRecord = {
  id: number;
  title: string;
  description: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  academicYear: string;
};

const demoFees: FeeRecord[] = [
  {
    id: 1,
    title: "Tuition Fee",
    description: "Academic tuition charges",
    totalAmount: 30000,
    paidAmount: 20000,
    dueDate: "2026-10-20",
    academicYear: "2026-27",
  },
  {
    id: 2,
    title: "Transport Fee",
    description: "School bus transportation",
    totalAmount: 12000,
    paidAmount: 6000,
    dueDate: "2026-10-15",
    academicYear: "2026-27",
  },
  {
    id: 3,
    title: "Examination Fee",
    description: "Term examination charges",
    totalAmount: 3000,
    paidAmount: 3000,
    dueDate: "2026-09-15",
    academicYear: "2026-27",
  },
  {
    id: 4,
    title: "Annual Fee",
    description: "Annual school activities and facilities",
    totalAmount: 5000,
    paidAmount: 0,
    dueDate: "2026-11-15",
    academicYear: "2026-27",
  },
  {
    id: 5,
    title: "Library Fee",
    description: "Library and learning resources",
    totalAmount: 1500,
    paidAmount: 1500,
    dueDate: "2026-08-15",
    academicYear: "2026-27",
  },
];

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function getStatus(fee: FeeRecord): FeeStatus {
  if (fee.paidAmount >= fee.totalAmount) return "Paid";

  if (fee.paidAmount > 0) return "Partial";

  const today = new Date().toISOString().slice(0, 10);

  if (fee.dueDate < today) return "Overdue";

  return "Pending";
}

const statusStyles: Record<FeeStatus, string> = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Overdue: "bg-red-100 text-red-700",
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ParentFeeDetails() {
  const [fees] = useState<FeeRecord[]>(demoFees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredFees = useMemo(
    () =>
      fees.filter((fee) => {
        const matchesSearch =
          fee.title.toLowerCase().includes(search.toLowerCase()) ||
          fee.description.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || getStatus(fee) === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [fees, search, statusFilter]
  );

  const totalFees = fees.reduce((sum, fee) => sum + fee.totalAmount, 0);

  const totalPaid = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);

  const totalDue = fees.reduce(
    (sum, fee) => sum + Math.max(0, fee.totalAmount - fee.paidAmount),
    0
  );

  const overdueAmount = fees
    .filter((fee) => getStatus(fee) === "Overdue")
    .reduce(
      (sum, fee) => sum + Math.max(0, fee.totalAmount - fee.paidAmount),
      0
    );

  const exportCSV = () => {
    const headers = [
      "Fee Type",
      "Description",
      "Total Amount",
      "Paid Amount",
      "Outstanding Amount",
      "Due Date",
      "Status",
      "Academic Year",
    ];

    const rows = filteredFees.map((fee) => [
      fee.title,
      fee.description,
      fee.totalAmount,
      fee.paidAmount,
      Math.max(0, fee.totalAmount - fee.paidAmount),
      fee.dueDate,
      getStatus(fee),
      fee.academicYear,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "parent-fee-details.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardClass =
    "rounded-xl border border-gray-200 bg-white p-5 shadow-sm";

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review your child's fee structure, payments and outstanding dues.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202b75]"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Child Information */}
      <div className={`${cardClass} flex flex-col justify-between gap-4 sm:flex-row sm:items-center`}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#27348b] font-bold text-white">
            AS
          </div>

          <div>
            <h2 className="font-semibold text-gray-800">Aarav Sharma</h2>
            <p className="mt-1 text-sm text-gray-500">
              Class 8-A · Admission No. ADM2026001
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays size={18} className="text-[#27348b]" />
          Academic Year: <span className="font-semibold">2026-27</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Total Fees</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {currency(totalFees)}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3 text-[#27348b]">
              <IndianRupee size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {currency(totalPaid)}
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Outstanding Dues</p>
              <p className="mt-2 text-2xl font-bold text-amber-700">
                {currency(totalDue)}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
              <Wallet size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Overdue Amount</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {currency(overdueAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <Clock size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className={cardClass}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-gray-800">Fee Payment Progress</h2>
            <p className="mt-1 text-sm text-gray-500">
              Amount paid against the total fees
            </p>
          </div>

          <span className="text-lg font-bold text-[#27348b]">
            {totalFees ? Math.round((totalPaid / totalFees) * 100) : 0}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#27348b] transition-all"
            style={{
              width: `${totalFees ? Math.min((totalPaid / totalFees) * 100, 100) : 0}%`,
            }}
          />
        </div>

        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
          <span>Paid: {currency(totalPaid)}</span>
          <span>Remaining: {currency(totalDue)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className={cardClass}>
        <h2 className="mb-4 font-semibold text-gray-800">Filter Fees</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search Fee
            </label>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by fee type or description"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fee Details Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <ReceiptText size={21} className="text-[#27348b]" />
            <div>
              <h2 className="font-semibold text-gray-800">Fee Breakdown</h2>
              <p className="mt-1 text-xs text-gray-500">
                {filteredFees.length} fee record(s) found
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Fee Type</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Paid</th>
                <th className="px-5 py-3 font-semibold">Balance</th>
                <th className="px-5 py-3 font-semibold">Due Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No fee records match your filters.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => {
                  const balance = Math.max(
                    0,
                    fee.totalAmount - fee.paidAmount
                  );
                  const status = getStatus(fee);

                  return (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {fee.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {fee.description}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                        {currency(fee.totalAmount)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium text-green-700">
                        {currency(fee.paidAmount)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                        {currency(balance)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(fee.dueDate)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {filteredFees.length > 0 && (
              <tfoot className="bg-gray-50 font-semibold text-gray-800">
                <tr>
                  <td className="px-5 py-4">Filtered Total</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {currency(
                      filteredFees.reduce(
                        (sum, fee) => sum + fee.totalAmount,
                        0
                      )
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-green-700">
                    {currency(
                      filteredFees.reduce(
                        (sum, fee) => sum + fee.paidAmount,
                        0
                      )
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {currency(
                      filteredFees.reduce(
                        (sum, fee) =>
                          sum + Math.max(0, fee.totalAmount - fee.paidAmount),
                        0
                      )
                    )}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <CalendarDays size={19} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-semibold">Note:</span> This page currently
          displays sample fee information. Actual fee records will be loaded
          from the school's database after backend integration.
        </p>
      </div>
    </div>
  );
}
