
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  UserRound,
  GraduationCap,
  Users,
  CalendarDays,
  Phone,
  Mail,
  MapPin,
  Pencil,
  X,
  Save,
  ClipboardCheck,
  IndianRupee,
  FileText,
  BookOpen,
} from "lucide-react";

type Student = {
  admissionNo: string;
  name: string;
  className: string;
  section: string;
  rollNo: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  email: string;
  phone: string;
  address: string;
  academicYear: string;
  admissionDate: string;
  status: "Active" | "Inactive";
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  guardianEmail: string;
  attendance: number;
  totalFee: number;
  paidFee: number;
};

const initialStudent: Student = {
  admissionNo: "ADM2026001",
  name: "Aarav Sharma",
  className: "Class 8",
  section: "A",
  rollNo: "08",
  dateOfBirth: "2014-06-15",
  gender: "Male",
  bloodGroup: "B+",
  email: "aarav@example.com",
  phone: "9876543210",
  address: "Sector 62, Noida, Uttar Pradesh",
  academicYear: "2026–2027",
  admissionDate: "2020-04-10",
  status: "Active",
  fatherName: "Rajesh Sharma",
  fatherPhone: "9876543211",
  motherName: "Priya Sharma",
  motherPhone: "9876543212",
  guardianEmail: "rajesh@example.com",
  attendance: 94,
  totalFee: 60000,
  paidFee: 45000,
};

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function StudentProfile() {
  const [student, setStudent] = useState(initialStudent);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(initialStudent);
  const [activeTab, setActiveTab] = useState("Overview");
  const { studentId } = useParams<{ studentId: string }>();
  function openEdit() {
    setForm({ ...student });
    setShowEdit(true);
  }

  function saveChanges(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStudent({ ...form });
    setShowEdit(false);
  }

  function updateField<K extends keyof Student>(
    field: K,
    value: Student[K]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  const remainingFee = Math.max(0, student.totalFee - student.paidFee);
  const feePercentage =
    student.totalFee > 0
      ? Math.min(100, (student.paidFee / student.totalFee) * 100)
      : 0;

  const tabs = ["Overview", "Academics", "Attendance", "Fees"];

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6">
      {/* Page heading */}
      <div>
        <p className="text-sm text-gray-500">
          Student Management / Student Profile
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Student Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View student information, academic details and school records.
        </p>
      </div>

      {/* Student identity card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="h-2 bg-blue-600" />

        <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UserRound size={38} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {student.name}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    student.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {student.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Admission No: {student.admissionNo}
              </p>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={16} />
                  {student.className} - {student.section}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={16} />
                  Academic Year {student.academicYear}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={openEdit}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Attendance</p>
            <ClipboardCheck className="text-blue-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {student.attendance}%
          </p>
          <div className="mt-3 h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${student.attendance}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Illustrative attendance summary
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Fees Paid</p>
            <IndianRupee className="text-green-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            ₹{student.paidFee.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Out of ₹{student.totalFee.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Pending Fees</p>
            <FileText className="text-amber-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            ₹{remainingFee.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Illustrative fee balance
          </p>
        </div>
      </div>

      {/* Profile navigation */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-w-max border-b border-gray-200 px-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === "Overview" && (
            <div className="space-y-6">
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <UserRound size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail label="Full Name" value={student.name} />
                  <Detail label="Date of Birth" value={student.dateOfBirth} />
                  <Detail label="Gender" value={student.gender} />
                  <Detail label="Blood Group" value={student.bloodGroup} />
                  <Detail label="Email" value={student.email} />
                  <Detail label="Phone Number" value={student.phone} />
                  <div className="sm:col-span-2 lg:col-span-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <Detail label="Address" value={student.address} />
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <GraduationCap size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Academic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail label="Admission Number" value={student.admissionNo} />
                  <Detail label="Class" value={student.className} />
                  <Detail label="Section" value={student.section} />
                  <Detail label="Roll Number" value={student.rollNo} />
                  <Detail label="Academic Year" value={student.academicYear} />
                  <Detail label="Admission Date" value={student.admissionDate} />
                </div>
              </section>

              <hr className="border-gray-100" />

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Users size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Parent / Guardian Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail label="Father's Name" value={student.fatherName} />
                  <Detail label="Father's Phone" value={student.fatherPhone} />
                  <Detail label="Mother's Name" value={student.motherName} />
                  <Detail label="Mother's Phone" value={student.motherPhone} />
                  <Detail label="Guardian Email" value={student.guardianEmail} />
                </div>
              </section>
            </div>
          )}

          {activeTab === "Academics" && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  Academic Summary
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label="Current Class" value={`${student.className} - ${student.section}`} />
                <Detail label="Roll Number" value={student.rollNo} />
                <Detail label="Academic Year" value={student.academicYear} />
              </div>
              <p className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                Subject marks, examination results and report cards can be
                connected when the academic modules and backend are ready.
              </p>
            </section>
          )}

          {activeTab === "Attendance" && (
            <section className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                Attendance Summary
              </h3>
              <div className="max-w-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance percentage</span>
                  <span className="font-semibold text-gray-900">
                    {student.attendance}%
                  </span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-gray-100">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${student.attendance}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Daily attendance records will be shown here after integration
                with the Attendance Management module.
              </p>
            </section>
          )}

          {activeTab === "Fees" && (
            <section className="space-y-4">
              <h3 className="font-semibold text-gray-900">Fee Summary</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Detail label="Total Fees" value={`₹${student.totalFee.toLocaleString("en-IN")}`} />
                <Detail label="Paid" value={`₹${student.paidFee.toLocaleString("en-IN")}`} />
                <Detail label="Balance" value={`₹${remainingFee.toLocaleString("en-IN")}`} />
              </div>
              <div className="h-3 rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-green-600"
                  style={{ width: `${feePercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Fee amounts are sample values, not actual payment records.
              </p>
            </section>
          )}
        </div>
      </div>

      {/* Edit profile modal */}
      {showEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Student Profile
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the student's details.
                </p>
              </div>
              <button
                onClick={() => setShowEdit(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Close edit form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveChanges} className="space-y-6 p-5">
              <section>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Student Details
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name *
                    <input required value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Admission Number *
                    <input required value={form.admissionNo} onChange={(e) => updateField("admissionNo", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Date of Birth
                    <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Gender
                    <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)} className={inputClass}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Blood Group
                    <input value={form.bloodGroup} onChange={(e) => updateField("bloodGroup", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                    <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                    Email
                    <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                    Address
                    <input value={form.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
                  </label>
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Academic Details
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">
                    Class
                    <select value={form.className} onChange={(e) => updateField("className", e.target.value)} className={inputClass}>
                      {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Section
                    <select value={form.section} onChange={(e) => updateField("section", e.target.value)} className={inputClass}>
                      {["A", "B", "C", "D"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Roll Number
                    <input value={form.rollNo} onChange={(e) => updateField("rollNo", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Academic Year
                    <input value={form.academicYear} onChange={(e) => updateField("academicYear", e.target.value)} className={inputClass} />
                  </label>
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Parent / Guardian Details
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">
                    Father's Name
                    <input value={form.fatherName} onChange={(e) => updateField("fatherName", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Father's Phone
                    <input value={form.fatherPhone} onChange={(e) => updateField("fatherPhone", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Mother's Name
                    <input value={form.motherName} onChange={(e) => updateField("motherName", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700">
                    Mother's Phone
                    <input value={form.motherPhone} onChange={(e) => updateField("motherPhone", e.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                    Guardian Email
                    <input type="email" value={form.guardianEmail} onChange={(e) => updateField("guardianEmail", e.target.value)} className={inputClass} />
                  </label>
                </div>
              </section>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setShowEdit(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
