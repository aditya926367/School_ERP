import { useState } from "react";
import {
  BookOpen,
  Clock,
  GraduationCap,
  MapPin,
  UserRound,
  X,
  Search,
} from "lucide-react";

type Subject = {
  id: number;
  name: string;
  code: string;
  teacher: string;
  room: string;
  periodsPerWeek: number;
  description: string;
  color: string;
};

const subjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    code: "MAT101",
    teacher: "Mrs. Priya Sharma",
    room: "Room 101",
    periodsPerWeek: 5,
    description: "Algebra, geometry, statistics, and problem-solving.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "Science",
    code: "SCI101",
    teacher: "Mr. Rahul Verma",
    room: "Science Lab",
    periodsPerWeek: 4,
    description: "Physics, chemistry, biology, and practical learning.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 3,
    name: "English",
    code: "ENG101",
    teacher: "Mrs. Neha Singh",
    room: "Room 103",
    periodsPerWeek: 4,
    description: "Grammar, reading, writing, and communication skills.",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    name: "Social Science",
    code: "SOC101",
    teacher: "Mr. Amit Kumar",
    room: "Room 104",
    periodsPerWeek: 3,
    description: "History, geography, civics, and social studies.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 5,
    name: "Computer Science",
    code: "COM101",
    teacher: "Mr. Vikash Gupta",
    room: "Computer Lab",
    periodsPerWeek: 3,
    description: "Computer fundamentals, programming, and digital skills.",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    id: 6,
    name: "Hindi",
    code: "HIN101",
    teacher: "Mrs. Sunita Devi",
    room: "Room 102",
    periodsPerWeek: 3,
    description: "Hindi grammar, literature, reading, and writing.",
    color: "bg-rose-100 text-rose-700",
  },
];

export default function MyClasses() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState<Subject | null>(null);

  const filteredSubjects = subjects.filter((subject) =>
    `${subject.name} ${subject.code} ${subject.teacher}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Classes
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your enrolled subjects, teachers, and classroom details.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<BookOpen size={22} />}
            label="Enrolled Subjects"
            value={String(subjects.length)}
          />
          <SummaryCard
            icon={<UserRound size={22} />}
            label="Teachers"
            value={String(new Set(subjects.map((s) => s.teacher)).size)}
          />
          <SummaryCard
            icon={<Clock size={22} />}
            label="Weekly Periods"
            value={String(
              subjects.reduce((total, subject) => total + subject.periodsPerWeek, 0)
            )}
          />
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects or teachers..."
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`rounded-lg p-3 ${subject.color}`}>
                  <BookOpen size={24} />
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {subject.code}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {subject.name}
              </h2>

              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <InfoRow
                  icon={<UserRound size={16} />}
                  text={subject.teacher}
                />
                <InfoRow
                  icon={<MapPin size={16} />}
                  text={subject.room}
                />
                <InfoRow
                  icon={<Clock size={16} />}
                  text={`${subject.periodsPerWeek} periods per week`}
                />
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubject(subject)}
                className="mt-5 w-full rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                View Subject Details
              </button>
            </div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <BookOpen className="mx-auto text-gray-400" size={32} />
            <p className="mt-3 font-medium text-gray-800">
              No subjects found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try searching with a different subject or teacher name.
            </p>
          </div>
        )}
      </div>

      {/* Subject details modal */}
      {selectedSubject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedSubject(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="subject-modal-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  {selectedSubject.code}
                </p>
                <h2
                  id="subject-modal-title"
                  className="mt-1 text-xl font-bold text-gray-900"
                >
                  {selectedSubject.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubject(null)}
                aria-label="Close subject details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              {selectedSubject.description}
            </p>

            <div className="mt-5 space-y-4 rounded-xl bg-gray-50 p-4">
              <InfoRow
                icon={<UserRound size={18} />}
                text={`Teacher: ${selectedSubject.teacher}`}
              />
              <InfoRow
                icon={<MapPin size={18} />}
                text={`Classroom: ${selectedSubject.room}`}
              />
              <InfoRow
                icon={<Clock size={18} />}
                text={`${selectedSubject.periodsPerWeek} periods per week`}
              />
            </div>

            <button
              type="button"
              onClick={() => setSelectedSubject(null)}
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-gray-400">{icon}</span>
      <span>{text}</span>
    </div>
  );
}