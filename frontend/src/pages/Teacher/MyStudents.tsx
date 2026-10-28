
import { useMemo, useState, type ReactNode } from "react";
import {
  Users,
  UserRound,
  ClipboardCheck,
  TrendingUp,
  Eye,
  X,
  Mail,
  Phone,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import FilterSelect from "../../components/common/FilterSelect";
import PageHeader from "../../components/common/PageHeader";
import SummaryCard from "../../components/common/SummaryCard";
import StatusBadge from "../../components/common/StatusBadge";

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

const initialStudents: Student[] = [];

export default function MyStudents() {
  const [students] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const classOptions = useMemo(
    () => Array.from(new Set(students.map((student) => student.className))),
    [students]
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.rollNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);
      const matchesClass = classFilter === "All" || student.className === classFilter;
      const matchesStatus = statusFilter === "All" || student.status === statusFilter;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, search, classFilter, statusFilter]);

  const activeCount = students.filter((student) => student.status === "Active").length;
  const averageAttendance = students.length
    ? students.reduce((sum, student) => sum + student.attendance, 0) / students.length
    : 0;
  const averageMarks = students.length
    ? students.reduce((sum, student) => sum + student.averageMarks, 0) / students.length
    : 0;

  const columns = [
    {
      key: "student",
      header: "Student",
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            {student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{student.name}</p>
            <p className="mt-1 text-xs text-gray-500">{student.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "rollNumber",
      header: "Roll Number",
      render: (student: Student) => <span className="text-gray-600">{student.rollNumber}</span>,
    },
    {
      key: "className",
      header: "Class",
      render: (student: Student) => (
        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          {student.className}-{student.section}
        </span>
      ),
    },
    {
      key: "attendance",
      header: "Attendance",
      render: (student: Student) => (
        <div className="flex min-w-[120px] items-center gap-2">
          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${student.attendance >= 90 ? "bg-emerald-500" : student.attendance >= 75 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${student.attendance}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700">{student.attendance}%</span>
        </div>
      ),
    },
    {
      key: "averageMarks",
      header: "Average Marks",
      render: (student: Student) => <span className="font-medium text-gray-700">{student.averageMarks}%</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (student: Student) => <StatusBadge status={student.status} />,
    },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (student: Student) => (
        <div className="text-right">
          <button
            type="button"
            onClick={() => setSelectedStudent(student)}
            aria-label={`View ${student.name}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            <Eye size={15} /> View
          </button>
        </div>
      ),
    },
  ];

  const clearFilters = () => {
    setSearch("");
    setClassFilter("All");
    setStatusFilter("All");
  };

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        title="My Students"
        description="View student profiles, attendance, and academic performance in your assigned classes."
        breadcrumb={["Teacher Portal", "My Students"]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Students" value={students.length} icon={<Users size={22} />} iconClassName="text-indigo-600" iconBackgroundClassName="bg-indigo-100" />
        <SummaryCard label="Active Students" value={activeCount} icon={<UserRound size={22} />} iconClassName="text-emerald-600" iconBackgroundClassName="bg-emerald-100" />
        <SummaryCard label="Average Attendance" value={`${averageAttendance.toFixed(1)}%`} icon={<ClipboardCheck size={22} />} iconClassName="text-blue-600" iconBackgroundClassName="bg-blue-100" />
        <SummaryCard label="Average Marks" value={`${averageMarks.toFixed(1)}%`} icon={<TrendingUp size={22} />} iconClassName="text-purple-600" iconBackgroundClassName="bg-purple-100" />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="font-semibold text-gray-900">Student Directory</h2>
          <p className="mt-1 text-sm text-gray-500">Search students and filter by class or status.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search name, roll number, or email..." />
          <FilterSelect value={classFilter} onChange={setClassFilter} options={classOptions} placeholder="All Classes" />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={["Active", "Inactive"]} placeholder="All Statuses" />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Student Records</h2>
          <p className="mt-1 text-xs text-gray-500">{filteredStudents.length} students found</p>
        </div>
        <DataTable
          data={filteredStudents}
          columns={columns}
          rowKey={(student: Student) => student.id}
          tableClassName="min-w-[850px]"
          emptyState={
            <div className="px-5 py-12 text-center">
              <Users className="mx-auto mb-3 text-gray-300" size={30} />
              <h3 className="font-semibold text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">Try changing your search or filters.</p>
              <button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-indigo-600 hover:underline">
                Clear filters
              </button>
            </div>
          }
        />
      </section>

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
                  {selectedStudent.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h2 id="student-profile-title" className="text-lg font-bold text-gray-900">{selectedStudent.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{selectedStudent.rollNumber}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedStudent(null)} aria-label="Close student profile" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">{selectedStudent.className}-{selectedStudent.section}</span>
                <StatusBadge status={selectedStudent.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ProfileMetric label="Attendance" value={`${selectedStudent.attendance}%`} />
                <ProfileMetric label="Average Marks" value={`${selectedStudent.averageMarks}%`} />
              </div>
              <div className="space-y-4">
                <DetailRow icon={<Mail size={17} />} label="Email" value={selectedStudent.email} />
                <DetailRow icon={<Phone size={17} />} label="Phone" value={selectedStudent.phone} />
                <DetailRow icon={<UserRound size={17} />} label="Gender" value={selectedStudent.gender} />
                <DetailRow icon={<CalendarDays size={17} />} label="Admission Date" value={selectedStudent.admissionDate} />
                <DetailRow icon={<BookOpen size={17} />} label="Class" value={`${selectedStudent.className}-${selectedStudent.section}`} />
              </div>
              <button type="button" onClick={() => setSelectedStudent(null)} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
