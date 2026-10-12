
import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  Save,
  ClipboardList,
  Users,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";

type StudentMark = {
  id: number;
  rollNo: number;
  admissionNo: string;
  name: string;
  marksObtained: string;
};

const initialStudents: StudentMark[] = [
  { id: 1, rollNo: 1, admissionNo: "ADM-1001", name: "Aarav Sharma", marksObtained: "85" },
  { id: 2, rollNo: 2, admissionNo: "ADM-1002", name: "Ananya Verma", marksObtained: "92" },
  { id: 3, rollNo: 3, admissionNo: "ADM-1003", name: "Rohan Kumar", marksObtained: "67" },
  { id: 4, rollNo: 4, admissionNo: "ADM-1004", name: "Priya Singh", marksObtained: "78" },
  { id: 5, rollNo: 5, admissionNo: "ADM-1005", name: "Arjun Gupta", marksObtained: "54" },
  { id: 6, rollNo: 6, admissionNo: "ADM-1006", name: "Sneha Kumari", marksObtained: "96" },
  { id: 7, rollNo: 7, admissionNo: "ADM-1007", name: "Rahul Yadav", marksObtained: "" },
  { id: 8, rollNo: 8, admissionNo: "ADM-1008", name: "Kavya Mishra", marksObtained: "73" },
];

const classOptions = [
  { value: "Class 8-A", count: 35 },
  { value: "Class 9-B", count: 32 },
  { value: "Class 10-A", count: 30 },
];

const subjects = ["Mathematics", "English", "Science", "Social Studies"];
const exams = ["Unit Test 1", "Half-Yearly Examination", "Unit Test 2", "Annual Examination"];

function getGrade(percentage: number) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function getGradeStyle(grade: string) {
  if (grade === "A+" || grade === "A") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (grade === "B" || grade === "C") {
    return "bg-blue-50 text-blue-700";
  }
  if (grade === "D") {
    return "bg-amber-50 text-amber-700";
  }
  return "bg-red-50 text-red-700";
}

export default function TeacherEnterMarks() {
  const [selectedClass, setSelectedClass] = useState("Class 8-A");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedExam, setSelectedExam] = useState("Unit Test 1");
  const [maxMarks, setMaxMarks] = useState("100");
  const [students, setStudents] = useState<StudentMark[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [savedRecords, setSavedRecords] = useState<Record<string, StudentMark[]>>({});
  const [message, setMessage] = useState("");
  const [savedKey, setSavedKey] = useState("");

  const maximum = Number(maxMarks);
  const validMaximum = Number.isFinite(maximum) && maximum > 0;

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) =>
      `${student.name} ${student.admissionNo} ${student.rollNo}`
        .toLowerCase()
        .includes(query)
    );
  }, [students, search]);

  const enteredMarks = students.filter(
    (student) => student.marksObtained.trim() !== ""
  );

  const validMarks = enteredMarks.filter((student) => {
    const mark = Number(student.marksObtained);
    return (
      student.marksObtained.trim() !== "" &&
      Number.isFinite(mark) &&
      mark >= 0 &&
      mark <= maximum
    );
  });

  const invalidCount = enteredMarks.length - validMarks.length;

  const stats = useMemo(() => {
    const percentages = validMarks.map(
      (student) => (Number(student.marksObtained) / maximum) * 100
    );

    return {
      total: students.length,
      entered: enteredMarks.length,
      pending: students.length - enteredMarks.length,
      average: percentages.length
        ? Math.round(
            percentages.reduce((sum, value) => sum + value, 0) /
              percentages.length
          )
        : 0,
      passed: validMarks.filter(
        (student) => Number(student.marksObtained) / maximum >= 0.33
      ).length,
    };
  }, [students, enteredMarks.length, validMarks, maximum]);

  const updateMarks = (id: number, value: string) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === id ? { ...student, marksObtained: value } : student
      )
    );
    setMessage("");
    setSavedKey("");
  };

  const saveMarks = () => {
    if (!validMaximum) {
      setMessage("Maximum marks must be greater than zero.");
      return;
    }

    if (invalidCount > 0) {
      setMessage("Please correct invalid marks before saving.");
      return;
    }

    if (enteredMarks.length === 0) {
      setMessage("Enter marks for at least one student before saving.");
      return;
    }

    const key = `${selectedClass}|${selectedSubject}|${selectedExam}`;

    setSavedRecords((current) => ({
      ...current,
      [key]: students.map((student) => ({ ...student })),
    }));

    setSavedKey(key);
    setMessage(
      `Marks saved for ${selectedClass} — ${selectedSubject} — ${selectedExam}.`
    );
  };

  const loadSavedMarks = () => {
    const key = `${selectedClass}|${selectedSubject}|${selectedExam}`;
    const saved = savedRecords[key];

    if (!saved) {
      setMessage("No saved marks found for this class, subject, and exam.");
      return;
    }

    setStudents(saved.map((student) => ({ ...student })));
    setSavedKey(key);
    setMessage("Saved marks loaded successfully.");
  };

  const resetMarks = () => {
    const confirmed = window.confirm(
      "Clear all marks entered for the currently displayed students?"
    );

    if (!confirmed) return;

    setStudents((current) =>
      current.map((student) => ({ ...student, marksObtained: "" }))
    );
    setMessage("Marks cleared. Remember to save if you want to keep this change.");
    setSavedKey("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <BookOpen size={18} />
              Teacher Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Enter Student Marks
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Record exam marks and review student performance.
            </p>
          </div>

          <button
            onClick={saveMarks}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Save size={18} />
            Save Marks
          </button>
        </div>

        {message && (
          <div
            role="status"
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.startsWith("Marks saved") ||
              message.startsWith("Saved marks")
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Students" value={stats.total} icon={<Users size={20} />} tone="indigo" />
          <StatCard title="Marks Entered" value={stats.entered} icon={<CheckCircle2 size={20} />} tone="green" />
          <StatCard title="Pending Entry" value={stats.pending} icon={<AlertCircle size={20} />} tone="amber" />
          <StatCard title="Average Percentage" value={`${stats.average}%`} icon={<FileSpreadsheet size={20} />} tone="blue" />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Exam Details
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FormField label="Class">
              <select
                value={selectedClass}
                onChange={(event) => {
                  setSelectedClass(event.target.value);
                  setMessage("");
                  setSavedKey("");
                }}
                className="form-select"
              >
                {classOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Subject">
              <select
                value={selectedSubject}
                onChange={(event) => {
                  setSelectedSubject(event.target.value);
                  setMessage("");
                  setSavedKey("");
                }}
                className="form-select"
              >
                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Examination">
              <select
                value={selectedExam}
                onChange={(event) => {
                  setSelectedExam(event.target.value);
                  setMessage("");
                  setSavedKey("");
                }}
                className="form-select"
              >
                {exams.map((exam) => (
                  <option key={exam}>{exam}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Maximum Marks">
              <input
                type="number"
                min="1"
                max="1000"
                value={maxMarks}
                onChange={(event) => {
                  setMaxMarks(event.target.value);
                  setMessage("");
                  setSavedKey("");
                }}
                className="form-select"
              />
            </FormField>
          </div>

          {!validMaximum && (
            <p className="mt-3 text-sm text-red-600">
              Enter a maximum mark greater than zero.
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Student Marks
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedClass} · {selectedSubject} · {selectedExam}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadSavedMarks}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw size={16} />
                Load Saved
              </button>
              <button
                onClick={resetMarks}
                className="rounded-xl border border-red-100 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Clear Marks
              </button>
            </div>
          </div>

          <div className="border-b border-slate-100 p-4 sm:px-6">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by student name, roll no. or admission no."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Roll No.</th>
                  <th className="px-5 py-4 font-semibold">Student</th>
                  <th className="px-5 py-4 font-semibold">Admission No.</th>
                  <th className="px-5 py-4 font-semibold">Marks Obtained</th>
                  <th className="px-5 py-4 font-semibold">Percentage</th>
                  <th className="px-5 py-4 font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const entered = student.marksObtained.trim() !== "";
                  const mark = Number(student.marksObtained);
                  const valid =
                    entered &&
                    validMaximum &&
                    Number.isFinite(mark) &&
                    mark >= 0 &&
                    mark <= maximum;

                  const percentage = valid ? (mark / maximum) * 100 : null;
                  const grade = percentage === null ? null : getGrade(percentage);

                  return (
                    <tr key={student.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {String(student.rollNo).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                            {student.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <span className="font-semibold text-slate-900">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {student.admissionNo}
                      </td>
                      <td className="px-5 py-4">
                        <input
                          aria-label={`Marks for ${student.name}`}
                          type="number"
                          min="0"
                          max={validMaximum ? maximum : undefined}
                          step="0.5"
                          value={student.marksObtained}
                          onChange={(event) =>
                            updateMarks(student.id, event.target.value)
                          }
                          placeholder="Enter marks"
                          className={`w-32 rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 ${
                            entered && !valid
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
                        />
                        {entered && !valid && (
                          <p className="mt-1 text-xs text-red-600">
                            Enter 0–{validMaximum ? maximum : "valid marks"}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {percentage === null ? "—" : `${percentage.toFixed(1)}%`}
                      </td>
                      <td className="px-5 py-4">
                        {grade ? (
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getGradeStyle(grade)}`}>
                            {grade}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Search size={30} className="mx-auto mb-3 text-slate-300" />
                      <p className="font-semibold text-slate-700">No students found</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try another search term.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 bg-slate-50 p-4 sm:grid-cols-3 sm:p-6">
            <MiniStat label="Valid Marks Entered" value={`${validMarks.length} / ${students.length}`} />
            <MiniStat label="Passed (33% threshold)" value={String(stats.passed)} />
            <MiniStat label="Invalid Entries" value={String(invalidCount)} />
          </div>

          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:px-6">
            Demo data only. Marks are kept in page memory and are not yet saved to PostgreSQL.
          </div>
        </section>

        {savedKey && (
          <p className="text-xs text-slate-500">
            Saved in this page session: {savedKey.replaceAll("|", " · ")}
          </p>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tone: "indigo" | "green" | "amber" | "blue";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
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
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
