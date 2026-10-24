
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Search,
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Download,
  FileText,
} from "lucide-react";

type ResultStatus = "Pass" | "Fail";
type PublishStatus = "Published" | "Draft";

type StudentResult = {
  id: number;
  studentId: string;
  studentName: string;
  className: string;
  exam: string;
  subjects: number;
  totalObtained: number;
  totalMarks: number;
  publishStatus: PublishStatus;
};

const initialResults: StudentResult[] = [
  {
    id: 1,
    studentId: "STU1001",
    studentName: "Aarav Sharma",
    className: "Class 10",
    exam: "First Term Examination",
    subjects: 5,
    totalObtained: 462,
    totalMarks: 500,
    publishStatus: "Published",
  },
  {
    id: 2,
    studentId: "STU1002",
    studentName: "Priya Verma",
    className: "Class 10",
    exam: "First Term Examination",
    subjects: 5,
    totalObtained: 421,
    totalMarks: 500,
    publishStatus: "Published",
  },
  {
    id: 3,
    studentId: "STU1003",
    studentName: "Rahul Kumar",
    className: "Class 9",
    exam: "Mid-Term Examination",
    subjects: 5,
    totalObtained: 172,
    totalMarks: 500,
    publishStatus: "Draft",
  },
  {
    id: 4,
    studentId: "STU1004",
    studentName: "Ananya Singh",
    className: "Class 8",
    exam: "Unit Test 2",
    subjects: 5,
    totalObtained: 386,
    totalMarks: 500,
    publishStatus: "Published",
  },
  {
    id: 5,
    studentId: "STU1005",
    studentName: "Rohan Gupta",
    className: "Class 9",
    exam: "Mid-Term Examination",
    subjects: 5,
    totalObtained: 245,
    totalMarks: 500,
    publishStatus: "Published",
  },
];

function getPercentage(result: StudentResult) {
  return result.totalMarks > 0
    ? (result.totalObtained / result.totalMarks) * 100
    : 0;
}

// Example grading scale. Adapt this to the school's official policy.
function getGrade(percentage: number) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

function getResultStatus(percentage: number): ResultStatus {
  return percentage >= 33 ? "Pass" : "Fail";
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}
    >
      {children}
    </span>
  );
}

export default function AdminResults() {
  const [results, setResults] = useState<StudentResult[]>(initialResults);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [examFilter, setExamFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const classes = useMemo(
    () => [...new Set(results.map((result) => result.className))].sort(),
    [results],
  );

  const exams = useMemo(
    () => [...new Set(results.map((result) => result.exam))].sort(),
    [results],
  );

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) => {
      const percentage = getPercentage(result);
      const resultStatus = getResultStatus(percentage);

      const matchesSearch = [
        result.studentId,
        result.studentName,
        result.className,
        result.exam,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesClass =
        classFilter === "All" || result.className === classFilter;

      const matchesExam =
        examFilter === "All" || result.exam === examFilter;

      const matchesStatus =
        statusFilter === "All" || resultStatus === statusFilter;

      return matchesSearch && matchesClass && matchesExam && matchesStatus;
    });
  }, [results, search, classFilter, examFilter, statusFilter]);

  const publishedResults = results.filter(
    (result) => result.publishStatus === "Published",
  );

  const passedResults = publishedResults.filter(
    (result) => getResultStatus(getPercentage(result)) === "Pass",
  );

  const averagePercentage =
    publishedResults.length > 0
      ? publishedResults.reduce(
          (sum, result) => sum + getPercentage(result),
          0,
        ) / publishedResults.length
      : 0;

  function togglePublish(id: number) {
    setResults((current) =>
      current.map((result) =>
        result.id === id
          ? {
              ...result,
              publishStatus:
                result.publishStatus === "Published" ? "Draft" : "Published",
            }
          : result,
      ),
    );
  }

  function exportCSV() {
    const headers = [
      "Student ID",
      "Student Name",
      "Class",
      "Examination",
      "Subjects",
      "Marks Obtained",
      "Total Marks",
      "Percentage",
      "Grade",
      "Result",
      "Publication Status",
    ];

    const rows = filteredResults.map((result) => {
      const percentage = getPercentage(result);

      return [
        result.studentId,
        result.studentName,
        result.className,
        result.exam,
        result.subjects,
        result.totalObtained,
        result.totalMarks,
        `${percentage.toFixed(2)}%`,
        getGrade(percentage),
        getResultStatus(percentage),
        result.publishStatus,
      ];
    });

    const escapeCSV = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "school-results.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Examination Results
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review student performance and manage result publication.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Result Records"
          value={results.length}
          icon={<FileText size={22} />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Published Results"
          value={publishedResults.length}
          icon={<Users size={22} />}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Average Percentage"
          value={`${averagePercentage.toFixed(1)}%`}
          icon={<Award size={22} />}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Pass Rate"
          value={
            publishedResults.length
              ? `${((passedResults.length / publishedResults.length) * 100).toFixed(1)}%`
              : "0%"
          }
          icon={<GraduationCap size={22} />}
          color="bg-green-100 text-green-600"
        />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students..."
              aria-label="Search results"
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            aria-label="Filter by class"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All classes</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>

          <select
            value={examFilter}
            onChange={(event) => setExamFilter(event.target.value)}
            aria-label="Filter by exam"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All examinations</option>
            {exams.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by result"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">Pass and Fail</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
      </div>

      {/* Results table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">Student Results</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredResults.length} record(s) found
            </p>
          </div>
          <GraduationCap size={22} className="text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Class</th>
                <th className="px-5 py-4 font-semibold">Examination</th>
                <th className="px-5 py-4 font-semibold">Marks</th>
                <th className="px-5 py-4 font-semibold">Percentage</th>
                <th className="px-5 py-4 font-semibold">Grade</th>
                <th className="px-5 py-4 font-semibold">Result</th>
                <th className="px-5 py-4 font-semibold">Publication</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredResults.map((result) => {
                const percentage = getPercentage(result);
                const grade = getGrade(percentage);
                const status = getResultStatus(percentage);

                return (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {result.studentName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {result.studentId}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {result.className}
                    </td>
                    <td className="px-5 py-4 text-gray-700">{result.exam}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {result.totalObtained} / {result.totalMarks}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        color={
                          percentage >= 80
                            ? "bg-green-100 text-green-700"
                            : percentage >= 50
                              ? "bg-blue-100 text-blue-700"
                              : percentage >= 33
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                        }
                      >
                        {grade}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        color={
                          status === "Pass"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {status === "Pass" ? (
                          <CheckCircle2 size={14} className="mr-1" />
                        ) : (
                          <XCircle size={14} className="mr-1" />
                        )}
                        {status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => togglePublish(result.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          result.publishStatus === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        title="Click to toggle publication status"
                      >
                        {result.publishStatus}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <FileText
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-medium text-gray-700">
                      No results found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Demo data only. Result calculations and the grading scale should be
        aligned with your school's official examination policy.
      </p>
    </div>
  );
}
