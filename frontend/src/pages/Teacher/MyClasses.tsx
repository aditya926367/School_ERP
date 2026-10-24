
import { useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  Search,
  GraduationCap,
  CalendarDays,
  Clock,
  MapPin,
  Eye,
  X,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";

type ClassItem = {
  id: number;
  className: string;
  subject: string;
  section: string;
  students: number;
  attendance: number;
  room: string;
  schedule: string;
  classTeacher: boolean;
  description: string;
};

const initialClasses: ClassItem[] = [
  {
    id: 1,
    className: "Class 8",
    subject: "Mathematics",
    section: "A",
    students: 32,
    attendance: 94,
    room: "Room 204",
    schedule: "Monday, Wednesday, Friday",
    classTeacher: true,
    description: "Algebra, geometry, and fundamental mathematical concepts.",
  },
  {
    id: 2,
    className: "Class 9",
    subject: "Mathematics",
    section: "B",
    students: 30,
    attendance: 91,
    room: "Room 206",
    schedule: "Monday, Tuesday, Thursday",
    classTeacher: false,
    description: "Number systems, polynomials, geometry, and statistics.",
  },
  {
    id: 3,
    className: "Class 10",
    subject: "Mathematics",
    section: "A",
    students: 28,
    attendance: 96,
    room: "Room 208",
    schedule: "Tuesday, Thursday, Friday",
    classTeacher: false,
    description: "Board examination preparation, algebra, and trigonometry.",
  },
  {
    id: 4,
    className: "Class 7",
    subject: "Mathematics",
    section: "B",
    students: 35,
    attendance: 89,
    room: "Room 202",
    schedule: "Monday, Wednesday, Thursday",
    classTeacher: false,
    description: "Integers, fractions, equations, and practical mathematics.",
  },
  {
    id: 5,
    className: "Class 8",
    subject: "Science",
    section: "B",
    students: 31,
    attendance: 93,
    room: "Science Lab",
    schedule: "Tuesday, Wednesday, Friday",
    classTeacher: false,
    description: "Physics, chemistry, biology, and laboratory activities.",
  },
  {
    id: 6,
    className: "Class 9",
    subject: "Science",
    section: "A",
    students: 30,
    attendance: 92,
    room: "Science Lab",
    schedule: "Monday, Thursday, Friday",
    classTeacher: false,
    description: "Scientific principles, experiments, and practical learning.",
  },
];

export default function MyClasses() {
  const [classes] = useState<ClassItem[]>(initialClasses);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return classes.filter((item) => {
      const matchesSearch =
        item.className.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.room.toLowerCase().includes(query);

      const matchesSubject =
        subjectFilter === "All" || item.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [classes, search, subjectFilter]);

  const totalStudents = classes.reduce(
    (total, item) => total + item.students,
    0
  );

  const averageAttendance =
    classes.length > 0
      ? classes.reduce((total, item) => total + item.attendance, 0) /
        classes.length
      : 0;

  const subjects = Array.from(new Set(classes.map((item) => item.subject)));

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <GraduationCap size={17} />
          <span>Teacher Portal</span>
          <span>/</span>
          <span>My Classes</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          My Classes
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your assigned classes, subjects, student strength, and schedules.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Assigned Classes"
          value={classes.length}
          subtitle="Classes assigned to you"
          icon={<BookOpen size={22} />}
          color="bg-indigo-100 text-indigo-600"
        />

        <SummaryCard
          title="Total Students"
          value={totalStudents}
          subtitle="Across assigned classes"
          icon={<Users size={22} />}
          color="bg-blue-100 text-blue-600"
        />

        <SummaryCard
          title="Subjects"
          value={subjects.length}
          subtitle="Different subjects taught"
          icon={<GraduationCap size={22} />}
          color="bg-purple-100 text-purple-600"
        />

        <SummaryCard
          title="Avg. Attendance"
          value={`${averageAttendance.toFixed(1)}%`}
          subtitle="Average across class records"
          icon={<TrendingUp size={22} />}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Assigned Classes</h2>
            <p className="mt-1 text-sm text-gray-500">
              Search and view your teaching assignments.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search classes..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 sm:w-60"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Class cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <BookOpen size={23} />
                  </div>

                  {item.classTeacher && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Class Teacher
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {item.className}-{item.section}
                </h3>

                <p className="mt-1 text-sm font-medium text-indigo-600">
                  {item.subject}
                </p>
              </div>

              <div className="space-y-4 p-5">
                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <InfoBox
                    icon={<Users size={16} />}
                    label="Students"
                    value={String(item.students)}
                  />

                  <InfoBox
                    icon={<ClipboardCheck size={16} />}
                    label="Attendance"
                    value={`${item.attendance}%`}
                  />
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="shrink-0 text-gray-400" />
                    {item.room}
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CalendarDays
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />
                    <span>{item.schedule}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClass(item)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                  <Eye size={17} />
                  View Class Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center">
            <Search className="mx-auto mb-3 text-gray-300" size={30} />
            <h3 className="font-semibold text-gray-900">No classes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try a different search term or subject filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSubjectFilter("All");
              }}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Class details modal */}
      {selectedClass && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedClass(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="class-details-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  {selectedClass.subject}
                </p>
                <h2
                  id="class-details-title"
                  className="mt-1 text-xl font-bold text-gray-900"
                >
                  {selectedClass.className}-{selectedClass.section}
                </h2>
              </div>

              <button
                onClick={() => setSelectedClass(null)}
                aria-label="Close class details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <p className="text-sm leading-6 text-gray-600">
                {selectedClass.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <InfoBox
                  icon={<Users size={17} />}
                  label="Total Students"
                  value={String(selectedClass.students)}
                />
                <InfoBox
                  icon={<ClipboardCheck size={17} />}
                  label="Attendance"
                  value={`${selectedClass.attendance}%`}
                />
              </div>

              <DetailRow
                icon={<MapPin size={17} />}
                label="Classroom"
                value={selectedClass.room}
              />

              <DetailRow
                icon={<CalendarDays size={17} />}
                label="Schedule"
                value={selectedClass.schedule}
              />

              <DetailRow
                icon={<Clock size={17} />}
                label="Assignment"
                value={
                  selectedClass.classTeacher
                    ? "Class Teacher"
                    : "Subject Teacher"
                }
              />

              <button
                onClick={() => setSelectedClass(null)}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
