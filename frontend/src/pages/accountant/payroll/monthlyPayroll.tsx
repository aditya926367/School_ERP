import { useState } from "react";
import { Head, Stat, Badge, card, inputCls, btn, th, td, inr, netOf, getStaff, loadRuns, saveRuns, monthLabel, WORKING_DAYS, daysOf } from "./payrollShared";
import type { Row, Run } from "./payrollShared";
import { todayISO } from "../../../store/feeStore";

export default function MonthlyPayroll() {
  const [month, setMonth] = useState(todayISO().slice(0, 7));
  const [runs, setRuns] = useState<Record<string, Run>>(loadRuns);
  const run = runs[month];
  // Working days for a new payroll (an existing run keeps its own value)
  const [newDays, setNewDays] = useState(WORKING_DAYS);
  const workingDays = run ? daysOf(run) : newDays;

  function update(next: Record<string, Run>) {
    setRuns(next);
    saveRuns(next);
  }

  function generate() {
    const rows: Row[] = getStaff().map((t) => {
      const base = netOf(t.s);
      return { id: t.id, name: t.name, designation: t.designation, present: newDays, base, net: base, paid: false };
    });
    update({ ...runs, [month]: { status: "Draft", rows, workingDays: newDays } });
  }

  function setPresent(id: string, value: string) {
    const days = Math.min(workingDays, Math.max(0, Number(value) || 0));
    const rows = run.rows.map((r) =>
      r.id === id ? { ...r, present: days, net: Math.round((r.base * days) / workingDays) } : r
    );
    update({ ...runs, [month]: { ...run, rows } });
  }

  // Change the working days of this month (a draft run is recalculated, an approved one is locked)
  function changeWorkingDays(value: string) {
    const days = Math.min(31, Math.max(1, Number(value) || 1));
    if (!run) {
      setNewDays(days);
      return;
    }
    const rows = run.rows.map((r) => {
      // Teachers with full attendance stay at full attendance for the new month length
      const present = r.present >= workingDays ? days : Math.min(r.present, days);
      return { ...r, present, net: Math.round((r.base * present) / days) };
    });
    update({ ...runs, [month]: { ...run, rows, workingDays: days } });
  }

  const approve = () => update({ ...runs, [month]: { ...run, status: "Approved" } });
  const total = run ? run.rows.reduce((a, r) => a + r.net, 0) : 0;
  const locked = run?.status === "Approved";

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Monthly Payroll"
        sub="Create the month's salary list from attendance, then approve it for payment."
        right={
          <div className="flex flex-wrap items-center gap-3">
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls} />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Working days
              <input
                type="number"
                min={1}
                max={31}
                value={workingDays}
                disabled={locked}
                onChange={(e) => changeWorkingDays(e.target.value)}
                className={`${inputCls} w-20`}
              />
            </label>
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
                <tr>{["Teacher", "Designation", "Monthly net", `Days present (of ${workingDays})`, "Payable"].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {run.rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className={td}><p className="font-medium text-gray-900">{r.name}</p><p className="text-xs text-gray-500">{r.id}</p></td>
                    <td className={td}>{r.designation}</td>
                    <td className={td}>{inr(r.base)}</td>
                    <td className={td}>
                      <input type="number" min={0} max={workingDays} value={r.present} disabled={locked} onChange={(e) => setPresent(r.id, e.target.value)} className={`${inputCls} w-24 disabled:bg-gray-100`} />
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