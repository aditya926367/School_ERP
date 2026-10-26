import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { getDemoUsers, saveDemoUsers } from "../../utils/demoAuth";
import Pagination from "../../components/common/Pagination";
import ActionButtons from "../../components/common/ActionButtons";
import {
  Download,
  Eye,
  Filter,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

// =====================================================================
// Types
// =====================================================================
type Gender = "Male" | "Female" | "Other";
type Status = "Active" | "Inactive" | "On Leave";

type Teacher = {
  id: string; // employee ID, for example T001
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string; // yyyy-mm-dd
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyName: string;
  emergencyPhone: string;
  designation: string;
  department: string;
  subjects: string[];
  qualification: string;
  experience: string; // years
  joiningDate: string; // yyyy-mm-dd
  employmentType: string;
  classTeacherOf: string; // empty means none
  status: Status;
  photo: string; // image as data URL, empty if no photo
};

// The form holds everything except the ID (the ID is generated)
type FormState = Omit<Teacher, "id">;

// =====================================================================
// Options for dropdowns
// =====================================================================
const SUBJECTS = [
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "Computer Science",
  "Physical Education",
  "Art",
  "Music",
  "Sanskrit",
];

const DESIGNATIONS = [
  "Primary Teacher (PRT)",
  "Trained Graduate Teacher (TGT)",
  "Post Graduate Teacher (PGT)",
  "Head of Department",
  "Vice Principal",
];

const DEPARTMENTS = [
  "Languages",
  "Mathematics",
  "Science",
  "Social Studies",
  "Computer",
  "Arts & Sports",
];

const QUALIFICATIONS = [
  "B.Ed",
  "M.Ed",
  "B.A., B.Ed",
  "B.Sc., B.Ed",
  "M.A., B.Ed",
  "M.Sc., B.Ed",
  "M.Sc., M.Ed",
  "Ph.D.",
  "Other",
];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const STATUSES: Status[] = ["Active", "Inactive", "On Leave"];
const GENDERS: Gender[] = ["Male", "Female", "Other"];

const CLASSES = [
  "6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B",
];

// =====================================================================
// Fake data (saved in the browser, replace with the backend API later)
// =====================================================================
const STORAGE_KEY = "erp_teachers";

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  gender: "Male",
  dob: "",
  bloodGroup: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  emergencyName: "",
  emergencyPhone: "",
  designation: "",
  department: "",
  subjects: [],
  qualification: "",
  experience: "",
  joiningDate: "",
  employmentType: "Full-time",
  classTeacherOf: "",
  status: "Active",
  photo: "",
};

// Builds a full teacher from the few fields that differ
function makeTeacher(
  t: Pick<
    Teacher,
    | "id"
    | "firstName"
    | "lastName"
    | "gender"
    | "phone"
    | "designation"
    | "department"
    | "subjects"
    | "qualification"
    | "experience"
    | "joiningDate"
    | "classTeacherOf"
    | "status"
  >
): Teacher {
  return {
    ...emptyForm,
    ...t,
    dob: "1986-04-12",
    email: `${t.firstName}.${t.lastName}@yourschool.com`.toLowerCase(),
  };
}

const seedTeachers: Teacher[] = [
  makeTeacher({ id: "T001", firstName: "Rahul", lastName: "Sharma", gender: "Male", phone: "9876500001", designation: "Post Graduate Teacher (PGT)", department: "Mathematics", subjects: ["Mathematics"], qualification: "M.Sc., B.Ed", experience: "12", joiningDate: "2014-07-01", classTeacherOf: "10-A", status: "Active" }),
  makeTeacher({ id: "T002", firstName: "Sunita", lastName: "Rao", gender: "Female", phone: "9876500002", designation: "Head of Department", department: "Science", subjects: ["Biology", "Science"], qualification: "Ph.D.", experience: "18", joiningDate: "2009-04-10", classTeacherOf: "", status: "Active" }),
  makeTeacher({ id: "T003", firstName: "Anil", lastName: "Verma", gender: "Male", phone: "9876500003", designation: "Trained Graduate Teacher (TGT)", department: "Languages", subjects: ["English"], qualification: "M.A., B.Ed", experience: "8", joiningDate: "2018-07-16", classTeacherOf: "8-A", status: "Active" }),
  makeTeacher({ id: "T004", firstName: "Priya", lastName: "Nair", gender: "Female", phone: "9876500004", designation: "Primary Teacher (PRT)", department: "Languages", subjects: ["Hindi", "Sanskrit"], qualification: "B.A., B.Ed", experience: "5", joiningDate: "2021-04-05", classTeacherOf: "6-B", status: "Active" }),
  makeTeacher({ id: "T005", firstName: "Vikram", lastName: "Singh", gender: "Male", phone: "9876500005", designation: "Trained Graduate Teacher (TGT)", department: "Arts & Sports", subjects: ["Physical Education"], qualification: "B.Ed", experience: "10", joiningDate: "2016-07-11", classTeacherOf: "", status: "Active" }),
  makeTeacher({ id: "T006", firstName: "Meena", lastName: "Gupta", gender: "Female", phone: "9876500006", designation: "Post Graduate Teacher (PGT)", department: "Social Studies", subjects: ["Social Science"], qualification: "M.A., B.Ed", experience: "14", joiningDate: "2012-04-02", classTeacherOf: "9-B", status: "On Leave" }),
  makeTeacher({ id: "T007", firstName: "Amit", lastName: "Chauhan", gender: "Male", phone: "9876500007", designation: "Trained Graduate Teacher (TGT)", department: "Computer", subjects: ["Computer Science"], qualification: "B.Sc., B.Ed", experience: "4", joiningDate: "2022-07-18", classTeacherOf: "", status: "Inactive" }),
  makeTeacher({ id: "T008", firstName: "Kavita", lastName: "Joshi", gender: "Female", phone: "9876500008", designation: "Primary Teacher (PRT)", department: "Arts & Sports", subjects: ["Art", "Music"], qualification: "B.Ed", experience: "6", joiningDate: "2020-04-06", classTeacherOf: "7-B", status: "Active" }),
];

function loadTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Teacher[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // broken saved data: fall back to the demo list
  }
  return seedTeachers;
}

// =====================================================================
// Helpers
// =====================================================================
function fullName(t: { firstName: string; lastName: string }): string {
  return `${t.firstName} ${t.lastName}`.trim();
}

function initials(t: { firstName: string; lastName: string }): string {
  return (t.firstName.charAt(0) + t.lastName.charAt(0)).toUpperCase();
}

// 2026-10-14 -> 14 Oct 2026
function formatDate(iso: string): string {
  if (!iso) return "-";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// Age in full years from a yyyy-mm-dd date of birth
function ageFrom(dob: string): number {
  const d = new Date(dob + "T00:00:00");
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const beforeBirthday =
    now.getMonth() < d.getMonth() ||
    (now.getMonth() === d.getMonth() && now.getDate() < d.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Next employee ID: highest number + 1 (T008 -> T009)
function nextId(list: Teacher[]): string {
  const max = list.reduce((m, t) => Math.max(m, Number(t.id.slice(1)) || 0), 0);
  return "T" + String(max + 1).padStart(3, "0");
}

const statusColor: Record<Status, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-200 text-gray-600",
  "On Leave": "bg-yellow-100 text-yellow-700",
};

const inputStyle =
  "h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";

// Label + input + error message
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

// =====================================================================
// Add / Edit form (a full page, not a popup)
// =====================================================================
type FormProps = {
  initial: Teacher | null; // null means add a new teacher
  teachers: Teacher[]; // used for the next ID and duplicate checks
  onSave: (teacher: Teacher) => void;
  onCancel: () => void;
};

function TeacherForm({ initial, teachers, onSave, onCancel }: FormProps) {
  const isEdit = initial !== null;
  const employeeId = initial ? initial.id : nextId(teachers);
  const [form, setForm] = useState<FormState>(
    initial ? { ...initial } : { ...emptyForm }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Updates one field and clears its error
  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm({ ...form, [key]: value });
    if (errors[key as string]) {
      const rest = { ...errors };
      delete rest[key as string];
      setErrors(rest);
    }
  }

  function toggleSubject(subject: string) {
    const next = form.subjects.includes(subject)
      ? form.subjects.filter((s) => s !== subject)
      : [...form.subjects, subject];
    set("subjects", next);
  }

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allows choosing the same file again
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, photo: "Please choose an image file" });
      return;
    }
    if (file.size > 300 * 1024) {
      setErrors({ ...errors, photo: "Photo must be smaller than 300 KB" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => set("photo", String(reader.result));
    reader.readAsDataURL(file);
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    const others = teachers.filter((t) => t.id !== employeeId);

    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";

    if (!form.dob) e.dob = "Date of birth is required";
    else if (ageFrom(form.dob) < 18) e.dob = "Teacher must be at least 18 years old";

    if (!/^\d{10}$/.test(form.phone)) e.phone = "Phone number must be 10 digits";
    else if (others.some((t) => t.phone === form.phone))
      e.phone = "Another teacher already has this phone number";

    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    else if (others.some((t) => t.email.toLowerCase() === form.email.trim().toLowerCase()))
      e.email = "Another teacher already has this email";

    if (form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = "PIN code must be 6 digits";
    if (form.emergencyPhone && !/^\d{10}$/.test(form.emergencyPhone))
      e.emergencyPhone = "Phone number must be 10 digits";

    if (!form.designation) e.designation = "Select a designation";
    if (!form.department) e.department = "Select a department";
    if (form.subjects.length === 0) e.subjects = "Select at least one subject";
    if (!form.qualification) e.qualification = "Select a qualification";

    if (form.experience === "" || Number(form.experience) < 0 || Number(form.experience) > 50)
      e.experience = "Enter experience between 0 and 50 years";

    if (!form.joiningDate) e.joiningDate = "Joining date is required";
    else if (form.joiningDate > todayIso()) e.joiningDate = "Joining date cannot be in the future";

    return e;
  }

  function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    onSave({
      ...form,
      id: employeeId,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
    });
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit} className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6" noValidate>
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            School Management / Teachers / {isEdit ? "Edit Teacher" : "Add Teacher"}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Teacher" : "Add Teacher"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Fields marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#27348b] px-5 text-sm font-medium text-white transition hover:bg-[#1f2a70] sm:w-auto"
          >
            {isEdit ? "Save Changes" : "Save Teacher"}
          </button>
        </div>
      </div>

      {errorCount > 0 && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Please fix {errorCount} {errorCount === 1 ? "field" : "fields"} marked in red below.
        </div>
      )}

      {/* ---------------- Personal information ---------------- */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">Personal Information</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr]">
          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
              {form.photo ? (
                <img src={form.photo} alt="Teacher" className="h-full w-full object-cover" />
              ) : (
                <User size={44} />
              )}
            </div>
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <Upload size={16} />
              {form.photo ? "Change photo" : "Upload photo"}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
            {form.photo && (
              <button
                type="button"
                onClick={() => set("photo", "")}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Remove photo
              </button>
            )}
            {errors.photo && <p className="text-center text-xs font-medium text-red-600">{errors.photo}</p>}
            <p className="text-center text-xs text-gray-400">JPG or PNG, up to 300 KB</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="First name" required error={errors.firstName}>
              <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="e.g. Rahul" className={inputStyle} />
            </Field>
            <Field label="Last name" required error={errors.lastName}>
              <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="e.g. Sharma" className={inputStyle} />
            </Field>
            <Field label="Gender" required>
              <select value={form.gender} onChange={(e) => set("gender", e.target.value as Gender)} className={inputStyle}>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Date of birth" required error={errors.dob}>
              <input type="date" value={form.dob} max={todayIso()} onChange={(e) => set("dob", e.target.value)} className={inputStyle} />
            </Field>
            <Field label="Blood group">
              <select value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} className={inputStyle}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </section>

      {/* ---------------- Contact details ---------------- */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">Contact Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Phone number" required error={errors.phone}>
            <input value={form.phone} maxLength={10} inputMode="numeric" onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} placeholder="10 digit mobile number" className={inputStyle} />
          </Field>
          <Field label="Email address" required error={errors.email}>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@yourschool.com" className={inputStyle} />
          </Field>
          <div className="sm:col-span-2 xl:col-span-3">
            <Field label="Address">
              <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House no., street, area" className={inputStyle} />
            </Field>
          </div>
          <Field label="City">
            <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputStyle} />
          </Field>
          <Field label="State">
            <input value={form.state} onChange={(e) => set("state", e.target.value)} className={inputStyle} />
          </Field>
          <Field label="PIN code" error={errors.pincode}>
            <input value={form.pincode} maxLength={6} inputMode="numeric" onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} className={inputStyle} />
          </Field>
          <Field label="Emergency contact name">
            <input value={form.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} className={inputStyle} />
          </Field>
          <Field label="Emergency contact phone" error={errors.emergencyPhone}>
            <input value={form.emergencyPhone} maxLength={10} inputMode="numeric" onChange={(e) => set("emergencyPhone", e.target.value.replace(/\D/g, ""))} className={inputStyle} />
          </Field>
        </div>
      </section>

      {/* ---------------- Professional details ---------------- */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">Professional Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Employee ID">
            <input value={employeeId} disabled className={`${inputStyle} bg-gray-100 text-gray-500`} />
          </Field>
          <Field label="Designation" required error={errors.designation}>
            <select value={form.designation} onChange={(e) => set("designation", e.target.value)} className={inputStyle}>
              <option value="">Select</option>
              {DESIGNATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Department" required error={errors.department}>
            <select value={form.department} onChange={(e) => set("department", e.target.value)} className={inputStyle}>
              <option value="">Select</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Highest qualification" required error={errors.qualification}>
            <select value={form.qualification} onChange={(e) => set("qualification", e.target.value)} className={inputStyle}>
              <option value="">Select</option>
              {QUALIFICATIONS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </Field>
          <Field label="Experience (years)" required error={errors.experience}>
            <input type="number" min={0} max={50} value={form.experience} onChange={(e) => set("experience", e.target.value)} className={inputStyle} />
          </Field>
          <Field label="Joining date" required error={errors.joiningDate}>
            <input type="date" value={form.joiningDate} max={todayIso()} onChange={(e) => set("joiningDate", e.target.value)} className={inputStyle} />
          </Field>
          <Field label="Employment type">
            <select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} className={inputStyle}>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Class teacher of">
            <select value={form.classTeacherOf} onChange={(e) => set("classTeacherOf", e.target.value)} className={inputStyle}>
              <option value="">Not a class teacher</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </Field>
          <Field label="Status" required>
            <select value={form.status} onChange={(e) => set("status", e.target.value as Status)} className={inputStyle}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Subjects as selectable chips */}
        <div className="mt-5">
          <Field label="Subjects taught" required error={errors.subjects}>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => {
                const active = form.subjects.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubject(s)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      active
                        ? "border-blue-600 bg-[#27348b] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </section>

      {/* ---------------- Bottom buttons ---------------- */}
      <div className="flex flex-col-reverse justify-end gap-2 pb-2 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#27348b] px-5 text-sm font-medium text-white transition hover:bg-[#1f2a70] sm:w-auto"
        >
          {isEdit ? "Save Changes" : "Save Teacher"}
        </button>
      </div>
    </form>
  );
}

// =====================================================================
// Page: teacher list (and the form above when adding or editing)
// =====================================================================
const PAGE_SIZES = [5, 10, 25, 50];
const filterStyle =
  "h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";

export default function Teachers() {
  // ?add=1 in the address opens the Add Teacher form (used by the dashboard quick action)
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdding = searchParams.get("add") === "1";
  const [teachers, setTeachers] = useState<Teacher[]>(loadTeachers);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [viewing, setViewing] = useState<Teacher | null>(null);
  const [notice, setNotice] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Save the list in the browser so it is still there after a refresh
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
    } catch {
      // storage is full: ignore, the list still works for this visit
    }
  }, [teachers]);

  const showForm = isAdding || editing !== null;

  function openAdd() {
    setEditing(null);
    setNotice("");
    setSearchParams({ add: "1" });
  }

  function closeForm() {
    setEditing(null);
    setSearchParams({});
  }

  function handleSave(teacher: Teacher) {
    const exists = teachers.some((t) => t.id === teacher.id);
    if (exists) {
      setTeachers(teachers.map((t) => (t.id === teacher.id ? teacher : t)));
      setNotice(`${fullName(teacher)} was updated successfully`);
    } else {
      setTeachers([teacher, ...teachers]);
      setPage(1);
      // naya teacher: login account bhi banao
      const users = getDemoUsers();
      const tempPassword = teacher.id + "@123"; // jaise T009@123
      saveDemoUsers([
        ...users,
        {
          userId: teacher.id,
          email: teacher.email,
          password: tempPassword,
          role: "teacher",
        },
      ]);
      setNotice(
        `${fullName(teacher)} added. Login: ${teacher.id} / ${tempPassword}`
      );
    }
    closeForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(t: Teacher) {
    if (!window.confirm(`Delete ${fullName(t)} (${t.id})? This cannot be undone.`)) return;
    setTeachers(teachers.filter((x) => x.id !== t.id));
    setNotice(`${fullName(t)} was deleted`);
  }

  function clearFilters() {
    setSearch("");
    setSubjectFilter("");
    setDesignationFilter("");
    setGenderFilter("");
    setStatusFilter("");
    setPage(1);
  }

  // ---------- Form view ----------
  if (showForm) {
    return (
      <TeacherForm
        key={editing?.id ?? "new"}
        initial={editing}
        teachers={teachers}
        onSave={handleSave}
        onCancel={closeForm}
      />
    );
  }

  // ---------- List view ----------
  const query = search.trim().toLowerCase();
  const filtered = teachers.filter(
    (t) =>
      (query === "" ||
        fullName(t).toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query) ||
        t.phone.includes(query)) &&
      (subjectFilter === "" || t.subjects.includes(subjectFilter)) &&
      (designationFilter === "" || t.designation === designationFilter) &&
      (genderFilter === "" || t.gender === genderFilter) &&
      (statusFilter === "" || t.status === statusFilter)
  );

  const hasFilters =
    search !== "" || subjectFilter !== "" || designationFilter !== "" || genderFilter !== "" || statusFilter !== "";

  // Stat cards count ALL teachers, not only the filtered ones
  const total = teachers.length;
  const activeCount = teachers.filter((t) => t.status === "Active").length;
  const maleCount = teachers.filter((t) => t.gender === "Male").length;
  const femaleCount = teachers.filter((t) => t.gender === "Female").length;

  const stats = [
    { label: "Total Teachers", value: total, icon: Users, tile: "bg-blue-50 text-blue-600" },
    { label: "Active Teachers", value: activeCount, icon: UserCheck, tile: "bg-green-50 text-green-600" },
    { label: "Male Teachers", value: maleCount, icon: User, tile: "bg-indigo-50 text-indigo-600" },
    { label: "Female Teachers", value: femaleCount, icon: UserPlus, tile: "bg-purple-50 text-purple-600" },
  ];

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  // Downloads the filtered list as a CSV file (opens in Excel)
  function handleExport() {
    const header = [
      "Employee ID", "Name", "Gender", "Phone", "Email", "Designation", "Department",
      "Subjects", "Qualification", "Experience (years)", "Joining Date", "Class Teacher Of", "Status",
    ];

    const rows = filtered.map((t) => [
      t.id, fullName(t), t.gender, t.phone, t.email, t.designation, t.department,
      t.subjects.join("; "), t.qualification, t.experience, t.joiningDate, t.classTeacherOf, t.status,
    ]);

    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teachers.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  // Prints only the teacher table (not the sidebar and header)
  function handlePrint() {
    const rows = filtered
      .map(
        (t) => `<tr>
          <td>${escapeHtml(t.id)}</td>
          <td>${escapeHtml(fullName(t))}</td>
          <td>${escapeHtml(t.subjects.join(", "))}</td>
          <td>${escapeHtml(t.designation)}</td>
          <td>${escapeHtml(t.phone)}</td>
          <td>${escapeHtml(t.status)}</td>
        </tr>`
      )
      .join("");

    const win = window.open("", "_blank", "width=1000,height=700");
    if (!win) {
      alert("Please allow pop-ups to print");
      return;
    }

    win.document.write(`<html><head><title>Teachers</title>
      <style>
        body{font-family:sans-serif;padding:16px;color:#111}
        h1{font-size:20px;margin:0 0 12px}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}
        th{background:#f3f4f6}
      </style></head><body>
      <h1>Teacher Directory (${filtered.length})</h1>
      <table><thead><tr>
        <th>Employee ID</th><th>Name</th><th>Subjects</th><th>Designation</th><th>Phone</th><th>Status</th>
      </tr></thead><tbody>${rows}</tbody></table></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6">
      {/* ---------------- Page heading ---------------- */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">School Management / Teachers</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage teacher records, qualifications, subjects, classes and attendance in one place.
          </p>
        </div>
        {/* Desktop actions: all buttons in one row */}
        <div className="hidden shrink-0 items-center justify-end gap-3 lg:flex">
          <button
            onClick={handleExport}
            className="flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-800 px-4 text-sm font-semibold text-white transition hover:bg-indigo-900"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-800 px-4 text-sm font-semibold text-white transition hover:bg-indigo-900"
          >
            <Printer size={18} />
            Print
          </button>
          <button
            onClick={openAdd}
            className="flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-800 px-5 text-sm font-semibold text-white transition hover:bg-indigo-900"
          >
            <Plus size={18} />
            Add Teacher
          </button>
        </div>

        {/* Small-screen actions: Export and Print together, Add Teacher below */}
        <div className="flex w-full flex-col items-end gap-2 lg:hidden">
          <div className="flex w-full justify-end gap-2 sm:w-auto sm:gap-3">
            <button
              onClick={handleExport}
              className="flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-800 px-3 text-sm font-semibold text-white transition hover:bg-indigo-900 sm:px-4"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-800 px-3 text-sm font-semibold text-white transition hover:bg-indigo-900 sm:px-4"
            >
              <Printer size={18} />
              Print
            </button>
          </div>
          <button
            onClick={openAdd}
            className="flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-800 px-5 text-sm font-semibold text-white transition hover:bg-indigo-900"
          >
            <Plus size={18} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Success message */}
      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss" className="text-green-700 hover:text-green-900">
            <X size={18} />
          </button>
        </div>
      )}

      {/* ---------------- Stat cards ---------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tile }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div>
              <div className="text-[15px] text-gray-500">{label}</div>
              <div className="mt-1 text-3xl font-bold text-gray-900">{value}</div>
            </div>
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tile}`}>
              <Icon size={26} />
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Directory ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Teacher Directory</h2>
            <span className="text-sm text-gray-500">({filtered.length} results)</span>
          </div>

          {/* Search and filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Name, employee ID, phone or email"
                className={`${filterStyle} w-full pl-10`}
              />
            </div>

            <select value={subjectFilter} onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }} className={filterStyle}>
              <option value="">All Subjects</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select value={designationFilter} onChange={(e) => { setDesignationFilter(e.target.value); setPage(1); }} className={filterStyle}>
              <option value="">All Designations</option>
              {DESIGNATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select value={genderFilter} onChange={(e) => { setGenderFilter(e.target.value); setPage(1); }} className={filterStyle}>
              <option value="">All Genders</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={filterStyle}>
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              disabled={!hasFilters}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <X size={16} />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border-t border-gray-200">
          <table className="w-full min-w-[900px] text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3">Employee ID</th>
                <th className="px-5 py-3">Teacher</th>
                <th className="px-5 py-3">Subjects</th>
                <th className="px-5 py-3">Designation</th>
                <th className="px-5 py-3">Class Teacher</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((t) => (
                <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3.5 text-gray-500">{t.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {t.photo ? (
                        <img src={t.photo} alt={fullName(t)} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {initials(t)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-gray-900">{fullName(t)}</div>
                        <div className="truncate text-xs text-gray-500">{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {t.subjects.slice(0, 2).join(", ")}
                    {t.subjects.length > 2 && (
                      <span className="ml-1 text-xs text-gray-500">+{t.subjects.length - 2}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">{t.designation}</td>
                  <td className="px-5 py-3.5">{t.classTeacherOf ? `Class ${t.classTeacherOf}` : "-"}</td>
                  <td className="px-5 py-3.5">{t.phone}</td>
                  <td className="px-5 py-3.5">{formatDate(t.joiningDate)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <ActionButtons
                      onView={() => setViewing(t)}
                      onEdit={() => {
                        setNotice("");
                        setEditing(t);
                      }}
                      onDelete={() => handleDelete(t)}
                      showDelete={true}
                      viewTitle={`View ${fullName(t)}`}
                      editTitle={`Edit ${fullName(t)}`}
                      deleteTitle={`Delete ${fullName(t)}`}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-500">
                    {teachers.length === 0 ? "No teachers added yet. Click Add Teacher to start." : "No teachers match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizes={PAGE_SIZES}
          itemLabel="teachers"
        />
      </div>

      {/* ---------------- View details popup ---------------- */}
      {viewing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Teacher Details</h2>
              <button
                onClick={() => setViewing(null)}
                aria-label="Close"
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-5 flex items-center gap-4">
                {viewing.photo ? (
                  <img src={viewing.photo} alt={fullName(viewing)} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                    {initials(viewing)}
                  </div>
                )}
                <div>
                  <div className="text-lg font-bold text-gray-900">{fullName(viewing)}</div>
                  <div className="text-sm text-gray-500">
                    {viewing.id} · {viewing.designation}
                  </div>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[viewing.status]}`}>
                    {viewing.status}
                  </span>
                </div>
              </div>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                {[
                  ["Gender", viewing.gender],
                  ["Date of birth", formatDate(viewing.dob)],
                  ["Blood group", viewing.bloodGroup || "-"],
                  ["Phone", viewing.phone],
                  ["Email", viewing.email],
                  ["Department", viewing.department],
                  ["Subjects", viewing.subjects.join(", ")],
                  ["Qualification", viewing.qualification],
                  ["Experience", `${viewing.experience} years`],
                  ["Joining date", formatDate(viewing.joiningDate)],
                  ["Employment type", viewing.employmentType],
                  ["Class teacher of", viewing.classTeacherOf ? `Class ${viewing.classTeacherOf}` : "-"],
                  [
                    "Address",
                    [viewing.address, viewing.city, viewing.state, viewing.pincode].filter(Boolean).join(", ") || "-",
                  ],
                  [
                    "Emergency contact",
                    viewing.emergencyName || viewing.emergencyPhone
                      ? `${viewing.emergencyName} ${viewing.emergencyPhone}`.trim()
                      : "-",
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase text-gray-500">{label}</dt>
                    <dd className="mt-0.5 font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setViewing(null)}
                className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setNotice("");
                  setEditing(viewing);
                  setViewing(null);
                }}
                className="h-10 rounded-xl bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a70]"
              >
                Edit Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}