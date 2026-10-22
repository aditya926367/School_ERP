import { useState } from "react";
import { Head, Stat, Badge, card, inputCls, btn, th, td, inr, netOf, getStaff, loadRuns, saveRuns, monthLabel, WORKING_DAYS } from "./payrollShared";
import type { Row, Run } from "./payrollShared";

export default function MonthlyPayroll() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [runs, setRuns] = useState<Record<string, Run>>(loadRuns);
  const run = runs[month];

  function update(next: Record<string, Run>) {
    setRuns(next);
    saveRuns(next);
  }

  function generate() {
    const rows: Row[] = getStaff().map((t) => {
      const base = netOf(t.s);
      return { id: t.id, name: t.name, designation: t.designation, present: WORKING_DAYS, base, net: base, paid: false };
    });
    update({ ...runs, [month]: { status: "Draft", rows } });
  }

  function setPresent(id: string, value: string) {
    const days = Math.min(WORKING_DAYS, Math.max(0, Number(value) || 0));
    const rows = run.rows.map((r) =>
      r.id === id ? { ...r, present: days, net: Math.round((r.base * days) / WORKING_DAYS) } : r
    );
    update({ ...runs, [month]: { ...run, rows } });
  }

  const approve = () => update({ ...runs, [month]: { ...run, status: "Approved" } });
  const total = run ? run.rows.reduce((a, r) => a + r.net, 0) : 0;
  const locked = run?.status === "Approved";

  return (
    <div className="space-y-6">
      <Head
        title="Monthly Payroll"
        sub="Create the month's salary list from attendance, then approve it for payment."
        right={
          <div className="flex flex-wrap items-center gap-3">
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls} />
            <button onClick={generate} disabled={locked} className={btn}>{run ? "Regenerate payroll" : "Generate payroll"}</button>
            {run && !locked && (
              <button onClick={approve} className="h-10 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700">Approve payroll</button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Stat label="Month" value={monthLabel(month)} />
        <Stat label="Total payable" value={inr(total)} />
        <div className={`${card} p-5`}>
          <p className="text-sm text-gray-500">Status</p>
          <div className="mt-2">{run ? <Badge ok={locked} text={locked ? "Approved" : "Draft"} /> : <span className="text-sm text-gray-500">Not generated</span>}</div>
        </div>
      </div>

      <div className={card}>
        {!run ? (
          <p className="px-5 py-14 text-center text-sm text-gray-500">No payroll for {monthLabel(month)} yet. Select Generate payroll to create it.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>{["Teacher", "Designation", "Monthly net", `Days present (of ${WORKING_DAYS})`, "Payable"].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {run.rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className={td}><p className="font-medium text-gray-900">{r.name}</p><p className="text-xs text-gray-500">{r.id}</p></td>
                    <td className={td}>{r.designation}</td>
                    <td className={td}>{inr(r.base)}</td>
                    <td className={td}>
                      <input type="number" min={0} max={WORKING_DAYS} value={r.present} disabled={locked} onChange={(e) => setPresent(r.id, e.target.value)} className={`${inputCls} w-24 disabled:bg-gray-100`} />
                    </td>
                    <td className={`${td} font-semibold text-gray-900`}>{inr(r.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}