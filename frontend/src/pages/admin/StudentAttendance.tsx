import { useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardCheck,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import SummaryCard from "../../components/common/SummaryCard";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

type Student = {
  id: number;
  studentId: string;
  name: string;
  className: string;
  status: AttendanceStatus;
};

const initialStudents: Student[] = [
  { id: 1, studentId: "STU1001", name: "Aarav Sharma", className: "Class 10", status: "Present" },
  { id: 2, studentId: "STU1002", name: "Priya Verma", className: "Class 10", status: "Absent" },
  { id: 3, studentId: "STU1003", name: "Rahul Kumar", className: "Class 9", status: "Present" },
  { id: 4, studentId: "STU1004", name: "Ananya Singh", className: "Class 8", status: "Late" },
  { id: 5, studentId: "STU1005", name: "Rohan Gupta", className: "Class 9", status: "Leave" },
  { id: 6, studentId: "STU1006", name: "Sneha Kumari", className: "Class 10", status: "Present" },
  { id: 7, studentId: "STU1007", name: "Karan Singh", className: "Class 8", status: "Present" },
  { id: 8, studentId: "STU1008", name: "Neha Gupta", className: "Class 9", status: "Absent" },
];

const statuses: AttendanceStatus[] = ["Present", "Absent", "Late", "Leave"];

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function StudentAttendance() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [date, setDate] = useState(today());
  const [classFilter, setClassFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const classes = [...new Set(students.map((student) => student.className))].sort();

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesClass = classFilter === "All" || student.className === classFilter;
      const matchesSearch = `${student.studentId} ${student.name} ${student.className}`
        .toLowerCase()
        .includes(query);

      return matchesClass && matchesSearch;
    });
  }, [students, classFilter, search]);

  const counts = {
    present: filteredStudents.filter((student) => student.status === "Present").length,
    absent: filteredStudents.filter((student) => student.status === "Absent").length,
    late: filteredStudents.filter((student) => student.status === "Late").length,
    leave: filteredStudents.filter((student) => student.status === "Leave").length,
  };

  function updateStatus(id: number, status: AttendanceStatus) {
    setStudents((current) =>
      current.map((student) => (student.id === id ? { ...student, status } : student)),
    );
    setSavedMessage("");
  }

  function markAllPresent() {
    const visibleIds = new Set(filteredStudents.map((student) => student.id));

    setStudents((current) =>
      current.map((student) =>
        visibleIds.has(student.id) ? { ...student, status: "Present" } : student,
      ),
    );
    setSavedMessage("");
  }

  function exportCSV() {
    const rows = [
      ["Date", "Student ID", "Student Name", "Class", "Status"],
      ...filteredStudents.map((student) => [
        date,
        student.studentId,
        student.name,
        student.className,
        student.status,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `student-attendance-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const columns = [
    {
      key: "student",
      header: "Student",
      render: (student: Student) => (
        <div>
          <p className="font-semibold text-gray-900">{student.name}</p>
          <p className="mt-1 text-xs text-gray-500">{student.studentId}</p>
        </div>
      ),
    },
    {
      key: "className",
      header: "Class",
      render: (student: Student) => <span className="text-gray-600">{student.className}</span>,
    },
    {
      key: "attendanceStatus",
      header: "Attendance Status",
      render: (student: Student) => (
        <select
          aria-label={`Attendance status for ${student.name}`}
          value={student.status}
          onChange={(event) => updateStatus(student.id, event.target.value as AttendanceStatus)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "statusLabel",
      header: "Status Label",
      render: (student: Student) => <StatusBadge status={student.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageHeader
          title="Student Attendance"
          description="Record and manage daily student attendance."
        />
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white "
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Present" value={counts.present} icon={<CheckCircle2 size={22} />} iconClassName="text-green-600" iconBackgroundClassName="bg-green-100" />
        <SummaryCard label="Absent" value={counts.absent} icon={<XCircle size={22} />} iconClassName="text-red-600" iconBackgroundClassName="bg-red-100" />
        <SummaryCard label="Late" value={counts.late} icon={<Clock size={22} />} iconClassName="text-amber-600" iconBackgroundClassName="bg-amber-100" />
        <SummaryCard label="On Leave" value={counts.leave} icon={<ClipboardCheck size={22} />} iconClassName="text-blue-600" iconBackgroundClassName="bg-blue-100" />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="min-w-0 space-y-1">
            <span className="block text-sm font-medium text-gray-700">Attendance Date</span>
            <div className="relative">
              <CalendarDays size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setSavedMessage("");
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>

          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">Class</label>
            <FilterSelect
              value={classFilter}
              onChange={setClassFilter}
              options={[
                { label: "All Classes", value: "All" },
                ...classes.map((name) => ({ label: name, value: name })),
              ]}
              placeholder="All Classes"
            />
          </div>

          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">Search Students</label>
            <SearchBar value={search} onChange={setSearch} placeholder="Name or student ID..." />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">Attendance Register</h2>
            <p className="mt-1 text-sm text-gray-500">{filteredStudents.length} students · {date}</p>
          </div>
          <button
            type="button"
            onClick={markAllPresent}
            className="inline-flex items-center justify-center rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
          >
            Mark All Present
          </button>
        </div>

        <DataTable<Student>
          data={filteredStudents}
          columns={columns}
          rowKey={(student) => student.id}
          tableClassName="min-w-[750px] text-sm text-gray-800"
          emptyState={
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Users size={22} />
              <span>No students found.</span>
            </div>
          }
        />

        <div className="flex flex-col justify-end gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center">
          
          <button
            type="button"
            onClick={() => setSavedMessage(`Attendance changes for ${date} are currently in page memory only.`)}
            className="rounded-lg bg-[#27348b] px-5 py-2.5 text-sm font-semibold text-white "
          >
            Save Attendance
          </button>
        </div>

        {savedMessage && (
          <p role="status" className="border-t border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
            {savedMessage}
          </p>
        )}
      </section>
    </div>
  );
}
