import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import SummaryCard from "../../components/common/SummaryCard";

type CalendarEventType = "Holiday" | "Event" | "Working Day";

type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  type: CalendarEventType;
  description: string;
};

const initialEvents: CalendarEvent[] = [
  { id: 1, title: "Independence Day", date: "2026-08-15", type: "Holiday", description: "National holiday" },
  { id: 2, title: "Teachers' Day", date: "2026-09-05", type: "Event", description: "School celebration" },
  { id: 3, title: "Gandhi Jayanti", date: "2026-10-02", type: "Holiday", description: "National holiday" },
  { id: 4, title: "Annual Sports Day", date: "2026-11-14", type: "Event", description: "Annual school sports event" },
  { id: 5, title: "Winter Working Saturday", date: "2026-12-12", type: "Working Day", description: "Special working Saturday" },
];

const emptyForm = {
  title: "",
  date: "",
  type: "Holiday" as CalendarEventType,
  description: "",
};

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const typeBadgeStatus: Record<CalendarEventType, string> = {
  Holiday: "Holiday",
  Event: "Event",
  "Working Day": "Working Day",
};

export default function HolidaysCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [year, setYear] = useState(2026);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events
      .filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(query) ||
          event.type.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.date.includes(query);
        const matchesType = typeFilter === "All" || event.type === typeFilter;
        const matchesYear = Number(event.date.slice(0, 4)) === year;
        return matchesSearch && matchesType && matchesYear;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, search, typeFilter, year]);

  const holidays = events.filter((event) => event.type === "Holiday" && Number(event.date.slice(0, 4)) === year).length;
  const schoolEvents = events.filter((event) => event.type === "Event" && Number(event.date.slice(0, 4)) === year).length;
  const workingDays = events.filter((event) => event.type === "Working Day" && Number(event.date.slice(0, 4)) === year).length;

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const upcomingEvents = events
    .filter((event) => Number(event.date.slice(0, 4)) === year)
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcomingHoliday = upcomingEvents.find((event) => event.type === "Holiday");
  const upcomingEvent = upcomingEvents.find((event) => event.type === "Event");
  const upcomingWorkingDay = upcomingEvents.find((event) => event.type === "Working Day");

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(event: CalendarEvent) {
    setEditingId(event.id);
    setForm({ title: event.title, date: event.date, type: event.type, description: event.description });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title || !form.date) return;

    if (editingId !== null) {
      setEvents((previous) => previous.map((event) =>
        event.id === editingId ? { ...event, ...form, title } : event
      ));
    } else {
      setEvents((previous) => [...previous, { ...form, title, id: Date.now() }]);
    }
    setYear(Number(form.date.slice(0, 4)));
    setPage(1);
    closeForm();
  }

  function deleteEvent(id: number) {
    setEvents((previous) => previous.filter((event) => event.id !== id));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="School Management / Holidays & Calendar"
        title="Holidays & Academic Calendar"
        description="Manage holidays, school events and working days."
        actions={
          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} /> Add Calendar Entry
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Holidays" value={holidays} icon={<CalendarDays size={22} />} iconClassName="text-red-600" iconBackgroundClassName="bg-red-50" />
        <SummaryCard label="School Events" value={schoolEvents} icon={<CalendarDays size={22} />} iconClassName="text-blue-600" iconBackgroundClassName="bg-blue-50" />
        <SummaryCard label="Working Days" value={workingDays} icon={<CalendarDays size={22} />} iconClassName="text-green-600" iconBackgroundClassName="bg-green-50" />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Academic Calendar</h2>
            <p className="mt-1 text-sm text-gray-500">Calendar overview for {year}.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous year" onClick={() => { setYear((value) => value - 1); setPage(1); }} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
              <ChevronLeft size={17} />
            </button>
            <span className="min-w-20 text-center text-sm font-semibold text-gray-700">{year}</span>
            <button type="button" aria-label="Next year" onClick={() => { setYear((value) => value + 1); setPage(1); }} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          <UpcomingCard label="Upcoming Holiday" event={upcomingHoliday} formatDate={formatDate} color="red" />
          <UpcomingCard label="Upcoming Event" event={upcomingEvent} formatDate={formatDate} color="blue" />
          <UpcomingCard label="Working Day" event={upcomingWorkingDay} formatDate={formatDate} color="green" />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Calendar Entries</h2>
            <p className="mt-1 text-sm text-gray-500">Search and manage holidays, events and working days.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search title, date or description..." />
            <FilterSelect value={typeFilter} onChange={(value) => { setTypeFilter(value); setPage(1); }} placeholder="All entry types" options={["Holiday", "Event", "Working Day"]} />
          </div>
        </div>

        <DataTable
          data={visibleEvents}
          rowKey={(event: CalendarEvent) => event.id}
          tableClassName="min-w-[750px]"
          columns={[
            { key: "date", header: "Date", render: (event: CalendarEvent) => <span className="whitespace-nowrap text-sm font-medium text-gray-800">{formatDate(event.date)}</span> },
            { key: "title", header: "Title", render: (event: CalendarEvent) => <span className="text-sm font-medium text-gray-800">{event.title}</span> },
            { key: "type", header: "Type", render: (event: CalendarEvent) => <TypeBadge type={event.type} /> },
            { key: "description", header: "Description", render: (event: CalendarEvent) => <span className="text-sm text-gray-500">{event.description || "—"}</span> },
            {
              key: "actions", header: "Actions", className: "text-right",
              render: (event: CalendarEvent) => (
                <div className="flex justify-end gap-1">
                  <button type="button" title="Edit calendar entry" aria-label={`Edit ${event.title}`} onClick={() => openEditForm(event)} className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"><Pencil size={16} /></button>
                  <button type="button" title="Delete calendar entry" aria-label={`Delete ${event.title}`} onClick={() => deleteEvent(event.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ),
            },
          ]}
          emptyState={<div><FileText size={32} className="mx-auto text-gray-300" /><p className="mt-2 text-sm font-medium text-gray-700">No calendar entries found</p><p className="mt-1 text-sm text-gray-500">Try another search, type or year.</p></div>}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredEvents.length} pageSize={pageSize} onPageChange={setPage} itemLabel="entries" />
      </section>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) closeForm(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="calendar-form-title" className="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 id="calendar-form-title" className="text-lg font-semibold text-gray-900">{editingId !== null ? "Edit Calendar Entry" : "Add Calendar Entry"}</h2>
              <p className="mt-1 text-sm text-gray-500">Add a holiday, event or working day.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <label className="block text-sm font-medium text-gray-700">Title *
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Example: Diwali Holiday" />
              </label>
              <label className="block text-sm font-medium text-gray-700">Date *
                <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
              </label>
              <label className="block text-sm font-medium text-gray-700">Entry Type *
                <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CalendarEventType })} className={inputClass}>
                  <option value="Holiday">Holiday</option><option value="Event">Event</option><option value="Working Day">Working Day</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-700">Description
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} placeholder="Enter description..." />
              </label>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={closeForm} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">{editingId !== null ? "Save Changes" : "Add Entry"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: CalendarEventType }) {
  const colors: Record<CalendarEventType, string> = {
    Holiday: "bg-red-50 text-red-700",
    Event: "bg-blue-50 text-blue-700",
    "Working Day": "bg-green-50 text-green-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[type]}`}>{type}</span>;
}

function UpcomingCard({
  label,
  event,
  formatDate,
  color,
}: {
  label: string;
  event?: CalendarEvent;
  formatDate: (date: string) => string;
  color: "red" | "blue" | "green";
}) {
  const colorClasses = {
    red: "border-red-100 bg-red-50 text-red-600",
    blue: "border-blue-100 bg-blue-50 text-blue-600",
    green: "border-green-100 bg-green-50 text-green-600",
  };
  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className="text-xs font-medium">{label}</p>
      <p className="mt-2 text-sm font-semibold text-gray-800">{event?.title ?? "No entry added"}</p>
      <p className="mt-1 text-xs text-gray-500">{event ? formatDate(event.date) : `No ${label.toLowerCase()} for ${new Date().getFullYear()}`}</p>
    </div>
  );
}
