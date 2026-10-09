
import {
  CalendarDays,
  Clock3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Wallet,
  Bell,
  ChevronRight,
  MapPin,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  UserRound,
} from "lucide-react";

const student = {
  name: "Aarav Sharma",
  admissionNo: "STU2026001",
  className: "Class 10",
  section: "A",
  rollNo: "12",
  academicYear: "2026–2027",
};

const attendance = {
  percentage: 92,
  present: 46,
  absent: 3,
  total: 50,
};

const subjects = [
  { name: "Mathematics", marks: 92, grade: "A+" },
  { name: "Science", marks: 86, grade: "A" },
  { name: "English", marks: 81, grade: "A" },
  { name: "Social Science", marks: 88, grade: "A" },
];

const timetable = [
  { time: "08:30 AM", subject: "Mathematics", teacher: "Mr. Verma", room: "Room 101" },
  { time: "09:20 AM", subject: "Science", teacher: "Mrs. Singh", room: "Lab 02" },
  { time: "10:10 AM", subject: "English", teacher: "Ms. Sharma", room: "Room 104" },
  { time: "11:30 AM", subject: "Computer Science", teacher: "Mr. Kumar", room: "Lab 01" },
];

const notices = [
  {
    title: "Unit Test Schedule Released",
    description: "Check the examination timetable for the upcoming unit tests.",
    date: "Today",
    type: "important",
  },
  {
    title: "Science Project Submission",
    description: "Submit your science project to your subject teacher.",
    date: "Tomorrow",
    type: "assignment",
  },
  {
    title: "Library Book Return",
    description: "Please return borrowed library books before the due date.",
    date: "10 Oct",
    type: "general",
  },
];

const quickLinks = [
  { label: "My Attendance", description: "View attendance history", icon: ClipboardCheck, href: "/student/attendance", color: "text-emerald-600 bg-emerald-50" },
  { label: "My Results", description: "Check marks and grades", icon: GraduationCap, href: "/student/results", color: "text-violet-600 bg-violet-50" },
  { label: "My Timetable", description: "View your class schedule", icon: CalendarDays, href: "/student/timetable", color: "text-blue-600 bg-blue-50" },
  { label: "My Homework", description: "Review assignments", icon: BookOpen, href: "/student/homework", color: "text-amber-600 bg-amber-50" },
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function StudentDashboard() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-100">
              {today}
            </p>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              {getGreeting()}, {student.name.split(" ")[0]}!
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Welcome to your student dashboard. Keep track of your classes,
              attendance, academic performance, and school updates.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20">
                {student.className} - Section {student.section}
              </span>
              <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20">
                Roll No. {student.rollNo}
              </span>
              <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20">
                {student.academicYear}
              </span>
            </div>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl border border-white/20 bg-white/15 sm:h-24 sm:w-24 sm:self-center">
            <GraduationCap size={48} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Personal information */}
      <section className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <UserRound size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">My Student Profile</h2>
            <p className="mt-1 text-sm text-slate-500">
              Admission No.: {student.admissionNo}
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={15} />
          Enrolled
        </span>
      </section>

      {/* Overview cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Attendance"
          value={`${attendance.percentage}%`}
          subtitle={`${attendance.present} classes attended`}
          icon={<ClipboardCheck size={22} />}
          color="bg-emerald-50 text-emerald-600"
          trend="Good attendance"
        />

        <SummaryCard
          title="Average Marks"
          value="86.8%"
          subtitle="Across 4 subjects"
          icon={<TrendingUp size={22} />}
          color="bg-blue-50 text-blue-600"
          trend="Good progress"
        />

        <SummaryCard
          title="Subjects"
          value="6"
          subtitle="Subjects this academic year"
          icon={<BookOpen size={22} />}
          color="bg-violet-50 text-violet-600"
          trend="Current session"
        />

        <SummaryCard
          title="Pending Fees"
          value="₹2,500"
          subtitle="Illustrative balance"
          icon={<Wallet size={22} />}
          color="bg-amber-50 text-amber-600"
          trend="Check fee details"
        />
      </section>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Attendance and performance */}
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900">My Attendance</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your attendance overview
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CalendarDays size={22} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex shrink-0 flex-col items-center justify-center sm:w-40">
                <div
                  className="relative flex h-36 w-36 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#10b981 ${attendance.percentage}%, #e2e8f0 ${attendance.percentage}% 100%)`,
                  }}
                >
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-bold text-slate-900">
                      {attendance.percentage}%
                    </span>
                    <span className="mt-1 text-xs text-slate-500">Attendance</span>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-emerald-600">
                  Keep it up!
                </p>
              </div>

              <div className="flex-1 space-y-4">
                <AttendanceRow
                  label="Present"
                  count={attendance.present}
                  total={attendance.total}
                  color="bg-emerald-500"
                />
                <AttendanceRow
                  label="Absent"
                  count={attendance.absent}
                  total={attendance.total}
                  color="bg-red-500"
                />
                <AttendanceRow
                  label="Other / Not recorded"
                  count={attendance.total - attendance.present - attendance.absent}
                  total={attendance.total}
                  color="bg-slate-400"
                />
                <p className="border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
                  These sample figures are for UI demonstration only. Actual
                  attendance will come from your school records.
                </p>
              </div>
            </div>
          </section>

          {/* Academic performance */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900">Academic Performance</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest subject-wise marks
                </p>
              </div>
              <TrendingUp size={21} className="text-indigo-600" />
            </div>

            <div className="mt-5 space-y-5">
              {subjects.map((subject) => (
                <div key={subject.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      {subject.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">
                        {subject.marks}%
                      </span>
                      <span className="min-w-8 rounded-md bg-indigo-50 px-2 py-1 text-center text-xs font-bold text-indigo-700">
                        {subject.grade}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${subject.marks}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/student/results"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View My Results <ChevronRight size={17} />
            </a>
          </section>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Timetable */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Today's Timetable</h2>
                <p className="mt-1 text-sm text-slate-500">Your class schedule</p>
              </div>
              <Clock3 size={21} className="text-indigo-600" />
            </div>

            <div className="mt-5 space-y-4">
              {timetable.map((item, index) => (
                <div key={item.subject} className="flex gap-3">
                  <div className="flex w-[76px] shrink-0 flex-col items-center">
                    <span className="text-xs font-semibold text-slate-700">
                      {item.time}
                    </span>
                    <div className="mt-2 flex flex-1 flex-col items-center">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          index === 0 ? "bg-indigo-600" : "bg-slate-300"
                        }`}
                      />
                      {index !== timetable.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-slate-200" />
                      )}
                    </div>
                  </div>

                  <div className="mb-1 flex-1 rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.subject}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.teacher}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} />
                      {item.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/student/timetable"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Full Timetable <ChevronRight size={16} />
            </a>
          </section>

          {/* Notices */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900">School Notices</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recent updates for you
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Bell size={20} />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.title}
                  className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 rounded-lg p-2 ${
                        notice.type === "important"
                          ? "bg-red-50 text-red-600"
                          : notice.type === "assignment"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {notice.type === "important" ? (
                        <AlertCircle size={17} />
                      ) : notice.type === "assignment" ? (
                        <BookOpen size={17} />
                      ) : (
                        <FileText size={17} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {notice.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {notice.description}
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-400">
                        {notice.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Quick access */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Access</h2>
          <p className="mt-1 text-sm text-slate-500">
            Open your personal student services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className={`rounded-xl p-3 ${link.color}`}>
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {link.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {link.description}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </a>
            );
          })}
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-slate-400">
        Student Dashboard · {student.academicYear}
      </p>
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
};

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{subtitle}</p>
      <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-600">
        {trend}
      </div>
    </div>
  );
}

type AttendanceRowProps = {
  label: string;
  count: number;
  total: number;
  color: string;
};

function AttendanceRow({ label, count, total, color }: AttendanceRowProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">
          {count} <span className="font-normal text-slate-400">/ {total}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
