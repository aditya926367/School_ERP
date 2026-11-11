// src/store/feeStore.ts
// Fee data for the accountant: structures, payments, logs and due dates.
// Students are NOT kept here. They come from studentStore, so a student added by admin
// shows up in Fee Collection automatically. Each student's total fee comes from the
// fee structures of his class, and "paid" is the sum of his payments.
import { useMemo } from "react";
import { createStore } from "./createStore";
import { SEED_STUDENTS, getStudents, studentStore, useStudents } from "./studentStore";
import type { Student } from "./studentStore";

// ---------- Types (same names on every page) ----------
export type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer" | "Cheque";
export const PAYMENT_MODES: PaymentMode[] = ["Cash", "UPI", "Card", "Bank Transfer", "Cheque"];

// One student as the fee pages see him (built from the student list + structures + payments)
export type FeeStudent = {
  id: number; // internal student ID
  studentId: string; // the admission number
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
  payments: FeePayment[];
  logs: FeeLog[];
  structures: FeeStructureItem[];
  dueDates: Record<string, string>; // studentId -> due date
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

const endOfMonth = () => {
  const now = new Date();
  return todayISO(new Date(now.getFullYear(), now.getMonth() + 1, 0));
};

function nowStamp() {
  const now = new Date();
  return `${todayISO(now)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export type DueStatus = "Paid" | "Overdue" | "Due Soon" | "Upcoming";

// Overdue: due date passed. Due Soon: within the next 7 days. Otherwise Upcoming.
export function dueStatus(s: FeeStudent, today: string = todayISO()): DueStatus {
  if (outstanding(s) === 0) return "Paid";
  if (s.dueDate < today) return "Overdue";
  const days = (new Date(s.dueDate).getTime() - new Date(today).getTime()) / 86400000;
  return days <= 7 ? "Due Soon" : "Upcoming";
}

// Yearly amount of one fee structure (a monthly fee is paid 12 times a year)
export const annualAmount = (item: FeeStructureItem) =>
  item.amount * (item.frequency === "Monthly" ? 12 : item.frequency === "Quarterly" ? 4 : 1);

// ---------- Demo data (matches the demo students of the admin Students page) ----------
const SEED_STRUCTURES: FeeStructureItem[] = [];

const logFor = (p: FeePayment): FeeLog => ({
  time: `${p.date} 10:00`,
  user: "Accountant",
  action: "Payment added",
  detail: `${p.receiptNo} for ${p.studentName}, ${money(p.amount)}`,
});

function seed(): FeeState {
  // Start with empty real data. Fee structures and payments are added by the user.
  return {
    payments: [],
    logs: [],
    structures: [],
    dueDates: {},
  };
}

const store = createStore<FeeState>("erp_fees_v2", seed, (saved) => {
  const data = saved as Partial<FeeState> | null;
  if (data && Array.isArray(data.payments) && Array.isArray(data.logs) && Array.isArray(data.structures)) {
    return { ...data, dueDates: data.dueDates ?? {} } as FeeState;
  }
  return null;
});

// ---------- Build the fee view of every student ----------
function deriveStudents(admin: Student[], fee: FeeState): FeeStudent[] {
  return admin
    .filter((student) => student.status === "Active")
    .map((student) => {
      const items = fee.structures.filter((i) => i.status === "Active" && i.className === student.className);
      return {
        id: student.id,
        studentId: student.admissionNo,
        studentName: student.name,
        className: student.className,
        feeType: items.length ? items.map((i) => i.feeType).join(" + ") : "No fee set",
        totalFee: items.reduce((sum, i) => sum + annualAmount(i), 0),
        paid: sumAmounts(fee.payments.filter((p) => p.studentId === student.admissionNo)),
        dueDate: fee.dueDates[student.admissionNo] ?? endOfMonth(),
      };
    });
}

// A new student gets a due date (end of this month) the first time we see him
function syncDueDates() {
  const missing = getStudents().filter((s) => !store.get().dueDates[s.admissionNo]);
  if (missing.length === 0) return;
  const date = endOfMonth();
  store.set((state) => ({
    ...state,
    dueDates: { ...state.dueDates, ...Object.fromEntries(missing.map((s) => [s.admissionNo, date])) },
  }));
}
syncDueDates();
studentStore.subscribe(syncDueDates);

// ---------- Actions ----------
export type AddPaymentInput = { studentId: string; amount: number; mode: PaymentMode; date: string };
export type AddPaymentResult = { ok: true; payment: FeePayment } | { ok: false; error: string };

export function addPayment(input: AddPaymentInput): AddPaymentResult {
  const state = store.get();
  const student = deriveStudents(getStudents(), state).find((s) => s.studentId === input.studentId);
  if (!student) return { ok: false, error: "Please select a student." };
  if (!Number.isFinite(input.amount) || input.amount <= 0) return { ok: false, error: "Enter a valid amount." };

  const due = outstanding(student);
  // If no fee structure exists yet, allow recording the received payment.
  // When a fee structure exists, prevent collecting more than the outstanding balance.
  if (student.totalFee > 0 && input.amount > due) {
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

  store.set({
    ...state,
    payments: [payment, ...state.payments],
    logs: [{ ...logFor(payment), time: nowStamp() }, ...state.logs],
  });
  return { ok: true, payment };
}

export type StructureInput = Omit<FeeStructureItem, "id">;

const describe = (item: StructureInput) => `${item.className} ${item.feeType}, ${money(item.amount)} ${item.frequency}`;

function commitStructures(structures: FeeStructureItem[], action: string, detail: string) {
  store.set((state) => ({
    ...state,
    structures,
    logs: [{ time: nowStamp(), user: "Accountant", action, detail }, ...state.logs],
  }));
}

export function addStructure(input: StructureInput) {
  const items = store.get().structures;
  const id = Math.max(0, ...items.map((item) => item.id)) + 1;
  commitStructures([...items, { ...input, id }], "Fee structure added", describe(input));
}

export function updateStructure(id: number, input: StructureInput) {
  commitStructures(
    store.get().structures.map((item) => (item.id === id ? { ...input, id } : item)),
    "Fee structure edited",
    describe(input),
  );
}

export function deleteStructure(id: number) {
  const items = store.get().structures;
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  commitStructures(items.filter((entry) => entry.id !== id), "Fee structure deleted", describe(item));
}

// Restore the demo fee data (students are not touched)
export function resetFees() {
  store.reset();
  syncDueDates();
}

// ---------- Hook used by every page ----------
export function useFees() {
  const fee = store.useValue();
  const [admin] = useStudents();
  const students = useMemo(() => deriveStudents(admin, fee), [admin, fee]);
  return {
    students,
    payments: fee.payments,
    logs: fee.logs,
    structures: fee.structures,
    addPayment,
    addStructure,
    updateStructure,
    deleteStructure,
    resetFees,
  };
}