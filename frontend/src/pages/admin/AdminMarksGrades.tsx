import { useMemo, useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  Plus,
  Search,
  X,
  GraduationCap,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import { EditButton, DeleteButton} from "../../components/common/ActionButtons";
import Pagination from "../../components/common/Pagination";

type MarkStatus = "Draft" | "Published";

type MarkRecord = {
  id: number;
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  exam: string;
  marksObtained: number;
  totalMarks: number;
  status: MarkStatus;
};

const initialRecords: MarkRecord[] = [
  {
    id: 1,
    studentId: "STU1001",
    studentName: "Aarav Sharma",
    className: "Class 10",
    subject: "Mathematics",
    exam: "First Term Examination",
    marksObtained: 92,
    totalMarks: 100,
    status: "Published",
  },
  {
    id: 2,
    studentId: "STU1002",
    studentName: "Priya Verma",
    className: "Class 10",
    subject: "Mathematics",
    exam: "First Term Examination",
    marksObtained: 84,
    totalMarks: 100,
    status: "Published",
  },
  {
    id: 3,
    studentId: "STU1003",
    studentName: "Rahul Kumar",
    className: "Class 9",
    subject: "Science",
    exam: "Mid-Term Examination",
    marksObtained: 36,
    totalMarks: 80,
    status: "Draft",
  },
  {
    id: 4,
    studentId: "STU1004",
    studentName: "Ananya Singh",
    className: "Class 8",
    subject: "English",
    exam: "Unit Test 2",
    marksObtained: 28,
    totalMarks: 50,
    status: "Published",
  },
  {
    id: 5,
    studentId: "STU1005",
    studentName: "Rohan Gupta",
    className: "Class 9",
    subject: "Science",
    exam: "Mid-Term Examination",
    marksObtained: 18,
    totalMarks: 80,
    status: "Draft",
  },
];

const emptyRecord: Omit<MarkRecord, "id"> = {
  studentId: "",
  studentName: "",
  className: "",
  subject: "",
  exam: "",
  marksObtained: 0,
  totalMarks: 100,
  status: "Draft",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function getPercentage(record: MarkRecord) {
  return record.totalMarks > 0
    ? (record.marksObtained / record.totalMarks) * 100
    : 0;
}

// Example grading scale. Adjust it to your school's official policy.
function getGrade(percentage: number) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

function getGradeStyle(grade: string) {
  if (grade === "A+" || grade === "A") {
    return "bg-green-100 text-green-700";
  }
  if (grade === "B+" || grade === "B") {
    return "bg-blue-100 text-blue-700";
  }
  if (grade === "C" || grade === "D") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-red-100 text-red-700";
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
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

export default function AdminMarksGrades() {
  const [records, setRecords] = useState<MarkRecord[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<MarkRecord, "id">>(emptyRecord);
  const [error, setError] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch = [
        record.studentId,
        record.studentName,
        record.className,
        record.subject,
        record.exam,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesClass =
        classFilter === "All" || record.className === classFilter;

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [records, search, classFilter, statusFilter]);

  // Reset page to 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, classFilter, statusFilter]);

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

  const averagePercentage =
    records.length > 0
      ? records.reduce((sum, record) => sum + getPercentage(record), 0) /
        records.length
      : 0;

  const publishedCount = records.filter(
    (record) => record.status === "Published",
  ).length;

  const passCount = records.filter(
    (record) => getPercentage(record) >= 40,
  ).length;

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyRecord });
    setError("");
    setShowModal(true);
  }

  function openEditModal(record: MarkRecord) {
    setEditingId(record.id);
    setForm({
      studentId: record.studentId,
      studentName: record.studentName,
      className: record.className,
      subject: record.subject,
      exam: record.exam,
      marksObtained: record.marksObtained,
      totalMarks: record.totalMarks,
      status: record.status,
    });
    setError("");
    setShowModal(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.studentId.trim() ||
      !form.studentName.trim() ||
      !form.className ||
      !form.subject.trim() ||
      !form.exam.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      !Number.isFinite(form.totalMarks) ||
      form.totalMarks <= 0 ||
      !Number.isFinite(form.marksObtained) ||
      form.marksObtained < 0 ||
      form.marksObtained > form.totalMarks
    ) {
      setError("Marks obtained must be between 0 and total marks.");
      return;
    }

    if (editingId !== null) {
      setRecords((current) =>
        current.map((record) =>
          record.id === editingId ? { ...form, id: editingId } : record,
        ),
      );
    } else {
      setRecords((current) => [
        ...current,
        { ...form, id: Date.now() },
      ]);
    }

    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyRecord });
    setError("");
  }

  function deleteRecord(id: number) {
    if (window.confirm("Delete this student's marks record?")) {
      setRecords((current) =>
        current.filter((record) => record.id !== id),
      );
    }
  }

  function togglePublish(id: number) {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status:
                record.status === "Published" ? "Draft" : "Published",
            }
          : record,
      ),
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Marks & Grades
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student marks, calculate grades, and publish results.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={18} />
          Add Marks
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Marks Records"
          value={records.length}
          icon={<GraduationCap size={22} />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Average Percentage"
          value={`${averagePercentage.toFixed(1)}%`}
          icon={<Award size={22} />}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Published Records"
          value={publishedCount}
          icon={<BookOpen size={22} />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Pass Rate"
          value={`${records.length ? ((passCount / records.length) * 100).toFixed(1) : "0.0"}%`}
          icon={<Users size={22} />}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, subject, exam..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            className={`${inputClass} md:w-44`}
            aria-label="Filter by class"
          >
            <option value="All">All classes</option>
            {[
              "Class 1",
              "Class 2",
              "Class 3",
              "Class 4",
              "Class 5",
              "Class 6",
              "Class 7",
              "Class 8",
              "Class 9",
              "Class 10",
              "Class 11",
              "Class 12",
            ].map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className={`${inputClass} md:w-44`}
            aria-label="Filter by publication status"
          >
            <option value="All">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Student Marks</h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredRecords.length} record(s) found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Class</th>
                <th className="px-5 py-4 font-semibold">Subject / Exam</th>
                <th className="px-5 py-4 font-semibold">Marks</th>
                <th className="px-5 py-4 font-semibold">Percentage</th>
                <th className="px-5 py-4 font-semibold">Grade</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.map((record) => {
                const percentage = getPercentage(record);
                const grade = getGrade(percentage);

                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {record.studentName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {record.studentId}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {record.className}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {record.subject}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {record.exam}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {record.marksObtained} / {record.totalMarks}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getGradeStyle(grade)}`}
                      >
                        {grade}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => togglePublish(record.id)}
                        title="Click to change publication status"
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          record.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {record.status}
                      </button>
                    </td>
                  <td className="px-5 py-4">
  <div className="flex items-center justify-end gap-2">
    <EditButton
      title={`Edit marks for ${record.studentName}`}
      onClick={() => openEditModal(record)}
    />

    <DeleteButton
      title={`Delete marks for ${record.studentName}`}
      onClick={() => deleteRecord(record.id)}
    />
  </div>
</td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <GraduationCap
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-medium text-gray-700">
                      No marks records found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Adjust your filters or add a marks record.
                    </p>
                  </td>
                </tr>
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

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="marks-modal-title"
            className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2
                  id="marks-modal-title"
                  className="text-lg font-bold text-gray-900"
                >
                  {editingId !== null ? "Edit Marks" : "Add Student Marks"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Grade and percentage are calculated automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Student ID *
                  </span>
                  <input
                    required
                    value={form.studentId}
                    onChange={(event) =>
                      setForm({ ...form, studentId: event.target.value })
                    }
                    placeholder="e.g. STU1001"
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Student Name *
                  </span>
                  <input
                    required
                    value={form.studentName}
                    onChange={(event) =>
                      setForm({ ...form, studentName: event.target.value })
                    }
                    placeholder="Enter student name"
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Class *
                  </span>
                  <select
                    required
                    value={form.className}
                    onChange={(event) =>
                      setForm({ ...form, className: event.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="">Select class</option>
                    {Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`).map(
                      (className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Subject *
                  </span>
                  <input
                    required
                    value={form.subject}
                    onChange={(event) =>
                      setForm({ ...form, subject: event.target.value })
                    }
                    placeholder="e.g. Mathematics"
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5 sm:col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Examination *
                  </span>
                  <input
                    required
                    value={form.exam}
                    onChange={(event) =>
                      setForm({ ...form, exam: event.target.value })
                    }
                    placeholder="Enter examination name"
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Marks Obtained *
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    max={form.totalMarks}
                    value={form.marksObtained}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        marksObtained: Number(event.target.value),
                      })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Total Marks *
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.totalMarks}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        totalMarks: Number(event.target.value),
                      })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Publication Status *
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as MarkStatus,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </label>
              </div>

              {form.totalMarks > 0 && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    Percentage:{" "}
                    <strong>
                      {(
                        (form.marksObtained / form.totalMarks) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>
                    {" · "}Grade:{" "}
                    <strong>
                      {getGrade(
                        (form.marksObtained / form.totalMarks) * 100,
                      )}
                    </strong>
                  </p>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#27348b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingId !== null ? "Save Changes" : "Save Marks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}