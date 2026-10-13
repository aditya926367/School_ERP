
import { useState } from "react";
import type { FormEvent } from "react";

type IssueRule = {
  maxBooks: string;
  loanDays: string;
  maxRenewals: string;
};

type Settings = {
  libraryName: string;
  openTime: string;
  closeTime: string;
  workingDays: string[];
  student: IssueRule;
  staff: IssueRule;
  finePerDay: string;
  graceDays: string;
  maxFine: string;
};

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Default values shown when the page opens and when "Reset" is clicked
const defaultSettings: Settings = {
  libraryName: "Central Library",
  openTime: "08:00",
  closeTime: "16:00",
  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  student: { maxBooks: "2", loanDays: "14", maxRenewals: "1" },
  staff: { maxBooks: "5", loanDays: "30", maxRenewals: "2" },
  finePerDay: "5",
  graceDays: "0",
  maxFine: "500",
};

const defaultCategories = ["Science", "History", "Biography", "Poetry", "Finance", "Fiction"];

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";

const labelStyle = "mb-1 block text-xs font-semibold uppercase text-gray-500";

// Returns true when the text is a whole number that is at least `min`
function isWholeNumber(value: string, min: number): boolean {
  const n = Number(value);
  return value.trim() !== "" && Number.isInteger(n) && n >= min;
}

export default function LibrarySetup() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Updates one top-level field, for example libraryName
  function setField<K extends keyof Settings>(key: K, value: Settings[K]) {
    setMessage("");
    setSettings({ ...settings, [key]: value });
  }

  // Updates one field inside the student or staff rule
  function setRule(who: "student" | "staff", key: keyof IssueRule, value: string) {
    setMessage("");
    setSettings({ ...settings, [who]: { ...settings[who], [key]: value } });
  }

  // Turns a working day on or off
  function toggleDay(day: string) {
    setMessage("");
    const days = settings.workingDays.includes(day)
      ? settings.workingDays.filter((d) => d !== day)
      : [...settings.workingDays, day];

    // keep the days in Mon..Sun order
    setSettings({ ...settings, workingDays: ALL_DAYS.filter((d) => days.includes(d)) });
  }

  function addCategory() {
    const name = newCategory.trim();
    if (!name) return;

    // do not allow the same category twice (ignore upper/lower case)
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setError("This category already exists");
      return;
    }

    setError("");
    setMessage("");
    setCategories([...categories, name]);
    setNewCategory("");
  }

  function removeCategory(name: string) {
    setMessage("");
    setCategories(categories.filter((c) => c !== name));
  }

  function handleReset() {
    setSettings(defaultSettings);
    setCategories(defaultCategories);
    setNewCategory("");
    setError("");
    setMessage("");
  }

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!settings.libraryName.trim()) {
      setError("Library name is required");
      return;
    }
    if (settings.closeTime <= settings.openTime) {
      setError("Closing time must be after opening time");
      return;
    }
    if (settings.workingDays.length === 0) {
      setError("Select at least one working day");
      return;
    }

    // Check the rules of both member types
    for (const who of ["student", "staff"] as const) {
      const rule = settings[who];
      const name = who === "student" ? "Student" : "Staff";

      if (!isWholeNumber(rule.maxBooks, 1)) {
        setError(`${name}: max books must be 1 or more`);
        return;
      }
      if (!isWholeNumber(rule.loanDays, 1)) {
        setError(`${name}: loan days must be 1 or more`);
        return;
      }
      if (!isWholeNumber(rule.maxRenewals, 0)) {
        setError(`${name}: renewals must be 0 or more`);
        return;
      }
    }

    if (!isWholeNumber(settings.finePerDay, 0)) {
      setError("Fine per day must be 0 or more");
      return;
    }
    if (!isWholeNumber(settings.graceDays, 0)) {
      setError("Grace days must be 0 or more");
      return;
    }
    if (!isWholeNumber(settings.maxFine, 0)) {
      setError("Maximum fine must be 0 or more");
      return;
    }

    // Later: send settings and categories to the backend API here
    setError("");
    setMessage("Library settings saved successfully");
  }

  // One row of the issue rules table (used for Student and Staff)
  function renderRuleRow(who: "student" | "staff", title: string) {
    const rule = settings[who];

    return (
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-4">
        <div className="pb-2 text-sm font-semibold text-gray-900">{title}</div>

        <div>
          <label className={labelStyle}>Max books</label>
          <input
            type="number"
            min={1}
            value={rule.maxBooks}
            onChange={(e) => setRule(who, "maxBooks", e.target.value)}
            className={inputStyle}
          />
        </div>

        <div>
          <label className={labelStyle}>Loan days</label>
          <input
            type="number"
            min={1}
            value={rule.loanDays}
            onChange={(e) => setRule(who, "loanDays", e.target.value)}
            className={inputStyle}
          />
        </div>

        <div>
          <label className={labelStyle}>Max renewals</label>
          <input
            type="number"
            min={0}
            value={rule.maxRenewals}
            onChange={(e) => setRule(who, "maxRenewals", e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Library Setup</h1>
        <p className="text-sm text-gray-500">Configure library rules, fines and book categories</p>
      </div>

      {/* ================= GENERAL ================= */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">General</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelStyle}>Library name</label>
            <input
              value={settings.libraryName}
              onChange={(e) => setField("libraryName", e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Opening time</label>
            <input
              type="time"
              value={settings.openTime}
              onChange={(e) => setField("openTime", e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Closing time</label>
            <input
              type="time"
              value={settings.closeTime}
              onChange={(e) => setField("closeTime", e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelStyle}>Working days</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => {
              const active = settings.workingDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`h-9 rounded-lg border px-4 text-sm font-semibold ${
                    active
                      ? "border-[#27348b] bg-[#27348b] text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= ISSUE RULES ================= */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Issue Rules</h2>
        <p className="mb-4 text-sm text-gray-500">How many books a member can take and for how long</p>

        <div className="space-y-4">
          {renderRuleRow("student", "Students")}
          <div className="border-t border-gray-200" />
          {renderRuleRow("staff", "Staff")}
        </div>
      </div>

      {/* ================= FINE SETTINGS ================= */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Fine Settings</h2>
        <p className="mb-4 text-sm text-gray-500">Charged when a book is returned after the due date</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelStyle}>Fine per day (₹)</label>
            <input
              type="number"
              min={0}
              value={settings.finePerDay}
              onChange={(e) => setField("finePerDay", e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Grace days</label>
            <input
              type="number"
              min={0}
              value={settings.graceDays}
              onChange={(e) => setField("graceDays", e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Maximum fine per book (₹)</label>
            <input
              type="number"
              min={0}
              value={settings.maxFine}
              onChange={(e) => setField("maxFine", e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* ================= BOOK CATEGORIES ================= */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Book Categories</h2>
        <p className="mb-4 text-sm text-gray-500">These categories appear when you add a book</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              // Enter adds the category instead of submitting the whole form
              if (e.key === "Enter") {
                e.preventDefault();
                addCategory();
              }
            }}
            placeholder="e.g. Computer Science"
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] sm:w-[320px]"
          />
          <button
            type="button"
            onClick={addCategory}
            className="h-10 rounded-lg border border-[#27348b] px-4 text-sm font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
          >
            + Add Category
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
            >
              {c}
              <button
                type="button"
                onClick={() => removeCategory(c)}
                className="text-lg leading-none text-blue-400 hover:text-red-600"
                aria-label={`Remove ${c}`}
              >
                ×
              </button>
            </span>
          ))}

          {categories.length === 0 && (
            <p className="text-sm text-gray-500">No categories yet. Add the first one above.</p>
          )}
        </div>
      </div>

      {/* ================= SAVE BAR ================= */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          {error && <p className="font-semibold text-red-600">{error}</p>}
          {message && <p className="font-semibold text-green-700">{message}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Reset to default
          </button>
          <button
            type="submit"
            className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </form>
  );
}