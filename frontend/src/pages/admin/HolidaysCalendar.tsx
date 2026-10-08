import {
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: "Holiday" | "Event" | "Working Day";
  description: string;
}

function HolidaysCalendar() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Independence Day",
      date: "2026-08-15",
      type: "Holiday",
      description: "National holiday",
    },
    {
      id: 2,
      title: "Teachers' Day",
      date: "2026-09-05",
      type: "Event",
      description: "School celebration",
    },
    {
      id: 3,
      title: "Gandhi Jayanti",
      date: "2026-10-02",
      type: "Holiday",
      description: "National holiday",
    },
    {
      id: 4,
      title: "Annual Sports Day",
      date: "2026-11-14",
      type: "Event",
      description: "Annual school sports event",
    },
    {
      id: 5,
      title: "Winter Working Saturday",
      date: "2026-12-12",
      type: "Working Day",
      description: "Special working Saturday",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    date: "",
    type: "Holiday" as CalendarEvent["type"],
    description: "",
  });

  const handleAddEvent = () => {
    if (!form.title || !form.date) return;

    setEvents([
      ...events,
      {
        id: Date.now(),
        title: form.title,
        date: form.date,
        type: form.type,
        description: form.description,
      },
    ]);

    setForm({
      title: "",
      date: "",
      type: "Holiday",
      description: "",
    });

    setShowForm(false);
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const filteredEvents = events.filter((event) => {
    const value = search.toLowerCase();

    return (
      event.title.toLowerCase().includes(value) ||
      event.type.toLowerCase().includes(value) ||
      event.description.toLowerCase().includes(value)
    );
  });

  const holidays = events.filter(
    (event) => event.type === "Holiday"
  ).length;

  const schoolEvents = events.filter(
    (event) => event.type === "Event"
  ).length;

  const workingDays = events.filter(
    (event) => event.type === "Working Day"
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Holidays & Academic Calendar
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage holidays, school events and working days.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
        >
          <Plus size={18} />
          Add Calendar Entry
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Holidays</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {holidays}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">School Events</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {schoolEvents}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Working Days</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {workingDays}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Preview */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Academic Calendar
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Calendar overview for the academic year.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="min-w-28 text-center text-sm font-semibold text-gray-700">
              2026
            </span>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-medium text-red-600">
              Upcoming Holiday
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-800">
              Gandhi Jayanti
            </p>

            <p className="mt-1 text-xs text-gray-500">
              02 Oct 2026
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600">
              Upcoming Event
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-800">
              Annual Sports Day
            </p>

            <p className="mt-1 text-xs text-gray-500">
              14 Nov 2026
            </p>
          </div>

          <div className="rounded-lg border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-medium text-green-600">
              Working Day
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-800">
              Winter Working Saturday
            </p>

            <p className="mt-1 text-xs text-gray-500">
              12 Dec 2026
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Entries */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Calendar Entries
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All holidays, events and working days.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search calendar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Title
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredEvents
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      {formatDate(event.date)}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      {event.title}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          event.type === "Holiday"
                            ? "bg-red-50 text-red-700"
                            : event.type === "Event"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-green-50 text-green-700"
                        }`}
                      >
                        {event.type}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {event.description || "—"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#27348b]"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteEvent(event.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {filteredEvents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No calendar entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Calendar Entry
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add a holiday, event or working day.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Title
                </label>

                <input
                  type="text"
                  placeholder="Example: Diwali Holiday"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date
                </label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Entry Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as CalendarEvent["type"],
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                >
                  <option value="Holiday">Holiday</option>
                  <option value="Event">Event</option>
                  <option value="Working Day">Working Day</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows={3}
                  placeholder="Enter description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddEvent}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HolidaysCalendar;