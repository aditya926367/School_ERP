import { useState } from "react";
import { Head, Stat, card, inputCls, th, td, money, sumAmounts, PAYMENTS } from "./feesShared";

export default function DaybookReport() {
  // Start with the date of the latest payment
  const [date, setDate] = useState(PAYMENTS[PAYMENTS.length - 1].date);
  const todays = PAYMENTS.filter((p) => p.date === date);
  const modes = ["Cash", "UPI", "Bank", "Cheque"];

  return (
    <div className="space-y-6">
      <Head
        title="Daybook Report"
        sub="All fee payments received on one day."
        right={<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />}
      />

      <div className="grid grid-cols-2 gap-5 xl:grid-cols-5">
        <Stat label="Day total" value={money(sumAmounts(todays))} />
        {modes.map((mode) => (
          <Stat key={mode} label={mode} value={money(sumAmounts(todays.filter((p) => p.mode === mode)))} />
        ))}
      </div>

      <div className={card}>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>{["Receipt no", "Student", "Mode", "Amount"].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {todays.map((p) => (
              <tr key={p.receiptNo}>
                <td className={td}>{p.receiptNo}</td>
                <td className={td}>{p.studentName}</td>
                <td className={td}>{p.mode}</td>
                <td className={`${td} font-semibold`}>{money(p.amount)}</td>
              </tr>
            ))}
            {todays.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-500">No payments on this date.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}