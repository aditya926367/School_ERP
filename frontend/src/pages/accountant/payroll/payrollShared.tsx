// import type { ReactNode } from "react";


// export type Structure = { basic: number; hra: number; da: number; other: number; pf: number; tax: number };
// export type Staff = { id: string; name: string; designation: string; s: Structure };
// export type Row = { id: string; name: string; designation: string; present: number; base: number; net: number; paid: boolean; paidOn?: string; mode?: string };
// export type Run = { status: "Draft" | "Approved"; rows: Row[] };

// export const WORKING_DAYS = 26;
// export const card = "rounded-xl border border-gray-200 bg-white shadow-sm";
// export const inputCls = "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-600";
// export const btn = "h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:opacity-40";
// export const th = "px-5 py-3 text-left text-xs font-semibold text-gray-500";
// export const td = "px-5 py-3.5 text-sm text-gray-700";

// export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
// export const gross = (s: Structure) => s.basic + s.hra + s.da + s.other;
// export const netOf = (s: Structure) => gross(s) - s.pf - s.tax;
// export const monthLabel = (m: string) =>
//   new Date(m + "-01").toLocaleString("en-IN", { month: "long", year: "numeric" });

// function read<T>(key: string, fallback: T): T {
//   try {
//     const raw = localStorage.getItem(key);
//     return raw ? (JSON.parse(raw) as T) : fallback;
//   } catch {
//     return fallback;
//   }
// }
// function write(key: string, value: unknown) {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch {
//     /* storage full: ignore */
//   }
// }

// export const loadRuns = () => read<Record<string, Run>>("erp_payroll_runs", {});
// export const saveRuns = (r: Record<string, Run>) => write("erp_payroll_runs", r);
// export const saveStructures = (m: Record<string, Structure>) => write("erp_salary", m);

// function defaultStructure(designation: string): Structure {
//   const basic = designation.includes("Vice") ? 75000 : designation.includes("Head") ? 60000
//     : designation.includes("PGT") ? 48000 : designation.includes("TGT") ? 38000 : 28000;
//   return { basic, hra: basic * 0.2, da: basic * 0.1, other: 0, pf: basic * 0.12, tax: 0 };
// }

// const DEMO = [
//   { id: "T001", firstName: "Rahul", lastName: "Sharma", designation: "Post Graduate Teacher (PGT)" },
//   { id: "T002", firstName: "Sunita", lastName: "Rao", designation: "Head of Department" },
//   { id: "T003", firstName: "Anil", lastName: "Verma", designation: "Trained Graduate Teacher (TGT)" },
//   { id: "T004", firstName: "Priya", lastName: "Nair", designation: "Primary Teacher (PRT)" },
// ];

// // Teachers come from the Add Teacher page (localStorage "erp_teachers")
// export function getStaff(): Staff[] {
//   const teachers = read<{ id: string; firstName: string; lastName: string; designation: string; status?: string }[]>("erp_teachers", []);
//   const saved = read<Record<string, Structure>>("erp_salary", {});
//   return (teachers.length ? teachers : DEMO)
//     .filter((t) => t.status !== "Inactive")
//     .map((t) => ({
//       id: t.id,
//       name: `${t.firstName} ${t.lastName}`,
//       designation: t.designation || "Teacher",
//       s: saved[t.id] ?? defaultStructure(t.designation || ""),
//     }));
// }

// export function Head({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) {
//   return (
//     <div className="flex flex-wrap items-start justify-between gap-3">
//       <div>
//         <p className="text-sm text-gray-500">Fees & Finance / Payroll</p>
//         <h1 className="mt-1 text-2xl font-bold text-gray-900">{title}</h1>
//         <p className="mt-1 text-sm text-gray-500">{sub}</p>
//       </div>
//       {right}
//     </div>
//   );
// }

// export function Stat({ label, value, tone = "text-gray-900" }: { label: string; value: string; tone?: string }) {
//   return (
//     <div className={`${card} p-5`}>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p>
//     </div>
//   );
// }

// export function Badge({ ok, text }: { ok: boolean; text: string }) {
//   return (
//     <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ok ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
//       {text}
//     </span>
//   );
// }




import type { ReactNode } from "react";

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
};

export const WORKING_DAYS = 26;

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

function defaultStructure(designation: string): Structure {
  const basic = designation.includes("Vice")
    ? 75000
    : designation.includes("Head")
      ? 60000
      : designation.includes("PGT")
        ? 48000
        : designation.includes("TGT")
          ? 38000
          : 28000;

  return {
    basic,
    hra: basic * 0.2,
    da: basic * 0.1,
    other: 0,
    pf: basic * 0.12,
    tax: 0,
  };
}

const DEMO = [
  {
    id: "T001",
    firstName: "Rahul",
    lastName: "Sharma",
    designation: "Post Graduate Teacher (PGT)",
  },
  {
    id: "T002",
    firstName: "Sunita",
    lastName: "Rao",
    designation: "Head of Department",
  },
  {
    id: "T003",
    firstName: "Anil",
    lastName: "Verma",
    designation: "Trained Graduate Teacher (TGT)",
  },
  {
    id: "T004",
    firstName: "Priya",
    lastName: "Nair",
    designation: "Primary Teacher (PRT)",
  },
];

export function getStaff(): Staff[] {
  const teachers = read<
    {
      id: string;
      firstName: string;
      lastName: string;
      designation: string;
      status?: string;
    }[]
  >("erp_teachers", []);

  const saved = read<Record<string, Structure>>("erp_salary", {});

  return (teachers.length ? teachers : DEMO)
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
