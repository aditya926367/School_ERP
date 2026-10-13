
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Search,
  Users,
  XCircle,
  Save,
  RotateCcw,
} from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

type Student = {
  id: number;
  admissionNo: string;
  name: string;
  rollNo: number;
  className: string;
  status: AttendanceStatus;
};

const initialStudents: Student[] = [
  { id: 1, admissionNo: "ADM-1001", name: "Aarav Sharma", rollNo: 1, className: "Class 8-A", status: "Present" },
  { id: 2, admissionNo: "ADM-1002", name: "Ananya Verma", rollNo: 2, className: "Class 8-A", status: "Present" },
  { id: 3, admissionNo: "ADM-1003", name: "Rohan Kumar", rollNo: 3, className: "Class 8-A", status: "Absent" },
  { id: 4, admissionNo: "ADM-1004", name: "Priya Singh", rollNo: 4, className: "Class 8-A", status: "Present" },
  { id: 5, admissionNo: "ADM-1005", name: "Arjun Gupta", rollNo: 5, className: "Class 8-A", status: "Late" },
  { id: 6, admissionNo: "ADM-1006", name: "Sneha Kumari", rollNo: 6, className: "Class 8-A", status: "Present" },
  { id: 7, admissionNo: "ADM-1007", name: "Rahul Yadav", rollNo: 7, className: "Class 8-A", status: "Leave" },
  { id: 8, admissionNo: "ADM-1008", name: "Kavya Mishra", rollNo: 8, className: "Class 8-A", status: "Present" },
  { id: 9, admissionNo: "ADM-2001", name: "Aditya Raj", rollNo: 1, className: "Class 9-B", status: "Present" },
  { id: 10, admissionNo: "ADM-2002", name: "Neha Singh", rollNo: 2, className: "Class 9-B", status: "Absent" },
  { id: 11, admissionNo: "ADM-2003", name: "Vivek Kumar", rollNo: 3, className: "Class 9-B", status: "Present" },
  { id: 12, admissionNo: "ADM-2004", name: "Pooja Kumari", rollNo: 4, className: "Class 9-B", status: "Late" },
  { id: 13, admissionNo: "ADM-3001", name: "Karan Verma", rollNo: 1, className: "Class 10-A", status: "Present" },
  { id: 14, admissionNo: "ADM-3002", name: "Simran Kaur", rollNo: 2, className: "Class 10-A", status: "Present" },
];

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Absent: "bg-red-50 text-red-700 border-red-200",
  Late: "bg-amber-50 text-amber-700 border-amber-200",
  Leave: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function TeacherMarkAttendance() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedClass, setSelectedClass] = useState("Class 8-A");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [savedRecords, setSavedRecords] = useState<Record<string, Student[]>>({});

  const classStudents = useMemo(
    () => students.filter((student) => student.className === selectedClass),
    [students, selectedClass]
  );

  const filteredStudents = useMemo(
    () =>
      classStudents.filter((student) =>
        `${student.name} ${student.admissionNo} ${student.rollNo}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [classStudents, search]
  );

  const counts = useMemo(
    () => ({
      total: classStudents.length,
      present: classStudents.filter((s) => s.status === "Present").length,
      absent: classStudents.filter((s) => s.status === "Absent").length,
      late: classStudents.filter((s) => s.status === "Late").length,
      leave: classStudents.filter((s) => s.status === "Leave").length,
    }),
    [classStudents]
  );

  const updateStatus = (studentId: number, status: AttendanceStatus) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
    setMessage("");
    setSavedKey("");
  };

  const markAllPresent = () => {
    setStudents((current) =>
      current.map((student) =>
        student.className === selectedClass
          ? { ...student, status: "Present" }
          : student
      )
    );
    setMessage("");
    setSavedKey("");
  };

  const saveAttendance = () => {
    const key = `${selectedClass}_${attendanceDate}`;
    setSavedRecords((current) => ({
      ...current,
      [key]: classStudents.map((student) => ({ ...student })),
    }));
    setSavedKey(key);
    setMessage(
      `Attendance saved for ${selectedClass} on ${attendanceDate}.`
    );
  };

  const loadSavedAttendance = () => {
    const key = `${selectedClass}_${attendanceDate}`;
    const saved = savedRecords[key];

    if (!saved) {
      setMessage("No saved attendance found for this class and date.");
      return;
    }

    setStudents((current) =>
      current.map((student) => {
        const savedStudent = saved.find((item) => item.id === student.id);
        return savedStudent ? { ...student, status: savedStudent.status } : student;
      })
    );
    setSavedKey(key);
    setMessage("Saved attendance loaded successfully.");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <ClipboardCheck size={18} />
              Teacher Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Mark Attendance
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Record and review daily student attendance.
            </p>
          </div>

          <button
            onClick={markAllPresent}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            <CheckCircle2 size={17} />
            Mark All Present
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard title="Total Students" value={counts.total} icon={<Users size={20} />} color="indigo" />
          <SummaryCard title="Present" value={counts.present} icon={<CheckCircle2 size={20} />} color="green" />
          <SummaryCard title="Absent" value={counts.absent} icon={<XCircle size={20} />} color="red" />
          <SummaryCard title="Late" value={counts.late} icon={<Clock3 size={20} />} color="amber" />
          <SummaryCard title="On Leave" value={counts.leave} icon={<CalendarDays size={20} />} color="blue" />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Attendance Details
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="attendance-class" className="mb-2 block text-sm font-medium text-slate-700">
                Select Class
              </label>
              <select
                id="attendance-class"
                value={selectedClass}
                onChange={(event) => {
                  setSelectedClass(event.target.value);
                  setSearch("");
                  setMessage("");
                  setSavedKey("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>Class 8-A</option>
                <option>Class 9-B</option>
                <option>Class 10-A</option>
              </select>
            </div>

            <div>
              <label htmlFor="attendance-date" className="mb-2 block text-sm font-medium text-slate-700">
                Attendance Date
              </label>
              <input
                id="attendance-date"
                type="date"
                value={attendanceDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(event) => {
                  setAttendanceDate(event.target.value);
                  setMessage("");
                  setSavedKey("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="student-search" className="mb-2 block text-sm font-medium text-slate-700">
                Search Student
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="student-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, roll no. or admission no."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div
            role="status"
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.startsWith("Attendance saved") ||
              message.startsWith("Saved attendance")
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {message}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Student Attendance
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedClass} · {attendanceDate} · {filteredStudents.length} students shown
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadSavedAttendance}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw size={16} />
                Load Saved
              </button>
              <button
                onClick={saveAttendance}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Save size={16} />
                Save Attendance
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Roll No.</th>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Admission No.</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {String(student.rollNo).padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-700">
                          {student.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {student.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {student.className}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {student.admissionNo}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[student.status]}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(["Present", "Absent", "Late", "Leave"] as AttendanceStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(student.id, status)}
                            aria-pressed={student.status === status}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                              student.status === status
                                ? statusStyles[status] + " ring-1 ring-current"
                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Search className="mx-auto mb-3 text-slate-300" size={30} />
                      <p className="font-semibold text-slate-700">No students found</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try a different search term or select another class.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Demo data only — attendance is not yet connected to your backend.</span>
            <span>
              {counts.total > 0
                ? `${Math.round((counts.present / counts.total) * 100)}% marked present`
                : "No students in this class"}
            </span>
          </div>
        </section>

        {savedKey && (
          <p className="text-xs text-slate-500">
            Last saved in this page session: {savedKey.replace("_", " · ")}
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "indigo" | "green" | "red" | "amber" | "blue";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
