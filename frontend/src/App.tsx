import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages & Layouts
import Login from "./pages/login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/forgot-password";
import DashboardLayout from "./layouts/DashboardLayout";


// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";


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
import AcademicReports from "./pages/admin/AcademicReports";
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


import Children from "./pages/parent/Children";
import Timetable from "./pages/parent/Timetable";
import ParentHomework from "./pages/parent/Homework";
import ParentResults from "./pages/parent/Results";
import ParentAttendance from "./pages/parent/Attendance";
import ParentFeeDetails from "./pages/parent/FeeDetails";
import ParentPaymentHistory from "./pages/parent/PaymentHistory";
import ParentAnnouncements from "./pages/parent/Announcements";
import ParentMessages from "./pages/parent/Messages";
//certificates
import CertificateDashboard from "./pages/admin/certificates/certificateDashboard";
import CreateCertificate from "./pages/admin/certificates/createCertificate";
import ManageCertificates from "./pages/admin/certificates/manageCertificates";
import BulkCertificate from "./pages/admin/certificates/bulkCertificate";
import IndividualCertificate from "./pages/admin/certificates/individualCertificate";
import Awards from "./pages/admin/certificates/awards";
import TransferCertificate from "./pages/admin/certificates/transferCertificate";
import CharacterCertificate from "./pages/admin/certificates/characterCertificate";
import LockUnlockCertificate from "./pages/admin/certificates/lockUnlockCertificate";


//communication routes

import AdminAnnouncement from "./pages/admin/communication/announcements.tsx";
import AdminNotices from "./pages/admin/communication/notices.tsx";
import AdminMessages from "./pages/admin/communication/messages.tsx";



//library
import LibraryDashboard from "./pages/libraryDashboard";
import FeesDashboard from "./pages/feesDashboard";
import AuthorList from "./pages/admin/library/author.tsx";
import ImportBookMaster from "./pages/admin/library/importBookMaster.tsx";
import ChangeBookStatus from "./pages/admin/library/changeBookStatus.tsx";
import BarcodeGenerator from "./pages/admin/library/barcodeGenerator.tsx";
import StockVerification from "./pages/admin/library/stockVerification.tsx";
import AcquireBook from "./pages/admin/library/aquireBook.tsx";
import LibraryReports from "./pages/admin/library/libraryReports.tsx";
import LibrarySetup from "./pages/admin/library/librarySetup.tsx";

///my profile 
import MyProfile from "./pages/common/myProfile.tsx";
import ChangePassword from "./pages/common/changePassword.tsx";
import Settings from "./pages/common/settings.tsx";
import Teachers from "./pages/admin/teacher.tsx";



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
            path="/admin/academic-reports"
            element={<AcademicReports />}
          />

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

          {/* Library dashboards */}
          <Route path="/librarydashboard" element={<LibraryDashboard />} />

          {/* Library pages () */}
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/issueReturns" element={<IssueReturn />} />
          <Route path="/fines" element={<Fines />} />
          <Route path="/feesdashboard" element={<FeesDashboard />} />
          <Route path="/authorList" element={<AuthorList />} />
          <Route path="/importBookMaster" element={<ImportBookMaster />} />
          <Route path="/changeBookStatus" element={<ChangeBookStatus />} />
          <Route path="/barcodeGenerator" element={<BarcodeGenerator />} />
          <Route path="/stockVerification" element={<StockVerification />} />
          <Route path="/acquireBook" element={<AcquireBook />} />
          <Route path="/libraryReports" element={<LibraryReports />} />
          <Route path="/librarySetup" element={<LibrarySetup />} />




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



          //Parent dashboard route
          <Route path="/parent/children" element={<Children />} />

          <Route path="/parent/timetable" element={<Timetable />} />
          <Route path="/parent/homework" element={<ParentHomework />} />
          <Route path="/parent/results" element={<ParentResults />} />
          <Route path="/parent/attendance" element={<ParentAttendance />} />
          <Route path="/parent/fee-details" element={<ParentFeeDetails />} />
          <Route path="/parent/payment-history" element={<ParentPaymentHistory />} />
          <Route path="/parent/announcements" element={<ParentAnnouncements />} />
          <Route path="/parent/messages" element={<ParentMessages />} />

          {/* Certificates & Awards  */}
          <Route path="/certificateDashboard" element={<CertificateDashboard />} />
          <Route path="/createCertificate" element={<CreateCertificate />} />
          <Route path="/manageCertificates" element={<ManageCertificates />} />
          <Route path="/bulkCertificate" element={<BulkCertificate />} />
          <Route path="/individualCertificate" element={<IndividualCertificate />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/transferCertificate" element={<TransferCertificate />} />
          <Route path="/characterCertificate" element={<CharacterCertificate />} />
          <Route path="/lockUnlockCertificate" element={<LockUnlockCertificate />} />

          {/* Communicaton routes) */}
          <Route path="/announcements" element={<AdminAnnouncement />} />
          <Route path="/notices" element={<AdminNotices />} />
          <Route path="/messages" element={<AdminMessages />} />



          {/* mainheader myProfile routes*/}
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/myProChangePassword" element={<ChangePassword />} />
           <Route path="/settings" element={<Settings />} />


           {/*teacher */}
            <Route path="/addTeachers" element={<Teachers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;