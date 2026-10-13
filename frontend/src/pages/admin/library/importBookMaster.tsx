
import { useState } from "react";
import type { ChangeEvent } from "react";

type ImportRow = {
  line: number;
  title: string;
  author: string;
  category: string;
  copies: string;
  error: string; // empty string means the row is valid
};

const SAMPLE_CSV =
  "title,author,category,copies\n" +
  "Wings of Fire,A.P.J. Abdul Kalam,Biography,5\n" +
  "Gitanjali,Rabindranath Tagore,Poetry,4\n";

// Simple CSV parser: first line is the header, values are split by comma
function parseCsv(text: string): ImportRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");

  return lines.slice(1).map((line, i) => {
    const [title = "", author = "", category = "", copies = ""] = line
      .split(",")
      .map((c) => c.trim());

    let error = "";
    if (!title || !author) {
      error = "Title and author are required";
    } else if (!Number.isInteger(Number(copies)) || Number(copies) < 1) {
      error = "Copies must be a whole number of 1 or more";
    }

    return { line: i + 2, title, author, category: category || "Other", copies, error };
  });
}

export default function ImportBookMaster() {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  const validRows = rows.filter((r) => r.error === "");
  const invalidCount = rows.length - validRows.length;

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("");
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => setRows(parseCsv(String(reader.result)));
    reader.readAsText(file);

    e.target.value = ""; // allows choosing the same file again
  }

  function downloadTemplate() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "book-master-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    // Later: send validRows to the backend API here
    setMessage(`${validRows.length} books imported successfully`);
    setRows([]);
    setFileName("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import BookMaster</h1>
        <p className="text-sm text-gray-500">Bulk import book records from a CSV file</p>
      </div>

      {/* Upload card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Step 1: Choose a CSV file</h2>
        <p className="mb-4 text-sm text-gray-500">
          Columns must be: <b>title, author, category, copies</b>
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="text-sm text-gray-700 file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-[#27348b] file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-[#1f2a73]"
          />
          <button
            onClick={downloadTemplate}
            className="h-10 rounded-lg border border-[#27348b] px-4 text-sm font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
          >
            Download sample template
          </button>
        </div>

        {fileName && <p className="mt-3 text-sm text-gray-600">Selected file: <b>{fileName}</b></p>}
        {message && <p className="mt-3 text-sm font-semibold text-green-700">{message}</p>}
      </div>

      {/* Preview card */}
      {rows.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Step 2: Preview</h2>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-green-700">{validRows.length} valid</span>
                {" · "}
                <span className="font-semibold text-red-600">{invalidCount} with errors</span>
              </p>
            </div>

            <button
              onClick={handleImport}
              disabled={validRows.length === 0}
              className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Import {validRows.length} valid books
            </button>
          </div>

          <div className="max-h-[420px] overflow-auto">
            <table className="w-full text-left text-sm text-gray-800">
              <thead className="sticky top-0 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Line</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Copies</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.line}
                    className={`border-t border-gray-200 ${r.error ? "bg-red-50" : ""}`}
                  >
                    <td className="px-4 py-3 text-gray-500">{r.line}</td>
                    <td className="px-4 py-3">{r.title}</td>
                    <td className="px-4 py-3">{r.author}</td>
                    <td className="px-4 py-3">{r.category}</td>
                    <td className="px-4 py-3">{r.copies}</td>
                    <td className="px-4 py-3">
                      {r.error ? (
                        <span className="text-xs font-medium text-red-700">{r.error}</span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          Valid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}