// src/pages/accountant/StudentPicker.tsx
// Find one student by typing, instead of choosing from a huge dropdown.
// Works the same for 10 students or 10,000: only the best matches are shown.
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { money } from "../../store/feeStore";
import type { FeeStudent } from "../../store/feeStore";

const MAX_RESULTS = 8;

const dueOf = (student: FeeStudent) => Math.max(0, student.totalFee - student.paid);

// A student can be picked only when something is still due
const canPay = (student: FeeStudent) => dueOf(student) > 0;

// Best matches first: exact ID, ID starts with, name starts with, then anything that contains the words.
// Every word you type must be found in the name, ID or class.
function searchStudents(students: FeeStudent[], query: string): FeeStudent[] {
  const text = query.trim().toLowerCase();
  if (!text) return [];

  const words = text.split(/\s+/);

  const rank = (student: FeeStudent) => {
    const id = student.studentId.toLowerCase();
    const name = student.studentName.toLowerCase();
    if (id === text) return 0;
    if (id.startsWith(text)) return 1;
    if (name.startsWith(text)) return 2;
    return 3;
  };

  return students
    .filter((student) => {
      const haystack = `${student.studentName} ${student.studentId} ${student.className}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    })
    .sort((a, b) => rank(a) - rank(b) || a.studentName.localeCompare(b.studentName));
}

type Props = {
  students: FeeStudent[];
  value: string; // selected student ID, empty when nobody is chosen
  onChange: (studentId: string) => void;
};

export default function StudentPicker({ students, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const selected = students.find((student) => student.studentId === value);

  // ---------- A student is chosen: show a summary with a Change button ----------
  if (selected) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{selected.studentName}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              {selected.studentId} · {selected.className} · {selected.feeType}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-sm font-semibold text-[#27348b] hover:underline"
          >
            Change
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-white p-2">
            <p className="text-gray-500">Total fee</p>
            <p className="mt-0.5 font-semibold text-gray-900">{money(selected.totalFee)}</p>
          </div>
          <div className="rounded-md bg-white p-2">
            <p className="text-gray-500">Paid</p>
            <p className="mt-0.5 font-semibold text-green-700">{money(selected.paid)}</p>
          </div>
          <div className="rounded-md bg-white p-2">
            <p className="text-gray-500">Due</p>
            <p className="mt-0.5 font-semibold text-red-600">{money(dueOf(selected))}</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Nobody chosen yet: search box + best matches ----------
  const results = searchStudents(students, query);
  const shown = results.slice(0, MAX_RESULTS);

  function pick(student: FeeStudent) {
    if (!canPay(student)) return;
    onChange(student.studentId);
    setQuery("");
    setActive(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!query.trim()) return; // nothing to choose from, let the form behave normally

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, shown.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault(); // Enter picks the highlighted student, it does not submit the form
      const student = shown[active];
      if (student) pick(student);
    } else if (event.key === "Escape") {
      event.stopPropagation();
      setQuery("");
    }
  }

  return (
    <div>
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          autoFocus
          type="text"
          role="combobox"
          aria-expanded={shown.length > 0}
          aria-controls="student-picker-results"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, admission no. or student ID"
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-600"
        />
      </div>

      {query.trim() !== "" && (
        <div
          id="student-picker-results"
          role="listbox"
          className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {shown.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-gray-500">
              No student found for “{query.trim()}”.
            </p>
          ) : (
            <>
              {shown.map((student, index) => {
                const payable = canPay(student);
                const note = student.feeType === "No fee set" ? "No fee set" : "Fully paid";

                return (
                  <button
                    key={student.studentId}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    disabled={!payable}
                    onClick={() => pick(student)}
                    onMouseEnter={() => setActive(index)}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm ${
                      index === active ? "bg-blue-50" : "bg-white"
                    } ${payable ? "hover:bg-blue-50" : "cursor-not-allowed opacity-60"}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-gray-900">{student.studentName}</span>
                      <span className="block text-xs text-gray-500">
                        {student.studentId} · {student.className}
                      </span>
                    </span>
                    <span className={`shrink-0 text-xs font-semibold ${payable ? "text-red-600" : "text-gray-500"}`}>
                      {payable ? `${money(dueOf(student))} due` : note}
                    </span>
                  </button>
                );
              })}

              {results.length > shown.length && (
                <p className="border-t border-gray-100 px-3 py-2 text-center text-xs text-gray-500">
                  Showing {shown.length} of {results.length} students. Type more to narrow down.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}