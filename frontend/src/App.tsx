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
import AdminTimetable from "./pages/admin/AdminTimetable";
import AdminExams from "./pages/admin/AdminExams";
import AdminMarksGrades from "./pages/admin/AdminMarksGrades";
import AdminResults from "./pages/admin/AdminResults";
import StudentAttendance from "./pages/admin/StudentAttendance";
import StaffAttendance from "./pages/admin/StaffAttendance";
import AttendanceReports from "./pages/admin/AttendanceReports";
import FeeStructure from "./pages/admin/FeeStructure";
import FeeCollection from "./pages/admin/FeeCollection";
import Receipts from "./pages/admin/Receipts";
import PendingDues from "./pages/admin/PendingDues";
import FinanceReports from "./pages/admin/FinanceReports";


//student pages
import MyClasses from "./pages/student/MyClasses";
import MyTimetable from "./pages/student/MyTimetable";
import MyHomework from "./pages/student/MyHomework";
import MyAttendance from "./pages/student/MyAttendance";
import MyExams from "./pages/student/MyExams";
import MyResults from "./pages/Student/MyResults.tsx";
import Announcements from "./pages/student/Announcements";
import Messages from "./pages/student/Messages";
// Keep this import only if this file exists in your project.
// import StudentProfile from "./pages/admin/StudentProfile";

// Library Pages (aapka)
import Books from "./pages/admin/library/books";
import Members from "./pages/admin/library/Members";
import IssueReturn from "./pages/admin/library/IssueReturn";
import Fines from "./pages/admin/library/Fines";


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
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/exams" element={<AdminExams />} />
          <Route path="/admin/marks-grades" element={<AdminMarksGrades />} />
          <Route path="/admin/results" element={<AdminResults />} />
          
          <Route
            path="/admin/holidays-calendar"
            element={<HolidaysCalendar />}
          />
          <Route
            path="/admin/grading-exam-settings"
            element={<GradingExamSettings />}
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
          <Route
            path="/admin/student-documents"
            element={<StudentDocuments />}
          />
          <Route path="/admin/student-attendance" element={<StudentAttendance />} />
          <Route path="/admin/staff-attendance" element={<StaffAttendance />} />
          <Route path="/admin/attendance-reports" element={<AttendanceReports />} /> 
          
<Route
  path="/admin/fee-structure"
  element={<FeeStructure />}
/>
<Route
  path="/admin/fee-collection"
  element={<FeeCollection />}
/>
<Route
  path="/admin/receipts"
  element={<Receipts />}
/>
<Route
  path="/admin/pending-dues"
  element={<PendingDues />}
/>
<Route
  path="/admin/finance-reports"
  element={<FinanceReports />}
/>
 

          {/* Add StudentProfile route here if its component exists */}
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