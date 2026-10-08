import { useState } from "react";
import type { ElementType } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  School,
  GraduationCap,
  Users,
  UserRound,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  WalletCards,
  Library,
  Award,
  Megaphone,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  UserCog,
  FileText,
  BookMarked,
  Clock3,
  Receipt,
  CircleDollarSign,
  MessageSquare,
  ClipboardList,
  Building2,
  CalendarCheck,
  NotebookTabs,
} from "lucide-react";

type UserRole = "admin" | "teacher" | "student" | "parent";

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
        {
          label: "School Profile",
          path: "/admin/school-profile",
          icon: School,
        },
        {
          label: "Campuses",
          path: "/admin/campuses",
          icon: Building2,
        },
        {
          label: "Academic Years",
          path: "/admin/academic-years",
          icon: CalendarDays,
        },
        {
          label: "Classes & Sections",
          path: "/admin/classes-sections",
          icon: GraduationCap,
        },
        {
          label: "Subjects",
          path: "/admin/subjects",
          icon: BookOpen,
        },
        {
          label: "Calendar",
          path: "/admin/holidays-calendar",
          icon: CalendarCheck,
        },
      ],
    },

    {
      title: "Academics",
      items: [
        {
          label: "Class-Subject-Teacher",
          path: "/admin/class-subject-teacher",
          icon: Users,
        },
        {
          label: "Timetable",
          path: "/admin/timetable",
          icon: Clock3,
        },
        {
          label: "Exams",
          path: "/admin/exams",
          icon: ClipboardList,
        },
        {
          label: "Marks & Grades",
          path: "/admin/marks-grades",
          icon: NotebookTabs,
        },
        {
          label: "Results",
          path: "/admin/results",
          icon: FileText,
        },
      ],
    },

    {
      title: "Students",
      items: [
        {
          label: "Admissions",
          path: "/admin/admissions",
          icon: UserRound,
        },
        {
          label: "Students",
          path: "/admin/students",
          icon: Users,
        },
        {
          label: "Student Profile",
          path: "/admin/student-profile",
          icon: UserCog,
        },
        {
          label: "Documents",
          path: "/admin/student-documents",
          icon: FileText,
        },
      ],
    },

    {
      title: "Attendance",
      items: [
        {
          label: "Student Attendance",
          path: "/admin/student-attendance",
          icon: ClipboardCheck,
        },
        {
          label: "Staff Attendance",
          path: "/admin/staff-attendance",
          icon: CalendarCheck,
        },
        {
          label: "Attendance Reports",
          path: "/admin/attendance-reports",
          icon: BarChart3,
        },
      ],
    },

    {
      title: "Fees & Finance",
      items: [
        {
          label: "Fee Structure",
          path: "/admin/fee-structure",
          icon: WalletCards,
        },
        {
          label: "Fee Collection",
          path: "/admin/fee-collection",
          icon: CircleDollarSign,
        },
        {
          label: "Receipts",
          path: "/admin/receipts",
          icon: Receipt,
        },
        {
          label: "Pending Dues",
          path: "/admin/pending-dues",
          icon: WalletCards,
        },
        {
          label: "Finance Reports",
          path: "/admin/finance-reports",
          icon: BarChart3,
        },
      ],
    },

    {
      title: "Library",
      items: [
        {
          label: "Books",
          path: "/admin/books",
          icon: Library,
        },
        {
          label: "Members",
          path: "/admin/library-members",
          icon: Users,
        },
        {
          label: "Issue / Return",
          path: "/admin/issue-return",
          icon: BookMarked,
        },
        {
          label: "Fines",
          path: "/admin/library-fines",
          icon: WalletCards,
        },
      ],
    },

    {
      title: "Certificates & Awards",
      items: [
        {
          label: "Certificates",
          path: "/admin/certificates",
          icon: Award,
        },
        {
          label: "Awards",
          path: "/admin/awards",
          icon: Award,
        },
      ],
    },

    {
      title: "Communication",
      items: [
        {
          label: "Announcements",
          path: "/admin/announcements",
          icon: Megaphone,
        },
        {
          label: "Notices",
          path: "/admin/notices",
          icon: FileText,
        },
        {
          label: "Messages",
          path: "/admin/messages",
          icon: MessageSquare,
        },
      ],
    },

    {
      title: "Reports",
      items: [
        {
          label: "Academic Reports",
          path: "/admin/academic-reports",
          icon: BarChart3,
        },
        {
          label: "Attendance Reports",
          path: "/admin/attendance-reports",
          icon: BarChart3,
        },
        {
          label: "Fee Reports",
          path: "/admin/fee-reports",
          icon: BarChart3,
        },
      ],
    },

    {
      title: "Administration",
      items: [
        {
          label: "Users",
          path: "/admin/users",
          icon: Users,
        },
        {
          label: "Roles & Permissions",
          path: "/admin/roles-permissions",
          icon: ShieldCheck,
        },
        {
          label: "Notification Templates",
          path: "/admin/notification-templates",
          icon: Bell,
        },
        {
          label: "System Settings",
          path: "/admin/settings",
          icon: Settings,
        },
        {
          label: "Audit Log",
          path: "/admin/audit-log",
          icon: ClipboardList,
        },
      ],
    },
  ],

  teacher: [
    {
      title: "My Teaching",
      items: [
        {
          label: "My Classes",
          path: "/teacher/classes",
          icon: GraduationCap,
        },
        {
          label: "My Students",
          path: "/teacher/students",
          icon: Users,
        },
        {
          label: "Timetable",
          path: "/teacher/timetable",
          icon: Clock3,
        },
      ],
    },

    {
      title: "Attendance",
      items: [
        {
          label: "Mark Attendance",
          path: "/teacher/attendance",
          icon: ClipboardCheck,
        },
        {
          label: "Attendance History",
          path: "/teacher/attendance-history",
          icon: CalendarCheck,
        },
      ],
    },

    {
      title: "Academics",
      items: [
        {
          label: "Homework",
          path: "/teacher/homework",
          icon: BookOpen,
        },
        {
          label: "Enter Marks",
          path: "/teacher/marks",
          icon: NotebookTabs,
        },
        {
          label: "Results",
          path: "/teacher/results",
          icon: FileText,
        },
      ],
    },

    {
      title: "Communication",
      items: [
        {
          label: "Announcements",
          path: "/teacher/announcements",
          icon: Megaphone,
        },
        {
          label: "Messages",
          path: "/teacher/messages",
          icon: MessageSquare,
        },
      ],
    },
  ],

  student: [
    {
      title: "My Academics",
      items: [
        {
          label: "My Classes",
          path: "/student/classes",
          icon: GraduationCap,
        },
        {
          label: "My Timetable",
          path: "/student/timetable",
          icon: Clock3,
        },
        {
          label: "My Homework",
          path: "/student/homework",
          icon: BookOpen,
        },
      ],
    },

    {
      title: "Attendance",
      items: [
        {
          label: "My Attendance",
          path: "/student/attendance",
          icon: ClipboardCheck,
        },
      ],
    },

    {
      title: "Exams & Results",
      items: [
        {
          label: "Exams",
          path: "/student/exams",
          icon: ClipboardList,
        },
        {
          label: "My Results",
          path: "/student/results",
          icon: FileText,
        },
      ],
    },

    {
      title: "Communication",
      items: [
        {
          label: "Announcements",
          path: "/student/announcements",
          icon: Megaphone,
        },
        {
          label: "Messages",
          path: "/student/messages",
          icon: MessageSquare,
        },
      ],
    },
  ],

  parent: [
    {
      title: "My Children",
      items: [
        {
          label: "Children",
          path: "/parent/children",
          icon: Users,
        },
        {
          label: "Student Profile",
          path: "/parent/student-profile",
          icon: UserRound,
        },
      ],
    },

    {
      title: "Academics",
      items: [
        {
          label: "Timetable",
          path: "/parent/timetable",
          icon: Clock3,
        },
        {
          label: "Homework",
          path: "/parent/homework",
          icon: BookOpen,
        },
        {
          label: "Results",
          path: "/parent/results",
          icon: FileText,
        },
      ],
    },

    {
      title: "Attendance",
      items: [
        {
          label: "Attendance",
          path: "/parent/attendance",
          icon: ClipboardCheck,
        },
      ],
    },

    {
      title: "Fees & Payments",
      items: [
        {
          label: "Fee Details",
          path: "/parent/fees",
          icon: WalletCards,
        },
        {
          label: "Payment History",
          path: "/parent/payment-history",
          icon: Receipt,
        },
      ],
    },

    {
      title: "Communication",
      items: [
        {
          label: "Announcements",
          path: "/parent/announcements",
          icon: Megaphone,
        },
        {
          label: "Messages",
          path: "/parent/messages",
          icon: MessageSquare,
        },
      ],
    },
  ],
};

const roleInfo = {
  admin: {
    name: "Admin",
    title: "Administrator",
    initials: "A",
  },
  teacher: {
    name: "Rahul Sharma",
    title: "Teacher",
    initials: "RS",
  },
  student: {
    name: "Aarav Sharma",
    title: "Student",
    initials: "AS",
  },
  parent: {
    name: "Rajesh Sharma",
    title: "Parent",
    initials: "RS",
  },
};

const dashboardPaths: Record<UserRole, string> = {
  admin: "/dashboard",
  teacher: "/teacherdashboard",
  student: "/studentdashboard",
  parent: "/parentdashboard",
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const storedRole = localStorage.getItem("role") as UserRole | null;

  const currentRole: UserRole =
    storedRole && roleMenus[storedRole] ? storedRole : "admin";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};

      roleMenus[currentRole].forEach((group) => {
        initial[group.title] = true;
      });

      return initial;
    }
  );

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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top--[72] bottom-0 z-40 flex  flex-col
          bg-[#27348b] text-white shadow-xl
          transition-all duration-300
          ${collapsed ? "w-[82px]" : "w-[270px]"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex h-[72px] items-center border-b border-white/10 px-5">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#27348b]">
                <School size={23} />
              </div>

              <div>
                <h1 className="text-sm font-bold tracking-wide">
                  SCHOOL ERP
                </h1>

                <p className="text-[10px] text-blue-200">
                  MANAGEMENT SYSTEM
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#27348b]">
              <School size={23} />
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role */}
        {!collapsed && (
          <div className="mx-4 mt-5 rounded-xl bg-white/10 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-[#27348b]">
                {user.initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user.name}
                </p>

                <p className="text-xs text-blue-200">
                  {user.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-5 flex-1 overflow-y-auto px-3 pb-5">
          {/* Dashboard */}
          <NavLink
            to={dashboardPaths[currentRole]}
            onClick={() => setSidebarOpen(false)}
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

            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          {roleMenus[currentRole].map((group) => {
            const isOpen = openGroups[group.title];

            return (
              <div key={group.title} className="mb-4">
                {!collapsed && (
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
                )}

                {(collapsed || isOpen) && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          title={collapsed ? item.label : undefined}
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

                          {!collapsed && (
                            <span className="truncate">
                              {item.label}
                            </span>
                          )}
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

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:ml-[82px]" : "lg:ml-[270px]"
        }`}
      >
        {/* Header */}
<header className="fixed left-0 right-0 top-0 z-50 h-[72px] border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Collapse */}
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:block"
            >
              <Menu size={21} />
            </button>

            <div className="hidden md:block">
              <p className="text-xs text-slate-400">
                School Name
              </p>

              <h2 className="text-sm font-semibold text-slate-800">
                School Address
                
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <Search size={20} />
            </button>

            {/* Notification */}
            <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <Bell size={20} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#27348b] text-xs font-bold text-white">
                {user.initials}
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800">
                  {user.name}
                </p>

                <p className="text-xs text-slate-400">
                  {user.title}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="min-h-[calc(100vh-72px)] p-4 md:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}