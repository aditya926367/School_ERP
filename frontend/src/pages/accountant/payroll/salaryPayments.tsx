import { useState } from "react";
import { Head, Stat, Badge, card, inputCls, btn, th, td, inr, loadRuns, saveRuns, monthLabel } from "./payrollShared";
import type { Run } from "./payrollShared";

export default function SalaryPayments() {
  const [runs, setRuns] = useState<Record<string, Run>>(loadRuns);
  const months = Object.keys(runs).filter((m) => runs[m].status === "Approved").sort().reverse();
  const [month, setMonth] = useState(months[0] ?? "");
  const [mode, setMode] = useState("Bank transfer");
  const run = runs[month];

  function pay(ids: string[]) {
    const today = new Date().toISOString().slice(0, 10);
    const rows = run.rows.map((r) => (ids.includes(r.id) ? { ...r, paid: true, paidOn: today, mode } : r));
    const next = { ...runs, [month]: { ...run, rows } };
    setRuns(next);
    saveRuns(next);
  }

  const total = run ? run.rows.reduce((a, r) => a + r.net, 0) : 0;
  const paid = run ? run.rows.filter((r) => r.paid).reduce((a, r) => a + r.net, 0) : 0;
  const pending = run ? run.rows.filter((r) => !r.paid).map((r) => r.id) : [];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Salary Payments"
        sub="Record which teachers have been paid for each approved month."
        right={
          months.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <select value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls}>
                {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
              </select>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className={inputCls}>
                {["Bank transfer", "Cheque", "Cash"].map((m) => <option key={m}>{m}</option>)}
              </select>
              <button onClick={() => pay(pending)} disabled={pending.length === 0} className={btn}>Pay all pending ({pending.length})</button>
            </div>
          )
        }
      />

      {!run ? (
        <div className={`${card} px-5 py-14 text-center text-sm text-gray-500`}>
          No approved payroll yet. Approve a month in Monthly Payroll to start recording payments.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Stat label="Total payroll" value={inr(total)} />
            <Stat label="Paid" value={inr(paid)} tone="text-green-600" />
            <Stat label="Pending" value={inr(total - paid)} tone="text-amber-600" />
          </div>
          <div className={card}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>{["Teacher", "Amount", "Status", "Paid on", "Mode", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {run.rows.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className={td}><p className="font-medium text-gray-900">{r.name}</p><p className="text-xs text-gray-500">{r.id}</p></td>
                      <td className={`${td} font-semibold text-gray-900`}>{inr(r.net)}</td>
                      <td className={td}><Badge ok={r.paid} text={r.paid ? "Paid" : "Pending"} /></td>
                      <td className={td}>{r.paidOn ?? "-"}</td>
                      <td className={td}>{r.mode ?? "-"}</td>
                      <td className={td}>
                        {!r.paid && <button onClick={() => pay([r.id])} className="text-sm font-semibold text-[#27348b] hover:underline">Mark as paid</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}