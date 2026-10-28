// src/store/studentStore.ts
// One shared list of students, saved in the browser (localStorage key "erp_students").
// Students page, Admissions, attendance, marks, certificates... all read this store,
// so a student added once shows up everywhere.
//
// When the backend arrives, only the inside of this file changes.
import { createStore } from "./createStore";

export type StudentStatus = "Active" | "Inactive";
export type Gender = "Male" | "Female";

export type Student = {
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

// Demo students (used only the first time, or after resetStudents())
// export const SEED_STUDENTS: Student[] = [];
export const SEED_STUDENTS: Student[] = [];

// const seed = (): Student[] => SEED_STUDENTS.map((student) => ({ ...student, documents: [...student.documents] }));
const seed = (): Student[] => [];

// ---------------------------------------------------------------------
// The store
// ---------------------------------------------------------------------
// Exported so other stores (fees, attendance...) can subscribe to student changes
export const studentStore = createStore<Student[]>("erp_students", seed, (saved) =>
  Array.isArray(saved) ? (saved as Student[]) : null
);

// In a component: const [students, setStudents] = useStudents();  (same shape as useState)
export const useStudents = () => studentStore.useState();

// Outside a component: const students = getStudents();
export const getStudents = () => studentStore.get();

// Back to the demo students
export const resetStudents = () => studentStore.reset();