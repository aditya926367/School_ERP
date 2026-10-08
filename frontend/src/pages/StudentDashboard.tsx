import type { ElementType } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
} from "lucide-react";

function StudentDashboard() {
  const stats = [
    {
      title: "My Subjects",
      value: "8",
      subtitle: "Current academic year",
      icon: BookOpen,
    },
    {
      title: "Attendance",
      value: "94%",
      subtitle: "Excellent attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Assignments",
      value: "5",
      subtitle: "Pending assignments",
      icon: FileText,
    },
    {
      title: "Average Score",
      value: "87%",
      subtitle: "Current performance",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Student Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your academic progress, timetable, attendance and assignments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>

                  <h3 className="mt-2 text-2xl font-bold text-gray-800">
                    {item.value}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.subtitle}
                  </p>
                </div>

                <div className="rounded-lg bg-[#27348b]/10 p-3 text-[#27348b]">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Timetable */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <CalendarDays size={20} className="text-[#27348b]" />

              <div>
                <h2 className="font-semibold text-gray-800">
                  Today's Timetable
                </h2>

                <p className="text-xs text-gray-500">
                  Your classes for today
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y">
            {[
              ["09:00 AM", "Mathematics", "Room 204"],
              ["11:00 AM", "Science", "Room 301"],
              ["01:00 PM", "English", "Room 105"],
            ].map((item) => (
              <div
                key={item[0]}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item[1]}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {item[2]}
                  </p>
                </div>

                <span className="text-xs font-medium text-[#27348b]">
                  {item[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800">
            Upcoming Exams
          </h2>

          <div className="mt-4 space-y-3">
            {[
              ["15 Oct 2026", "Mathematics"],
              ["17 Oct 2026", "Science"],
              ["20 Oct 2026", "English"],
            ].map((exam) => (
              <div
                key={exam[0]}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {exam[1]}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Examination
                  </p>
                </div>

                <span className="text-xs font-semibold text-[#27348b]">
                  {exam[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-[#27348b]" />

          <div>
            <h2 className="font-semibold text-gray-800">
              Pending Assignments
            </h2>

            <p className="text-xs text-gray-500">
              Assignments that require your attention
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm font-semibold text-gray-800">
              Mathematics
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Algebra worksheet
            </p>

            <span className="mt-3 inline-block text-xs font-medium text-red-600">
              Due: 10 Oct
            </span>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm font-semibold text-gray-800">
              Science
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Physics practical
            </p>

            <span className="mt-3 inline-block text-xs font-medium text-red-600">
              Due: 12 Oct
            </span>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm font-semibold text-gray-800">
              English
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Essay submission
            </p>

            <span className="mt-3 inline-block text-xs font-medium text-red-600">
              Due: 14 Oct
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;