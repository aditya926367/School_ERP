import type { ReactNode } from "react";

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