
import apiClient from "./apiClient";

// Common type for API responses
export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

// ================================
// SCHOOL SETUP
// ================================

export const getSchoolProfile = () =>
  apiClient.get<ApiResponse<unknown>>(
    "/admin/school-profile"
  );

export const saveSchoolProfile = (data: unknown) =>
  apiClient.post<ApiResponse<unknown>>(
    "/admin/school-profile",
    data
  );

export const updateSchoolProfile = (data: unknown) =>
  apiClient.put<ApiResponse<unknown>>(
    "/admin/school-profile",
    data
  );


// ================================
// ACADEMIC YEAR
// ================================

export const getAcademicYears = () =>
  apiClient.get<ApiResponse<unknown[]>>(
    "/admin/academic-years"
  );

export const createAcademicYear = (data: unknown) =>
  apiClient.post<ApiResponse<unknown>>(
    "/admin/academic-years",
    data
  );

export const updateAcademicYear = (
  id: string,
  data: unknown
) =>
  apiClient.put<ApiResponse<unknown>>(
    `/admin/academic-years/${id}`,
    data
  );


// ================================
// CLASS & SECTION
// ================================

export const getClasses = () =>
  apiClient.get<ApiResponse<unknown[]>>(
    "/admin/classes"
  );

export const createClass = (data: unknown) =>
  apiClient.post<ApiResponse<unknown>>(
    "/admin/classes",
    data
  );

export const getSections = () =>
  apiClient.get<ApiResponse<unknown[]>>(
    "/admin/sections"
  );

export const createSection = (data: unknown) =>
  apiClient.post<ApiResponse<unknown>>(
    "/admin/sections",
    data
  );


// ================================
// SUBJECTS
// ================================

export const getSubjects = () =>
  apiClient.get<ApiResponse<unknown[]>>(
    "/admin/subjects"
  );

export const createSubject = (data: unknown) =>
  apiClient.post<ApiResponse<unknown>>(
    "/admin/subjects",
    data
  );


// ================================
// TEACHERS
// ================================

export const getTeachers = () =>
  apiClient.get<ApiResponse<unknown[]>>(
    "/admin/teachers"
  );

export const createTeacher = (data: unknown) =>
  apiClient.post<ApiResponse<unknown>>(
    "/admin/teachers",
    data
  );


// ================================
// STUDENT ADMISSION
// ================================

export const getStudents = () =>
  apiClient.get<ApiResponse<unknown[]>>(
    "/admin/students"
  );

export const createStudent = (data: unknown) =>
  apiClient.post<ApiResponse<unknown>>(
    "/admin/students",
    data
  );
