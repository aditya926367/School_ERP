
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Search,
  Plus,
  Download,
  Wallet,
  Users,
  Receipt,
  IndianRupee,
} from "lucide-react";

export type FinanceRow = {
  id: string;
  name: string;
  detail: string;
  amount: number;
  status: string;
};

export type FinanceConfig = {
  title: string;
  description: string;
  searchPlaceholder: string;
  columns: string[];
  rows: FinanceRow[];
  actionLabel?: string;
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function FinanceModule({
  config,
}: {
  config: FinanceConfig;
}) {
  const [rows, setRows] = useState(config.rows);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) =>
      `${row.id} ${row.name} ${row.detail} ${row.status}`
        .toLowerCase()
        .includes(query),
    );
  }, [rows, search]);

  const total = filtered.reduce((sum, row) => sum + row.amount, 0);
  const pending = filtered
    .filter((row) => /pending|unpaid|due/i.test(row.status))
    .reduce((sum, row) => sum + row.amount, 0);

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !detail.trim() || Number(amount) <= 0) {
      setNotice("Enter a name, description and amount greater than zero.");
      return;
    }

    const record: FinanceRow = {
      id: `FIN${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      detail: detail.trim(),
      amount: Number(amount),
      status: "Active",
    };

    setRows((current) => [record, ...current]);
    setName("");
    setDetail("");
    setAmount("");
    setShowForm(false);
    setNotice("Record added in this page's temporary state.");
  }

  function exportCSV() {
    const csvRows = [
      ["ID", "Name", "Details", "Amount (INR)", "Status"],
      ...filtered.map((row) => [
        row.id,
        row.name,
        row.detail,
        String(row.amount),
        row.status,
      ]),
    ];

    const csv = csvRows
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${config.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {config.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {config.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Download size={17} />
            Export CSV
          </button>

          {config.actionLabel && (
            <button
              onClick={() => {
                setNotice("");
                setShowForm((value) => !value);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              {config.actionLabel}
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800"
        >
          {notice}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={addRecord}
          className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-5 sm:grid-cols-3"
        >
          <label className="space-y-1.5 text-sm font-medium">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 font-normal"
              placeholder="Enter name"
              required
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium">
            Description
            <input
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 font-normal"
              placeholder="Class, fee type or reference"
              required
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium">
            Amount (₹)
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 font-normal"
              placeholder="Enter amount"
              required
            />
          </label>

          <div className="flex gap-2 sm:col-span-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Save Record
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Records</span>
            <Users className="text-blue-600" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold">{filtered.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Amount</span>
            <IndianRupee className="text-green-600" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold">{money(total)}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Pending Amount</span>
            <Wallet className="text-amber-600" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold">{money(pending)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              {config.title} Records
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filtered.length} records found
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={config.searchPlaceholder}
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                {config.columns.map((column) => (
                  <th key={column} className="px-5 py-4">
                    {column}
                  </th>
                ))}
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">{row.id}</td>
                  <td className="px-5 py-4">{row.name}</td>
                  <td className="px-5 py-4">{row.detail}</td>
                  <td className="px-5 py-4 font-semibold">
                    {money(row.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={config.columns.length + 2}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    <Receipt className="mx-auto mb-2" size={24} />
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t px-5 py-3 text-xs text-gray-500">
          Demo data only. Records added here are not saved to the database.
        </div>
      </div>
    </div>
  );
}
