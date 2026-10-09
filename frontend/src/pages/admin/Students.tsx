import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserPlus,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  UserRound,
  GraduationCap,
  CalendarDays,
  BookOpen,
  IndianRupee,
  ClipboardCheck,
  FileText,
  Download,
  Printer,
  Save,
  Filter,
} from "lucide-react";

type StudentStatus = "Active" | "Inactive";
type Gender = "Male" | "Female";
type Tab = "Overview" | "Academics" | "Attendance" | "Fees" | "Documents";

type Student = {
  id: number;
  admissionNo: string;
  name: string;
  className: string;
  section: string;
  rollNo: string;
  parentName: string;
  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherName: string;
  motherPhone: string;
  motherOccupation: string;
  guardianEmail: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: string;
  admissionDate: string;
  academicYear: string;
  status: StudentStatus;
  attendance: number;
  presentDays: number;
  absentDays: number;
  totalFee: number;
  paidFee: number;
  previousResult: string;
  previousPercentage: number;
  documents: string[];
};

const initialStudents: Student[] = [
  {
    id: 1, admissionNo: "ADM2026001", name: "Aarav Sharma", className: "Class 8", section: "A", rollNo: "08",
    parentName: "Rajesh Sharma", fatherName: "Rajesh Sharma", fatherPhone: "9876543210", fatherOccupation: "Business",
    motherName: "Priya Sharma", motherPhone: "9876543212", motherOccupation: "Teacher", guardianEmail: "rajesh@example.com",
    phone: "9876543210", email: "aarav@example.com", address: "Sector 62, Noida, Uttar Pradesh",
    dateOfBirth: "2014-06-15", gender: "Male", bloodGroup: "B+", admissionDate: "2020-04-10",
    academicYear: "2026-2027", status: "Active", attendance: 94, presentDays: 188, absentDays: 12,
    totalFee: 60000, paidFee: 45000, previousResult: "Passed", previousPercentage: 86,
    documents: ["Birth Certificate", "Previous Marksheet"],
  },
  {
    id: 2, admissionNo: "ADM2026002", name: "Ananya Singh", className: "Class 6", section: "B", rollNo: "12",
    parentName: "Amit Singh", fatherName: "Amit Singh", fatherPhone: "9876543211", fatherOccupation: "Engineer",
    motherName: "Neha Singh", motherPhone: "9876543213", motherOccupation: "Doctor", guardianEmail: "amit@example.com",
    phone: "9876543211", email: "ananya@example.com", address: "Indirapuram, Ghaziabad, Uttar Pradesh",
    dateOfBirth: "2016-09-20", gender: "Female", bloodGroup: "A+", admissionDate: "2022-04-12",
    academicYear: "2026-2027", status: "Active", attendance: 96, presentDays: 192, absentDays: 8,
    totalFee: 52000, paidFee: 52000, previousResult: "Passed", previousPercentage: 91,
    documents: ["Birth Certificate", "Previous Marksheet"],
  },
  {
    id: 3, admissionNo: "ADM2026003", name: "Rohan Kumar", className: "Class 9", section: "A", rollNo: "05",
    parentName: "Suresh Kumar", fatherName: "Suresh Kumar", fatherPhone: "9876543212", fatherOccupation: "Accountant",
    motherName: "Sunita Kumar", motherPhone: "9876543214", motherOccupation: "Homemaker", guardianEmail: "suresh@example.com",
    phone: "9876543212", email: "rohan@example.com", address: "Vaishali, Ghaziabad, Uttar Pradesh",
    dateOfBirth: "2013-03-11", gender: "Male", bloodGroup: "O+", admissionDate: "2019-04-15",
    academicYear: "2026-2027", status: "Active", attendance: 88, presentDays: 176, absentDays: 24,
    totalFee: 65000, paidFee: 40000, previousResult: "Passed", previousPercentage: 78,
    documents: ["Birth Certificate", "Transfer Certificate"],
  },
  {
    id: 4, admissionNo: "ADM2026004", name: "Priya Verma", className: "Class 5", section: "C", rollNo: "09",
    parentName: "Manoj Verma", fatherName: "Manoj Verma", fatherPhone: "9876543213", fatherOccupation: "Manager",
    motherName: "Poonam Verma", motherPhone: "9876543215", motherOccupation: "Nurse", guardianEmail: "manoj@example.com",
    phone: "9876543213", email: "priya@example.com", address: "Sector 15, Noida, Uttar Pradesh",
    dateOfBirth: "2017-12-02", gender: "Female", bloodGroup: "AB+", admissionDate: "2021-04-18",
    academicYear: "2026-2027", status: "Inactive", attendance: 82, presentDays: 164, absentDays: 36,
    totalFee: 48000, paidFee: 30000, previousResult: "Passed", previousPercentage: 81,
    documents: ["Birth Certificate", "Previous Marksheet"],
  },
  {
    id: 5, admissionNo: "ADM2026005", name: "Ishaan Gupta", className: "Class 7", section: "A", rollNo: "03",
    parentName: "Ravi Gupta", fatherName: "Ravi Gupta", fatherPhone: "9876543214", fatherOccupation: "Teacher",
    motherName: "Kavita Gupta", motherPhone: "9876543216", motherOccupation: "Homemaker", guardianEmail: "ravi@example.com",
    phone: "9876543214", email: "ishaan@example.com", address: "Crossings Republik, Ghaziabad",
    dateOfBirth: "2015-05-08", gender: "Male", bloodGroup: "B-", admissionDate: "2021-04-10",
    academicYear: "2026-2027", status: "Active", attendance: 90, presentDays: 180, absentDays: 20,
    totalFee: 56000, paidFee: 50000, previousResult: "Passed", previousPercentage: 84,
    documents: ["Birth Certificate", "Previous Marksheet"],
  },
  {
    id: 6, admissionNo: "ADM2026006", name: "Diya Patel", className: "Class 4", section: "B", rollNo: "14",
    parentName: "Karan Patel", fatherName: "Karan Patel", fatherPhone: "9876543215", fatherOccupation: "Consultant",
    motherName: "Ritu Patel", motherPhone: "9876543217", motherOccupation: "Teacher", guardianEmail: "karan@example.com",
    phone: "9876543215", email: "diya@example.com", address: "Sector 50, Noida, Uttar Pradesh",
    dateOfBirth: "2018-08-17", gender: "Female", bloodGroup: "O-", admissionDate: "2022-04-12",
    academicYear: "2026-2027", status: "Active", attendance: 97, presentDays: 194, absentDays: 6,
    totalFee: 45000, paidFee: 45000, previousResult: "Passed", previousPercentage: 94,
    documents: ["Birth Certificate", "Previous Marksheet"],
  },
  {
    id: 7, admissionNo: "ADM2026007", name: "Kabir Das", className: "Class 10", section: "A", rollNo: "18",
    parentName: "Anil Das", fatherName: "Anil Das", fatherPhone: "9876543216", fatherOccupation: "Business",
    motherName: "Maya Das", motherPhone: "9876543218", motherOccupation: "Homemaker", guardianEmail: "anil@example.com",
    phone: "9876543216", email: "kabir@example.com", address: "Sector 12, Noida, Uttar Pradesh",
    dateOfBirth: "2012-11-21", gender: "Male", bloodGroup: "A-", admissionDate: "2018-04-15",
    academicYear: "2026-2027", status: "Inactive", attendance: 70, presentDays: 140, absentDays: 60,
    totalFee: 70000, paidFee: 30000, previousResult: "Passed", previousPercentage: 72,
    documents: ["Birth Certificate"],
  },
  {
    id: 8, admissionNo: "ADM2026008", name: "Meera Joshi", className: "Class 3", section: "C", rollNo: "11",
    parentName: "Vijay Joshi", fatherName: "Vijay Joshi", fatherPhone: "9876543217", fatherOccupation: "Developer",
    motherName: "Sneha Joshi", motherPhone: "9876543219", motherOccupation: "Designer", guardianEmail: "vijay@example.com",
    phone: "9876543217", email: "meera@example.com", address: "Sector 76, Noida, Uttar Pradesh",
    dateOfBirth: "2019-02-14", gender: "Female", bloodGroup: "AB-", admissionDate: "2023-04-05",
    academicYear: "2026-2027", status: "Active", attendance: 95, presentDays: 190, absentDays: 10,
    totalFee: 42000, paidFee: 42000, previousResult: "Passed", previousPercentage: 88,
    documents: ["Birth Certificate", "Previous Marksheet"],
  },
];

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

const tabs: Tab[] = ["Overview", "Academics", "Attendance", "Fees", "Documents"];

function Detail({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">
        {value === undefined || value === "" ? "Not provided" : value}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [page, setPage] = useState(1);

  const emptyForm = (): Omit<Student, "id"> => ({
    admissionNo: "",
    name: "",
    className: "Class 1",
    section: "A",
    rollNo: "",
    parentName: "",
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    guardianEmail: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    gender: "Male",
    bloodGroup: "Unknown",
    admissionDate: "",
    academicYear: "2026-2027",
    status: "Active",
    attendance: 0,
    presentDays: 0,
    absentDays: 0,
    totalFee: 0,
    paidFee: 0,
    previousResult: "Not available",
    previousPercentage: 0,
    documents: [],
  });

  const [form, setForm] = useState<Omit<Student, "id">>(emptyForm());
  const pageSize = 5;

  const classOptions = useMemo(
    () =>
      [...new Set(students.map((student) => student.className))].sort(
        (a, b) => Number(a.replace("Class ", "")) - Number(b.replace("Class ", ""))
      ),
    [students]
  );

  const sectionOptions = useMemo(
    () =>
      [...new Set(
        students
          .filter((student) => classFilter === "All" || student.className === classFilter)
          .map((student) => student.section)
      )].sort(),
    [students, classFilter]
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.admissionNo.toLowerCase().includes(query) ||
        student.parentName.toLowerCase().includes(query) ||
        student.fatherName.toLowerCase().includes(query) ||
        student.motherName.toLowerCase().includes(query);
      return (
        matchesSearch &&
        (classFilter === "All" || student.className === classFilter) &&
        (sectionFilter === "All" || student.section === sectionFilter) &&
        (genderFilter === "All" || student.gender === genderFilter) &&
        (statusFilter === "All" || student.status === statusFilter)
      );
    });
  }, [students, search, classFilter, sectionFilter, genderFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleStudents = filteredStudents.slice(startIndex, startIndex + pageSize);
  const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? null;

  const activeCount = students.filter((student) => student.status === "Active").length;
  const maleCount = students.filter((student) => student.gender === "Male").length;
  const femaleCount = students.filter((student) => student.gender === "Female").length;

  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    setForm({
      ...emptyForm(),
      admissionNo: `ADM2026${String(Math.max(0, ...students.map((s) => s.id)) + 1).padStart(3, "0")}`,
    });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(student: Student) {
    const { id: _id, ...studentForm } = student;
    setForm(studentForm);
    setEditingId(student.id);
    setShowForm(true);
    setSelectedStudentId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId !== null) {
      setStudents((previous) =>
        previous.map((student) => (student.id === editingId ? { ...student, ...form } : student))
      );
      setSelectedStudentId(editingId);
    } else {
      const newStudent: Student = {
        id: Math.max(0, ...students.map((student) => student.id)) + 1,
        ...form,
      };
      setStudents((previous) => [newStudent, ...previous]);
      setSelectedStudentId(newStudent.id);
      setPage(1);
    }
    resetForm();
  }

  function updateForm<K extends keyof Omit<Student, "id">>(field: K, value: Omit<Student, "id">[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function resetFilters() {
    setSearch("");
    setClassFilter("All");
    setSectionFilter("All");
    setGenderFilter("All");
    setStatusFilter("All");
    setPage(1);
  }

  function exportStudents() {
    const columns: (keyof Student)[] = [
      "admissionNo", "name", "className", "section", "rollNo", "gender",
      "dateOfBirth", "phone", "email", "parentName", "fatherPhone", "status",
      "attendance", "totalFee", "paidFee",
    ];
    const escapeCsv = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [
      columns.join(","),
      ...filteredStudents.map((student) => columns.map((column) => escapeCsv(student[column])).join(",")),
    ].join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-records.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function printStudent(student?: Student) {
    if (student) setSelectedStudentId(student.id);
    window.print();
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6 print:bg-white print:p-0">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">School Management / Students</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student records, profiles, academics, attendance and fees in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button onClick={exportStudents} className={buttonClass}>
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => window.print()} className={buttonClass}>
            <Printer size={16} /> Print
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Students", value: students.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Students", value: activeCount, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Male Students", value: maleCount, icon: UserRound, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Female Students", value: femaleCount, icon: UserPlus, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}><Icon size={22} className={stat.color} /></div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm print:hidden">
        <div className="border-b border-gray-200 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Student Directory</h2>
            <span className="text-sm text-gray-500">({filteredStudents.length} results)</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <div className="relative xl:col-span-2">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="Name, admission no. or parent"
                className={`${inputClass} pl-9`}
              />
            </div>
            <select value={classFilter} onChange={(event) => { setClassFilter(event.target.value); setSectionFilter("All"); setPage(1); }} className={inputClass}>
              <option value="All">All Classes</option>
              {classOptions.map((className) => <option key={className}>{className}</option>)}
            </select>
            <select value={sectionFilter} onChange={(event) => { setSectionFilter(event.target.value); setPage(1); }} className={inputClass}>
              <option value="All">All Sections</option>
              {sectionOptions.map((section) => <option key={section}>{section}</option>)}
            </select>
            <select value={genderFilter} onChange={(event) => { setGenderFilter(event.target.value); setPage(1); }} className={inputClass}>
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className={inputClass}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={resetFilters} className={buttonClass}><X size={15} /> Clear Filters</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50">
              <tr>
                {["Student", "Admission No.", "Class / Section", "Parent / Guardian", "Phone", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{heading}</th>
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
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">Roll No. {student.rollNo || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{student.admissionNo}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{student.className} - {student.section}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{student.parentName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{student.phone}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${student.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{student.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button title="View full profile" onClick={() => { setSelectedStudentId(student.id); setActiveTab("Overview"); }} className="rounded-md p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"><Eye size={17} /></button>
                      <button title="Edit student" onClick={() => openEditForm(student)} className="rounded-md p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={17} /></button>
                      <button title="Print profile" onClick={() => printStudent(student)} className="rounded-md p-2 text-gray-500 hover:bg-gray-100"><Printer size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleStudents.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center">
                  <Users className="mx-auto text-gray-300" size={32} />
                  <p className="mt-2 text-sm font-medium text-gray-700">No students found</p>
                  <p className="mt-1 text-sm text-gray-500">Try changing your search or filters.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredStudents.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, filteredStudents.length)} of {filteredStudents.length} students
          </p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className={buttonClass} aria-label="Previous page"><ChevronLeft size={18} /> Previous</button>
            <span className="px-2 text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className={buttonClass} aria-label="Next page">Next <ChevronRight size={18} /></button>
          </div>
        </div>
      </section>

      {selectedStudent && (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" id="student-profile">
          <div className="h-2 bg-blue-600" />
          <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"><UserRound size={32} /></div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${selectedStudent.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{selectedStudent.status}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{selectedStudent.admissionNo}</p>
                <p className="mt-1 text-sm font-medium text-blue-700">{selectedStudent.className} · Section {selectedStudent.section}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button onClick={() => openEditForm(selectedStudent)} className={buttonClass}><Pencil size={16} /> Edit Profile</button>
              <button onClick={() => window.print()} className={buttonClass}><Printer size={16} /> Print Profile</button>
              <button onClick={() => setSelectedStudentId(null)} className={buttonClass}><X size={16} /> Close</button>
            </div>
          </div>

          <div className="overflow-x-auto border-b border-gray-200 print:hidden">
            <div className="flex min-w-max gap-1 px-4">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === tab ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-900"}`}>{tab}</button>
              ))}
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {activeTab === "Overview" && (
              <>
                <SectionCard title="Personal Information" icon={<UserRound size={19} />}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail label="Full Name" value={selectedStudent.name} />
                    <Detail label="Admission Number" value={selectedStudent.admissionNo} />
                    <Detail label="Date of Birth" value={selectedStudent.dateOfBirth} />
                    <Detail label="Gender" value={selectedStudent.gender} />
                    <Detail label="Blood Group" value={selectedStudent.bloodGroup} />
                    <Detail label="Admission Date" value={selectedStudent.admissionDate} />
                    <Detail label="Phone" value={selectedStudent.phone} />
                    <Detail label="Email" value={selectedStudent.email} />
                    <Detail label="Address" value={selectedStudent.address} />
                  </div>
                </SectionCard>
                <SectionCard title="Parent & Guardian Details" icon={<Users size={19} />}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail label="Father's Name" value={selectedStudent.fatherName} />
                    <Detail label="Father's Phone" value={selectedStudent.fatherPhone} />
                    <Detail label="Father's Occupation" value={selectedStudent.fatherOccupation} />
                    <Detail label="Mother's Name" value={selectedStudent.motherName} />
                    <Detail label="Mother's Phone" value={selectedStudent.motherPhone} />
                    <Detail label="Mother's Occupation" value={selectedStudent.motherOccupation} />
                    <Detail label="Guardian Email" value={selectedStudent.guardianEmail} />
                  </div>
                </SectionCard>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 text-gray-500"><ClipboardCheck size={18} /><span className="text-sm">Attendance</span></div>
                    <p className="mt-3 text-2xl font-bold text-gray-900">{selectedStudent.attendance}%</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${selectedStudent.attendance}%` }} /></div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 text-gray-500"><IndianRupee size={18} /><span className="text-sm">Pending Fees</span></div>
                    <p className="mt-3 text-2xl font-bold text-gray-900">₹{Math.max(0, selectedStudent.totalFee - selectedStudent.paidFee).toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-xs text-gray-500">Out of ₹{selectedStudent.totalFee.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 text-gray-500"><GraduationCap size={18} /><span className="text-sm">Previous Result</span></div>
                    <p className="mt-3 text-2xl font-bold text-gray-900">{selectedStudent.previousPercentage}%</p>
                    <p className="mt-1 text-xs text-gray-500">{selectedStudent.previousResult}</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Academics" && (
              <div className="space-y-5">
                <SectionCard title="Academic Information" icon={<GraduationCap size={19} />}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail label="Class" value={selectedStudent.className} />
                    <Detail label="Section" value={selectedStudent.section} />
                    <Detail label="Roll Number" value={selectedStudent.rollNo} />
                    <Detail label="Academic Session" value={selectedStudent.academicYear} />
                    <Detail label="Previous Result" value={selectedStudent.previousResult} />
                    <Detail label="Previous Percentage" value={`${selectedStudent.previousPercentage}%`} />
                  </div>
                </SectionCard>
                <SectionCard title="Previous Academic Result" icon={<BookOpen size={19} />}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500"><tr><th className="px-4 py-3">Session</th><th className="px-4 py-3">Result</th><th className="px-4 py-3">Percentage</th></tr></thead>
                      <tbody><tr className="border-t border-gray-100"><td className="px-4 py-3">Previous Session</td><td className="px-4 py-3">{selectedStudent.previousResult}</td><td className="px-4 py-3">{selectedStudent.previousPercentage}%</td></tr></tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">Sample result data. Connect academic records to your database for a complete history.</p>
                </SectionCard>
              </div>
            )}

            {activeTab === "Attendance" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { title: "Attendance", value: `${selectedStudent.attendance}%` },
                    { title: "Present Days", value: selectedStudent.presentDays },
                    { title: "Absent Days", value: selectedStudent.absentDays },
                  ].map((item) => <div key={item.title} className="rounded-xl border border-gray-200 p-5"><p className="text-sm text-gray-500">{item.title}</p><p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p></div>)}
                </div>
                <SectionCard title="Attendance History" icon={<CalendarDays size={19} />}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail label="Academic Session" value={selectedStudent.academicYear} />
                    <Detail label="Present Days" value={selectedStudent.presentDays} />
                    <Detail label="Absent Days" value={selectedStudent.absentDays} />
                  </div>
                  <p className="mt-4 text-xs text-gray-500">Attendance history is sample summary data, not a live daily register.</p>
                </SectionCard>
              </div>
            )}

            {activeTab === "Fees" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 p-5"><p className="text-sm text-gray-500">Total Fees</p><p className="mt-2 text-2xl font-bold">₹{selectedStudent.totalFee.toLocaleString("en-IN")}</p></div>
                  <div className="rounded-xl border border-gray-200 p-5"><p className="text-sm text-gray-500">Paid Amount</p><p className="mt-2 text-2xl font-bold text-green-700">₹{selectedStudent.paidFee.toLocaleString("en-IN")}</p></div>
                  <div className="rounded-xl border border-gray-200 p-5"><p className="text-sm text-gray-500">Pending Amount</p><p className="mt-2 text-2xl font-bold text-red-600">₹{Math.max(0, selectedStudent.totalFee - selectedStudent.paidFee).toLocaleString("en-IN")}</p></div>
                </div>
                <SectionCard title="Fee Payment Summary" icon={<IndianRupee size={19} />}>
                  <div className="mb-3 flex items-center justify-between"><span className="text-sm text-gray-600">Fees paid</span><span className="text-sm font-semibold">{selectedStudent.totalFee > 0 ? Math.min(100, selectedStudent.paidFee / selectedStudent.totalFee * 100).toFixed(0) : 0}%</span></div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-green-600" style={{ width: `${selectedStudent.totalFee > 0 ? Math.min(100, selectedStudent.paidFee / selectedStudent.totalFee * 100) : 0}%` }} /></div>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Detail label="Payment Status" value={selectedStudent.paidFee >= selectedStudent.totalFee ? "Paid in Full" : selectedStudent.paidFee === 0 ? "Unpaid" : "Partially Paid"} />
                    <Detail label="Academic Session" value={selectedStudent.academicYear} />
                  </div>
                  <p className="mt-4 text-xs text-gray-500">Sample fee summary. Actual invoices and transactions require backend integration.</p>
                </SectionCard>
              </div>
            )}

            {activeTab === "Documents" && (
              <SectionCard title="Student Documents" icon={<FileText size={19} />}>
                {selectedStudent.documents.length ? (
                  <div className="space-y-3">
                    {selectedStudent.documents.map((document) => (
                      <div key={document} className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600"><FileText size={20} /></div>
                        <div><p className="text-sm font-medium text-gray-900">{document}</p><p className="text-xs text-gray-500">Document record · Sample</p></div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">No documents have been listed.</p>}
                <p className="mt-4 text-xs text-gray-500">Document names only; uploads and downloads need document storage and backend integration.</p>
              </SectionCard>
            )}
          </div>
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4 print:hidden">
          <div className="my-auto max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{editingId !== null ? "Edit Student" : "Add Student"}</h2>
                <p className="mt-1 text-sm text-gray-500">Manage personal, academic, guardian, attendance and fee details.</p>
              </div>
              <button onClick={resetForm} className="rounded-lg p-2 hover:bg-gray-100" aria-label="Close form"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5">
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Personal & Admission Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="text-sm font-medium text-gray-700">Student Name *<input required value={form.name} onChange={(e) => updateForm("name", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Admission Number *<input required value={form.admissionNo} onChange={(e) => updateForm("admissionNo", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Class *<select value={form.className} onChange={(e) => updateForm("className", e.target.value)} className={inputClass}>{Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((c) => <option key={c}>{c}</option>)}</select></label>
                  <label className="text-sm font-medium text-gray-700">Section *<select value={form.section} onChange={(e) => updateForm("section", e.target.value)} className={inputClass}>{["A", "B", "C", "D"].map((s) => <option key={s}>{s}</option>)}</select></label>
                  <label className="text-sm font-medium text-gray-700">Roll Number<input value={form.rollNo} onChange={(e) => updateForm("rollNo", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Date of Birth<input type="date" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Gender<select value={form.gender} onChange={(e) => updateForm("gender", e.target.value as Gender)} className={inputClass}><option>Male</option><option>Female</option></select></label>
                  <label className="text-sm font-medium text-gray-700">Blood Group<select value={form.bloodGroup} onChange={(e) => updateForm("bloodGroup", e.target.value)} className={inputClass}>{["Unknown", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => <option key={b}>{b}</option>)}</select></label>
                  <label className="text-sm font-medium text-gray-700">Admission Date<input type="date" value={form.admissionDate} onChange={(e) => updateForm("admissionDate", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Academic Session<input value={form.academicYear} onChange={(e) => updateForm("academicYear", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Status<select value={form.status} onChange={(e) => updateForm("status", e.target.value as StudentStatus)} className={inputClass}><option>Active</option><option>Inactive</option></select></label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Contact & Guardian Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="text-sm font-medium text-gray-700">Student Phone<input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Student Email<input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Father's Name<input value={form.fatherName} onChange={(e) => { updateForm("fatherName", e.target.value); updateForm("parentName", e.target.value); }} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Father's Phone<input type="tel" value={form.fatherPhone} onChange={(e) => updateForm("fatherPhone", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Father's Occupation<input value={form.fatherOccupation} onChange={(e) => updateForm("fatherOccupation", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Mother's Name<input value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Mother's Phone<input type="tel" value={form.motherPhone} onChange={(e) => updateForm("motherPhone", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Mother's Occupation<input value={form.motherOccupation} onChange={(e) => updateForm("motherOccupation", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Guardian Email<input type="email" value={form.guardianEmail} onChange={(e) => updateForm("guardianEmail", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700 sm:col-span-2 lg:col-span-3">Address<textarea rows={2} value={form.address} onChange={(e) => updateForm("address", e.target.value)} className={inputClass} /></label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-900">Academics, Attendance & Fees</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="text-sm font-medium text-gray-700">Previous Result<input value={form.previousResult} onChange={(e) => updateForm("previousResult", e.target.value)} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Previous Percentage<input type="number" min="0" max="100" value={form.previousPercentage} onChange={(e) => updateForm("previousPercentage", Number(e.target.value))} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Attendance %<input type="number" min="0" max="100" value={form.attendance} onChange={(e) => updateForm("attendance", Number(e.target.value))} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Present Days<input type="number" min="0" value={form.presentDays} onChange={(e) => updateForm("presentDays", Number(e.target.value))} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Absent Days<input type="number" min="0" value={form.absentDays} onChange={(e) => updateForm("absentDays", Number(e.target.value))} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Total Fees (₹)<input type="number" min="0" value={form.totalFee} onChange={(e) => updateForm("totalFee", Number(e.target.value))} className={inputClass} /></label>
                  <label className="text-sm font-medium text-gray-700">Paid Fees (₹)<input type="number" min="0" value={form.paidFee} onChange={(e) => updateForm("paidFee", Number(e.target.value))} className={inputClass} /></label>
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-4 sm:flex-row">
                <button type="button" onClick={resetForm} className={buttonClass}>Cancel</button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><Save size={16} />{editingId !== null ? "Save Changes" : "Add Student"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #student-profile, #student-profile * { visibility: visible; }
          #student-profile { position: absolute; inset: 0; width: 100%; border: 0; box-shadow: none; }
          #student-profile .print\\\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
