// src/store/teacherStore.ts
// One shared list of teachers, saved in the browser (localStorage key "erp_teachers").
// Pages that need teachers (Add Teacher, Payroll, timetable, class-teacher mapping...)
// all read this store, so a teacher added once shows up everywhere.
//
// When the backend arrives, only the inside of this file changes.
import { createStore } from "./createStore";

export type Gender = "Male" | "Female" | "Other";
export type Status = "Active" | "Inactive" | "On Leave";

export type Teacher = {
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

export const teacherName = (t: { firstName: string; lastName: string }) =>
  `${t.firstName} ${t.lastName}`.trim();

// ---------------------------------------------------------------------
// Demo data (used only the first time, or after resetTeachers())
// ---------------------------------------------------------------------
type SeedRow = Pick<
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
>;

// Builds a full teacher from the few fields that differ
function makeTeacher(t: SeedRow): Teacher {
  return {
    dob: "1986-04-12",
    bloodGroup: "",
    email: `${t.firstName}.${t.lastName}@yourschool.com`.toLowerCase(),
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyName: "",
    emergencyPhone: "",
    employmentType: "Full-time",
    photo: "",
    ...t,
  };
}

const SEED_ROWS: SeedRow[] = [];

// const seed = (): Teacher[] => SEED_ROWS.map(makeTeacher);
const seed = (): Teacher[] => [];

// ---------------------------------------------------------------------
// The store
// ---------------------------------------------------------------------
// The key is the same one the Add Teacher page used before, so teachers
// that are already saved in the browser keep working.
const store = createStore<Teacher[]>("erp_teachers", seed, (saved) =>
  Array.isArray(saved) ? (saved as Teacher[]) : null
);

// In a component: const [teachers, setTeachers] = useTeachers();  (same shape as useState)
export const useTeachers = () => store.useState();

// Outside a component (helpers, payroll): const teachers = getTeachers();
export const getTeachers = () => store.get();

// Back to the demo teachers
export const resetTeachers = () => store.reset();