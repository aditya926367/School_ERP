// 

// src/pages/accountantDashboard.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegListAlt,
  FaThList,
  FaBars,
  FaBook,
  FaCalendarAlt,
  FaChevronRight,
} from "react-icons/fa";
import { PAYMENTS, STUDENTS, money, outstanding, sumAmounts } from "./accountant/feesShared";
import { loadRuns, inr } from "./accountant/payroll/payrollShared";

// ---------- Small helpers ----------
const panel =
  "bg-white border border-[#b9b9e6] rounded-[3px] shadow-[0_12px_14px_-10px_rgba(39,52,139,0.35)]";

// Local date as YYYY-MM-DD (toISOString would use UTC and can shift the day in India)
function localDate(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const shortDay = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// ---------- Clickable stat box (top row) ----------
function StatBox({
  label,
  value,
  note,
  to,
  tone = "text-[#2a2a63]",
}: {
  label: string;
  value: string;
  note: string;
  to: string;
  tone?: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`${panel} px-4 py-4 text-left transition-colors hover:border-[#27348b]`}
    >
      <p className="text-[13px] font-semibold text-[#2a2a63]">{label}</p>
      <p className={`mt-1 text-[24px] font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-[12px] text-gray-500">{note}</p>
    </button>
  );
}

// ---------- Quick action button ----------
function QuickAction({ icon, label, to }: { icon: ReactNode; label: string; to: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-3 rounded-[3px] border border-[#b9b9e6] bg-white px-4 py-3 text-left text-[14px] font-semibold text-[#2a2a63] transition-colors hover:border-[#27348b] hover:bg-[#f4f4fb]"
    >
      <span className="text-[18px]">{icon}</span>
      <span className="flex-1">{label}</span>
      <FaChevronRight className="text-[12px]" />
    </button>
  );
}

// ---------- Panel with a title and an optional "view all" link ----------
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
    <div className={`${panel} p-4`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[#2a2a63]">{title}</h2>
        {to && (
          <button onClick={() => navigate(to)} className="text-[13px] font-semibold text-[#27348b] hover:underline">
            {linkText ?? "View all"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ---------- Page (DashboardLayout already adds the header and sidebar) ----------
export default function AccountantDashboard() {
  const now = new Date();
  const today = localDate(now);
  const month = today.slice(0, 7);

  // --- Stat numbers ---
  const todayPayments = PAYMENTS.filter((p) => p.date === today);
  const todayTotal = sumAmounts(todayPayments);
  const monthTotal = sumAmounts(PAYMENTS.filter((p) => p.date.startsWith(month)));
  const totalPending = STUDENTS.reduce((sum, s) => sum + outstanding(s), 0);
  const pendingStudents = STUDENTS.filter((s) => outstanding(s) > 0).length;

  const run = loadRuns()[month];
  const payrollTotal = run ? run.rows.reduce((sum, r) => sum + r.net, 0) : null;

  // --- Last 7 days chart data (oldest first) ---
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const date = localDate(d);
    return { date, total: sumAmounts(PAYMENTS.filter((p) => p.date === date)) };
  });
  const maxDay = Math.max(1, ...last7.map((d) => d.total));
  const weekTotal = last7.reduce((sum, d) => sum + d.total, 0);

  // --- Top 5 students with the highest pending amount ---
  const defaulters = STUDENTS.filter((s) => outstanding(s) > 0)
    .sort((a, b) => outstanding(b) - outstanding(a))
    .slice(0, 5);

  // --- Latest 5 payments ---
  const recent = [...PAYMENTS]
    .sort((a, b) => b.date.localeCompare(a.date) || b.receiptNo.localeCompare(a.receiptNo))
    .slice(0, 5);

  // --- Class-wise collection progress ---
  const classes = [...new Set(STUDENTS.map((s) => s.className))].sort().map((className) => {
    const list = STUDENTS.filter((s) => s.className === className);
    const total = list.reduce((sum, s) => sum + s.total, 0);
    const paid = list.reduce((sum, s) => sum + s.paid, 0);
    return { className, total, paid, rate: total ? Math.round((paid / total) * 100) : 0 };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-[4px] px-4 pt-6 pb-8">
      <h1 className="text-center text-[22px] font-bold text-[#2a2a63]">Welcome, Fees Management</h1>

      {/* Quick numbers (click a box to open its page) */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox
          label="Today's collection"
          value={money(todayTotal)}
          note={`${todayPayments.length} payment(s) today`}
          to="/daybookReport"
          tone="text-green-600"
        />
        <StatBox
          label="Total pending"
          value={money(totalPending)}
          note={`${pendingStudents} student(s) with dues`}
          to="/pendingdues"
          tone="text-red-600"
        />
        <StatBox label="Collected this month" value={money(monthTotal)} note={month} to="/financeReports" />
        <StatBox
          label="This month's payroll"
          value={payrollTotal === null ? "Not generated" : inr(payrollTotal)}
          note={run ? `Status: ${run.status}` : "Open Monthly Payroll to create it"}
          to="/monthlyPayroll"
        />
      </div>

      {/* Quick actions: the jobs an accountant does most often */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <QuickAction icon={<FaRegListAlt />} label="Collect fee" to="/feeCollection" />
        <QuickAction icon={<FaThList />} label="Pending dues" to="/pendingdues" />
        <QuickAction icon={<FaBars />} label="Student fee-bill" to="/studentFeeBill" />
        <QuickAction icon={<FaBook />} label="Daybook" to="/daybookReport" />
        <QuickAction icon={<FaCalendarAlt />} label="Monthly payroll" to="/monthlyPayroll" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Last 7 days chart */}
        <Panel title="Collection in the last 7 days" to="/financeReports" linkText="Open reports">
          <p className="mb-3 text-[13px] text-gray-500">
            Total {money(weekTotal)} across {last7.filter((d) => d.total > 0).length} day(s) with payments
          </p>
          <div className="flex h-44 items-end gap-3">
            {last7.map((d) => (
              <div key={d.date} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[11px] text-gray-500">{d.total ? money(d.total) : ""}</span>
                <div
                  className={`w-full rounded-t-[2px] ${d.date === today ? "bg-[#27348b]" : "bg-[#9aa3dc]"}`}
                  style={{ height: `${(d.total / maxDay) * 100}%`, minHeight: d.total ? 4 : 0 }}
                  title={`${shortDay(d.date)}: ${money(d.total)}`}
                />
                <span className="text-[11px] text-[#2a2a63]">{shortDay(d.date)}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Highest pending */}
        <Panel title="Highest pending fees" to="/pendingdues">
          {defaulters.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No pending fees. Every student has paid in full.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {defaulters.map((s) => {
                const overdue = s.dueDate < today;
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#2a2a63]">{s.name}</p>
                      <p className="text-[12px] text-gray-500">
                        {s.className} · due {shortDay(s.dueDate)}
                        {overdue && <span className="ml-2 font-semibold text-red-600">Overdue</span>}
                      </p>
                    </div>
                    <span className="text-[14px] font-bold text-red-600">{money(outstanding(s))}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Latest payments */}
        <Panel title="Latest payments" to="/receipts" linkText="All receipts">
          <ul className="divide-y divide-gray-100">
            {recent.map((p) => (
              <li key={p.receiptNo} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#2a2a63]">{p.studentName}</p>
                  <p className="text-[12px] text-gray-500">
                    {p.receiptNo} · {shortDay(p.date)} · {p.mode}
                  </p>
                </div>
                <span className="text-[14px] font-bold text-green-600">{money(p.amount)}</span>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="py-8 text-center text-sm text-gray-500">No payments yet. Use Collect fee to add one.</li>
            )}
          </ul>
        </Panel>

        {/* Class-wise progress */}
        <Panel title="Class-wise collection" to="/misStatus" linkText="MIS status">
          <ul className="space-y-3">
            {classes.map((c) => (
              <li key={c.className}>
                <div className="flex justify-between text-[13px]">
                  <span className="font-semibold text-[#2a2a63]">{c.className}</span>
                  <span className="text-gray-500">
                    {money(c.paid)} of {money(c.total)} ({c.rate}%)
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-[#27348b]" style={{ width: `${c.rate}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}