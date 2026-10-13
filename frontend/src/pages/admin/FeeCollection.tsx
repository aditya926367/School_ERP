
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Search,
  Plus,
  IndianRupee,
  Wallet,
  CreditCard,
  Banknote,
  X,
  Printer,
  CheckCircle2,
} from "lucide-react";

type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer";

type StudentFee = {
  id: number;
  studentId: string;
  studentName: string;
  className: string;
  totalFee: number;
  paid: number;
};

type Payment = {
  id: number;
  receiptNo: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  mode: PaymentMode;
  date: string;
};

const initialStudents: StudentFee[] = [
  { id: 1, studentId: "STU1001", studentName: "Aarav Sharma", className: "Class 10", totalFee: 45000, paid: 30000 },
  { id: 2, studentId: "STU1002", studentName: "Priya Verma", className: "Class 10", totalFee: 45000, paid: 45000 },
  { id: 3, studentId: "STU1003", studentName: "Rahul Kumar", className: "Class 9", totalFee: 40000, paid: 25000 },
  { id: 4, studentId: "STU1004", studentName: "Ananya Singh", className: "Class 8", totalFee: 35000, paid: 20000 },
  { id: 5, studentId: "STU1005", studentName: "Rohan Gupta", className: "Class 7", totalFee: 30000, paid: 10000 },
];

const initialPayments: Payment[] = [
  { id: 1, receiptNo: "REC-2026-001", studentId: "STU1001", studentName: "Aarav Sharma", className: "Class 10", amount: 10000, mode: "UPI", date: "2026-10-12" },
  { id: 2, receiptNo: "REC-2026-002", studentId: "STU1002", studentName: "Priya Verma", className: "Class 10", amount: 15000, mode: "Cash", date: "2026-10-12" },
  { id: 3, receiptNo: "REC-2026-003", studentId: "STU1003", studentName: "Rahul Kumar", className: "Class 9", amount: 5000, mode: "Card", date: "2026-10-11" },
];

const emptyForm = {
  studentId: "",
  amount: "",
  mode: "UPI" as PaymentMode,
  date: new Date().toISOString().slice(0, 10),
};

const money = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function FeeCollection() {
  const [students, setStudents] = useState(initialStudents);
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.studentName.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (classFilter === "All" || student.className === classFilter)
      );
    });
  }, [students, search, classFilter]);

  const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalOutstanding = students.reduce(
    (sum, student) => sum + Math.max(0, student.totalFee - student.paid),
    0,
  );
  const paidStudents = students.filter(
    (student) => student.paid >= student.totalFee,
  ).length;

  function collectFee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const student = students.find((item) => item.studentId === form.studentId);
    const amount = Number(form.amount);

    if (!student) {
      alert("Please select a student.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const due = Math.max(0, student.totalFee - student.paid);

    if (amount > due) {
      alert(`Payment exceeds the student's outstanding balance of ${money(due)}.`);
      return;
    }

    const nextId = Math.max(0, ...payments.map((payment) => payment.id)) + 1;
    const receipt: Payment = {
      id: nextId,
      receiptNo: `REC-2026-${String(nextId).padStart(3, "0")}`,
      studentId: student.studentId,
      studentName: student.studentName,
      className: student.className,
      amount,
      mode: form.mode,
      date: form.date,
    };

    setPayments((current) => [receipt, ...current]);
    setStudents((current) =>
      current.map((item) =>
        item.studentId === student.studentId
          ? { ...item, paid: item.paid + amount }
          : item,
      ),
    );

    setSelectedReceipt(receipt);
    setModalOpen(false);
    setForm(emptyForm);
  }

  function printReceipt(receipt: Payment) {
    const printWindow = window.open("", "_blank", "width=700,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the receipt.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Fee Receipt ${receipt.receiptNo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
            .receipt { max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 28px; }
            h1, h2 { text-align: center; }
            .row { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid #eee; }
            .amount { font-size: 24px; font-weight: bold; text-align: center; margin: 24px 0; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h1>School Fee Receipt</h1>
            <h2>${receipt.receiptNo}</h2>
            <div class="row"><span>Student</span><strong>${receipt.studentName}</strong></div>
            <div class="row"><span>Student ID</span><strong>${receipt.studentId}</strong></div>
            <div class="row"><span>Class</span><strong>${receipt.className}</strong></div>
            <div class="row"><span>Date</span><strong>${receipt.date}</strong></div>
            <div class="row"><span>Payment Mode</span><strong>${receipt.mode}</strong></div>
            <div class="amount">Amount: ${money(receipt.amount)}</div>
            <p>Thank you for your payment.</p>
          </div>
          <script>window.onload = () => window.print();<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Collection</h1>
          <p className="mt-1 text-sm text-gray-500">
            Collect student payments and generate receipts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Collect Fee
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Collected</p>
            <IndianRupee size={22} className="text-green-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{money(totalCollected)}</p>
          <p className="mt-1 text-xs text-gray-500">Recorded demo payments</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Outstanding Dues</p>
            <Wallet size={22} className="text-red-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{money(totalOutstanding)}</p>
          <p className="mt-1 text-xs text-gray-500">Across sample students</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Students Listed</p>
            <CreditCard size={22} className="text-blue-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{students.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Fully Paid</p>
            <CheckCircle2 size={22} className="text-purple-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{paidStudents}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student name or ID..."
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm"
            />
          </div>

          <select
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            className="rounded-lg border bg-white px-3 py-2.5 text-sm"
          >
            <option value="All">All Classes</option>
            {Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`).map(
              (className) => (
                <option key={className}>{className}</option>
              ),
            )}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Total Fee</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.map((student) => {
                const due = Math.max(0, student.totalFee - student.paid);
                const fullyPaid = due === 0;

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{student.studentName}</p>
                      <p className="mt-1 text-xs text-gray-500">{student.studentId}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{student.className}</td>
                    <td className="px-4 py-4">{money(student.totalFee)}</td>
                    <td className="px-4 py-4 font-medium text-green-700">{money(student.paid)}</td>
                    <td className="px-4 py-4 font-semibold text-red-600">{money(due)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${fullyPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {fullyPaid ? "Paid" : "Due"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        disabled={fullyPaid}
                        onClick={() => {
                          setForm({ ...emptyForm, studentId: student.studentId });
                          setModalOpen(true);
                        }}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Collect
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">Recent Payments</h2>
          <p className="mt-1 text-sm text-gray-500">Latest recorded transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Receipt No.</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-5 py-4 font-medium">{payment.receiptNo}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{payment.studentName}</p>
                    <p className="mt-1 text-xs text-gray-500">{payment.studentId}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{payment.date}</td>
                  <td className="px-5 py-4 text-gray-600">{payment.mode}</td>
                  <td className="px-5 py-4 font-semibold">{money(payment.amount)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => printReceipt(payment)}
                      title="Print receipt"
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <Printer size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t px-5 py-3 text-xs text-gray-500">
          Demo transactions only; payments are not saved to the database.
        </p>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Collect Student Fee</h2>
                <p className="mt-1 text-sm text-gray-500">Enter payment details.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={collectFee} className="space-y-4 p-5">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Student</span>
                <select
                  required
                  value={form.studentId}
                  onChange={(event) => setForm({ ...form, studentId: event.target.value })}
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.studentId}>
                      {student.studentName} — {student.studentId} ({money(Math.max(0, student.totalFee - student.paid))} due)
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Amount (₹)</span>
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => setForm({ ...form, amount: event.target.value })}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">Payment Mode</span>
                  <select
                    value={form.mode}
                    onChange={(event) => setForm({ ...form, mode: event.target.value as PaymentMode })}
                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  >
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">Payment Date</span>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm({ ...form, date: event.target.value })}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedReceipt && (
        <div className="fixed bottom-5 right-5 z-40 flex max-w-sm items-start gap-3 rounded-xl border border-green-200 bg-white p-4 shadow-lg">
          <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Payment recorded</p>
            <p className="mt-1 text-sm text-gray-600">
              Receipt {selectedReceipt.receiptNo} · {money(selectedReceipt.amount)}
            </p>
            <button
              onClick={() => printReceipt(selectedReceipt)}
              className="mt-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              Print receipt
            </button>
          </div>
          <button
            onClick={() => setSelectedReceipt(null)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
