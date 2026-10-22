import { useState } from "react";
import { Head, card, inputCls, th, td, money, sumAmounts, PAYMENTS } from "./feesShared";

export default function Reconciliation() {
  // Bank amount typed by the accountant for each date
  const [bankAmounts, setBankAmounts] = useState<Record<string, string>>({});

  // List of unique dates that have payments
  const dates = [...new Set(PAYMENTS.map((p) => p.date))];

  return (
    <div className="space-y-6">
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
              const recorded = sumAmounts(PAYMENTS.filter((p) => p.date === date));
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
          </tbody>
        </table>
      </div>
    </div>
  );
}