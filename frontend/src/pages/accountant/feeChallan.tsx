import { useEffect, useMemo, useState } from "react";
import { Printer, Search } from "lucide-react";
import { Head, card, inputCls, btn } from "./feesShared";
import { useFees, money, outstanding } from "../../store/feeStore";
import Pagination from "../../components/common/Pagination";

export default function FeeChallan() {
  const { students } = useFees();

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedFeeType, setSelectedFeeType] = useState("All Fee Types");
  const [studentId, setStudentId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Get unique class options
  const classOptions = useMemo(
    () => [...new Set(students.map((s) => s.className))],
    [students]
  );

  // Get unique fee type options
  const feeTypeOptions = useMemo(
    () => [...new Set(students.map((s) => s.feeType))],
    [students]
  );

  // Apply search and filters
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.studentName.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query);

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
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Keep the current page valid when filters or data change
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);



  const selectedStudent = filteredStudents.find(
    (student) => student.studentId === studentId
  );

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const resetPage = () => setCurrentPage(1);

  if (students.length === 0) {
    return (
      <div className="p-6 text-sm text-gray-500">
        No students found.
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Fee Challan"
        sub="Search students, filter fee records, and print fee challans."
        right={
          <button
            onClick={() => window.print()}
            disabled={!selectedStudent}
            className={`${btn} flex items-center gap-2 print:hidden`}
          >
            <Printer size={16} />
            Print Challan
          </button>
        }
      />

      {/* Search and filters */}
      <div className={`${card} p-4 print:hidden`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search Student
            </label>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by name or student ID"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setStudentId("");
                  setCurrentPage(1);
                }}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Class
            </label>

            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setStudentId("");
                setCurrentPage(1);
              }}
              className={inputCls}
            >
              <option value="All Classes">All Classes</option>

              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Fee Type
            </label>

            <select
              value={selectedFeeType}
              onChange={(e) => {
                setSelectedFeeType(e.target.value);
                setStudentId("");
                setCurrentPage(1);
              }}
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
      </div>

      {/* Student list */}
      <div className={`${card} overflow-hidden print:hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-gray-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Student Name</th>
                <th className="px-5 py-3 font-semibold">Student ID</th>
                <th className="px-5 py-3 font-semibold">Class</th>
                <th className="px-5 py-3 font-semibold">Fee Type</th>
                <th className="px-5 py-3 font-semibold">Challan</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedStudents.map((student) => (
                <tr
                  key={student.studentId}
                  className={
                    student.studentId === studentId
                      ? "bg-indigo-50"
                      : "hover:bg-slate-50"
                  }
                >
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {student.studentName}
                  </td>

                  <td className="px-5 py-3 text-gray-600">
                    {student.studentId}
                  </td>

                  <td className="px-5 py-3 text-gray-600">
                    {student.className}
                  </td>

                  <td className="px-5 py-3 text-gray-600">
                    {student.feeType}
                  </td>

                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setStudentId(student.studentId)}
                      className={`${btn} ${student.studentId === studentId
                          ? "bg-indigo-700"
                          : ""
                        }`}
                    >
                      {student.studentId === studentId
                        ? "Selected"
                        : "Generate Challan"}
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No students match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

      {/* Selected student's challan */}
      {selectedStudent ? (
        <div
          id="fee-challan"
          className={`${card} mx-auto max-w-2xl p-8`}
        >
          <div className="flex justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="text-lg font-bold text-[#27348b]">
                Your School Name
              </p>
              <p className="text-sm text-gray-500">Fee challan</p>
            </div>

            <p className="text-sm font-semibold">
              CH-{selectedStudent.studentId}-
              {selectedStudent.dueDate.replaceAll("-", "")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-5 text-sm">
            <div>
              <p className="text-gray-500">Student</p>
              <p className="font-semibold">
                {selectedStudent.studentName}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Student ID</p>
              <p className="font-semibold">
                {selectedStudent.studentId}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Class</p>
              <p className="font-semibold">
                {selectedStudent.className}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Fee type</p>
              <p className="font-semibold">
                {selectedStudent.feeType}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Pay before</p>
              <p className="font-semibold">
                {selectedStudent.dueDate}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-[#27348b] px-5 py-4 text-white">
            <span>Amount to pay</span>

            <span className="text-2xl font-bold">
              {money(outstanding(selectedStudent))}
            </span>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Bank: Your Bank Name | Account no: XXXXXXXXXX | IFSC:
            XXXX0000000
          </p>
        </div>
      ) : (
        <div className={`${card} p-6 text-center text-sm text-gray-500 print:hidden`}>
          Select a student to generate a fee challan.
        </div>
      )}

      {/* Print only the challan */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #fee-challan,
          #fee-challan * {
            visibility: visible !important;
          }

          #fee-challan {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            margin: 0;
            box-shadow: none !important;
            border: none !important;
          }

          @page {
            margin: 12mm;
          }
        }
      `}</style>
    </div>
  );
}
