// src/store/feeStore.ts
// One shared source of fee data for all accountant pages.
// Data lives in localStorage now; later only this file changes when the backend arrives.
import { useSyncExternalStore } from "react";

// ---------- Types (same names on every page) ----------
export type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer" | "Cheque";
export const PAYMENT_MODES: PaymentMode[] = ["Cash", "UPI", "Card", "Bank Transfer", "Cheque"];

export type FeeStudent = {
  studentId: string;
  studentName: string;
  className: string;
  feeType: string;
  totalFee: number;
  paid: number;
  dueDate: string; // YYYY-MM-DD
};

export type FeePayment = {
  id: number;
  receiptNo: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  mode: PaymentMode;
  date: string; // YYYY-MM-DD
};

export type FeeLog = { time: string; user: string; action: string; detail: string };

export type FeeFrequency = "Monthly" | "Quarterly" | "Annually";

export type FeeStructureItem = {
  id: number;
  className: string;
  academicYear: string;
  feeType: string;
  amount: number;
  frequency: FeeFrequency;
  status: "Active" | "Inactive";
};

type FeeState = {
  students: FeeStudent[];
  payments: FeePayment[];
  logs: FeeLog[];
  structures: FeeStructureItem[];
};

// ---------- Helpers ----------
export const money = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
export const outstanding = (s: FeeStudent) => Math.max(0, s.totalFee - s.paid);
export const sumAmounts = (list: { amount: number }[]) => list.reduce((sum, p) => sum + p.amount, 0);

// Local date as YYYY-MM-DD (toISOString would use UTC and can shift the day in India)
export function todayISO(d: Date = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export type DueStatus = "Paid" | "Overdue" | "Due Soon" | "Upcoming";

// Overdue: due date passed. Due Soon: within the next 7 days. Otherwise Upcoming.
export function dueStatus(s: FeeStudent, today: string = todayISO()): DueStatus {
  if (outstanding(s) === 0) return "Paid";
  if (s.dueDate < today) return "Overdue";
  const days = (new Date(s.dueDate).getTime() - new Date(today).getTime()) / 86400000;
  return days <= 7 ? "Due Soon" : "Upcoming";
}

// ---------- Demo data (one set for every page) ----------
const SEED_STUDENTS: FeeStudent[] = [
  { studentId: "STU1001", studentName: "Aarav Sharma", className: "Class 10", feeType: "Tuition Fee", totalFee: 45000, paid: 30000, dueDate: "2026-10-05" },
  { studentId: "STU1002", studentName: "Priya Verma", className: "Class 10", feeType: "Tuition Fee", totalFee: 45000, paid: 45000, dueDate: "2026-12-05" },
  { studentId: "STU1003", studentName: "Rahul Kumar", className: "Class 9", feeType: "Tuition Fee", totalFee: 40000, paid: 25000, dueDate: "2026-10-10" },
  { studentId: "STU1004", studentName: "Ananya Singh", className: "Class 8", feeType: "Transport Fee", totalFee: 35000, paid: 20000, dueDate: "2026-10-20" },
  { studentId: "STU1005", studentName: "Rohan Gupta", className: "Class 7", feeType: "Annual Fee", totalFee: 30000, paid: 10000, dueDate: "2026-11-15" },
  { studentId: "STU1006", studentName: "Kabir Mehta", className: "Class 9", feeType: "Tuition Fee", totalFee: 40000, paid: 15000, dueDate: "2026-12-10" },
];

const SEED_PAYMENTS: FeePayment[] = [
  { id: 6, receiptNo: "REC-2026-006", studentId: "STU1006", studentName: "Kabir Mehta", className: "Class 9", amount: 7000, mode: "UPI", date: "2026-10-22" },
  { id: 5, receiptNo: "REC-2026-005", studentId: "STU1005", studentName: "Rohan Gupta", className: "Class 7", amount: 5000, mode: "Cash", date: "2026-10-21" },
  { id: 4, receiptNo: "REC-2026-004", studentId: "STU1004", studentName: "Ananya Singh", className: "Class 8", amount: 8000, mode: "Cheque", date: "2026-10-21" },
  { id: 3, receiptNo: "REC-2026-003", studentId: "STU1002", studentName: "Priya Verma", className: "Class 10", amount: 20000, mode: "Bank Transfer", date: "2026-10-20" },
  { id: 2, receiptNo: "REC-2026-002", studentId: "STU1003", studentName: "Rahul Kumar", className: "Class 9", amount: 10000, mode: "Cash", date: "2026-10-20" },
  { id: 1, receiptNo: "REC-2026-001", studentId: "STU1001", studentName: "Aarav Sharma", className: "Class 10", amount: 15000, mode: "UPI", date: "2026-10-20" },
];

const SEED_STRUCTURES: FeeStructureItem[] = [
  { id: 1, className: "Class 6", academicYear: "2026-2027", feeType: "Tuition Fee", amount: 2500, frequency: "Monthly", status: "Active" },
  { id: 2, className: "Class 7", academicYear: "2026-2027", feeType: "Annual Fee", amount: 30000, frequency: "Annually", status: "Active" },
  { id: 3, className: "Class 8", academicYear: "2026-2027", feeType: "Transport Fee", amount: 35000, frequency: "Annually", status: "Active" },
  { id: 4, className: "Class 9", academicYear: "2026-2027", feeType: "Tuition Fee", amount: 40000, frequency: "Annually", status: "Active" },
  { id: 5, className: "Class 10", academicYear: "2026-2027", feeType: "Tuition Fee", amount: 45000, frequency: "Annually", status: "Active" },
];

// Yearly amount of one fee structure (a monthly fee is paid 12 times a year)
export const annualAmount = (item: FeeStructureItem) =>
  item.amount * (item.frequency === "Monthly" ? 12 : item.frequency === "Quarterly" ? 4 : 1);

// A student's total fee = sum of the active structures of his class.
// A class with no active structure keeps the student's current total.
function applyStructures(students: FeeStudent[], structures: FeeStructureItem[]): FeeStudent[] {
  return students.map((student) => {
    const items = structures.filter((item) => item.status === "Active" && item.className === student.className);
    if (items.length === 0) return student;
    return {
      ...student,
      totalFee: items.reduce((sum, item) => sum + annualAmount(item), 0),
      feeType: items.map((item) => item.feeType).join(" + "),
    };
  });
}

function nowStamp() {
  const now = new Date();
  return `${todayISO(now)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

const logFor = (p: FeePayment): FeeLog => ({
  time: `${p.date} 10:00`,
  user: "Accountant",
  action: "Payment added",
  detail: `${p.receiptNo} for ${p.studentName}, ${money(p.amount)}`,
});

const seed = (): FeeState => ({
  students: SEED_STUDENTS,
  payments: SEED_PAYMENTS,
  logs: SEED_PAYMENTS.map(logFor), // newest first, same order as the payments
  structures: SEED_STRUCTURES,
});

// ---------- Store (localStorage + subscribers) ----------
const KEY = "erp_fees_v1";

function load(): FeeState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as Partial<FeeState>;
      if (Array.isArray(data.students) && Array.isArray(data.payments) && Array.isArray(data.logs)) {
        // Data saved by an older version has no fee structures: add the demo ones
        return { ...data, structures: Array.isArray(data.structures) ? data.structures : SEED_STRUCTURES } as FeeState;
      }
    }
  } catch {
    // Broken JSON or storage blocked: fall back to demo data.
  }
  return seed();
}

let state: FeeState = load();
const listeners = new Set<() => void>();

function commit(next: FeeState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable: data stays in memory only.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Keep other browser tabs in sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === KEY) {
      state = load();
      listeners.forEach((listener) => listener());
    }
  });
}

// ---------- Actions ----------
export type AddPaymentInput = { studentId: string; amount: number; mode: PaymentMode; date: string };
export type AddPaymentResult = { ok: true; payment: FeePayment } | { ok: false; error: string };

export function addPayment(input: AddPaymentInput): AddPaymentResult {
  const student = state.students.find((s) => s.studentId === input.studentId);
  if (!student) return { ok: false, error: "Please select a student." };
  if (!Number.isFinite(input.amount) || input.amount <= 0) return { ok: false, error: "Enter a valid amount." };

  const due = outstanding(student);
  if (input.amount > due) {
    return { ok: false, error: `Payment exceeds the student's outstanding balance of ${money(due)}.` };
  }

  const nextId = Math.max(0, ...state.payments.map((p) => p.id)) + 1;
  const payment: FeePayment = {
    id: nextId,
    receiptNo: `REC-${input.date.slice(0, 4)}-${String(nextId).padStart(3, "0")}`,
    studentId: student.studentId,
    studentName: student.studentName,
    className: student.className,
    amount: input.amount,
    mode: input.mode,
    date: input.date,
  };

  commit({
    ...state,
    students: state.students.map((s) =>
      s.studentId === student.studentId ? { ...s, paid: s.paid + input.amount } : s,
    ),
    payments: [payment, ...state.payments],
    logs: [{ ...logFor(payment), time: nowStamp() }, ...state.logs],
  });

  return { ok: true, payment };
}

// ---------- Fee structure actions (they also update every student's total fee) ----------
export type StructureInput = Omit<FeeStructureItem, "id">;

function commitStructures(structures: FeeStructureItem[], action: string, detail: string) {
  commit({
    ...state,
    structures,
    students: applyStructures(state.students, structures),
    logs: [{ time: nowStamp(), user: "Accountant", action, detail }, ...state.logs],
  });
}

const describe = (item: StructureInput) => `${item.className} ${item.feeType}, ${money(item.amount)} ${item.frequency}`;

export function addStructure(input: StructureInput) {
  const id = Math.max(0, ...state.structures.map((item) => item.id)) + 1;
  commitStructures([...state.structures, { ...input, id }], "Fee structure added", describe(input));
}

export function updateStructure(id: number, input: StructureInput) {
  commitStructures(
    state.structures.map((item) => (item.id === id ? { ...input, id } : item)),
    "Fee structure edited",
    describe(input),
  );
}

export function deleteStructure(id: number) {
  const item = state.structures.find((entry) => entry.id === id);
  if (!item) return;
  commitStructures(state.structures.filter((entry) => entry.id !== id), "Fee structure deleted", describe(item));
}

// Restore the demo data (useful while testing)
export function resetFees() {
  commit(seed());
}

// ---------- Hook used by every page ----------
export function useFees() {
  const data = useSyncExternalStore(subscribe, () => state);
  return {
    students: data.students,
    payments: data.payments,
    logs: data.logs,
    structures: data.structures,
    addPayment,
    addStructure,
    updateStructure,
    deleteStructure,
    resetFees,
  };
}