
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, Plus, X } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import type { DataTableColumn } from "../../components/common/DataTable";

import {
  EditButton,
  DeleteButton,
} from "../../components/common/ActionButtons";

type HolidayCategory =
  | "Public Holiday"
  | "School Holiday"
  | "Event";

interface Holiday {
  id: number;
  name: string;
  date: string;
  category: HolidayCategory;
  description: string;
}

type HolidayForm = Omit<Holiday, "id">;

const INITIAL_HOLIDAYS: Holiday[] = [
  {
    id: 1,
    name: "Diwali",
    date: "2026-11-08",
    category: "Public Holiday",
    description: "Festival of lights",
  },
  {
    id: 2,
    name: "Children's Day",
    date: "2026-11-14",
    category: "School Holiday",
    description: "School celebration",
  },
  {
    id: 3,
    name: "Winter Break Begins",
    date: "2026-12-24",
    category: "School Holiday",
    description: "Winter vacation",
  },
];

const EMPTY_FORM: HolidayForm = {
  name: "",
  date: "",
  category: "School Holiday",
  description: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10";

function formatDate(value: string): string {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function HolidaysCalender() {
  const [holidays, setHolidays] =
    useState<Holiday[]>(INITIAL_HOLIDAYS);

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<HolidayForm>(EMPTY_FORM);
  const [error, setError] = useState("");

  const filteredHolidays = useMemo(() => {
    const query = search.trim().toLowerCase();

    return holidays
      .filter((holiday) =>
        [
          holiday.name,
          holiday.date,
          holiday.category,
          holiday.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [holidays, search]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (holiday: Holiday) => {
    setEditingId(holiday.id);

    setForm({
      name: holiday.name,
      date: holiday.date,
      category: holiday.category,
      description: holiday.description,
    });

    setError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleDelete = (id: number) => {
    const holiday = holidays.find((item) => item.id === id);

    if (!holiday) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${holiday.name}"?`,
    );

    if (!confirmed) return;

    setHolidays((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const name = form.name.trim();

    if (!name || !form.date) {
      setError("Holiday name and date are required.");
      return;
    }

    const duplicate = holidays.some(
      (holiday) =>
        holiday.id !== editingId &&
        holiday.date === form.date &&
        holiday.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      setError(
        "A holiday with this name and date already exists.",
      );
      return;
    }

    if (editingId !== null) {
      setHolidays((current) =>
        current.map((holiday) =>
          holiday.id === editingId
            ? { ...holiday, ...form, name }
            : holiday,
        ),
      );
    } else {
      const newHoliday: Holiday = {
        ...form,
        name,
        id: Date.now(),
      };

      setHolidays((current) => [...current, newHoliday]);
    }

    closeForm();
  };

  const columns: DataTableColumn<Holiday>[] = [
    {
      key: "holiday",
      header: "Holiday",
      render: (holiday) => (
        <div>
          <p className="font-medium text-gray-800">
            {holiday.name}
          </p>

          {holiday.description && (
            <p className="mt-1 text-xs text-gray-500">
              {holiday.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (holiday) => (
        <span className="whitespace-nowrap text-sm text-gray-600">
          {formatDate(holiday.date)}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (holiday) => {
        const categoryClass =
          holiday.category === "Public Holiday"
            ? "bg-blue-50 text-blue-700"
            : holiday.category === "Event"
              ? "bg-purple-50 text-purple-700"
              : "bg-green-50 text-green-700";

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${categoryClass}`}
          >
            {holiday.category}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-28",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (holiday) => (
        <div className="flex items-center justify-end gap-2">
          <EditButton
            onClick={() => openEditForm(holiday)}
          />

          <DeleteButton
            onClick={() => handleDelete(holiday.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      {/* Page header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#27348b]/10 text-[#27348b]">
            <CalendarDays size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Holidays Calendar
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage school holidays and events.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
        >
          <Plus size={18} />
          Add Holiday
        </button>
      </header>

      {/* Holiday table */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Holiday Schedule
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredHolidays.length}{" "}
              {filteredHolidays.length === 1
                ? "record"
                : "records"}
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search holidays..."
            aria-label="Search holidays"
            className={`${inputClass} sm:max-w-xs`}
          />
        </div>

        <DataTable
          data={filteredHolidays}
          columns={columns}
          rowKey={(holiday) => holiday.id}
          emptyState={
            <p className="text-sm text-gray-500">
              No holidays found. Add a holiday or change your search.
            </p>
          }
        />
      </section>

      {/* Add/Edit modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="holiday-form-title"
            className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2
                  id="holiday-form-title"
                  className="text-lg font-semibold text-gray-800"
                >
                  {editingId === null
                    ? "Add Holiday"
                    : "Edit Holiday"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the holiday details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >
              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div>
                <label
                  htmlFor="holiday-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Holiday Name *
                </label>

                <input
                  id="holiday-name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="e.g. Republic Day"
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="holiday-date"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Date *
                </label>

                <input
                  id="holiday-date"
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="holiday-category"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>

                <select
                  id="holiday-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value as HolidayCategory,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="Public Holiday">
                    Public Holiday
                  </option>
                  <option value="School Holiday">
                    School Holiday
                  </option>
                  <option value="Event">Event</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="holiday-description"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="holiday-description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className={`${inputClass} resize-y`}
                  rows={3}
                  placeholder="Optional details"
                  maxLength={300}
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
                >
                  {editingId === null
                    ? "Add Holiday"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
