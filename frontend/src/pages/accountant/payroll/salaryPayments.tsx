// import { useState } from "react";
// import { Head, Stat, Badge, card, inputCls, btn, th, td, inr, loadRuns, saveRuns, monthLabel } from "./payrollShared";
// import type { Run } from "./payrollShared";

// export default function SalaryPayments() {
//   const [runs, setRuns] = useState<Record<string, Run>>(loadRuns);
//   const months = Object.keys(runs).filter((m) => runs[m].status === "Approved").sort().reverse();
//   const [month, setMonth] = useState(months[0] ?? "");
//   const [mode, setMode] = useState("Bank transfer");
//   const run = runs[month];

//   function pay(ids: string[]) {
//     const today = new Date().toISOString().slice(0, 10);
//     const rows = run.rows.map((r) => (ids.includes(r.id) ? { ...r, paid: true, paidOn: today, mode } : r));
//     const next = { ...runs, [month]: { ...run, rows } };
//     setRuns(next);
//     saveRuns(next);
//   }

//   const total = run ? run.rows.reduce((a, r) => a + r.net, 0) : 0;
//   const paid = run ? run.rows.filter((r) => r.paid).reduce((a, r) => a + r.net, 0) : 0;
//   const pending = run ? run.rows.filter((r) => !r.paid).map((r) => r.id) : [];

//   return (
//     <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
//       <Head
//         title="Salary Payments"
//         sub="Record which teachers have been paid for each approved month."
//         right={
//           months.length > 0 && (
//             <div className="flex flex-wrap items-center gap-3">
//               <select value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls}>
//                 {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
//               </select>
//               <select value={mode} onChange={(e) => setMode(e.target.value)} className={inputCls}>
//                 {["Bank transfer", "Cheque", "Cash"].map((m) => <option key={m}>{m}</option>)}
//               </select>
//               <button onClick={() => pay(pending)} disabled={pending.length === 0} className={btn}>Pay all pending ({pending.length})</button>
//             </div>
//           )
//         }
//       />

//       {!run ? (
//         <div className={`${card} px-5 py-14 text-center text-sm text-gray-500`}>
//           No approved payroll yet. Approve a month in Monthly Payroll to start recording payments.
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
//             <Stat label="Total payroll" value={inr(total)} />
//             <Stat label="Paid" value={inr(paid)} tone="text-green-600" />
//             <Stat label="Pending" value={inr(total - paid)} tone="text-amber-600" />
//           </div>
//           <div className={card}>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>{["Teacher", "Amount", "Status", "Paid on", "Mode", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {run.rows.map((r) => (
//                     <tr key={r.id} className="hover:bg-gray-50">
//                       <td className={td}><p className="font-medium text-gray-900">{r.name}</p><p className="text-xs text-gray-500">{r.id}</p></td>
//                       <td className={`${td} font-semibold text-gray-900`}>{inr(r.net)}</td>
//                       <td className={td}><Badge ok={r.paid} text={r.paid ? "Paid" : "Pending"} /></td>
//                       <td className={td}>{r.paidOn ?? "-"}</td>
//                       <td className={td}>{r.mode ?? "-"}</td>
//                       <td className={td}>
//                         {!r.paid && <button onClick={() => pay([r.id])} className="text-sm font-semibold text-[#27348b] hover:underline">Mark as paid</button>}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import {
  Users,
  Clock,
  IndianRupee,
  Wallet,
} from "lucide-react";

import {
  Head,
  Badge,
  card,
  inputCls,
  btn,
  th,
  td,
  inr,
  loadRuns,
  saveRuns,
  monthLabel,
} from "./payrollShared";

import type { Run } from "./payrollShared";

export default function SalaryPayments() {
  const [runs, setRuns] = useState<Record<string, Run>>(loadRuns);

  const months = Object.keys(runs)
    .filter((month) => runs[month].status === "Approved")
    .sort()
    .reverse();

  const [month, setMonth] = useState(months[0] ?? "");
  const [mode, setMode] = useState("Bank transfer");

  const run = runs[month];

  function pay(ids: string[]) {
    if (!run || ids.length === 0) return;

    const today = new Date().toISOString().slice(0, 10);

    const rows = run.rows.map((row) =>
      ids.includes(row.id) && !row.paid
        ? {
            ...row,
            paid: true,
            paidOn: today,
            mode,
          }
        : row
    );

    const next = {
      ...runs,
      [month]: {
        ...run,
        rows,
      },
    };

    setRuns(next);
    saveRuns(next);
  }

  const total = run
    ? run.rows.reduce((sum, row) => sum + row.net, 0)
    : 0;

  const paidRows = run
    ? run.rows.filter((row) => row.paid)
    : [];

  const pendingRows = run
    ? run.rows.filter((row) => !row.paid)
    : [];

  const paid = paidRows.reduce(
    (sum, row) => sum + row.net,
    0
  );

  const paidCount = paidRows.length;
  const pendingCount = pendingRows.length;
  const pendingIds = pendingRows.map((row) => row.id);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Salary Payments"
        sub="Record which teachers have been paid for each approved month."
        right={
          months.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className={inputCls}
              >
                {months.map((value) => (
                  <option key={value} value={value}>
                    {monthLabel(value)}
                  </option>
                ))}
              </select>

              <select
                value={mode}
                onChange={(event) => setMode(event.target.value)}
                className={inputCls}
              >
                {["Bank transfer", "Cheque", "Cash"].map(
                  (paymentMode) => (
                    <option key={paymentMode} value={paymentMode}>
                      {paymentMode}
                    </option>
                  )
                )}
              </select>

              <button
                onClick={() => pay(pendingIds)}
                disabled={pendingIds.length === 0}
                className={btn}
              >
                Pay all pending ({pendingIds.length})
              </button>
            </div>
          ) : null
        }
      />

      {!run ? (
        <div
          className={`${card} px-5 py-14 text-center text-sm text-gray-500`}
        >
          No approved payroll yet. Approve a month in Monthly
          Payroll to start recording payments.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Teachers paid
                </p>
                <Users
                  className="h-5 w-5 text-green-600"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {paidCount} / {run.rows.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Teachers paid for {monthLabel(month)}
              </p>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Teachers pending
                </p>
                <Clock
                  className="h-5 w-5 text-amber-600"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {pendingCount} / {run.rows.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Teachers still awaiting payment
              </p>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Total salary paid
                </p>
                <IndianRupee
                  className="h-5 w-5 text-green-600"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {inr(paid)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Paid in {monthLabel(month)}
              </p>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Salary remaining
                </p>
                <Wallet
                  className="h-5 w-5 text-amber-600"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {inr(total - paid)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Pending for {monthLabel(month)}
              </p>
            </div>
          </div>

          <div className={card}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Teacher",
                      "Amount",
                      "Status",
                      "Paid on",
                      "Mode",
                      "Action",
                    ].map((heading) => (
                      <th key={heading} className={th}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {run.rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className={td}>
                        <p className="font-medium text-gray-900">
                          {row.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {row.id}
                        </p>
                      </td>

                      <td className={`${td} font-semibold text-gray-900`}>
                        {inr(row.net)}
                      </td>

                      <td className={td}>
                        <Badge
                          ok={row.paid}
                          text={row.paid ? "Paid" : "Pending"}
                        />
                      </td>

                      <td className={td}>
                        {row.paidOn ?? "-"}
                      </td>

                      <td className={td}>
                        {row.mode ?? "-"}
                      </td>

                      <td className={td}>
                        {!row.paid && (
                          <button
                            onClick={() => pay([row.id])}
                            className="text-sm font-semibold text-[#27348b] hover:underline"
                          >
                            Mark as paid
                          </button>
                        )}
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
