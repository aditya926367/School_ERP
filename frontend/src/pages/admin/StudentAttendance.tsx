import { useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardCheck,
} from "lucide-react";

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

const statusStyle: Record<AttendanceStatus, string> = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Late: "bg-amber-100 text-amber-700",
  Leave: "bg-blue-100 text-blue-700",
};

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function StudentAttendance() {
  const [students, setStudents] = useState(initialStudents);
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
    present: filteredStudents.filter((s) => s.status === "Present").length,
    absent: filteredStudents.filter((s) => s.status === "Absent").length,
    late: filteredStudents.filter((s) => s.status === "Late").length,
    leave: filteredStudents.filter((s) => s.status === "Leave").length,
  };

  function updateStatus(id: number, status: AttendanceStatus) {
    setStudents((current) =>
      current.map((student) => student.id === id ? { ...student, status } : student),
    );
    setSavedMessage("");
  }

  function markAllPresent() {
    setStudents((current) =>
      current.map((student) =>
        filteredStudents.some((filtered) => filtered.id === student.id)
          ? { ...student, status: "Present" }
          : student,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">Record and manage daily student attendance.</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50">
          <Download size={17} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Present", value: counts.present, icon: <CheckCircle2 size={22} />, color: "bg-green-100 text-green-600" },
          { title: "Absent", value: counts.absent, icon: <XCircle size={22} />, color: "bg-red-100 text-red-600" },
          { title: "Late", value: counts.late, icon: <Clock size={22} />, color: "bg-amber-100 text-amber-600" },
          { title: "On Leave", value: counts.leave, icon: <ClipboardCheck size={22} />, color: "bg-blue-100 text-blue-600" },
        ].map((item) => (
          <div key={item.title} className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`rounded-xl p-3 ${item.color}`}>{item.icon}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Attendance Date</span>
            <div className="relative">
              <CalendarDays size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setSavedMessage(""); }} className="w-full rounded-lg border px-3 py-2.5 pl-10 text-sm" />
            </div>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Class</span>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm">
              <option value="All">All Classes</option>
              {classes.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Search Students</span>
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or student ID..." className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm" />
            </div>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">Attendance Register</h2>
            <p className="mt-1 text-sm text-gray-500">{filteredStudents.length} students · {date}</p>
          </div>
          <button onClick={markAllPresent} className="rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50">
            Mark All Present
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Attendance Status</th>
                <th className="px-5 py-4">Status Label</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{student.studentId}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{student.className}</td>
                  <td className="px-5 py-4">
                    <select value={student.status} onChange={(e) => updateStatus(student.id, e.target.value as AttendanceStatus)} className="rounded-lg border bg-white px-3 py-2 text-sm">
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[student.status]}`}>{student.status}</span>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500"><Users className="mx-auto mb-2" />No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-500">Demo data only; records are not saved to the database.</p>
          <button onClick={() => setSavedMessage(`Attendance changes for ${date} are currently in page memory only.`)} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Save Attendance
          </button>
        </div>
        {savedMessage && <p role="status" className="border-t bg-amber-50 px-5 py-3 text-sm text-amber-800">{savedMessage}</p>}
      </div>
    </div>
  );
}
