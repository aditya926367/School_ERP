


import { useRef, useState } from "react";
import { useBooks } from "../../../store/libraryStore";

const CODE39: Record<string, string> = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  ".": "wwnnnnwnn",
  " ": "nwwnnnwnn",
  "*": "nwnnwnwnn",
};

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

function Barcode({ value }: { value: string }) {
  const NARROW = 2;
  const WIDE = 5;
  const encoded = "*" + value.toUpperCase() + "*";

  const bars: { x: number; w: number }[] = [];
  let x = 10;

  Array.from(encoded).forEach((ch) => {
    const pattern = CODE39[ch];

    if (!pattern) return;

    for (let i = 0; i < 9; i++) {
      const w = pattern[i] === "w" ? WIDE : NARROW;

      if (i % 2 === 0) {
        bars.push({ x, w });
      }

      x += w;
    }

    x += NARROW;
  });

  const width = x + 10;

  return (
    <svg
      width={220}
      viewBox={`0 0 ${width} 80`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, index) => (
        <rect
          key={index}
          x={bar.x}
          y={0}
          width={bar.w}
          height={60}
          fill="#000"
        />
      ))}

      <text
        x={width / 2}
        y={76}
        textAnchor="middle"
        fontSize={14}
        fontFamily="monospace"
      >
        {value.toUpperCase()}
      </text>
    </svg>
  );
}

export default function BarcodeGenerator() {
  const [books] = useBooks();

  const [bookId, setBookId] = useState("");
  const [custom, setCustom] = useState("");
  const [count, setCount] = useState("");

  const printRef = useRef<HTMLDivElement>(null);

  const selectedBook = books.find((book) => book.id === bookId);

  const value = custom.trim() || selectedBook?.id || "";

  const isValid =
    value !== "" && /^[A-Za-z0-9 .-]+$/.test(value);

  const labelCount = Math.min(
    60,
    Math.max(1, Number(count) || 1)
  );

  function handlePrint() {
    if (!printRef.current || !isValid) return;

    const win = window.open("", "_blank", "width=800,height=600");

    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Barcode Labels</title>
        </head>
        <body style="
          font-family: sans-serif;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 16px;
        ">
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Barcode Generator
        </h1>

        <p className="text-sm text-gray-500">
          Generate barcode labels for books
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
              Book
            </label>

            <select
              value={bookId}
              onChange={(e) => {
                setBookId(e.target.value);
                setCustom("");
              }}
              className={inputStyle}
            >
              <option value="">Select a book</option>

              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.id} - {book.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
              Or custom code
            </label>

            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Enter barcode value"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
              Number of labels
            </label>

            <input
              type="number"
              min={1}
              max={60}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePrint}
              disabled={!isValid || !count || Number(count) < 1}
              className="h-10 w-full rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Print labels
            </button>
          </div>
        </div>

        {books.length === 0 && (
          <p className="mt-3 text-sm text-gray-500">
            No books available. Add books in Books Management first.
          </p>
        )}

        {custom.trim() !== "" && !isValid && (
          <p className="mt-3 text-sm text-red-600">
            Only letters, numbers, space, dash and dot are allowed in a barcode.
          </p>
        )}
      </div>

      {isValid && count !== "" && Number(count) >= 1 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-900">
            Preview ({labelCount} {labelCount === 1 ? "label" : "labels"})
          </h2>

          <div ref={printRef} className="flex flex-wrap gap-3">
            {Array.from({ length: labelCount }).map((_, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #cbd5e1",
                  padding: 8,
                  width: 240,
                  textAlign: "center",
                  background: "#fff",
                }}
              >
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  {selectedBook?.title || "Library Label"}
                </div>

                <Barcode value={value} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
