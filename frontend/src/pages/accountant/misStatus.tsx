import { Head, Stat, card, th, td, money, outstanding, STUDENTS } from "./feesShared";

export default function MisStatus() {
  const totalFee = STUDENTS.reduce((sum, s) => sum + s.total, 0);
  const collected = STUDENTS.reduce((sum, s) => sum + s.paid, 0);
  const pending = totalFee - collected;
  const percent = Math.round((collected / totalFee) * 100);

  // Unique class names, for the class-wise table
  const classes = [...new Set(STUDENTS.map((s) => s.className))].sort();

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head title="MIS Status" sub="A quick summary of fee collection for the school." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total fee" value={money(totalFee)} />
        <Stat label="Collected" value={money(collected)} tone="text-green-600" />
        <Stat label="Pending" value={money(pending)} tone="text-red-600" />
        <Stat label="Collection rate" value={percent + "%"} />
      </div>

      <div className={card}>
        <h2 className="border-b border-gray-200 p-5 text-lg font-semibold">Class-wise collection</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>{["Class", "Total", "Collected", "Pending", "Progress"].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.map((className) => {
              const list = STUDENTS.filter((s) => s.className === className);
              const total = list.reduce((sum, s) => sum + s.total, 0);
              const paid = list.reduce((sum, s) => sum + s.paid, 0);
              const due = list.reduce((sum, s) => sum + outstanding(s), 0);
              const rate = Math.round((paid / total) * 100);
              return (
                <tr key={className}>
                  <td className={td}>{className}</td>
                  <td className={td}>{money(total)}</td>
                  <td className={td}>{money(paid)}</td>
                  <td className={td}>{money(due)}</td>
                  <td className={td}>
                    <div className="h-2 w-32 rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: rate + "%" }} />
                    </div>
                    <span className="text-xs text-gray-500">{rate}%</span>
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