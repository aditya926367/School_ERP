import { useMemo, useState } from "react";
import {
  Download,
  Eye,
  Printer,
  ReceiptText,
  Search,
  X,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";

type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer";

type Receipt = {
  id: number;
  receiptNo: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  mode: PaymentMode;
  date: string;
  status: "Paid" | "Refunded";
};

const initialReceipts: Receipt[] = [
  {
    id: 1,
    receiptNo: "REC-2026-001",
    studentId: "STU1001",
    studentName: "Aarav Sharma",
    className: "Class 10",
    amount: 10000,
    mode: "UPI",
    date: "2026-10-12",
    status: "Paid",
  },
  {
    id: 2,
    receiptNo: "REC-2026-002",
    studentId: "STU1002",
    studentName: "Priya Verma",
    className: "Class 10",
    amount: 15000,
    mode: "Cash",
    date: "2026-10-12",
    status: "Paid",
  },
  {
    id: 3,
    receiptNo: "REC-2026-003",
    studentId: "STU1003",
    studentName: "Rahul Kumar",
    className: "Class 9",
    amount: 5000,
    mode: "Card",
    date: "2026-10-11",
    status: "Paid",
  },
  {
    id: 4,
    receiptNo: "REC-2026-004",
    studentId: "STU1004",
    studentName: "Ananya Singh",
    className: "Class 8",
    amount: 7500,
    mode: "Bank Transfer",
    date: "2026-10-09",
    status: "Paid",
  },
  {
    id: 5,
    receiptNo: "REC-2026-005",
    studentId: "STU1005",
    studentName: "Rohan Gupta",
    className: "Class 7",
    amount: 3000,
    mode: "UPI",
    date: "2026-10-07",
    status: "Paid",
  },
];

const money = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function printReceipt(receipt: Receipt) {
  const printWindow = window.open("", "_blank", "width=700,height=700");

  if (!printWindow) {
    alert("Please allow pop-ups to print the receipt.");
    return;
  }

  const safe = (value: string) =>
    value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Receipt ${safe(receipt.receiptNo)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 32px;
            color: #111827;
          }

          .receipt {
            max-width: 600px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 28px;
          }

          h1, h2 {
            text-align: center;
          }

          .row {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }

          .amount {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 24px 0;
          }

          .note {
            text-align: center;
            color: #555;
            margin-top: 24px;
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <h1>School Fee Receipt</h1>
          <h2>${safe(receipt.receiptNo)}</h2>

          <div class="row">
            <span>Student</span>
            <strong>${safe(receipt.studentName)}</strong>
          </div>

          <div class="row">
            <span>Student ID</span>
            <strong>${safe(receipt.studentId)}</strong>
          </div>

          <div class="row">
            <span>Class</span>
            <strong>${safe(receipt.className)}</strong>
          </div>

          <div class="row">
            <span>Payment Date</span>
            <strong>${safe(receipt.date)}</strong>
          </div>

          <div class="row">
            <span>Payment Mode</span>
            <strong>${safe(receipt.mode)}</strong>
          </div>

          <div class="row">
            <span>Status</span>
            <strong>${safe(receipt.status)}</strong>
          </div>

          <div class="amount">
            Amount Paid: ${money(receipt.amount)}
          </div>

          <p class="note">Thank you for your payment.</p>
        </div>

        <script>
          window.onload = () => window.print();
        <\/script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

export default function Receipts() {
  const [receipts] = useState<Receipt[]>(initialReceipts);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] =
    useState<Receipt | null>(null);

  const pageSize = 5;

  const filteredReceipts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return receipts.filter((receipt) => {
      const matchesSearch = [
        receipt.receiptNo,
        receipt.studentId,
        receipt.studentName,
        receipt.className,
      ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (modeFilter === "All" || receipt.mode === modeFilter) &&
        (statusFilter === "All" || receipt.status === statusFilter)
      );
    });
  }, [receipts, search, modeFilter, statusFilter]);

  const totalCollected = receipts
    .filter((receipt) => receipt.status === "Paid")
    .reduce((sum, receipt) => sum + receipt.amount, 0);

  const totalFilteredAmount = filteredReceipts
    .filter((receipt) => receipt.status === "Paid")
    .reduce((sum, receipt) => sum + receipt.amount, 0);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReceipts.length / pageSize),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedReceipts = filteredReceipts.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function exportCSV() {
    const rows = [
      [
        "Receipt No.",
        "Student ID",
        "Student Name",
        "Class",
        "Amount",
        "Payment Mode",
        "Date",
        "Status",
      ],
      ...filteredReceipts.map((receipt) => [
        receipt.receiptNo,
        receipt.studentId,
        receipt.studentName,
        receipt.className,
        receipt.amount,
        receipt.mode,
        receipt.date,
        receipt.status,
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
    link.download = "payment-receipts.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Receipt Register"
        description="A chronological record of completed fee transactions, with printable receipt copies."
        actions={
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Download size={18} />
            Export Receipts
          </button>
        }
      />

      {/* Receipt overview */}
      <section className="overflow-hidden rounded-2xl bg-white text-slate-900">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <ReceiptText size={18} />
              Receipt register overview
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Total successful payments recorded
            </p>

            <p className="mt-1 text-3xl font-bold tracking-tight">
              {money(totalCollected)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-500">Receipts issued</p>
              <p className="mt-1 text-2xl font-semibold">
                {receipts.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-500">Current results</p>
              <p className="mt-1 text-2xl font-semibold">
                {filteredReceipts.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              placeholder="Find by receipt number, student, ID, or class..."
            />
          </div>

          <div className="w-full sm:w-48">
            <FilterSelect
              value={modeFilter}
              onChange={(value) => {
                setModeFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All payment modes", value: "All" },
                "UPI",
                "Cash",
                "Card",
                "Bank Transfer",
              ]}
              placeholder="All payment modes"
            />
          </div>

          <div className="w-full sm:w-40">
            <FilterSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All statuses", value: "All" },
                "Paid",
                "Refunded",
              ]}
              placeholder="All statuses"
            />
          </div>
        </div>
      </section>

      {/* Receipt ledger */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <ReceiptText size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Issued receipts
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Payment ledger · newest transactions first
              </p>
            </div>
          </div>

          <span className="text-sm text-slate-500">
            {filteredReceipts.length} records
          </span>
        </div>

        <DataTable
          data={paginatedReceipts}
          rowKey={(receipt) => receipt.id}
          tableClassName="min-w-[900px]"
          emptyState="No receipts match your search or filters."
          columns={[
            {
              key: "receiptNo",
              header: "Receipt No.",
              render: (receipt: Receipt) => (
                <span className="inline-flex items-center gap-2 font-semibold text-blue-700">
                  <ReceiptText size={16} className="text-blue-400" />
                  {receipt.receiptNo}
                </span>
              ),
            },
            {
              key: "student",
              header: "Student",
              render: (receipt: Receipt) => (
                <div>
                  <p className="font-medium text-gray-900">
                    {receipt.studentName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {receipt.studentId} · {receipt.className}
                  </p>
                </div>
              ),
            },
            {
              key: "date",
              header: "Payment Date",
              render: (receipt: Receipt) => receipt.date,
            },
            {
              key: "mode",
              header: "Payment Mode",
              render: (receipt: Receipt) => receipt.mode,
            },
            {
              key: "amount",
              header: "Amount",
              render: (receipt: Receipt) => (
                <span className="font-semibold tabular-nums text-slate-900">
                  {money(receipt.amount)}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (receipt: Receipt) => (
                <StatusBadge status={receipt.status} />
              ),
            },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: (receipt: Receipt) => (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(receipt)}
                    title="View receipt"
                    aria-label={`View receipt ${receipt.receiptNo}`}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => printReceipt(receipt)}
                    title="Print receipt"
                    aria-label={`Print receipt ${receipt.receiptNo}`}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <Printer size={17} />
                  </button>
                </div>
              ),
            },
          ]}
        />

        <div className="border-t px-5 py-3">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredReceipts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            itemLabel="receipts"
          />
        </div>

        <p className="border-t px-5 py-3 text-xs text-gray-500">
          Demo data only. Connect this page to your backend API to load actual
          payment records.
        </p>
      </section>

      {/* Receipt details modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Receipt Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedReceipt.receiptNo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close receipt details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {[
                ["Student", selectedReceipt.studentName],
                ["Student ID", selectedReceipt.studentId],
                ["Class", selectedReceipt.className],
                ["Payment Date", selectedReceipt.date],
                ["Payment Mode", selectedReceipt.mode],
                ["Status", selectedReceipt.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b pb-3 text-sm"
                >
                  <span className="text-gray-500">{label}</span>
                  <span className="text-right font-medium text-gray-900">
                    {value}
                  </span>
                </div>
              ))}

              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {money(selectedReceipt.amount)}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t p-5">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => printReceipt(selectedReceipt)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Printer size={17} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}