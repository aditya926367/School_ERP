
import { useMemo, useState } from "react";
import {
  Users,
  Search,
  GraduationCap,
  UserRound,
  ClipboardCheck,
  TrendingUp,
  Eye,
  X,
  Mail,
  Phone,
  CalendarDays,
  BookOpen,
  Filter,
} from "lucide-react";

type Student = {
  id: number;
  name: string;
  rollNumber: string;
  className: string;
  section: string;
  gender: string;
  email: string;
  phone: string;
  attendance: number;
  averageMarks: number;
  status: "Active" | "Inactive";
  admissionDate: string;
};

const initialStudents: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    rollNumber: "STU1001",
    className: "Class 8",
    section: "A",
    gender: "Male",
    email: "aarav@example.com",
    phone: "9876543210",
    attendance: 96,
    averageMarks: 88,
    status: "Active",
    admissionDate: "April 10, 2024",
  },
  {
    id: 2,
    name: "Ananya Verma",
    rollNumber: "STU1002",
    className: "Class 8",
    section: "A",
    gender: "Female",
    email: "ananya@example.com",
    phone: "9876543211",
    attendance: 94,
    averageMarks: 92,
    status: "Active",
    admissionDate: "April 12, 2024",
  },
  {
    id: 3,
    name: "Rohan Kumar",
    rollNumber: "STU1003",
    className: "Class 8",
    section: "A",
    gender: "Male",
    email: "rohan@example.com",
    phone: "9876543212",
    attendance: 82,
    averageMarks: 67,
    status: "Active",
    admissionDate: "April 15, 2024",
  },
  {
    id: 4,
    name: "Priya Singh",
    rollNumber: "STU1004",
    className: "Class 9",
    section: "B",
    gender: "Female",
    email: "priya@example.com",
    phone: "9876543213",
    attendance: 98,
    averageMarks: 95,
    status: "Active",
    admissionDate: "April 8, 2023",
  },
  {
    id: 5,
    name: "Vivek Gupta",
    rollNumber: "STU1005",
    className: "Class 9",
    section: "B",
    gender: "Male",
    email: "vivek@example.com",
    phone: "9876543214",
    attendance: 75,
    averageMarks: 58,
    status: "Active",
    admissionDate: "April 18, 2023",
  },
  {
    id: 6,
    name: "Sneha Kumari",
    rollNumber: "STU1006",
    className: "Class 10",
    section: "A",
    gender: "Female",
    email: "sneha@example.com",
    phone: "9876543215",
    attendance: 91,
    averageMarks: 84,
    status: "Active",
    admissionDate: "April 6, 2022",
  },
  {
    id: 7,
    name: "Rahul Yadav",
    rollNumber: "STU1007",
    className: "Class 10",
    section: "A",
    gender: "Male",
    email: "rahul@example.com",
    phone: "9876543216",
    attendance: 68,
    averageMarks: 49,
    status: "Inactive",
    admissionDate: "April 20, 2022",
  },
  {
    id: 8,
    name: "Kavya Mishra",
    rollNumber: "STU1008",
    className: "Class 8",
    section: "A",
    gender: "Female",
    email: "kavya@example.com",
    phone: "9876543217",
    attendance: 89,
    averageMarks: 81,
    status: "Active",
    admissionDate: "April 22, 2024",
  },
];

export default function MyStudents() {
  const [students] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const classOptions = Array.from(
    new Set(students.map((student) => student.className))
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.rollNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);

      const matchesClass =
        classFilter === "All" || student.className === classFilter;

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, search, classFilter, statusFilter]);

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const averageAttendance =
    students.length > 0
      ? students.reduce((sum, student) => sum + student.attendance, 0) /
        students.length
      : 0;

  const averageMarks =
    students.length > 0
      ? students.reduce((sum, student) => sum + student.averageMarks, 0) /
        students.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <GraduationCap size={17} />
          <span>Teacher Portal</span>
          <span>/</span>
          <span>My Students</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          My Students
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View student profiles, attendance, and academic performance in your
          assigned classes.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Students"
          value={students.length}
          subtitle="Across displayed classes"
          icon={<Users size={22} />}
          color="bg-indigo-100 text-indigo-600"
        />

        <SummaryCard
          title="Active Students"
          value={activeCount}
          subtitle="Currently active"
          icon={<UserRound size={22} />}
          color="bg-emerald-100 text-emerald-600"
        />

        <SummaryCard
          title="Average Attendance"
          value={`${averageAttendance.toFixed(1)}%`}
          subtitle="Across listed students"
          icon={<ClipboardCheck size={22} />}
          color="bg-blue-100 text-blue-600"
        />

        <SummaryCard
          title="Average Marks"
          value={`${averageMarks.toFixed(1)}%`}
          subtitle="Academic performance"
          icon={<TrendingUp size={22} />}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Student Directory</h2>
            <p className="mt-1 text-sm text-gray-500">
              Search students and filter by class or status.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, roll no..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Classes</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">Student Records</h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredStudents.length} students found
            </p>
          </div>
          <Filter size={19} className="text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Roll Number</th>
                <th className="px-5 py-4 font-semibold">Class</th>
                <th className="px-5 py-4 font-semibold">Attendance</th>
                <th className="px-5 py-4 font-semibold">Average Marks</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                        {student.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {student.rollNumber}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      {student.className}-{student.section}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            student.attendance >= 90
                              ? "bg-emerald-500"
                              : student.attendance >= 75
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {student.attendance}%
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-700">
                    {student.averageMarks}%
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        student.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      aria-label={`View ${student.name}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Users className="mx-auto mb-3 text-gray-300" size={30} />
            <h3 className="font-semibold text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setClassFilter("All");
                setStatusFilter("All");
              }}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Student profile modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-profile-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                  {selectedStudent.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h2
                    id="student-profile-title"
                    className="text-lg font-bold text-gray-900"
                  >
                    {selectedStudent.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedStudent.rollNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                aria-label="Close student profile"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                  {selectedStudent.className}-{selectedStudent.section}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    selectedStudent.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedStudent.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ProfileMetric
                  label="Attendance"
                  value={`${selectedStudent.attendance}%`}
                />
                <ProfileMetric
                  label="Average Marks"
                  value={`${selectedStudent.averageMarks}%`}
                />
              </div>

              <div className="space-y-4">
                <DetailRow
                  icon={<Mail size={17} />}
                  label="Email"
                  value={selectedStudent.email}
                />
                <DetailRow
                  icon={<Phone size={17} />}
                  label="Phone"
                  value={selectedStudent.phone}
                />
                <DetailRow
                  icon={<UserRound size={17} />}
                  label="Gender"
                  value={selectedStudent.gender}
                />
                <DetailRow
                  icon={<CalendarDays size={17} />}
                  label="Admission Date"
                  value={selectedStudent.admissionDate}
                />
                <DetailRow
                  icon={<BookOpen size={17} />}
                  label="Class"
                  value={`${selectedStudent.className}-${selectedStudent.section}`}
                />
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Close Profile
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

function ProfileMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
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
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
