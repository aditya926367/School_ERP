import { useMemo, useState } from "react";
import {
  ReceiptText,
  IndianRupee,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Eye,
  X,
  CalendarDays,
  CreditCard,
  Wallet,
  Filter,
} from "lucide-react";

type PaymentStatus = "Paid" | "Pending" | "Failed";

type Payment = {
  id: string;
  receiptNo: string;
  student: string;
  description: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: PaymentStatus;
  transactionId: string;
};

const initialPayments: Payment[] = [
  {
    id: "1",
    receiptNo: "REC-2026-1042",
    student: "Aarav Sharma",
    description: "Tuition Fee - October",
    amount: 5000,
    paymentDate: "2026-10-05",
    method: "UPI",
    status: "Paid",
    transactionId: "UPI928371645",
  },
  {
    id: "2",
    receiptNo: "REC-2026-1018",
    student: "Aarav Sharma",
    description: "Transport Fee - October",
    amount: 1500,
    paymentDate: "2026-10-03",
    method: "Net Banking",
    status: "Paid",
    transactionId: "NB827364519",
  },
  {
    id: "3",
    receiptNo: "REC-2026-0981",
    student: "Anaya Sharma",
    description: "Tuition Fee - October",
    amount: 4500,
    paymentDate: "2026-10-01",
    method: "Debit Card",
    status: "Paid",
    transactionId: "DC746281903",
  },
  {
    id: "4",
    receiptNo: "REC-2026-0960",
    student: "Aarav Sharma",
    description: "Examination Fee",
    amount: 1200,
    paymentDate: "2026-09-25",
    method: "UPI",
    status: "Pending",
    transactionId: "UPI_PENDING_104",
  },
  {
    id: "5",
    receiptNo: "REC-2026-0912",
    student: "Anaya Sharma",
    description: "Transport Fee - September",
    amount: 1500,
    paymentDate: "2026-09-10",
    method: "Credit Card",
    status: "Failed",
    transactionId: "CC572819364",
  },
  {
    id: "6",
    receiptNo: "REC-2026-0845",
    student: "Aarav Sharma",
    description: "Tuition Fee - September",
    amount: 5000,
    paymentDate: "2026-09-05",
    method: "UPI",
    status: "Paid",
    transactionId: "UPI625193847",
  },
  {
    id: "7",
    receiptNo: "REC-2026-0802",
    student: "Anaya Sharma",
    description: "Tuition Fee - September",
    amount: 4500,
    paymentDate: "2026-09-03",
    method: "Net Banking",
    status: "Paid",
    transactionId: "NB519283746",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function downloadCsv(payments: Payment[]) {
  const headers = [
    "Receipt Number",
    "Student",
    "Description",
    "Amount",
    "Payment Date",
    "Payment Method",
    "Status",
    "Transaction ID",
  ];

  const escapeCsv = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const rows = payments.map((payment) =>
    [
      payment.receiptNo,
      payment.student,
      payment.description,
      payment.amount,
      payment.paymentDate,
      payment.method,
      payment.status,
      payment.transactionId,
    ]
      .map(escapeCsv)
      .join(","),
  );

  const csv = [headers.map(escapeCsv).join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "parent-payment-history.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function ParentPaymentHistory() {
  const [payments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [studentFilter, setStudentFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
    null,
  );

  const paidPayments = payments.filter(
    (payment) => payment.status === "Paid",
  );

  const totalPaid = paidPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((total, payment) => total + payment.amount, 0);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        payment.receiptNo.toLowerCase().includes(query) ||
        payment.student.toLowerCase().includes(query) ||
        payment.description.toLowerCase().includes(query) ||
        payment.transactionId.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      const matchesStudent =
        studentFilter === "All" || payment.student === studentFilter;

      return matchesSearch && matchesStatus && matchesStudent;
    });
  }, [payments, search, statusFilter, studentFilter]);

  function downloadReceipt(payment: Payment) {
    const receipt = [
      "SCHOOL ERP - PAYMENT RECEIPT",
      "----------------------------------------",
      `Receipt Number: ${payment.receiptNo}`,
      `Student: ${payment.student}`,
      `Description: ${payment.description}`,
      `Amount: ${formatCurrency(payment.amount)}`,
      `Payment Date: ${formatDate(payment.paymentDate)}`,
      `Payment Method: ${payment.method}`,
      `Status: ${payment.status}`,
      `Transaction ID: ${payment.transactionId}`,
      "----------------------------------------",
      "This is a demo receipt generated by the School ERP frontend.",
    ].join("\n");

    const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${payment.receiptNo}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const statusStyle: Record<PaymentStatus, string> = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment History
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review your children's school fee transactions and receipts.
          </p>
        </div>

        <button
          onClick={() => downloadCsv(filteredPayments)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Download size={17} />
          Export History
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(totalPaid)}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Across recorded transactions
              </p>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <CheckCircle2 size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(pendingAmount)}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Awaiting confirmation
              </p>
            </div>
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <Clock size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Successful Transactions</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {paidPayments.length}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Payments marked as paid
              </p>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <ReceiptText size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <h2 className="font-semibold text-gray-900">Filter Transactions</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search receipt, student..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={studentFilter}
            onChange={(event) => setStudentFilter(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Children</option>
            <option value="Aarav Sharma">Aarav Sharma</option>
            <option value="Anaya Sharma">Anaya Sharma</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </section>

      {/* Transactions table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">Transactions</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredPayments.length} transaction(s) found
            </p>
          </div>
          <span className="text-xs text-gray-400">
            Demo records · October–September 2026
          </span>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <ReceiptText size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 font-medium text-gray-700">
              No transactions found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-semibold">Receipt</th>
                  <th className="px-5 py-3 font-semibold">Student / Fee</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-blue-700">
                        {payment.receiptNo}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {payment.transactionId}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {payment.student}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {payment.description}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={15} className="text-gray-400" />
                        {formatDate(payment.paymentDate)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                        {payment.method === "UPI" ? (
                          <Wallet size={16} />
                        ) : (
                          <CreditCard size={16} />
                        )}
                        {payment.method}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[payment.status]}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Receipt details modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Payment Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPayment.receiptNo}
                </p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close payment details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-blue-50 p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600">
                  <IndianRupee size={24} />
                </div>
                <p className="mt-3 text-sm text-gray-500">Transaction Amount</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {formatCurrency(selectedPayment.amount)}
                </p>
                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[selectedPayment.status]}`}
                >
                  {selectedPayment.status}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  ["Student", selectedPayment.student],
                  ["Fee Description", selectedPayment.description],
                  ["Payment Date", formatDate(selectedPayment.paymentDate)],
                  ["Payment Method", selectedPayment.method],
                  ["Transaction ID", selectedPayment.transactionId],
                  ["Receipt Number", selectedPayment.receiptNo],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <span className="text-gray-500">{label}</span>
                    <span className="max-w-[60%] break-words text-right font-medium text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => downloadReceipt(selectedPayment)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Download size={16} />
                  Download Receipt
                </button>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                Demo receipt only; not an official proof of payment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
