import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import MainHeader from "./mainHeader";
import {
  ShoppingCart,
  Upload,
  RefreshCw,
  Barcode,
  LayoutDashboard,
  School,
  GraduationCap,
  Users,
  UserRound,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  WalletCards,
  Award,
  Megaphone,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  FileText,
  BookMarked,
  Clock3,
  Receipt,
  CircleDollarSign,
  MessageSquare,
  ClipboardList,
  CalendarCheck,
  NotebookTabs,
  Pencil,
} from "lucide-react";

type UserRole =
  | "admin"
  | "teacher"
  | "student"
  | "parent"
  | "library"
  | "certificate"
  | "accountant";

type MenuItem = {
  label: string;
  path: string;
  icon: ElementType;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const roleMenus: Record<UserRole, MenuGroup[]> = {
  admin: [
    {
      title: "School Management",
      items: [
        { label: "School Profile", path: "/admin/school-profile", icon: School },
        { label: "Academic Years", path: "/admin/academic-years", icon: CalendarDays },
        { label: "Classes & Sections", path: "/admin/classes-sections", icon: GraduationCap },
        { label: "Subjects", path: "/admin/subjects", icon: BookOpen },
        { label: "Calendar", path: "/admin/holidays-calendar", icon: CalendarCheck },
      ],
    },
    {
      title: "Academics",
      items: [
        { label: "Class-Subject-Teacher", path: "/admin/class-subject-teacher", icon: Users },
        { label: "Add Teacher", path: "/addTeachers", icon: GraduationCap },
        { label: "Timetable", path: "/admin/timetable", icon: Clock3 },
        { label: "Exams", path: "/admin/exams", icon: ClipboardList },
        { label: "Marks & Grades", path: "/admin/marks-grades", icon: NotebookTabs },
        { label: "Results", path: "/admin/results", icon: FileText },
        { label: "Academic Reports", path: "/admin/academic-reports", icon: BarChart3 },
      ],
    },
    {
      title: "Students",
      items: [
        { label: "Admissions", path: "/admin/admissions", icon: UserRound },
        { label: "Students", path: "/admin/students", icon: Users },
        { label: "Documents", path: "/admin/student-documents", icon: FileText },
      ],
    },
    {
      title: "Attendance",
      items: [
        { label: "Student Attendance", path: "/admin/student-attendance", icon: ClipboardCheck },
        { label: "Staff Attendance", path: "/admin/staff-attendance", icon: CalendarCheck },
        { label: "Attendance Reports", path: "/admin/attendance-reports", icon: BarChart3 },
      ],
    },
    {
      title: "Fees & Finance",
      items: [
        {
          label: "Fee Structure",
          path: "/feeStructure",
          icon: WalletCards,
        },
        {
          label: "Fee Collection",
          path: "/feeCollection",
          icon: CircleDollarSign,
        },
        {
          label: "Receipts",
          path: "/receipts",
          icon: Receipt,
        },
        {
          label: "Pending Dues",
          path: "/pendingdues",
          icon: WalletCards,
        },
        {
          label: "Finance Reports",
          path: "/financeReports",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Certificates & Awards",
      items: [
        { label: "Certificates", path: "/certificateDashboard", icon: Award },
      ],
    },
    {
      title: "Communication",
      items: [
        { label: "Announcements", path: "/announcements", icon: Megaphone },
        { label: "Notices", path: "/notices", icon: FileText },
        { label: "Messages", path: "/messages", icon: MessageSquare },
      ],
    },
    {
      title: "Administration",
      items: [
        { label: "Users", path: "/admin/users", icon: Users },
        { label: "Roles & Permissions", path: "/admin/roles-permissions", icon: ShieldCheck },
        { label: "Notification Templates", path: "/admin/notification-templates", icon: Bell },
        { label: "System Settings", path: "/admin/settings", icon: Settings },
        { label: "Audit Log", path: "/admin/audit-log", icon: ClipboardList },
      ],
    },
  ],

  certificate: [
    {
      title: "Certificate Management",
      items: [
        { label: "Create Certificate", path: "/createCertificate", icon: Award },
        { label: "Manage Certificates", path: "/manageCertificates", icon: FileText },
        { label: "Bulk Certificate", path: "/bulkCertificate", icon: ClipboardList },
        { label: "Individual Certificate", path: "/individualCertificate", icon: UserRound },
        { label: "Awards", path: "/awards", icon: Award },
        { label: "Transfer Certificate", path: "/transferCertificate", icon: FileText },
        { label: "Character Certificate", path: "/characterCertificate", icon: ShieldCheck },
        { label: "Lock/Unlock Certificate", path: "/lockUnlockCertificate", icon: Settings },
      ],
    },
  ],

  teacher: [
    {
      title: "My Teaching",
      items: [
        { label: "My Classes", path: "/teacher/classes", icon: GraduationCap },
        { label: "My Students", path: "/teacher/students", icon: Users },
        { label: "Timetable", path: "/teacher/timetable", icon: Clock3 },
      ],
    },
    {
      title: "Attendance",
      items: [
        { label: "Mark Attendance", path: "/teacher/mark-attendance", icon: ClipboardCheck },
        { label: "Attendance History", path: "/teacher/attendance-history", icon: CalendarCheck },
      ],
    },
    {
      title: "Academics",
      items: [
        { label: "Homework", path: "/teacher/homework", icon: BookOpen },
        { label: "Enter Marks", path: "/teacher/enter-marks", icon: NotebookTabs },
        { label: "Results", path: "/teacher/results", icon: FileText },
      ],
    },
    {
      title: "Communication",
      items: [
        { label: "Announcements", path: "/teacher/announcements", icon: Megaphone },
        { label: "Messages", path: "/teacher/messages", icon: MessageSquare },
      ],
    },
  ],

  student: [
    {
      title: "My Academics",
      items: [
        { label: "My Classes", path: "/student/classes", icon: GraduationCap },
        { label: "My Timetable", path: "/student/timetable", icon: Clock3 },
        { label: "My Homework", path: "/student/homework", icon: BookOpen },
      ],
    },
    {
      title: "Attendance",
      items: [
        { label: "My Attendance", path: "/student/attendance", icon: ClipboardCheck },
      ],
    },
    {
      title: "Exams & Results",
      items: [
        { label: "Exams", path: "/student/exams", icon: ClipboardList },
        { label: "My Results", path: "/student/results", icon: FileText },
      ],
    },
    {
      title: "Communication",
      items: [
        { label: "Announcements", path: "/student/announcements", icon: Megaphone },
        { label: "Messages", path: "/student/messages", icon: MessageSquare },
      ],
    },
  ],

  parent: [
    {
      title: "My Children",
      items: [{ label: "Children", path: "/parent/children", icon: Users }],
    },
    {
      title: "Academics",
      items: [
        { label: "Timetable", path: "/parent/timetable", icon: Clock3 },
        { label: "Homework", path: "/parent/homework", icon: BookOpen },
        { label: "Results", path: "/parent/results", icon: FileText },
      ],
    },
    {
      title: "Attendance",
      items: [
        { label: "Attendance", path: "/parent/attendance", icon: ClipboardCheck },
      ],
    },
    {
      title: "Fees & Payments",
      items: [
        { label: "Fee Details", path: "/parent/fee-details", icon: WalletCards },
        { label: "Payment History", path: "/parent/payment-history", icon: Receipt },
      ],
    },
    {
      title: "Communication",
      items: [
        { label: "Announcements", path: "/parent/announcements", icon: Megaphone },
        { label: "Messages", path: "/parent/messages", icon: MessageSquare },
      ],
    },
  ],

  library: [
    {
      title: "Library Management",
      items: [
        { label: "Library Setup", path: "/librarySetup", icon: Pencil },
        { label: "Issue and Return", path: "/issueReturns", icon: BookMarked },
        { label: "Stock Verification", path: "/stockVerification", icon: ClipboardCheck },
        { label: "Reports", path: "/libraryReports", icon: BarChart3 },
      ],
    },
    {
      title: "Books",
      items: [
        { label: "Book Master", path: "/books", icon: BookOpen },
        { label: "Acquire Book", path: "/acquireBook", icon: ShoppingCart },
        { label: "Import BookMaster", path: "/importBookMaster", icon: Upload },
        { label: "Change Book Status", path: "/changeBookStatus", icon: RefreshCw },
        { label: "Barcode Generator", path: "/barcodeGenerator", icon: Barcode },
        { label: "Author List", path: "/authorList", icon: Users },
      ],
    },
    {
      title: "Payroll",
      items: [
        { label: "Salary Structure", path: "/salaryStructure", icon: WalletCards },
        { label: "Monthly Payroll", path: "/monthlyPayroll", icon: CalendarDays },
        { label: "Salary Payments", path: "/salaryPayments", icon: CircleDollarSign },
        { label: "Payslips", path: "/payslips", icon: Receipt },
      ],
    },
  ],

  accountant: [
    {
      title: "Fees Management",
      items: [
        { label: "Fee Structure", path: "/feeStructure", icon: ClipboardList },
        { label: "Fee Collection", path: "/feeCollection", icon: CircleDollarSign },
        { label: "Receipts", path: "/receipts", icon: Receipt },
        { label: "Pending Dues", path: "/pendingdues", icon: Clock3 },
        { label: "Finance Reports", path: "/financeReports", icon: BarChart3 },
      ],
    },
  ],
};

const roleInfo: Record<UserRole, { name: string; title: string; initials: string }> = {
  admin: { name: "Admin", title: "Administrator", initials: "A" },
  accountant: { name: "Accountant", title: "Fees Management", initials: "AC" },
  teacher: { name: "Rahul Sharma", title: "Teacher", initials: "RS" },
  student: { name: "Aarav Sharma", title: "Student", initials: "AS" },
  parent: { name: "Rajesh Sharma", title: "Parent", initials: "RS" },
  library: { name: "Librarian", title: "Library Management", initials: "L" },
  certificate: {
    name: "Certificate Manager",
    title: "Certificate Management",
    initials: "C",
  },
};

const dashboardPaths: Record<UserRole, string> = {
  admin: "/admindashboard",
  teacher: "/teacherdashboard",
  student: "/studentdashboard",
  parent: "/parentdashboard",
  library: "/librarydashboard",
  certificate: "/certificateDashboard",
  accountant: "/accountantDashboard",
};

const certificatePaths = [
  "/certificateDashboard",
  "/createCertificate",
  "/manageCertificates",
  "/bulkCertificate",
  "/individualCertificate",
  "/awards",
  "/transferCertificate",
  "/characterCertificate",
  "/lockUnlockCertificate",
];

const libraryPaths = [
  "/libraryDashboard",
  "/librarydashboard",
  "/books",
  "/librarySetup",
  "/stockVerification",
  "/issueReturns",
  "/libraryReports",
  "/authorList",
  "/importBookMaster",
  "/changeBookStatus",
  "/barcodeGenerator",
  "/acquireBook",
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 1024
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Only auto-close after clicking a link on mobile
  const closeOnMobile = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };
useEffect(() => {
  const mq = window.matchMedia("(min-width: 1024px)");

  const handleChange = (e: MediaQueryListEvent) => {
    // desktop -> open, mobile -> closed
    setSidebarOpen(e.matches);
  };

  mq.addEventListener("change", handleChange);
  return () => mq.removeEventListener("change", handleChange);
}, []);
  const storedRole = localStorage.getItem("role") as UserRole | null;

  const currentRole: UserRole = (() => {
    const path = location.pathname;

    if (storedRole === "accountant") return "accountant";

    if (path === "/studentdashboard" || path.startsWith("/student/")) {
      return "student";
    }
    if (path === "/teacherdashboard" || path.startsWith("/teacher/")) {
      return "teacher";
    }
    if (path === "/parentdashboard" || path.startsWith("/parent/")) {
      return "parent";
    }
    if (path === "/admindashboard" || path.startsWith("/admin/")) {
      return "admin";
    }
    if (certificatePaths.includes(path)) return "certificate";
    if (libraryPaths.includes(path) || path.startsWith("/library/")) {
      return "library";
    }

    return storedRole && roleMenus[storedRole] ? storedRole : "admin";
  })();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    roleMenus[currentRole].forEach((group) => {
      initial[group.title] = true;
    });
    return initial;
  });

  useEffect(() => {
    setOpenGroups((prev) => {
      const updated = { ...prev };
      roleMenus[currentRole].forEach((group) => {
        if (updated[group.title] === undefined) {
          updated[group.title] = true;
        }
      });
      return updated;
    });
  }, [currentRole]);

  const user = roleInfo[currentRole];

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  };

  const isDashboardActive = location.pathname === dashboardPaths[currentRole];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header - hamburger toggles the sidebar (open <-> close) */}
      <MainHeader onMenuClick={toggleSidebar} />

      {/* Mobile overlay: tap outside to close */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-[72px] bottom-0 z-40 flex w-[270px] flex-col
          bg-[#27348b] text-white shadow-xl
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Profile card */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-5">
          <div className="flex-1 rounded-xl bg-white/10 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#27348b]">
                {user.initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-blue-200">{user.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 overflow-y-auto px-3 pb-5">
          {/* Dashboard */}
          <NavLink
            to={dashboardPaths[currentRole]}
            onClick={closeOnMobile}
            className={`
              mb-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium
              transition
              ${
                isDashboardActive
                  ? "bg-white text-[#27348b] shadow-sm"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          {roleMenus[currentRole].map((group) => {
            const isOpen = openGroups[group.title];

            return (
              <div key={group.title} className="mb-4">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="mb-1 flex w-full items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-blue-300"
                >
                  <span>{group.title}</span>

                  {isOpen ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>

                {isOpen && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={closeOnMobile}
                          className={({ isActive }) => `
                            flex items-center gap-3 rounded-lg px-3 py-2.5
                            text-sm transition
                            ${
                              isActive
                                ? "bg-white/15 text-white font-medium"
                                : "text-blue-100 hover:bg-white/10 hover:text-white"
                            }
                          `}
                        >
                          <Icon size={18} />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-blue-100 transition hover:bg-red-500/20 hover:text-white"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`min-h-screen pt-[72px] transition-all duration-300 ${
          sidebarOpen ? "lg:ml-[270px]" : "lg:ml-0"
        }`}
      >
        <div className="min-h-[calc(100vh-72px)] bg-gray-100 p-5 lg:p-8">
          <div className="mx-auto max-w-[1500px]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}