

// Sample data, replace with API data later
const summary = [
  { label: "Total Books", value: "1,250", color: "text-[#27348b]" },
  { label: "Currently Issued", value: "184", color: "text-yellow-600" },
  { label: "Overdue", value: "23", color: "text-red-600" },
  { label: "Pending Fines", value: "₹1,150", color: "text-red-600" },
];

const categories = [
  { name: "Fiction", count: 360 },
  { name: "Science", count: 320 },
  { name: "History", count: 210 },
  { name: "Biography", count: 150 },
  { name: "Poetry", count: 120 },
  { name: "Finance", count: 90 },
];

const mostIssued = [
  { title: "Wings of Fire", author: "A.P.J. Abdul Kalam", times: 48 },
  { title: "Concept of Physics", author: "H.C. Verma", times: 41 },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", times: 35 },
  { title: "Gitanjali", author: "Rabindranath Tagore", times: 28 },
  { title: "Discovery of India", author: "Jawaharlal Nehru", times: 22 },
];

const overdue = [
  { member: "Aarav Sharma (M101)", book: "Wings of Fire", dueDate: "2026-10-05", daysLate: 8 },
  { member: "Mrs. Sunita Rao (M201)", book: "Gitanjali", dueDate: "2026-10-03", daysLate: 10 },
  { member: "Rohit Gupta (M103)", book: "Discovery of India", dueDate: "2026-10-09", daysLate: 4 },
];

const FINE_PER_DAY = 5; // rupees

export default function LibraryReports() {
  const maxCategory = Math.max(...categories.map((c) => c.count));

  // Downloads the "most issued" table as a CSV file
  function exportCsv() {
    const header = "title,author,times_issued";
    const lines = mostIssued.map((b) => `${b.title},${b.author},${b.times}`);
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "most-issued-books.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library Reports</h1>
          <p className="text-sm text-gray-500">Overview of books, issues and fines</p>
        </div>

        <button
          onClick={exportCsv}
          className="h-10 rounded-lg border border-[#27348b] px-4 text-sm font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
        >
          Export Most Issued (CSV)
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase text-gray-500">{s.label}</div>
            <div className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Books by category (simple bar chart) */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Books by Category</h2>

          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex justify-between text-sm text-gray-700">
                  <span>{c.name}</span>
                  <span className="font-semibold">{c.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2.5 rounded-full bg-[#27348b]"
                    style={{ width: `${(c.count / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most issued books */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <h2 className="border-b border-gray-200 p-4 text-base font-semibold text-gray-900">
            Most Issued Books
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-800">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">Times Issued</th>
                </tr>
              </thead>
              <tbody>
                {mostIssued.map((b, i) => (
                  <tr key={b.title} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{b.title}</div>
                      <div className="text-xs text-gray-500">{b.author}</div>
                    </td>
                    <td className="px-4 py-3">{b.times}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Overdue books */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-200 p-4 text-base font-semibold text-gray-900">
          Overdue Books
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Days Late</th>
                <th className="px-4 py-3">Fine</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map((o) => (
                <tr key={o.member + o.book} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{o.member}</td>
                  <td className="px-4 py-3">{o.book}</td>
                  <td className="px-4 py-3">{o.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      {o.daysLate} days
                    </span>
                  </td>
                  <td className="px-4 py-3">₹{o.daysLate * FINE_PER_DAY}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}