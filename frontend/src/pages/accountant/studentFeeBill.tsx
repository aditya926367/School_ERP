import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Printer, Search } from "lucide-react";

import { Head, card, inputCls, btn } from "./feesShared";
import { useFees, money, outstanding } from "../../store/feeStore";
import Pagination from "../../components/common/Pagination";
import { useSchool, SCHOOL_NAME_MISSING } from "../../store/schoolStore";
import { useStudents } from "../../store/studentStore";



export default function StudentFeeBill() {
  const { students } = useFees();
  const school = useSchool();

  // The section lives in the admin student record, so look it up by admission number
  const [adminStudents] = useStudents();
  const sectionOf = (studentId: string) =>
    adminStudents.find((item) => item.admissionNo === studentId)?.section || "—";

  // Filters
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedFeeType, setSelectedFeeType] =
    useState("All Fee Types");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Individual student bill
  const [selectedStudentId, setSelectedStudentId] =
    useState<string | null>(null);

  // Unique class options
  const classOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map((student) => student.className)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }, [students]);

  // Unique fee type options
  const feeTypeOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map((student) => student.feeType)
          .filter(Boolean)
      )
    ).sort();
  }, [students]);

  // Apply all filters together
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch = student.studentName
        .toLowerCase()
        .includes(query);

      const matchesClass =
        selectedClass === "All Classes" ||
        student.className === selectedClass;

      const matchesFeeType =
        selectedFeeType === "All Fee Types" ||
        student.feeType === selectedFeeType;

      return matchesSearch && matchesClass && matchesFeeType;
    });
  }, [students, search, selectedClass, selectedFeeType]);

  // Pagination calculations
  const totalItems = filteredStudents.length;

const totalPages = Math.max(
  1,
  Math.ceil(totalItems / pageSize)
);



  // Keep the page valid if filters or data change
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  // Only show students for the current page
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredStudents.slice(
      startIndex,
      startIndex + pageSize
    );
  }, [filteredStudents, currentPage, pageSize]);

  // Selected student's bill
  const selectedStudent = students.find(
    (student) => student.studentId === selectedStudentId
  );

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setCurrentPage(1);
  };

  const handleFeeTypeChange = (value: string) => {
    setSelectedFeeType(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Individual bill view
  if (selectedStudent) {
    return (
      <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
        <Head
          title="Student Fee-Bill"
          sub="Individual student fee details."
          right={
            <div className="flex flex-wrap gap-3 print:hidden">
              <button
                onClick={() => setSelectedStudentId(null)}
                className={`${btn} flex items-center gap-2`}
              >
                <ArrowLeft size={16} />
                Back to Students
              </button>

              <button
                onClick={() => window.print()}
                className={`${btn} flex items-center gap-2`}
              >
                <Printer size={16} />
                Print Bill
              </button>
            </div>
          }
        />

        <div className="print-bill mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* School header */}
          <div className="border-b border-gray-200 pb-4 text-center">
            <h2 className="text-2xl font-bold text-[#27348b]">
              {school.schoolName || SCHOOL_NAME_MISSING}
            </h2>
            {school.address && <p className="text-xs text-gray-500">{school.address}</p>}

            <p className="mt-1 text-sm text-gray-500">
              Student Fee Bill
            </p>
          </div>

          {/* Student details */}
          <div className="grid grid-cols-2 gap-5 py-6 text-sm">
            <div>
              <p className="text-gray-500">Student Name</p>
              <p className="mt-1 font-semibold text-gray-900">
                {selectedStudent.studentName}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Student ID</p>
              <p className="mt-1 font-semibold text-gray-900">
                {selectedStudent.studentId}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Class</p>
              <p className="mt-1 font-semibold text-gray-900">
                {selectedStudent.className}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Section</p>
              <p className="mt-1 font-semibold text-gray-900">
                {sectionOf(selectedStudent.studentId)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Fee Type</p>
              <p className="mt-1 font-semibold text-gray-900">
                {selectedStudent.feeType}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Due Date</p>
              <p className="mt-1 font-semibold text-gray-900">
                {selectedStudent.dueDate || "—"}
              </p>
            </div>
          </div>

          {/* Fee summary */}
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 text-sm">
            <div className="flex justify-between gap-4 px-4 py-4">
              <span className="text-gray-600">Total Fee</span>

              <span className="font-medium">
                {money(selectedStudent.totalFee)}
              </span>
            </div>

            <div className="flex justify-between gap-4 px-4 py-4">
              <span className="text-gray-600">Paid Amount</span>

              <span className="font-medium text-green-700">
                {money(selectedStudent.paid)}
              </span>
            </div>

            <div className="flex justify-between gap-4 bg-red-50 px-4 py-4 font-bold">
              <span>Outstanding Amount</span>

              <span className="text-red-600">
                {money(outstanding(selectedStudent))}
              </span>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            This is a computer-generated fee bill.
          </p>
        </div>

        {/* Print only the individual bill */}
        <style>{`
          @media print {
            @page {
              margin: 15mm;
            }

            body * {
              visibility: hidden !important;
            }

            .print-bill,
            .print-bill * {
              visibility: visible !important;
            }

            .print-bill {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Student list view
  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Student Fee-Bill"
        sub="Search students, filter by class and fee type, and view individual bills."
      />

      {/* Search | Class | Fee Type */}
      <div className={`${card} grid grid-cols-1 gap-4 p-4 md:grid-cols-3`}>
        {/* Search */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Search Student
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              placeholder="Search student name..."
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        {/* Class filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Class
          </label>

          <select
            value={selectedClass}
            onChange={(event) =>
              handleClassChange(event.target.value)
            }
            className={inputCls}
          >
            <option value="All Classes">All Classes</option>

            {classOptions.map((className) => (
              <option key={className} value={className}>
                Class {className}
              </option>
            ))}
          </select>
        </div>

        {/* Fee type filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Fee Type
          </label>

          <select
            value={selectedFeeType}
            onChange={(event) =>
              handleFeeTypeChange(event.target.value)
            }
            className={inputCls}
          >
            <option value="All Fee Types">All Fee Types</option>

            {feeTypeOptions.map((feeType) => (
              <option key={feeType} value={feeType}>
                {feeType}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student table */}
      <div className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 p-4">
          <h3 className="font-semibold text-gray-900">
            {selectedClass === "All Classes"
              ? "All Students"
              : `Class ${selectedClass} Students`}
          </h3>

          <span className="text-sm text-gray-500">
            {totalItems} student(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">
                  Student Name
                </th>

                <th className="px-6 py-4 font-semibold">
                  Class
                </th>

                <th className="px-6 py-4 font-semibold">
                  Section
                </th>

                <th className="px-6 py-4 text-right font-semibold">
                  Bill
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr
                    key={student.studentId}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {student.studentName}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {student.className}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {sectionOf(student.studentId)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStudentId(student.studentId)
                        }
                        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
                      >
                        View Bill
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No students found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable pagination */}
        <div className="border-t border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
           
          />
        </div>
      </div>
    </div>
  );
}
