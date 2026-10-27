import { useState } from "react";
import { Head, card, inputCls, th, td } from "./feesShared";
import { useFees } from "../../store/feeStore";

export default function FeeLogs() {
  const { logs } = useFees();
  const [search, setSearch] = useState("");

  // Keep only the logs that contain the search text
  const shown = logs.filter((log) =>
    (log.user + log.action + log.detail).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Fee Logs"
        sub="A record of every fee related action done in the system."
        right={<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs" className={`${inputCls} w-64`} />}
      />

      <div className={card}>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>{["Time", "User", "Action", "Details"].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shown.map((log) => (
              <tr key={log.time + log.detail}>
                <td className={td}>{log.time}</td>
                <td className={td}>{log.user}</td>
                <td className={`${td} font-medium text-gray-900`}>{log.action}</td>
                <td className={td}>{log.detail}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-500">No logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}