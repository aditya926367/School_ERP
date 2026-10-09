import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import ForgotPassword from "./pages/forgot-password";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import SchoolProfile from "./pages/admin/SchoolProfile";
import AcademicYears from "./pages/admin/AcademicYears";
import ClassesSections from "./pages/admin/ClassesSections";
import Subjects from "./pages/admin/Subjects";
import ClassSubjectTeacherMapping from "./pages/admin/ClassSubjectTeacherMapping";
import HolidaysCalendar from "./pages/admin/HolidaysCalendar";
import GradingExamSettings from "./pages/admin/GradingExamSettings";
import Users from "./pages/admin/Users";
import MainHeader from "./layouts/mainHeader";
import SimpleHeader from "./layouts/simpleHeader";
import LibraryDashboard from "./pages/libraryDashboard";
import Students from "./pages/admin/Students";
import Admissions from "./pages/admin/Admissions";
import StudentProfile from "./pages/admin/StudentProfile";
import StudentDocuments from "./pages/admin/StudentDocuments";
import Fees from "./pages/feesDashboard";
import FeesDashboard from "./pages/feesDashboard";
Fees

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication & Header Layout Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/mainHeader" element={<MainHeader />} />
        <Route path="/simpleHeader" element={<SimpleHeader />} />
        <Route path="/libraryDashboard" element={<LibraryDashboard />} />
         <Route path="/feesDashboard" element={<FeesDashboard/>} />


        {/* Dashboard Layout & Role-Based Views */}
        <Route element={<DashboardLayout />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/parentdashboard" element={<ParentDashboard />} />

          {/* Student Management */}
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/admissions" element={<Admissions />} />
          <Route path="/admin/student-profile" element={<StudentProfile />} />
          <Route
            path="/admin/student-documents"
            element={<StudentDocuments />}
          />
          <Route
            path="/admin/student-profile/:studentId"
            element={<StudentProfile />}
          />



        </Route>

        {/* Admin Management Sub-Routes */}
        <Route path="/admin/school-profile" element={<SchoolProfile />} />
        <Route path="/admin/academic-years" element={<AcademicYears />} />
        <Route path="/admin/classes-sections" element={<ClassesSections />} />
        <Route path="/admin/subjects" element={<Subjects />} />
        <Route path="/admin/class-subject-teacher" element={<ClassSubjectTeacherMapping />} />
        <Route path="/admin/holidays-calendar" element={<HolidaysCalendar />} />
        <Route path="/admin/grading-exam-settings" element={<GradingExamSettings />} />
        <Route path="/admin/users" element={<Users />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;