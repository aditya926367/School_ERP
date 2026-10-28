import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegListAlt,
  FaThList,
  FaBars,
  FaBook,
  FaCalendarAlt,
  FaChevronRight,
  FaRupeeSign,
  FaWallet,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";

import {
  useFees,
  money,
  outstanding,
  sumAmounts,
  todayISO,
} from "../store/feeStore";

import { loadRuns, inr } from "./accountant/payroll/payrollShared";

// ---------- Shared dashboard styles ----------
const panel =
  "rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md";

const shortDay = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

// ---------- Summary card ----------
function StatBox({
  label,
  value,
  note,
  to,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  note: string;
  to: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`${panel} group flex min-h-[145px] w-full items-start justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <p className="mt-3 break-words text-2xl font-bold text-slate-800">
          {value}
        </p>

        <p className="mt-2 text-xs text-slate-500">{note}</p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${iconBg} ${iconColor} transition-transform group-hover:scale-105`}
      >
        {icon}
      </div>
    </button>
  );
}

// ---------- Quick action ----------
function QuickAction({
  icon,
  label,
  description,
  to,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  to: string;
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`${panel} group flex min-h-[155px] flex-col p-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-700 transition-colors group-hover:bg-indigo-700 group-hover:text-white">
          {icon}
        </span>

        <FaChevronRight className="text-xs text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-700" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        {label}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </button>
  );
}

// ---------- Dashboard panel ----------
function Panel({
  title,
  to,
  linkText,
  children,
}: {
  title: string;
  to?: string;
  linkText?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <section className={`${panel} min-w-0 overflow-hidden`}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-bold text-slate-800">
          {title}
        </h2>

        {to && (
          <button
            type="button"
            onClick={() => navigate(to)}
            className="shrink-0 text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
          >
            {linkText ?? "View all"}
          </button>
        )}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

// ---------- Accountant Dashboard ----------
export default function AccountantDashboard() {
  const navigate = useNavigate();
  const now = new Date();
  const { students, payments } = useFees();

  const today = todayISO(now);
  const month = today.slice(0, 7);

  // Summary calculations
  const todayPayments = payments.filter((p) => p.date === today);
  const todayTotal = sumAmounts(todayPayments);

  const monthPayments = payments.filter((p) =>
    p.date.startsWith(month)
  );
  const monthTotal = sumAmounts(monthPayments);

  const totalPending = students.reduce(
    (sum, student) => sum + outstanding(student),
    0
  );

  const pendingStudents = students.filter(
    (student) => outstanding(student) > 0
  ).length;

  const run = loadRuns()[month];

  const payrollTotal = run
    ? run.rows.reduce((sum, row) => sum + row.net, 0)
    : null;

  // Last seven days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - i));

    const isoDate = todayISO(date);

    return {
      date: isoDate,
      total: sumAmounts(
        payments.filter((payment) => payment.date === isoDate)
      ),
    };
  });

  const maxDay = Math.max(1, ...last7.map((day) => day.total));

  const weekTotal = last7.reduce(
    (sum, day) => sum + day.total,
    0
  );

  // Five students with the highest pending fees
  const defaulters = students
    .filter((student) => outstanding(student) > 0)
    .sort(
      (a, b) => outstanding(b) - outstanding(a)
    )
    .slice(0, 5);

  // Latest five payments
  const recent = [...payments]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.id - a.id
    )
    .slice(0, 5);

  // Class-wise collection progress
  const classes = [
    ...new Set(students.map((student) => student.className)),
  ]
    .sort()
    .map((className) => {
      const classStudents = students.filter(
        (student) => student.className === className
      );

      const total = classStudents.reduce(
        (sum, student) => sum + student.totalFee,
        0
      );

      const paid = classStudents.reduce(
        (sum, student) => sum + student.paid,
        0
      );

      return {
        className,
        total,
        paid,
        rate: total
          ? Math.min(100, Math.round((paid / total) * 100))
          : 0,
      };
    });

  return (
    <div className="min-h-screen space-y-7 bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Dashboard heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
          Accountant Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage fee collections, outstanding dues, student bills,
          daybook, and payroll.
        </p>
      </div>

      {/* Summary cards: two per row */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Financial Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A summary of your school's fee and payroll activities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatBox
            label="Total Collection"
            value={money(todayTotal)}
            note={`${todayPayments.length} payment(s) collected today`}
            to="/daybookReport"
            icon={<FaRupeeSign />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatBox
            label="Total Pending"
            value={money(totalPending)}
            note={`${pendingStudents} student(s) with outstanding dues`}
            to="/pendingdues"
            icon={<FaWallet />}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />

          <StatBox
            label="Collected This Month"
            value={money(monthTotal)}
            note={`${monthPayments.length} payment(s) this month`}
            to="/financeReports"
            icon={<FaMoneyBillWave />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatBox
            label="This Month's Payroll"
            value={
              payrollTotal === null
                ? "Not generated"
                : inr(payrollTotal)
            }
            note={
              run
                ? `Status: ${run.status}`
                : "Open monthly payroll to generate"
            }
            to="/monthlyPayroll"
            icon={<FaUsers />}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />
        </div>
      </section>

{/* Quick Actions */}
<section>
  <div className="mb-4">
    <h2 className="text-xl font-bold text-slate-900">
      Quick Actions
    </h2>
  </div>

  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
    <button
      onClick={() => navigate("/feeCollection")}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left text-base text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50"
    >
      <FaRegListAlt className="shrink-0 text-xl text-blue-600" />
      <span>Collect Fees</span>
    </button>

    <button
      onClick={() => navigate("/pendingdues")}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left text-base text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50"
    >
      <FaThList className="shrink-0 text-xl text-blue-600" />
      <span>Pending Dues</span>
    </button>

    <button
      onClick={() => navigate("/studentFeeBill")}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left text-base text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50"
    >
      <FaBars className="shrink-0 text-xl text-blue-600" />
      <span>Student Fee-Bill</span>
    </button>

    <button
      onClick={() => navigate("/daybookReport")}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left text-base text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50"
    >
      <FaBook className="shrink-0 text-xl text-blue-600" />
      <span>Daybook</span>
    </button>

    <button
      onClick={() => navigate("/monthlyPayroll")}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left text-base text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50"
    >
      <FaCalendarAlt className="shrink-0 text-xl text-blue-600" />
      <span>Monthly Payroll</span>
    </button>
  </div>
</section>


      {/* Dashboard details */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Collection & Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor collection trends, pending fees, and class-wise progress.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Collection chart */}
          <Panel
            title="Collection in the Last 7 Days"
            to="/financeReports"
            linkText="View Reports"
          >
            <div className="mb-5 rounded-lg bg-indigo-50 p-4">
              <p className="text-sm text-slate-500">
                Total collection over the last seven days
              </p>

              <p className="mt-1 text-2xl font-bold text-indigo-800">
                {money(weekTotal)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {last7.filter((day) => day.total > 0).length} day(s)
                with payments
              </p>
            </div>

            <div className="flex h-48 items-end gap-2 sm:gap-3">
              {last7.map((day) => (
                <div
                  key={day.date}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="max-w-full truncate text-[10px] text-slate-500 sm:text-xs">
                    {day.total ? money(day.total) : "—"}
                  </span>

                  <div className="flex h-32 w-full items-end">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        day.date === today
                          ? "bg-indigo-700"
                          : "bg-indigo-300"
                      }`}
                      style={{
                        height: day.total
                          ? `${Math.max(
                              5,
                              (day.total / maxDay) * 100
                            )}%`
                          : "0%",
                      }}
                      title={`${shortDay(day.date)}: ${money(day.total)}`}
                    />
                  </div>

                  <span className="text-[10px] text-slate-500 sm:text-xs">
                    {shortDay(day.date)}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Highest pending fees */}
          <Panel
            title="Highest Pending Fees"
            to="/pendingdues"
            linkText="View All"
          >
            {defaulters.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-600">
                  ✓
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No pending fees
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  All students have cleared their recorded dues.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {defaulters.map((student) => {
                  const overdue = student.dueDate < today;

                  return (
                    <li
                      key={student.studentId}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-bold text-rose-600">
                          {student.studentName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {student.studentName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {student.className} · Due{" "}
                            {shortDay(student.dueDate)}
                          </p>

                          {overdue && (
                            <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="shrink-0 text-sm font-bold text-rose-600">
                        {money(outstanding(student))}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          {/* Latest payments */}
          <Panel
            title="Latest Payments"
            to="/receipts"
            linkText="All Receipts"
          >
            {recent.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No payments yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Record a payment to see it here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recent.map((payment) => (
                  <li
                    key={payment.receiptNo}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <FaMoneyBillWave />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {payment.studentName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {payment.receiptNo} · {shortDay(payment.date)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {payment.mode}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-emerald-600">
                      +{money(payment.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Class-wise collection */}
          <Panel
            title="Class-Wise Collection"
            to="/misStatus"
            linkText="MIS Status"
          >
            {classes.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">
                No class collection data available.
              </p>
            ) : (
              <ul className="space-y-5">
                {classes.map((classItem) => (
                  <li key={classItem.className}>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {classItem.className}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Collected {money(classItem.paid)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-700">
                          {classItem.rate}%
                        </p>

                        <p className="text-xs text-slate-400">
                          of {money(classItem.total)}
                        </p>
                      </div>
                    </div>

                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`${classItem.className} collection progress`}
                      aria-valuenow={classItem.rate}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${classItem.rate}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>
    </div>
  );
}
