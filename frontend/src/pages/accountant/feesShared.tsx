import type { ReactNode } from "react";

// ---------- Types ----------
export type StudentFee = {
  id: string;
  name: string;
  className: string;
  feeType: string;
  total: number;
  paid: number;
  dueDate: string; // format: YYYY-MM-DD
};

export type Payment = {
  receiptNo: string;
  date: string; // format: YYYY-MM-DD
  studentName: string;
  amount: number;
  mode: "Cash" | "UPI" | "Bank" | "Cheque";
};

export type LogItem = { time: string; user: string; action: string; detail: string };

// ---------- Demo data (replace with backend data later) ----------
export const STUDENTS: StudentFee[] = [
  { id: "STU1001", name: "Aarav Sharma", className: "Class 10", feeType: "Tuition Fee", total: 45000, paid: 30000, dueDate: "2026-10-05" },
  { id: "STU1003", name: "Rahul Kumar", className: "Class 9", feeType: "Tuition Fee", total: 40000, paid: 25000, dueDate: "2026-10-10" },
  { id: "STU1004", name: "Ananya Singh", className: "Class 8", feeType: "Transport Fee", total: 35000, paid: 20000, dueDate: "2026-10-20" },
  { id: "STU1005", name: "Rohan Gupta", className: "Class 7", feeType: "Annual Fee", total: 30000, paid: 10000, dueDate: "2026-11-15" },
  { id: "STU1006", name: "Priya Verma", className: "Class 10", feeType: "Tuition Fee", total: 45000, paid: 45000, dueDate: "2026-12-05" },
  { id: "STU1007", name: "Kabir Mehta", className: "Class 9", feeType: "Tuition Fee", total: 40000, paid: 15000, dueDate: "2026-12-10" },
];

export const PAYMENTS: Payment[] = [
  { receiptNo: "R-101", date: "2026-10-20", studentName: "Aarav Sharma", amount: 15000, mode: "UPI" },
  { receiptNo: "R-102", date: "2026-10-20", studentName: "Rahul Kumar", amount: 10000, mode: "Cash" },
  { receiptNo: "R-103", date: "2026-10-20", studentName: "Priya Verma", amount: 20000, mode: "Bank" },
  { receiptNo: "R-104", date: "2026-10-21", studentName: "Ananya Singh", amount: 8000, mode: "Cheque" },
  { receiptNo: "R-105", date: "2026-10-21", studentName: "Rohan Gupta", amount: 5000, mode: "Cash" },
  { receiptNo: "R-106", date: "2026-10-22", studentName: "Kabir Mehta", amount: 7000, mode: "UPI" },
];

export const LOGS: LogItem[] = [
  { time: "2026-10-22 10:42", user: "Accountant", action: "Payment added", detail: "R-106 for Kabir Mehta, Rs 7,000" },
  { time: "2026-10-21 16:10", user: "Accountant", action: "Payment added", detail: "R-105 for Rohan Gupta, Rs 5,000" },
  { time: "2026-10-21 11:25", user: "Accountant", action: "Challan created", detail: "Challan for Ananya Singh" },
  { time: "2026-10-20 15:00", user: "Admin", action: "Fee structure edited", detail: "Class 9 tuition fee updated" },
  { time: "2026-10-20 12:30", user: "Accountant", action: "Reminder opened", detail: "Reminder for Rahul Kumar" },
];

// ---------- Small helpers ----------
export const money = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const outstanding = (s: StudentFee) => Math.max(0, s.total - s.paid);
export const sumAmounts = (list: Payment[]) => list.reduce((total, p) => total + p.amount, 0);

// ---------- Common styles ----------
export const card = "rounded-xl border border-gray-200 bg-white shadow-sm";
export const inputCls = "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-600";
export const btn = "h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]";
export const th = "px-5 py-3 text-left text-xs font-semibold text-gray-500";
export const td = "px-5 py-3.5 text-sm text-gray-700";

// ---------- Common UI pieces ----------
export function Head({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500">Fees Management</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{sub}</p>
      </div>
      {right}
    </div>
  );
}

export function Stat({ label, value, tone = "text-gray-900" }: { label: string; value: string; tone?: string }) {
  return (
    <div className={`${card} p-5`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}