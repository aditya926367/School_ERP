import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Printer,
  Search,
  TrendingUp,
  XCircle,
} from "lucide-react";

type ResultStatus = "Published" | "Pending";

type SubjectResult = {
  subject: string;
  code: string;
  maxMarks: number;
  marksObtained: number | null;
};

type ExamResult = {
  id: number;
  examName: string;
  academicYear: string;
  className: string;
  examDate: string;
  publishedDate: string;
  status: ResultStatus;
  subjects: SubjectResult[];
};

const examResults: ExamResult[] = [
  {
    id: 1,
    examName: "Mid-Term Examination",
    academicYear: "2026–2027",
    className: "Class 10-A",
    examDate: "September 2026",
    publishedDate: "October 5, 2026",
    status: "Published",
    subjects: [
      { subject: "English", code: "ENG101", maxMarks: 100, marksObtained: 82 },
      { subject: "Mathematics", code: "MAT101", maxMarks: 100, marksObtained: 91 },
      { subject: "Science", code: "SCI101", maxMarks: 100, marksObtained: 78 },
      { subject: "Social Science", code: "SST101", maxMarks: 100, marksObtained: 85 },
      { subject: "Computer Science", code: "CS101", maxMarks: 100, marksObtained: 94 },
    ],
  },
  {
    id: 2,
    examName: "Unit Test 1",
    academicYear: "2026–2027",
    className: "Class 10-A",
    examDate: "July 2026",
    publishedDate: "August 2, 2026",
    status: "Published",
    subjects: [
      { subject: "English", code: "ENG101", maxMarks: 50, marksObtained: 40 },
      { subject: "Mathematics", code: "MAT101", maxMarks: 50, marksObtained: 45 },
      { subject: "Science", code: "SCI101", maxMarks: 50, marksObtained: 38 },
      { subject: "Social Science", code: "SST101", maxMarks: 50, marksObtained: 42 },
      { subject: "Computer Science", code: "CS101", maxMarks: 50, marksObtained: 47 },
    ],
  },
  {
    id: 3,
    examName: "Final Examination",
    academicYear: "2026–2027",
    className: "Class 10-A",
    examDate: "March 2027",
    publishedDate: "",
    status: "Pending",
    subjects: [
      { subject: "English", code: "ENG101", maxMarks: 100, marksObtained: null },
      { subject: "Mathematics", code: "MAT101", maxMarks: 100, marksObtained: null },
      { subject: "Science", code: "SCI101", maxMarks: 100, marksObtained: null },
      { subject: "Social Science", code: "SST101", maxMarks: 100, marksObtained: null },
      { subject: "Computer Science", code: "CS101", maxMarks: 100, marksObtained: null },
    ],
  },
];

function getGrade(percentage: number) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 33) return "D";
  return "F";
}

function getGradeColor(grade: string) {
  if (grade === "A+" || grade === "A") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (grade === "B+" || grade === "B") {
    return "bg-blue-100 text-blue-700";
  }
  if (grade === "C" || grade === "D") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-red-100 text-red-700";
}

export default function MyResults() {
  const [selectedExamId, setSelectedExamId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [examFilter, setExamFilter] = useState("All");

  const selectedExam =
    examResults.find((exam) => exam.id === selectedExamId) ??
    examResults[0];

  const publishedResults = examResults.filter(
    (exam) => exam.status === "Published"
  );

  const filteredExams = useMemo(() => {
    return examResults.filter((exam) => {
      const matchesSearch = exam.examName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        examFilter === "All" || exam.status === examFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, examFilter]);

  const obtainedMarks = selectedExam.subjects.reduce(
    (total, subject) => total + (subject.marksObtained ?? 0),
    0
  );

  const maximumMarks = selectedExam.subjects.reduce(
    (total, subject) => total + subject.maxMarks,
    0
  );

  const completedSubjects = selectedExam.subjects.filter(
    (subject) => subject.marksObtained !== null
  );

  const percentage =
    selectedExam.status === "Published" && maximumMarks > 0
      ? (obtainedMarks /
          completedSubjects.reduce(
            (total, subject) => total + subject.maxMarks,
            0
          )) *
        100
      : 0;

  const passedSubjects = completedSubjects.filter(
    (subject) =>
      ((subject.marksObtained ?? 0) / subject.maxMarks) * 100 >= 33
  ).length;

  const overallStatus =
    selectedExam.status === "Pending"
      ? "Pending"
      : passedSubjects === completedSubjects.length
        ? "Pass"
        : "Fail";

  const handlePrint = () => {
    if (selectedExam.status === "Pending") {
      alert("This result has not been published yet.");
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <GraduationCap size={17} />
            <span>Student Portal</span>
            <span>/</span>
            <span>My Results</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Results
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your examination marks, grades, and academic performance.
          </p>
        </div>

        <button
          onClick={handlePrint}
          disabled={selectedExam.status === "Pending"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Printer size={17} />
          Print Marksheet
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Published Results"
          value={String(publishedResults.length)}
          subtitle="Examinations available"
          icon={<FileText size={21} />}
          iconClass="bg-indigo-100 text-indigo-600"
        />
        <SummaryCard
          title="Overall Percentage"
          value={
            selectedExam.status === "Published"
              ? `${percentage.toFixed(1)}%`
              : "—"
          }
          subtitle={selectedExam.examName}
          icon={<TrendingUp size={21} />}
          iconClass="bg-emerald-100 text-emerald-600"
        />
        <SummaryCard
          title="Marks Obtained"
          value={
            selectedExam.status === "Published"
              ? `${obtainedMarks}/${maximumMarks}`
              : "—"
          }
          subtitle="Selected examination"
          icon={<Award size={21} />}
          iconClass="bg-amber-100 text-amber-600"
        />
        <SummaryCard
          title="Subjects Passed"
          value={
            selectedExam.status === "Published"
              ? `${passedSubjects}/${completedSubjects.length}`
              : "—"
          }
          subtitle="Minimum passing marks: 33%"
          icon={<BookOpen size={21} />}
          iconClass="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Exam selector */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="text-indigo-600" size={20} />
          <h2 className="font-semibold text-gray-900">Select Examination</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {examResults.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedExamId === exam.id
                  ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="rounded-lg bg-white p-2 text-indigo-600 shadow-sm">
                  <FileText size={19} />
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    exam.status === "Published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {exam.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{exam.examName}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {exam.academicYear}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {exam.examDate}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Marksheet */}
      <div id="marksheet" className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Examination Marksheet
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {selectedExam.examName} · {selectedExam.academicYear}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
              selectedExam.status === "Published"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {selectedExam.status === "Published"
              ? "Result Published"
              : "Result Not Published"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 border-b border-gray-100 bg-gray-50 p-5 sm:grid-cols-3">
          <StudentDetail label="Student Name" value="Aditya Raj" />
          <StudentDetail label="Class / Section" value={selectedExam.className} />
          <StudentDetail
            label="Academic Year"
            value={selectedExam.academicYear}
          />
        </div>

        {selectedExam.status === "Pending" ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="mb-4 rounded-full bg-amber-100 p-4 text-amber-600">
              <CalendarDays size={30} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Results are not available yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              Your marks will appear here once the school publishes the
              examination results.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Subject</th>
                    <th className="px-5 py-4 font-semibold">Subject Code</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Maximum Marks
                    </th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Marks Obtained
                    </th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Grade
                    </th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {selectedExam.subjects.map((subject) => {
                    const subjectPercentage =
                      ((subject.marksObtained ?? 0) / subject.maxMarks) * 100;
                    const grade =
                      subject.marksObtained === null
                        ? "—"
                        : getGrade(subjectPercentage);
                    const passed = subjectPercentage >= 33;

                    return (
                      <tr key={subject.code} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {subject.subject}
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {subject.code}
                        </td>
                        <td className="px-5 py-4 text-center text-gray-700">
                          {subject.maxMarks}
                        </td>
                        <td className="px-5 py-4 text-center font-semibold text-gray-900">
                          {subject.marksObtained ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-center">
                          {grade === "—" ? (
                            "—"
                          ) : (
                            <span
                              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${getGradeColor(grade)}`}
                            >
                              {grade}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center">
                          {subject.marksObtained === null ? (
                            <span className="text-gray-400">Pending</span>
                          ) : passed ? (
                            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                              <CheckCircle2 size={15} /> Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-medium text-red-600">
                              <XCircle size={15} /> Fail
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-gray-100 p-5 sm:grid-cols-3">
              <ResultMetric
                label="Total Marks"
                value={`${obtainedMarks} / ${maximumMarks}`}
              />
              <ResultMetric
                label="Percentage"
                value={`${percentage.toFixed(2)}%`}
              />
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Final Result</p>
                <p
                  className={`mt-1 text-xl font-bold ${
                    overallStatus === "Pass"
                      ? "text-emerald-600"
                      : overallStatus === "Fail"
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}
                >
                  {overallStatus}
                </p>
                {selectedExam.status === "Published" && (
                  <p className="mt-1 text-xs text-gray-500">
                    Grade: {getGrade(percentage)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:justify-between">
              <span>
                Published on: {selectedExam.publishedDate || "—"}
              </span>
              <span>Passing criteria: 33% in each subject</span>
            </div>
          </>
        )}
      </div>

      {/* All exam results */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              All Examination Results
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search and view the status of your examinations.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 sm:w-52"
              />
            </div>

            <select
              value={examFilter}
              onChange={(event) => setExamFilter(event.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Results</option>
              <option value="Published">Published</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => {
              const marks = exam.subjects.filter(
                (subject) => subject.marksObtained !== null
              );
              const obtained = marks.reduce(
                (total, subject) =>
                  total + (subject.marksObtained ?? 0),
                0
              );
              const maximum = marks.reduce(
                (total, subject) => total + subject.maxMarks,
                0
              );

              return (
                <div
                  key={exam.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                      <FileText size={21} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exam.examName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {exam.academicYear} · {exam.examDate}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {exam.subjects.length} subjects
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-right">
                      {exam.status === "Published" ? (
                        <>
                          <p className="font-bold text-gray-900">
                            {obtained}/{maximum}
                          </p>
                          <p className="text-xs text-gray-500">
                            {maximum > 0
                              ? `${((obtained / maximum) * 100).toFixed(1)}%`
                              : "—"}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">Not available</p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedExamId(exam.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center">
              <Search className="mx-auto mb-3 text-gray-300" size={30} />
              <p className="font-medium text-gray-700">No results found</p>
              <p className="mt-1 text-sm text-gray-500">
                Try another search term or filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #marksheet, #marksheet * {
            visibility: visible;
          }
          #marksheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function StudentDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ResultMetric({
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