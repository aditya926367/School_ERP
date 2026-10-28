
import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Search,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Filter,
} from "lucide-react";

type ResultRecord = {
  id: number;
  rollNo: number;
  admissionNo: string;
  studentName: string;
  className: string;
  subject: string;
  exam: string;
  marksObtained: number;
  maxMarks: number;
};

const initialResults: ResultRecord[] = [];

function getGrade(percentage: number) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function gradeStyle(grade: string) {
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

export default function TeacherResults() {
  const [results] = useState<ResultRecord[]>(initialResults);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedExam, setSelectedExam] = useState("All Exams");
  const [performanceFilter, setPerformanceFilter] = useState("All Students");
  const [search, setSearch] = useState("");

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) => {
      const percentage = (result.marksObtained / result.maxMarks) * 100;

      const matchesClass =
        selectedClass === "All Classes" ||
        result.className === selectedClass;

      const matchesSubject =
        selectedSubject === "All Subjects" ||
        result.subject === selectedSubject;

      const matchesExam =
        selectedExam === "All Exams" || result.exam === selectedExam;

      const matchesSearch =
        !query ||
        `${result.studentName} ${result.admissionNo} ${result.rollNo} ${result.className}`
          .toLowerCase()
          .includes(query);

      const matchesPerformance =
        performanceFilter === "All Students" ||
        (performanceFilter === "Passed" && percentage >= 33) ||
        (performanceFilter === "Failed" && percentage < 33) ||
        (performanceFilter === "Above 75%" && percentage >= 75) ||
        (performanceFilter === "Below 50%" && percentage < 50);

      return (
        matchesClass &&
        matchesSubject &&
        matchesExam &&
        matchesSearch &&
        matchesPerformance
      );
    });
  }, [
    results,
    selectedClass,
    selectedSubject,
    selectedExam,
    performanceFilter,
    search,
  ]);

  const stats = useMemo(() => {
    const total = filteredResults.length;
    const passed = filteredResults.filter(
      (r) => (r.marksObtained / r.maxMarks) * 100 >= 33
    ).length;
    const average = total
      ? filteredResults.reduce(
          (sum, r) => sum + (r.marksObtained / r.maxMarks) * 100,
          0
        ) / total
      : 0;

    return {
      total,
      passed,
      failed: total - passed,
      average: Math.round(average),
      passRate: total ? Math.round((passed / total) * 100) : 0,
    };
  }, [filteredResults]);

  const resetFilters = () => {
    setSelectedClass("All Classes");
    setSelectedSubject("All Subjects");
    setSelectedExam("All Exams");
    setPerformanceFilter("All Students");
    setSearch("");
  };

  const exportCSV = () => {
    const header = [
      "Roll No",
      "Admission No",
      "Student Name",
      "Class",
      "Subject",
      "Exam",
      "Marks Obtained",
      "Maximum Marks",
      "Percentage",
      "Grade",
      "Result",
    ];

    const rows = filteredResults.map((r) => {
      const percentage = (r.marksObtained / r.maxMarks) * 100;
      return [
        r.rollNo,
        r.admissionNo,
        r.studentName,
        r.className,
        r.subject,
        r.exam,
        r.marksObtained,
        r.maxMarks,
        `${percentage.toFixed(1)}%`,
        getGrade(percentage),
        percentage >= 33 ? "Pass" : "Fail",
      ];
    });

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teacher-exam-results.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <Award size={18} />
              Teacher Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Exam Results
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review marks, grades, and student performance.
            </p>
          </div>

          <button
            onClick={exportCSV}
            disabled={filteredResults.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={18} />
            Export Results
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Students in Report" value={stats.total} icon={<Users size={20} />} tone="indigo" />
          <StatCard title="Passed" value={stats.passed} icon={<CheckCircle2 size={20} />} tone="green" />
          <StatCard title="Failed" value={stats.failed} icon={<XCircle size={20} />} tone="red" />
          <StatCard title="Average Percentage" value={`${stats.average}%`} icon={<TrendingUp size={20} />} tone="blue" />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Filter size={19} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Filter Results
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <FilterField label="Class">
              <select
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
                className="filter-control"
              >
                <option>All Classes</option>
                <option>Class 8-A</option>
                <option>Class 9-B</option>
                <option>Class 10-A</option>
              </select>
            </FilterField>

            <FilterField label="Subject">
              <select
                value={selectedSubject}
                onChange={(event) => setSelectedSubject(event.target.value)}
                className="filter-control"
              >
                <option>All Subjects</option>
                <option>Mathematics</option>
                <option>English</option>
                <option>Science</option>
                <option>Social Studies</option>
              </select>
            </FilterField>

            <FilterField label="Examination">
              <select
                value={selectedExam}
                onChange={(event) => setSelectedExam(event.target.value)}
                className="filter-control"
              >
                <option>All Exams</option>
                <option>Unit Test 1</option>
                <option>Half-Yearly Examination</option>
                <option>Unit Test 2</option>
                <option>Annual Examination</option>
              </select>
            </FilterField>

            <FilterField label="Performance">
              <select
                value={performanceFilter}
                onChange={(event) => setPerformanceFilter(event.target.value)}
                className="filter-control"
              >
                <option>All Students</option>
                <option>Passed</option>
                <option>Failed</option>
                <option>Above 75%</option>
                <option>Below 50%</option>
              </select>
            </FilterField>

            <FilterField label="Search Student">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name or admission no."
                  className="filter-control pl-9"
                />
              </div>
            </FilterField>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filteredResults.length}</span> result(s)
            </p>
            <button
              onClick={resetFilters}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Reset Filters
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Student Performance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Grades use the demo scale: A+ (90%), A (80%), B (70%), C (60%), D (50%), F (below 50%).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Roll No.</th>
                  <th className="px-5 py-4 font-semibold">Student</th>
                  <th className="px-5 py-4 font-semibold">Class</th>
                  <th className="px-5 py-4 font-semibold">Subject</th>
                  <th className="px-5 py-4 font-semibold">Exam</th>
                  <th className="px-5 py-4 font-semibold">Marks</th>
                  <th className="px-5 py-4 font-semibold">Percentage</th>
                  <th className="px-5 py-4 font-semibold">Grade</th>
                  <th className="px-5 py-4 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map((result) => {
                  const percentage =
                    (result.marksObtained / result.maxMarks) * 100;
                  const grade = getGrade(percentage);
                  const passed = percentage >= 33;

                  return (
                    <tr key={result.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {String(result.rollNo).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                            {result.studentName
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {result.studentName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {result.admissionNo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{result.className}</td>
                      <td className="px-5 py-4 text-slate-600">{result.subject}</td>
                      <td className="px-5 py-4 text-slate-600">{result.exam}</td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {result.marksObtained}/{result.maxMarks}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-12 font-medium text-slate-700">
                            {percentage.toFixed(1)}%
                          </span>
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${passed ? "bg-emerald-500" : "bg-red-500"}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${gradeStyle(grade)}`}>
                          {grade}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          passed
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {passed ? "Pass" : "Fail"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-14 text-center">
                      <Search size={32} className="mx-auto mb-3 text-slate-300" />
                      <p className="font-semibold text-slate-700">No results found</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing the filters or search term.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 bg-slate-50 p-4 sm:grid-cols-3 sm:p-6">
            <SummaryItem label="Pass Rate" value={`${stats.passRate}%`} />
            <SummaryItem label="Students Passed" value={`${stats.passed} / ${stats.total}`} />
            <SummaryItem label="Students Failed" value={String(stats.failed)} />
          </div>

          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:px-6">
            Demo data only. Connect the page to your marks and results API for real student records.
          </div>
        </section>
      </div>
    </div>
  );
}

function FilterField({
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
  tone: "indigo" | "green" | "red" | "blue";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
