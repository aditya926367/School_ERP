import type { ElementType } from "react";
import {
  BookOpen,
  CalendarDays,
  IndianRupee,
  UserRound,
  Users,
} from "lucide-react";

function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Parent Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor your child's academics, attendance, fees and school activities.
        </p>
      </div>

      {/* Child Profile */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#27348b] text-lg font-bold text-white">
              AS
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Aarav Sharma
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Class 8-A • Roll No. 24
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 px-5 py-3">
            <p className="text-xs text-gray-500">Academic Year</p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              2026-27
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                94%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Excellent
              </p>
            </div>

            <ClipboardIcon />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Academic Score</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                87%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Current average
              </p>
            </div>

            <BookOpen size={21} className="text-[#27348b]" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Fee Due</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                ₹12,500
              </p>
              <p className="mt-1 text-xs text-red-500">
                Pending payment
              </p>
            </div>

            <IndianRupee size={21} className="text-[#27348b]" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Homework</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                3
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Pending
              </p>
            </div>

            <BookOpen size={21} className="text-[#27348b]" />
          </div>
        </div>
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
                  Child's scheduled classes
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

        {/* Recent Results */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800">
            Recent Results
          </h2>

          <div className="mt-4 space-y-3">
            {[
              ["Mathematics", "91%"],
              ["Science", "88%"],
              ["English", "84%"],
            ].map((result) => (
              <div
                key={result[0]}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
              >
                <span className="text-sm font-medium text-gray-700">
                  {result[0]}
                </span>

                <span className="text-sm font-bold text-[#27348b]">
                  {result[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Children */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-[#27348b]" />

          <div>
            <h2 className="font-semibold text-gray-800">
              My Children
            </h2>

            <p className="text-xs text-gray-500">
              Children linked to your account
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#27348b]/10 text-[#27348b]">
              <UserRound size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Aarav Sharma
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Class 8-A
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#27348b]/10 text-[#27348b]">
              <UserRound size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Anaya Sharma
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Class 5-B
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800">
          School Announcements
        </h2>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Parent-Teacher Meeting
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Scheduled for 20 October 2026.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Annual Sports Day
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Annual sports day will be held later this month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <div className="text-[#27348b]">
      <ClipboardCheckIcon />
    </div>
  );
}

function ClipboardCheckIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="18" x="4" y="3" rx="2" />
      <path d="M9 3h6v4H9z" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

export default ParentDashboard;