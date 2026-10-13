import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages & Layouts
import Login from "./pages/login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/forgot-password";
import DashboardLayout from "./layouts/DashboardLayout";
// import MainHeader from "./layouts/mainHeader";
// import SimpleHeader from "./layouts/simpleHeader";

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
// import LibraryDashboard from "./pages/libraryDashboard";
// import FeesDashboard from "./pages/feesDashboard";

// Admin Management Pages
import SchoolProfile from "./pages/admin/SchoolProfile";
import AcademicYears from "./pages/admin/AcademicYears";
import ClassesSections from "./pages/admin/ClassesSections";
import Subjects from "./pages/admin/Subjects";
import ClassSubjectTeacherMapping from "./pages/admin/ClassSubjectTeacherMapping";
import HolidaysCalendar from "./pages/admin/HolidaysCalendar";
import GradingExamSettings from "./pages/admin/GradingExamSettings";
import Users from "./pages/admin/Users";

// Student Management Pages (admin side)
import Students from "./pages/admin/Students";
import Admissions from "./pages/admin/Admissions";
import StudentDocuments from "./pages/admin/StudentDocuments";

// Library Pages (aapka)
import Books from "./pages/admin/library/books";
import Members from "./pages/admin/library/Members";
import IssueReturn from "./pages/admin/library/IssueReturn";
import Fines from "./pages/admin/library/Fines";

// Student Pages (colleague ka)
import MyClasses from "./pages/Student/MyClasses";
import MyTimetable from "./pages/Student/MyTimetable";
import MyHomework from "./pages/Student/MyHomework";
import MyAttendance from "./pages/Student/MyAttendance";
import MyExams from "./pages/Student/MyExams";
import MyResults from "./pages/Student/MyResults";
import Announcements from "./pages/Student/Announcements";
import Messages from "./pages/Student/Messages";
//Teacher pages
import TeacherMyClasses from "./pages/teacher/MyClasses";
import TeacherMyStudents from "./pages/teacher/MyStudents";
import TeacherMyTimetable from "./pages/teacher/MyTimetable";
import TeacherMarkAttendance from "./pages/teacher/MarkAttendance";
import TeacherAttendanceHistory from "./pages/teacher/AttendanceHistory";
import TeacherHomework from "./pages/teacher/Homework";
import TeacherEnterMarks from "./pages/teacher/EnterMarks";
import TeacherResults from "./pages/teacher/Results";
import TeacherAnnouncements from "./pages/teacher/Announcements";
import TeacherMessages from "./pages/teacher/Messages";

import MainHeader from "./layouts/mainHeader";
import SimpleHeader from "./layouts/simpleHeader";
import LibraryDashboard from "./pages/libraryDashboard";
import FeesDashboard from "./pages/feesDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Header Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/mainHeader" element={<MainHeader />} />
        <Route path="/simpleHeader" element={<SimpleHeader />} />

        {/* Protected Dashboard Layout Routes */}
        <Route element={<DashboardLayout />}>
          {/* Dashboards */}
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/parentdashboard" element={<ParentDashboard />} />

          {/* Student pages (colleague) */}
          <Route path="/student/classes" element={<MyClasses />} />
          <Route path="/student/timetable" element={<MyTimetable />} />
          <Route path="/student/homework" element={<MyHomework />} />
          <Route path="/student/attendance" element={<MyAttendance />} />
          <Route path="/student/exams" element={<MyExams />} />
          <Route path="/student/results" element={<MyResults />} />
          <Route path="/student/announcements" element={<Announcements />} />
          <Route path="/student/messages" element={<Messages />} />
          
          //teacher pages
          <Route path="/teacher/classes" element={<TeacherMyClasses />} />
          <Route path="/teacher/students" element={<TeacherMyStudents />} />
          <Route path="/teacher/timetable" element={<TeacherMyTimetable />} />
          <Route path="/teacher/mark-attendance" element={<TeacherMarkAttendance />} />
          <Route path="/teacher/attendance-history" element={<TeacherAttendanceHistory />} />
          <Route path="/teacher/homework" element={<TeacherHomework />} />
          <Route path="/teacher/enter-marks" element={<TeacherEnterMarks />} />
          <Route path="/teacher/results" element={<TeacherResults />} />
          <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
          <Route path="/teacher/messages" element={<TeacherMessages />} />  


          <Route
            path="/parentdashboard"
            element={<ParentDashboard />}
          />

          {/* Admin Management */}
          <Route path="/admin/school-profile" element={<SchoolProfile />} />
          <Route path="/admin/academic-years" element={<AcademicYears />} />
          <Route path="/admin/classes-sections" element={<ClassesSections />} />
          <Route path="/admin/subjects" element={<Subjects />} />
          <Route path="/admin/class-subject-teacher" element={<ClassSubjectTeacherMapping />} />
          <Route path="/admin/holidays-calendar" element={<HolidaysCalendar />} />
          <Route path="/admin/grading-exam-settings" element={<GradingExamSettings />} />
          <Route path="/admin/users" element={<Users />} />

          {/* Library / Fees dashboards */}
          <Route path="/library" element={<LibraryDashboard />} />
          <Route path="/fees" element={<FeesDashboard />} />

          {/* Student Management (admin side) */}
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/admissions" element={<Admissions />} />
          <Route path="/admin/student-documents" element={<StudentDocuments />} />

          {/* Library pages (aapka) */}
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/issueReturns" element={<IssueReturn />} />
          <Route path="/fines" element={<Fines />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;