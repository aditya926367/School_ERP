import {
  Users,
  GraduationCap,
  ClipboardCheck,
  IndianRupee,
  UserPlus,
  BookOpen,
  CalendarDays,
  FileText,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "1,248",
    icon: Users,
    description: "Active students",
  },
  {
    title: "Total Teachers",
    value: "86",
    icon: GraduationCap,
    description: "Teaching staff",
  },
  {
    title: "Today's Attendance",
    value: "94%",
    icon: ClipboardCheck,
    description: "Student attendance",
  },
  {
    title: "Fee Collection",
    value: "₹8.4L",
    icon: IndianRupee,
    description: "This academic year",
  },
];

const recentAdmissions = [
  {
    name: "Aarav Sharma",
    className: "Class 8",
    section: "A",
    date: "05 Oct 2026",
  },
  {
    name: "Ananya Singh",
    className: "Class 6",
    section: "B",
    date: "04 Oct 2026",
  },
  {
    name: "Rohan Kumar",
    className: "Class 9",
    section: "A",
    date: "03 Oct 2026",
  },
  {
    name: "Priya Verma",
    className: "Class 5",
    section: "C",
    date: "02 Oct 2026",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your school's activities and performance.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Attendance Overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Attendance Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Today's student attendance
              </p>
            </div>

            <ClipboardCheck className="h-6 w-6 text-blue-600" />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Present</span>
              <span className="font-semibold text-gray-900">94%</span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: "94%" }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Present</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  1,173
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Absent</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  55
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Leave</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  20
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>

          <div className="mt-5 space-y-3">
            <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Add Student
              </span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Add Teacher
              </span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Manage Classes
              </span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Academic Calendar
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Admissions */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Admissions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recently admitted students
            </p>
          </div>

          <FileText className="h-6 w-6 text-blue-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Student
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Class
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Section
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Admission Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {recentAdmissions.map((student) => (
                <tr key={student.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.className}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.section}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}