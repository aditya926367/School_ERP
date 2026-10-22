import { useState } from "react";
import { Head, card, inputCls, th, td, LOGS } from "./feesShared";

export default function FeeLogs() {
  const [search, setSearch] = useState("");

  // Keep only the logs that contain the search text
  const shown = LOGS.filter((log) =>
    (log.user + log.action + log.detail).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
          </tbody>
        </table>
      </div>
    </div>
  );
}