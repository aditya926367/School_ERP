
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

type Student = {
  id: number;
  admissionNo: string;
  name: string;
  className: string;
  section: string;
  parentName: string;
  phone: string;
  status: "Active" | "Inactive";
};

const initialStudents: Student[] = [
  { id: 1, admissionNo: "ADM2026001", name: "Aarav Sharma", className: "Class 8", section: "A", parentName: "Rajesh Sharma", phone: "9876543210", status: "Active" },
  { id: 2, admissionNo: "ADM2026002", name: "Ananya Singh", className: "Class 6", section: "B", parentName: "Amit Singh", phone: "9876543211", status: "Active" },
  { id: 3, admissionNo: "ADM2026003", name: "Rohan Kumar", className: "Class 9", section: "A", parentName: "Suresh Kumar", phone: "9876543212", status: "Active" },
  { id: 4, admissionNo: "ADM2026004", name: "Priya Verma", className: "Class 5", section: "C", parentName: "Manoj Verma", phone: "9876543213", status: "Inactive" },
  { id: 5, admissionNo: "ADM2026005", name: "Ishaan Gupta", className: "Class 7", section: "A", parentName: "Ravi Gupta", phone: "9876543214", status: "Active" },
  { id: 6, admissionNo: "ADM2026006", name: "Diya Patel", className: "Class 4", section: "B", parentName: "Karan Patel", phone: "9876543215", status: "Active" },
  { id: 7, admissionNo: "ADM2026007", name: "Kabir Das", className: "Class 10", section: "A", parentName: "Anil Das", phone: "9876543216", status: "Inactive" },
  { id: 8, admissionNo: "ADM2026008", name: "Meera Joshi", className: "Class 3", section: "C", parentName: "Vijay Joshi", phone: "9876543217", status: "Active" },
];

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
const navigate = useNavigate();


  const [form, setForm] = useState({
    admissionNo: "",
    name: "",
    className: "Class 1",
    section: "A",
    parentName: "",
    phone: "",
    status: "Active" as Student["status"],
  });

  const pageSize = 5;

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.admissionNo.toLowerCase().includes(query) ||
        student.parentName.toLowerCase().includes(query);

        
      const matchesClass =
        classFilter === "All" || student.className === classFilter;

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, search, classFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleStudents = filteredStudents.slice(
    startIndex,
    startIndex + pageSize
  );

  const activeCount = students.filter((s) => s.status === "Active").length;
  const inactiveCount = students.length - activeCount;

  function resetForm() {
    setForm({
      admissionNo: "",
      name: "",
      className: "Class 1",
      section: "A",
      parentName: "",
      phone: "",
      status: "Active",
    });
    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    setForm({
      admissionNo: `ADM2026${String(students.length + 1).padStart(3, "0")}`,
      name: "",
      className: "Class 1",
      section: "A",
      parentName: "",
      phone: "",
      status: "Active",
    });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(student: Student) {
    setForm({
      admissionNo: student.admissionNo,
      name: student.name,
      className: student.className,
      section: student.section,
      parentName: student.parentName,
      phone: student.phone,
      status: student.status,
    });
    setEditingId(student.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editingId !== null) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editingId ? { ...student, ...form } : student
        )
      );
    } else {
      const newStudent: Student = {
        id: Math.max(0, ...students.map((student) => student.id)) + 1,
        ...form,
      };
      setStudents((previous) => [newStudent, ...previous]);
      setPage(1);
    }

    resetForm();
  }

  function updateForm(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">School Management / Students</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Student Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student records, classes and enrollment status.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Students", value: students.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Students", value: activeCount, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Inactive Students", value: inactiveCount, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
          { label: "Current Admissions", value: students.filter((s) => s.admissionNo.startsWith("ADM2026")).length, icon: UserPlus, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <Icon size={22} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Student Directory</h2>
            <p className="mt-1 text-sm text-gray-500">
              Search and manage enrolled students.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search students..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              <option value="All">All Classes</option>
              {Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`).map(
                (className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                )
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50">
              <tr>
                {["Student", "Admission No.", "Class", "Parent / Guardian", "Phone", "Status", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {visibleStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      </div>
                     
<button
  type="button"
  onClick={() =>
    navigate(`/admin/student-profile/${student.id}`)
  }
  className="whitespace-nowrap text-left text-sm font-medium text-blue-600 hover:underline"
>
  {student.name}
</button>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.admissionNo}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.className} - {student.section}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.parentName}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.phone}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        student.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        title="View student"
                        onClick={() => setSelectedStudent(student)}
                        className="rounded-md p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Edit student"
                        onClick={() => openEditForm(student)}
                        className="rounded-md p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Pencil size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Users className="mx-auto text-gray-300" size={32} />
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      No students found
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

        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredStudents.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(startIndex + pageSize, filteredStudents.length)} of{" "}
            {filteredStudents.length} students
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="px-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId !== null ? "Edit Student" : "Add Student"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the student's basic details.
                </p>
              </div>
              <button onClick={resetForm} className="rounded-lg p-2 hover:bg-gray-100" aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Student Name *
                  <input required value={form.name} onChange={(e) => updateForm("name", e.target.value)} className={inputClass} placeholder="Enter full name" />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Admission Number *
                  <input required value={form.admissionNo} onChange={(e) => updateForm("admissionNo", e.target.value)} className={inputClass} placeholder="Admission number" />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Class *
                  <select value={form.className} onChange={(e) => updateForm("className", e.target.value)} className={inputClass}>
                    {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Section *
                  <select value={form.section} onChange={(e) => updateForm("section", e.target.value)} className={inputClass}>
                    {["A", "B", "C", "D"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Parent / Guardian *
                  <input required value={form.parentName} onChange={(e) => updateForm("parentName", e.target.value)} className={inputClass} placeholder="Guardian name" />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Phone Number *
                  <input required type="tel" pattern="[0-9]{10}" title="Enter a 10-digit phone number" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className={inputClass} placeholder="10-digit phone number" />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2">
                  Status
                  <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className={inputClass}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  {editingId !== null ? "Save Changes" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Student Details
              </h2>
              <button onClick={() => setSelectedStudent(null)} className="rounded-lg p-2 hover:bg-gray-100" aria-label="Close details">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {selectedStudent.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500">{selectedStudent.admissionNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Class", `${selectedStudent.className} - ${selectedStudent.section}`],
                  ["Parent / Guardian", selectedStudent.parentName],
                  ["Phone", selectedStudent.phone],
                  ["Status", selectedStudent.status],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button onClick={() => setSelectedStudent(null)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
