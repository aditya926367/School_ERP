import { useState } from "react";
import { Head, card, inputCls, th, td } from "./feesShared";
import { useFees, money, sumAmounts } from "../../store/feeStore";

export default function Reconciliation() {
  const { payments } = useFees();

  // Bank amount typed by the accountant for each date
  const [bankAmounts, setBankAmounts] = useState<Record<string, string>>({});

  // Unique dates that have payments, newest first
  const dates = [...new Set(payments.map((p) => p.date))].sort().reverse();

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Reconciliation"
        sub="Compare the payments in our records with the amount shown in the bank statement."
      />

      <div className={card}>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Date", "Recorded in system", "Bank statement amount", "Difference", "Result"].map((h) => (
                <th key={h} className={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dates.map((date) => {
              const recorded = sumAmounts(payments.filter((p) => p.date === date));
              const typed = bankAmounts[date] ?? "";
              const difference = Number(typed) - recorded;
              const matched = typed !== "" && difference === 0;

              return (
                <tr key={date}>
                  <td className={td}>{date}</td>
                  <td className={td}>{money(recorded)}</td>
                  <td className={td}>
                    <input
                      type="number"
                      value={typed}
                      onChange={(e) => setBankAmounts({ ...bankAmounts, [date]: e.target.value })}
                      className={`${inputCls} w-40`}
                      placeholder="Enter amount"
                    />
                  </td>
                  <td className={td}>{typed === "" ? "-" : money(difference)}</td>
                  <td className={td}>
                    {typed === "" ? "-" : matched
                      ? <span className="font-semibold text-green-700">Matched</span>
                      : <span className="font-semibold text-red-600">Mismatch</span>}
                  </td>
                </tr>
              );
            })}
            {dates.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-500">No payments recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}