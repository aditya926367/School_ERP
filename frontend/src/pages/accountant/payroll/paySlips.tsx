import { useState } from "react";
import { Printer } from "lucide-react";
import { Head, card, inputCls, btn, inr, gross, getStaff, loadRuns, monthLabel, WORKING_DAYS } from "./payrollShared";

export default function Payslips() {
  const runs = loadRuns();
  const months = Object.keys(runs).sort().reverse();
  const [month, setMonth] = useState(months[0] ?? "");
  const rows = runs[month]?.rows ?? [];
  const [empId, setEmpId] = useState("");

  const row = rows.find((r) => r.id === empId) ?? rows[0];
  const staff = row ? getStaff().find((t) => t.id === row.id) : undefined;
  const s = staff?.s;

  const lines = (items: [string, number][]) =>
    items.map(([label, amount]) => (
      <div key={label} className="flex justify-between py-1.5 text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{inr(amount)}</span>
      </div>
    ));

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="print:hidden">
        <Head
          title="Payslips"
          sub="View and print a teacher's salary slip for any generated month."
          right={
            months.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <select value={month} onChange={(e) => { setMonth(e.target.value); setEmpId(""); }} className={inputCls}>
                  {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
                </select>
                <select value={row?.id ?? ""} onChange={(e) => setEmpId(e.target.value)} className={inputCls}>
                  {rows.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
                </select>
                <button onClick={() => window.print()} className={`${btn} flex items-center gap-2`}><Printer size={16} /> Print payslip</button>
              </div>
            )
          }
        />
      </div>

      {!row || !s ? (
        <div className={`${card} px-5 py-14 text-center text-sm text-gray-500`}>
          No payslips yet. Generate a payroll in Monthly Payroll first.
        </div>
      ) : (
        <div className={`${card} mx-auto max-w-2xl p-8`}>
          <div className="border-b border-gray-200 pb-5">
            <p className="text-lg font-bold text-[#27348b]">Your School Name</p>
            <p className="text-sm text-gray-500">Payslip for {monthLabel(month)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-5 text-sm">
            <div><p className="text-gray-500">Employee</p><p className="font-semibold text-gray-900">{row.name}</p></div>
            <div><p className="text-gray-500">Employee ID</p><p className="font-semibold text-gray-900">{row.id}</p></div>
            <div><p className="text-gray-500">Designation</p><p className="font-semibold text-gray-900">{row.designation}</p></div>
            <div><p className="text-gray-500">Days present</p><p className="font-semibold text-gray-900">{row.present} of {WORKING_DAYS}</p></div>
          </div>

          <div className="grid grid-cols-1 gap-8 py-5 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Earnings</h3>
              {lines([["Basic salary", s.basic], ["House rent allowance", s.hra], ["Dearness allowance", s.da], ["Other allowance", s.other]])}
              <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold"><span>Gross</span><span>{inr(gross(s))}</span></div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Deductions</h3>
              {lines([["PF", s.pf], ["Tax", s.tax]])}
              <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold"><span>Total</span><span>{inr(s.pf + s.tax)}</span></div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-[#27348b] px-5 py-4 text-white">
            <span className="font-medium">Net pay</span>
            <span className="text-2xl font-bold">{inr(row.net)}</span>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            {row.paid ? `Paid on ${row.paidOn} by ${row.mode}.` : "Payment pending."}
          </p>
        </div>
      )}
    </div>
  );
}