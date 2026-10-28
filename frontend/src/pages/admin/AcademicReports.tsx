import { useMemo, useState, useEffect } from "react";
import {
  Download,
  Search,
  GraduationCap,
  Users,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";

type AcademicRecord = {
  id: number;
  studentName: string;
  admissionNo: string;
  className: string;
  section: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
};

const demoRecords: AcademicRecord[] = [];

const currencyPercent = (value: number) => `${value.toFixed(1)}%`;

export default function AcademicReports() {
  const [records] = useState<AcademicRecord[]>(demoRecords);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const query = search.toLowerCase();

      return (
        (record.studentName.toLowerCase().includes(query) ||
          record.admissionNo.toLowerCase().includes(query)) &&
        (classFilter === "All" || record.className === classFilter) &&
        (subjectFilter === "All" || record.subject === subjectFilter) &&
        (sectionFilter === "All" || record.section === sectionFilter)
      );
    });
  }, [records, search, classFilter, subjectFilter, sectionFilter]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, classFilter, subjectFilter, sectionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const students = useMemo(() => {
    const map = new Map<string, {
      studentName: string;
      admissionNo: string;
      className: string;
      section: string;
      marks: number;
      total: number;
    }>();

    filteredRecords.forEach((record) => {
      const key = record.admissionNo;
      const existing = map.get(key);

      if (existing) {
        existing.marks += record.marksObtained;
        existing.total += record.totalMarks;
      } else {
        map.set(key, {
          studentName: record.studentName,
          admissionNo: record.admissionNo,
          className: record.className,
          section: record.section,
          marks: record.marksObtained,
          total: record.totalMarks,
        });
      }
    });

    return Array.from(map.values()).map((student) => ({
      ...student,
      percentage: student.total
        ? (student.marks / student.total) * 100
        : 0,
    }));
  }, [filteredRecords]);

  const averagePercentage = students.length
    ? students.reduce((sum, student) => sum + student.percentage, 0) /
      students.length
    : 0;

  const passCount = students.filter((student) => student.percentage >= 33).length;
  const passPercentage = students.length
    ? (passCount / students.length) * 100
    : 0;

  const subjectStats = useMemo(() => {
    const map = new Map<string, { marks: number; total: number; count: number }>();

    filteredRecords.forEach((record) => {
      const current = map.get(record.subject) || {
        marks: 0,
        total: 0,
        count: 0,
      };

      current.marks += record.marksObtained;
      current.total += record.totalMarks;
      current.count += 1;
      map.set(record.subject, current);
    });

    return Array.from(map.entries()).map(([subject, data]) => ({
      subject,
      average: data.total ? (data.marks / data.total) * 100 : 0,
      count: data.count,
    }));
  }, [filteredRecords]);

  const exportCSV = () => {
    const headers = [
      "Admission No",
      "Student Name",
      "Class",
      "Section",
      "Subject",
      "Marks Obtained",
      "Total Marks",
      "Percentage",
      "Result",
    ];

    const rows = filteredRecords.map((record) => {
      const percentage = (record.marksObtained / record.totalMarks) * 100;

      return [
        record.admissionNo,
        record.studentName,
        record.className,
        record.section,
        record.subject,
        record.marksObtained,
        record.totalMarks,
        percentage.toFixed(1) + "%",
        percentage >= 33 ? "Pass" : "Fail",
      ];
    });

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "academic-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm";
  const labelClass = "mb-1 block text-sm font-medium text-gray-600";
  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Academic Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze student performance, class results and subject averages.
          </p>
        </div>

        <button
          onClick={exportCSV}
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className={cardClass}>
        <h2 className="mb-4 font-semibold text-gray-800">Report Filters</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass}>Search Student</label>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or admission no."
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Class</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Classes</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Students Included</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {students.length}
              </p>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Performance</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {currencyPercent(averagePercentage)}
              </p>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pass Percentage</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {currencyPercent(passPercentage)}
              </p>
            </div>
            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
              <GraduationCap size={22} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subjects Included</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {subjectStats.length}
              </p>
            </div>
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <BookOpen size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className={cardClass}>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
            <Award size={19} className="text-blue-600" />
            Subject Performance
          </h2>

          {subjectStats.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No subject records found.
            </p>
          ) : (
            <div className="space-y-5">
              {subjectStats.map((subject) => (
                <div key={subject.subject}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="font-medium text-gray-700">
                      {subject.subject}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {currencyPercent(subject.average)}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${Math.min(subject.average, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h2 className="mb-4 font-semibold text-gray-800">
            Class Performance Summary
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-3 font-semibold">Class</th>
                  <th className="px-3 py-3 font-semibold">Students</th>
                  <th className="px-3 py-3 font-semibold">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from(
                  students.reduce((map, student) => {
                    const current = map.get(student.className) || {
                      count: 0,
                      total: 0,
                    };
                    current.count += 1;
                    current.total += student.percentage;
                    map.set(student.className, current);
                    return map;
                  }, new Map<string, { count: number; total: number }>())
                ).map(([className, data]) => (
                  <tr key={className}>
                    <td className="px-3 py-3 font-medium text-gray-800">
                      {className}
                    </td>
                    <td className="px-3 py-3 text-gray-600">{data.count}</td>
                    <td className="px-3 py-3 font-semibold text-gray-800">
                      {currencyPercent(data.total / data.count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="mb-4">
          <h2 className="font-semibold text-gray-800">
            Student Marks Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredRecords.length} subject record(s) found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Admission No.</th>
                <th className="px-4 py-3 font-semibold">Class</th>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Marks</th>
                <th className="px-4 py-3 font-semibold">Percentage</th>
                <th className="px-4 py-3 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No records match your filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const percentage =
                    (record.marksObtained / record.totalMarks) * 100;
                  const passed = percentage >= 33;

                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {record.studentName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.admissionNo}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.className} - {record.section}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.subject}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {record.marksObtained}/{record.totalMarks}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {currencyPercent(percentage)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            passed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {passed ? "Pass" : "Fail"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredRecords.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSizes={[5, 10, 20, 50]}
          />
        )}
      </div>
    </div>
  );
}