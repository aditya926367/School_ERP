// import { useState } from "react";
// import { Head, Stat, card, inputCls, th, td } from "./feesShared";
// import { useFees, money, sumAmounts, PAYMENT_MODES, todayISO } from "../../store/feeStore";

// export default function DaybookReport() {
//   const { payments } = useFees();

//   // Start with the date of the latest payment (or today when there are none)
//   const latest = payments.reduce((max, p) => (p.date > max ? p.date : max), "");
//   const [date, setDate] = useState(latest || todayISO());
//   const todays = payments.filter((p) => p.date === date);

//   return (
//     <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
//       <Head
//         title="Daybook Report"
//         sub="All fee payments received on one day."
//         right={<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />}
//       />

//       <div className="grid grid-cols-2 gap-5 xl:grid-cols-6">
//         <Stat label="Day total" value={money(sumAmounts(todays))} />
//         {PAYMENT_MODES.map((mode) => (
//           <Stat key={mode} label={mode} value={money(sumAmounts(todays.filter((p) => p.mode === mode)))} />
//         ))}
//       </div>

//       <div className={card}>
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>{["Receipt no", "Student", "Mode", "Amount"].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {todays.map((p) => (
//               <tr key={p.receiptNo}>
//                 <td className={td}>{p.receiptNo}</td>
//                 <td className={td}>{p.studentName}</td>
//                 <td className={td}>{p.mode}</td>
//                 <td className={`${td} font-semibold`}>{money(p.amount)}</td>
//               </tr>
//             ))}
//             {todays.length === 0 && (
//               <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-500">No payments on this date.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }





import { useMemo, useState } from "react";
import { Banknote, CalendarDays, CreditCard, FileText, IndianRupee, Landmark, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import SummaryCard from "../../components/common/SummaryCard";
import { useFees, money, sumAmounts, todayISO } from "../../store/accountantStore";
import type { FeePayment, PaymentMode } from "../../store/accountantStore";

// Icon and colours of each payment mode (same style as the cards on the other pages)
const MODE_STYLE: Record<PaymentMode, { icon: ReactNode; iconClass: string; bgClass: string; badgeClass: string }> = {
  Cash: { icon: <Banknote size={22} />, iconClass: "text-amber-600", bgClass: "bg-amber-50", badgeClass: "bg-amber-100 text-amber-800" },
  UPI: { icon: <Smartphone size={22} />, iconClass: "text-purple-600", bgClass: "bg-purple-50", badgeClass: "bg-purple-100 text-purple-800" },
  Card: { icon: <CreditCard size={22} />, iconClass: "text-blue-600", bgClass: "bg-blue-50", badgeClass: "bg-blue-100 text-blue-800" },
  "Bank Transfer": { icon: <Landmark size={22} />, iconClass: "text-indigo-600", bgClass: "bg-indigo-50", badgeClass: "bg-indigo-100 text-indigo-800" },
  Cheque: { icon: <FileText size={22} />, iconClass: "text-rose-600", bgClass: "bg-rose-50", badgeClass: "bg-rose-100 text-rose-800" },
};

const MODES = Object.keys(MODE_STYLE) as PaymentMode[];

export default function DaybookReport() {
  const { payments } = useFees();

  // Start with the date of the latest payment (or today when there are none)
  const latest = payments.reduce((max, payment) => (payment.date > max ? payment.date : max), "");
  const [date, setDate] = useState(latest || todayISO());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Payments of the chosen day
  const dayPayments = useMemo(() => payments.filter((payment) => payment.date === date), [payments, date]);
  const dayTotal = sumAmounts(dayPayments);

  const totalPages = Math.max(1, Math.ceil(dayPayments.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagePayments = dayPayments.slice((safePage - 1) * pageSize, safePage * pageSize);

  const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        breadcrumb="Fees Management"
        title="Daybook Report"
        description="All fee payments received on one day."
        actions={
          <>
            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
            />
            <button
              type="button"
              onClick={() => {
                setDate(todayISO());
                setCurrentPage(1);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <CalendarDays size={18} />
              Today
            </button>
          </>
        }
      />

      {/* Day total and one card for every payment mode */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Day total"
          value={money(dayTotal)}
          icon={<IndianRupee size={22} />}
          iconClassName="text-green-600"
          iconBackgroundClassName="bg-green-50"
        />
        {MODES.map((mode) => {
          const style = MODE_STYLE[mode];
          const list = dayPayments.filter((payment) => payment.mode === mode);
          return (
            <SummaryCard
              key={mode}
              label={`${mode} (${list.length})`}
              value={money(sumAmounts(list))}
              icon={style.icon}
              iconClassName={style.iconClass}
              iconBackgroundClassName={style.bgClass}
            />
          );
        })}
      </div>

      {/* Payments of the day */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Payments received</h2>
            <p className="text-sm text-gray-500">{dateLabel}</p>
          </div>
          <span className="text-sm font-medium text-gray-500">
            {dayPayments.length} payments, {money(dayTotal)}
          </span>
        </div>

        <div className="p-4">
          <DataTable
            data={pagePayments}
            rowKey={(payment) => payment.id}
            tableClassName="min-w-[640px]"
            emptyState="No payments were received on this date."
            columns={[
              {
                key: "receiptNo",
                header: "Receipt No.",
                render: (payment: FeePayment) => <span className="font-semibold text-blue-700">{payment.receiptNo}</span>,
              },
              {
                key: "student",
                header: "Student",
                render: (payment: FeePayment) => (
                  <div>
                    <p className="font-medium text-gray-900">{payment.studentName}</p>
                    <p className="text-xs text-gray-500">
                      {payment.className} · {payment.studentId}
                    </p>
                  </div>
                ),
              },
              {
                key: "mode",
                header: "Mode",
                render: (payment: FeePayment) => (
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${MODE_STYLE[payment.mode].badgeClass}`}>
                    {payment.mode}
                  </span>
                ),
              },
              {
                key: "amount",
                header: "Amount",
                className: "text-right",
                render: (payment: FeePayment) => <span className="font-bold text-green-700">{money(payment.amount)}</span>,
              },
            ]}
          />
        </div>

        <div className="border-t px-5 py-3">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={dayPayments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            itemLabel="payments"
          />
        </div>
      </section>
    </div>
  );
}