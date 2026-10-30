import type { ReactNode } from "react";
import { getTeachers } from "../../../store/teacherStore";

export type Structure = {
  basic: number;
  hra: number;
  da: number;
  other: number;
  pf: number;
  tax: number;
};

export type Staff = {
  id: string;
  name: string;
  designation: string;
  s: Structure;
};

export type Row = {
  id: string;
  name: string;
  designation: string;
  present: number;
  base: number;
  net: number;
  paid: boolean;
  paidOn?: string;
  mode?: string;
};

export type Run = {
  status: "Draft" | "Approved";
  rows: Row[];
  // Working days of this month (saved with the run, so old payslips never change)
  workingDays?: number;
};

// Default working days for a month. A run can override it with its own workingDays.
export const WORKING_DAYS = 26;

// Working days to use for a run
export const daysOf = (run?: Run) => run?.workingDays ?? WORKING_DAYS;

export const card =
  "rounded-xl border border-gray-200 bg-white shadow-sm";

export const inputCls =
  "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-600";

export const btn =
  "h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:opacity-40";

export const th = "px-5 py-3 text-left text-xs font-semibold text-gray-500";
export const td = "px-5 py-3.5 text-sm text-gray-700";

export const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const gross = (s: Structure) =>
  s.basic + s.hra + s.da + s.other;

export const netOf = (s: Structure) =>
  gross(s) - s.pf - s.tax;

export const monthLabel = (m: string) =>
  new Date(m + "-01").toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable or full.
  }
}

export const loadRuns = () =>
  read<Record<string, Run>>("erp_payroll_runs", {});

export const saveRuns = (runs: Record<string, Run>) =>
  write("erp_payroll_runs", runs);

export const saveStructures = (
  structures: Record<string, Structure>
) => write("erp_salary", structures);


function defaultStructure(_designation: string): Structure {
  return {
    basic: 0,
    hra: 0,
    da: 0,
    other: 0,
    pf: 0,
    tax: 0,
  };
}


export function getStaff(): Staff[] {
  // Teachers come from the shared teacher store (Add Teacher page)
  const teachers = getTeachers();

  const saved = read<Record<string, Structure>>("erp_salary", {});

  return teachers
    .filter((teacher) => teacher.status !== "Inactive")
    .map((teacher) => ({
      id: teacher.id,
      name: `${teacher.firstName} ${teacher.lastName}`,
      designation: teacher.designation || "Teacher",
      s:
        saved[teacher.id] ??
        defaultStructure(teacher.designation || ""),
    }));
}

export function Head({
  title,
  sub,
  right,
}: {
  title: string;
  sub: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500">
          Fees & Finance / Payroll
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{sub}</p>
      </div>
      {right}
    </div>
  );
}

export function Stat({
  label,
  value,
  tone = "text-gray-900",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className={`${card} p-5`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>
        {value}
      </p>
    </div>
  );
}

export function Badge({
  ok,
  text,
}: {
  ok: boolean;
  text: string;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        ok
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {text}
    </span>
  );
}
