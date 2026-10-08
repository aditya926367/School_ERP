import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Users,
} from "lucide-react";

const classes = [
  {
    className: "Class 8-A",
    subject: "Mathematics",
    students: 32,
    attendance: "94%",
  },
  {
    className: "Class 9-B",
    subject: "Mathematics",
    students: 30,
    attendance: "91%",
  },
  {
    className: "Class 10-A",
    subject: "Mathematics",
    students: 28,
    attendance: "96%",
  },
];

const timetable = [
  {
    time: "09:00 AM",
    subject: "Mathematics",
    className: "Class 8-A",
    room: "Room 204",
    status: "Completed",
  },
  {
    time: "11:00 AM",
    subject: "Mathematics",
    className: "Class 9-B",
    room: "Room 206",
    status: "Upcoming",
  },
  {
    time: "01:00 PM",
    subject: "Mathematics",
    className: "Class 10-A",
    room: "Room 208",
    status: "Upcoming",
  },
];

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Good Morning, Rahul
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's your teaching overview for today.
        </p>
      </div>

      {/* Teacher Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="My Classes"
          value="6"
          subtitle="Currently assigned"
          icon={BookOpen}
        />

        <StatCard
          title="My Students"
          value="186"
          subtitle="Across all classes"
          icon={Users}
        />

        <StatCard
          title="Today's Attendance"
          value="92%"
          subtitle="171 of 186 present"
          icon={ClipboardCheck}
        />

        <StatCard
          title="Pending Homework"
          value="8"
          subtitle="Waiting for review"
          icon={FileText}
        />
      </div>

      {/* Today's Timetable + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Timetable */}
        <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="font-semibold text-gray-800">
                Today's Timetable
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your scheduled classes for today
              </p>
            </div>

            <CalendarDays size={20} className="text-[#27348b]" />
          </div>

          <div className="divide-y">
            {timetable.map((item) => (
              <div
                key={`${item.time}-${item.className}`}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-20 items-center justify-center rounded-lg bg-gray-50 text-xs font-semibold text-gray-700">
                    {item.time}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.subject}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.className} • {item.room}
                    </p>
                  </div>
                </div>

                <span
                  className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === "Completed"
                      ? "bg-green-50 text-green-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {item.status === "Completed" && (
                    <CheckCircle2 size={13} />
                  )}

                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Frequently used teaching tools
          </p>

          <div className="mt-5 space-y-3">
            <QuickAction
              icon={ClipboardCheck}
              title="Mark Attendance"
              subtitle="Record today's attendance"
            />

            <QuickAction
              icon={FileText}
              title="Add Homework"
              subtitle="Create new assignment"
            />

            <QuickAction
              icon={BookOpen}
              title="Enter Marks"
              subtitle="Update student marks"
            />

            <QuickAction
              icon={Users}
              title="View Students"
              subtitle="Manage your students"
            />
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-gray-800">
            My Classes
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Classes assigned to you
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          {classes.map((item) => (
            <div
              key={item.className}
              className="rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-800">
                    {item.className}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.subject}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
                  <BookOpen size={18} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">
                    Students
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {item.students}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">
                    Attendance
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {item.attendance}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Work + Announcements */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Pending Homework */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="font-semibold text-gray-800">
                Pending Homework
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Assignments requiring your review
              </p>
            </div>

            <FileText size={19} className="text-[#27348b]" />
          </div>

          <div className="divide-y">
            <HomeworkItem
              subject="Mathematics"
              className="Class 8-A"
              submissions="28 / 32 submitted"
            />

            <HomeworkItem
              subject="Mathematics"
              className="Class 9-B"
              submissions="24 / 30 submitted"
            />

            <HomeworkItem
              subject="Mathematics"
              className="Class 10-A"
              submissions="26 / 28 submitted"
            />
          </div>
        </div>

        {/* Announcements */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-gray-800">
              School Announcements
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Recent notices for teaching staff
            </p>
          </div>

          <div className="space-y-3 p-6">
            <Announcement
              title="Parent-Teacher Meeting"
              description="Parent-Teacher meeting is scheduled for 20 October 2026."
            />

            <Announcement
              title="Annual Sports Day"
              description="Teachers are requested to submit participant lists."
            />

            <Announcement
              title="Exam Schedule Released"
              description="The examination schedule for October has been published."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {value}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition hover:border-[#27348b]/30 hover:bg-gray-50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-800">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-gray-500">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

function HomeworkItem({
  subject,
  className,
  submissions,
}: {
  subject: string;
  className: string;
  submissions: string;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="text-sm font-medium text-gray-800">
          {subject}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {className} • {submissions}
        </p>
      </div>

      <Clock size={17} className="text-gray-400" />
    </div>
  );
}

function Announcement({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-sm font-semibold text-gray-800">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default TeacherDashboard;