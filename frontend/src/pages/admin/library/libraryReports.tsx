





type LibraryReportData = {
  books: {
    id: number;
    title: string;
    author: string;
    category: string;
  }[];
  copies: {
    id: number;
    bookId: number;
    status: string;
  }[];
  issues: {
    id: number;
    bookId: number;
    memberName: string;
    memberCode: string;
    issueDate: string;
    dueDate: string;
    returnDate: string | null;
  }[];
  fines: {
    id: number;
    amount: number;
    paid: boolean;
  }[];
  finePerDay: number;
};

type LibraryReportsProps = {
  data?: LibraryReportData;
  loading?: boolean;
};

export default function LibraryReports({
  data,
  loading = false,
}: LibraryReportsProps) {
  const books = data?.books ?? [];
  const copies = data?.copies ?? [];
  const issues = data?.issues ?? [];
  const fines = data?.fines ?? [];
  const finePerDay = data?.finePerDay ?? 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysLate = (dueDate: string) => {
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    return Math.max(
      0,
      Math.floor((today.getTime() - due.getTime()) / 86400000)
    );
  };

  const activeIssues = issues.filter((issue) => !issue.returnDate);

  const overdueIssues = activeIssues.filter(
    (issue) => getDaysLate(issue.dueDate) > 0
  );

  const pendingFineAmount = fines
    .filter((fine) => !fine.paid)
    .reduce((total, fine) => total + Number(fine.amount), 0);

  const summary = [
    {
      label: "Total Book Copies",
      value: copies.length.toLocaleString("en-IN"),
      color: "text-[#27348b]",
    },
    {
      label: "Currently Issued",
      value: activeIssues.length.toLocaleString("en-IN"),
      color: "text-yellow-600",
    },
    {
      label: "Overdue",
      value: overdueIssues.length.toLocaleString("en-IN"),
      color: "text-red-600",
    },
    {
      label: "Pending Fines",
      value: `₹${pendingFineAmount.toLocaleString("en-IN")}`,
      color: "text-red-600",
    },
  ];

  const categoryCounts = books.reduce<Record<string, number>>(
    (result, book) => {
      const category = book.category?.trim() || "Uncategorized";
      result[category] = (result[category] || 0) + 1;
      return result;
    },
    {}
  );

  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const mostIssued = Object.values(
    activeIssues.reduce<
      Record<
        number,
        { bookId: number; title: string; author: string; times: number }
      >
    >((result, issue) => {
      const book = books.find((item) => item.id === issue.bookId);

      if (!book) return result;

      if (!result[issue.bookId]) {
        result[issue.bookId] = {
          bookId: issue.bookId,
          title: book.title,
          author: book.author,
          times: 0,
        };
      }

      result[issue.bookId].times += 1;
      return result;
    }, {})
  ).sort((a, b) => b.times - a.times);

  const overdue = overdueIssues.map((issue) => {
    const book = books.find((item) => item.id === issue.bookId);
    const daysLate = getDaysLate(issue.dueDate);

    return {
      ...issue,
      bookTitle: book?.title ?? "Unknown Book",
      daysLate,
      fine: daysLate * finePerDay,
    };
  });

  function exportCsv() {
    if (mostIssued.length === 0) return;

    const header = ["Book", "Author", "Times Issued"];

    const rows = mostIssued.map((book) => [
      book.title,
      book.author,
      book.times,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "most-issued-books.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const maxCategory = Math.max(
    1,
    ...categories.map((category) => category.count)
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading library reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Library Reports
          </h1>
          <p className="text-sm text-gray-500">
            Overview of books, issues and fines
          </p>
        </div>

        <button
          onClick={exportCsv}
          disabled={mostIssued.length === 0}
          className="h-10 rounded-lg border border-[#27348b] bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="text-xs font-semibold uppercase text-gray-500">
              {item.label}
            </div>
            <div className={`mt-1 text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Categories */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Books by Category
          </h2>

          {categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No book categories available.
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="mb-1 flex justify-between text-sm text-gray-700">
                    <span>{category.name}</span>
                    <span className="font-semibold">{category.count}</span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2.5 rounded-full bg-[#27348b]"
                      style={{
                        width: `${(category.count / maxCategory) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most issued */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <h2 className="border-b border-gray-200 p-4 text-base font-semibold text-gray-900">
            Most Issued Books
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-800">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">Times Issued</th>
                </tr>
              </thead>
              <tbody>
                {mostIssued.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No issue history available.
                    </td>
                  </tr>
                ) : (
                  mostIssued.map((book, index) => (
                    <tr key={book.bookId} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{book.title}</div>
                        <div className="text-xs text-gray-500">
                          {book.author}
                        </div>
                      </td>
                      <td className="px-4 py-3">{book.times}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Overdue */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-200 p-4 text-base font-semibold text-gray-900">
          Overdue Books
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Days Late</th>
                <th className="px-4 py-3">Fine</th>
              </tr>
            </thead>
            <tbody>
              {overdue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No overdue books found.
                  </td>
                </tr>
              ) : (
                overdue.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-semibold">
                      {item.memberName} ({item.memberCode})
                    </td>
                    <td className="px-4 py-3">{item.bookTitle}</td>
                    <td className="px-4 py-3">{item.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        {item.daysLate} days
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      ₹{item.fine.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
