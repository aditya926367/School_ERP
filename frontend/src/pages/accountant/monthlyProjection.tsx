import { Head, card, th, td, money, outstanding, sumAmounts, STUDENTS, PAYMENTS } from "./feesShared";

export default function MonthlyProjection() {
  // Unique months (YYYY-MM) taken from the due dates
  const months = [...new Set(STUDENTS.map((s) => s.dueDate.slice(0, 7)))].sort();

  return (
    <div className="space-y-6">
      <Head
        title="Monthly Projection"
        sub="How much fee we expect to collect each month, based on the due dates."
      />

      <div className={card}>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Month", "Expected (pending dues)", "Collected so far", "Still to collect"].map((h) => (
                <th key={h} className={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {months.map((month) => {
              const expected = STUDENTS
                .filter((s) => s.dueDate.startsWith(month))
                .reduce((sum, s) => sum + outstanding(s), 0);
              const collected = sumAmounts(PAYMENTS.filter((p) => p.date.startsWith(month)));
              return (
                <tr key={month}>
                  <td className={td}>{month}</td>
                  <td className={td}>{money(expected)}</td>
                  <td className={`${td} text-green-700`}>{money(collected)}</td>
                  <td className={`${td} font-semibold`}>{money(Math.max(0, expected - collected))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}