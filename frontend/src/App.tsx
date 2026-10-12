
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
import Students from "./pages/admin/Students";
import Admissions from "./pages/admin/Admissions";
import StudentDocuments from "./pages/admin/StudentDocuments";
//student pages
import MyClasses from "./pages/student/MyClasses";
import MyTimetable from "./pages/student/MyTimetable";
import MyHomework from "./pages/student/MyHomework";
import MyAttendance from "./pages/student/MyAttendance";
import MyExams from "./pages/student/MyExams";
import MyResults from "./pages/Student/MyResults.tsx";


// Keep this import only if this file exists in your project.
// import StudentProfile from "./pages/admin/StudentProfile";

import MainHeader from "./layouts/mainHeader";
import SimpleHeader from "./layouts/simpleHeader";
import LibraryDashboard from "./pages/libraryDashboard";
import FeesDashboard from "./pages/feesDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/mainHeader" element={<MainHeader />} />
        <Route path="/simpleHeader" element={<SimpleHeader />} />

        {/* Dashboard layout and protected-area pages */}
        <Route element={<DashboardLayout />}>
          {/* Dashboards */}
          <Route
            path="/admindashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/teacherdashboard"
            element={<TeacherDashboard />}
          />
          <Route path="/studentdashboard" element={<StudentDashboard />}/>
          <Route path="/student/classes" element={<MyClasses />} />
          <Route path="/student/timetable" element={<MyTimetable />} />
          <Route path="/student/homework" element={<MyHomework />} />
          <Route path="/student/attendance" element={<MyAttendance />} />
          <Route path="/student/exams" element={<MyExams />} />
          <Route path="/student/results" element={<MyResults />} />

          <Route
            path="/parentdashboard"
            element={<ParentDashboard />}
          />

          {/* Admin management */}
          <Route
            path="/admin/school-profile"
            element={<SchoolProfile />}
          />
          <Route
            path="/admin/academic-years"
            element={<AcademicYears />}
          />
          <Route
            path="/admin/classes-sections"
            element={<ClassesSections />}
          />
          <Route
            path="/admin/subjects"
            element={<Subjects />}
          />
          <Route
            path="/admin/class-subject-teacher"
            element={<ClassSubjectTeacherMapping />}
          />
          <Route
            path="/admin/holidays-calendar"
            element={<HolidaysCalendar />}
          />
          <Route
            path="/admin/grading-exam-settings"
            element={<GradingExamSettings />}
          />
          <Route path="/admin/users" element={<Users />} />

          {/* Student management */}
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/admissions" element={<Admissions />} />
          <Route
            path="/admin/student-documents"
            element={<StudentDocuments />}
          />

          {/* Add StudentProfile route here if its component exists */}

          {/* Other dashboards */}
          <Route
            path="/library"
            element={<LibraryDashboard />}
          />
          <Route
            path="/fees"
            element={<FeesDashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
