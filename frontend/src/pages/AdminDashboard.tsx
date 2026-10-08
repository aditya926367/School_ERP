import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  MessageSquare,
  School,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { ElementType } from "react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

type UserRole = "admin" | "teacher" | "student" | "parent";

interface MenuItem {
  label: string;
  path: string;
  icon: ElementType;
}

interface MenuGroup {
  label: string;
  icon: ElementType;
  items: MenuItem[];
}

const roleMenus: Record<UserRole, MenuGroup[]> = {
  admin: [
    {
      label: "School Management",
      icon: School,
      items: [
        {
          label: "School Profile",
          path: "/admin/school-profile",
          icon: School,
        },
        {
          label: "Campuses",
          path: "/admin/campuses",
          icon: School,
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
          icon: CalendarDays,
        },
      ],
    },

    {
      label: "Academics",
      icon: GraduationCap,
      items: [
        {
          label: "Class-Subject-Teacher",
          path: "/admin/class-subject-teacher",
          icon: Users,
        },
        {
          label: "Timetable",
          path: "/admin/timetable",
          icon: CalendarDays,
        },
        {
          label: "Exams",
          path: "/admin/exams",
          icon: FileText,
        },
        {
          label: "Marks & Grades",
          path: "/admin/marks",
          icon: ClipboardCheck,
        },
        {
          label: "Results",
          path: "/admin/results",
          icon: FileText,
        },
      ],
    },

    {
      label: "Students",
      icon: Users,
      items: [
        {
          label: "Admissions",
          path: "/admin/admissions",
          icon: UserCog,
        },
        {
          label: "Students",
          path: "/admin/students",
          icon: Users,
        },
        {
          label: "Student Profile",
          path: "/admin/students/profile",
          icon: UserCog,
        },
        {
          label: "Documents",
          path: "/admin/students/documents",
          icon: FileText,
        },
      ],
    },

    {
      label: "Attendance",
      icon: ClipboardCheck,
      items: [
        {
          label: "Student Attendance",
          path: "/admin/attendance/students",
          icon: ClipboardCheck,
        },
        {
          label: "Staff Attendance",
          path: "/admin/attendance/staff",
          icon: UserCog,
        },
        {
          label: "Attendance Reports",
          path: "/admin/attendance/reports",
          icon: FileText,
        },
      ],
    },

    {
      label: "Fees & Finance",
      icon: Wallet,
      items: [
        {
          label: "Fee Structure",
          path: "/admin/fees/structure",
          icon: Wallet,
        },
        {
          label: "Fee Collection",
          path: "/admin/fees/collection",
          icon: Wallet,
        },
        {
          label: "Receipts",
          path: "/admin/fees/receipts",
          icon: FileText,
        },
        {
          label: "Pending Dues",
          path: "/admin/fees/dues",
          icon: FileText,
        },
        {
          label: "Finance Reports",
          path: "/admin/fees/reports",
          icon: FileText,
        },
      ],
    },

    {
      label: "Library",
      icon: Library,
      items: [
        {
          label: "Books",
          path: "/admin/library/books",
          icon: BookOpen,
        },
        {
          label: "Members",
          path: "/admin/library/members",
          icon: Users,
        },
        {
          label: "Issue / Return",
          path: "/admin/library/transactions",
          icon: Library,
        },
        {
          label: "Fines",
          path: "/admin/library/fines",
          icon: Wallet,
        },
      ],
    },

    {
      label: "Certificates & Awards",
      icon: Award,
      items: [
        {
          label: "Certificates",
          path: "/admin/certificates",
          icon: FileText,
        },
        {
          label: "Awards",
          path: "/admin/awards",
          icon: Award,
        },
      ],
    },

    {
      label: "Communication",
      icon: MessageSquare,
      items: [
        {
          label: "Announcements",
          path: "/admin/communication/announcements",
          icon: Bell,
        },
        {
          label: "Notices",
          path: "/admin/communication/notices",
          icon: FileText,
        },
        {
          label: "Notifications",
          path: "/admin/communication/notifications",
          icon: Bell,
        },
        {
          label: "Messages",
          path: "/admin/communication/messages",
          icon: MessageSquare,
        },
      ],
    },

    {
      label: "Reports",
      icon: FileText,
      items: [
        {
          label: "Academic Reports",
          path: "/admin/reports/academic",
          icon: GraduationCap,
        },
        {
          label: "Attendance Reports",
          path: "/admin/reports/attendance",
          icon: ClipboardCheck,
        },
        {
          label: "Fee Reports",
          path: "/admin/reports/fees",
          icon: Wallet,
        },
      ],
    },

    {
      label: "Administration",
      icon: ShieldCheck,
      items: [
        {
          label: "Users",
          path: "/admin/users",
          icon: Users,
        },
        {
          label: "Create / Edit User",
          path: "/admin/users/create",
          icon: UserCog,
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
          path: "/admin/system-settings",
          icon: Settings,
        },
        {
          label: "Audit Log",
          path: "/admin/audit-log",
          icon: FileText,
        },
      ],
    },
  ],

  teacher: [
    {
      label: "My Teaching",
      icon: GraduationCap,
      items: [
        {
          label: "My Classes",
          path: "/teacher/classes",
          icon: Users,
        },
        {
          label: "My Students",
          path: "/teacher/students",
          icon: Users,
        },
        {
          label: "Timetable",
          path: "/teacher/timetable",
          icon: CalendarDays,
        },
      ],
    },

    {
      label: "Attendance",
      icon: ClipboardCheck,
      items: [
        {
          label: "Mark Attendance",
          path: "/teacher/attendance",
          icon: ClipboardCheck,
        },
        {
          label: "Attendance History",
          path: "/teacher/attendance/history",
          icon: FileText,
        },
      ],
    },

    {
      label: "Academics",
      icon: BookOpen,
      items: [
        {
          label: "Homework",
          path: "/teacher/homework",
          icon: FileText,
        },
        {
          label: "Enter Marks",
          path: "/teacher/marks",
          icon: ClipboardCheck,
        },
        {
          label: "Results",
          path: "/teacher/results",
          icon: GraduationCap,
        },
      ],
    },

    {
      label: "Communication",
      icon: MessageSquare,
      items: [
        {
          label: "Announcements",
          path: "/teacher/announcements",
          icon: Bell,
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
      label: "My Academics",
      icon: GraduationCap,
      items: [
        {
          label: "My Classes",
          path: "/student/classes",
          icon: BookOpen,
        },
        {
          label: "My Timetable",
          path: "/student/timetable",
          icon: CalendarDays,
        },
        {
          label: "My Homework",
          path: "/student/homework",
          icon: FileText,
        },
      ],
    },

    {
      label: "Attendance",
      icon: ClipboardCheck,
      items: [
        {
          label: "My Attendance",
          path: "/student/attendance",
          icon: ClipboardCheck,
        },
      ],
    },

    {
      label: "Exams & Results",
      icon: GraduationCap,
      items: [
        {
          label: "Exams",
          path: "/student/exams",
          icon: FileText,
        },
        {
          label: "My Results",
          path: "/student/results",
          icon: GraduationCap,
        },
      ],
    },

    {
      label: "Communication",
      icon: MessageSquare,
      items: [
        {
          label: "Announcements",
          path: "/student/announcements",
          icon: Bell,
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
      label: "My Children",
      icon: Users,
      items: [
        {
          label: "Children",
          path: "/parent/children",
          icon: Users,
        },
        {
          label: "Student Profile",
          path: "/parent/student-profile",
          icon: UserCog,
        },
      ],
    },

    {
      label: "Academics",
      icon: GraduationCap,
      items: [
        {
          label: "Timetable",
          path: "/parent/timetable",
          icon: CalendarDays,
        },
        {
          label: "Homework",
          path: "/parent/homework",
          icon: FileText,
        },
        {
          label: "Results",
          path: "/parent/results",
          icon: GraduationCap,
        },
      ],
    },

    {
      label: "Attendance",
      icon: ClipboardCheck,
      items: [
        {
          label: "Attendance",
          path: "/parent/attendance",
          icon: ClipboardCheck,
        },
      ],
    },

    {
      label: "Fees & Payments",
      icon: Wallet,
      items: [
        {
          label: "Fee Details",
          path: "/parent/fees",
          icon: Wallet,
        },
        {
          label: "Payment History",
          path: "/parent/payments",
          icon: FileText,
        },
      ],
    },

    {
      label: "Communication",
      icon: MessageSquare,
      items: [
        {
          label: "Announcements",
          path: "/parent/announcements",
          icon: Bell,
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

function DashboardLayout() {
  /*
   * TEMPORARY ROLE
   *
   * Change this value to test different sidebars:
   *
   * "admin"
   * "teacher"
   * "student"
   * "parent"
   *
   * Later this will come from login/backend.
   */
  const currentRole: UserRole = "admin";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const menu = roleMenus[currentRole];
  const user = roleInfo[currentRole];

  const toggleGroup = (label: string) => {
    setOpenGroups((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex min-h-[calc(100vh-48px)] overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#27348b] text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-white/15 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <School size={20} />
              </div>

              <div>
                <h1 className="text-base font-bold">School ERP</h1>

                <p className="text-[10px] text-white/60">
                  School Management System
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 hover:bg-white/10 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="h-[calc(100vh-64px)] overflow-y-auto px-3 py-4">
            {/* Dashboard */}
            <NavLink
              to={
                currentRole === "admin"
                  ? "/dashboard"
                  : currentRole === "teacher"
                    ? "/teacherdashboard"
                    : currentRole === "student"
                      ? "/studentdashboard"
                      : "/parentdashboard"
              }
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-[#27348b]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            {/* Role-based Menu */}
            <div className="space-y-1">
              {menu.map((group) => {
                const GroupIcon = group.icon;
                const isOpen = openGroups.includes(group.label);

                return (
                  <div key={group.label}>
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <GroupIcon size={18} />
                        {group.label}
                      </span>

                      <span
                        className={`text-xs transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {isOpen && (
                      <div className="ml-4 border-l border-white/15 pl-3">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon;

                          return (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              onClick={() => setSidebarOpen(false)}
                              className={({ isActive }) =>
                                `my-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition ${
                                  isActive
                                    ? "bg-white/15 font-semibold text-white"
                                    : "text-white/65 hover:bg-white/10 hover:text-white"
                                }`
                              }
                            >
                              <ItemIcon size={15} />
                              {item.label}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-5 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  School ERP
                </h2>

                <p className="hidden text-xs text-gray-500 sm:block">
                  Delhi Public School
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                <Bell size={19} />

                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <div className="flex items-center gap-3 border-l pl-4">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.title}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#27348b] text-xs font-bold text-white">
                  {user.initials}
                </div>
              </div>
            </div>
          </header>

          {/* Page */}
          <main className="flex-1 overflow-auto bg-gray-100 p-5 lg:p-8">
            <div className="mx-auto max-w-[1500px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;