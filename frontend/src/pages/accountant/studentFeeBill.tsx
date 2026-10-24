import { useState } from "react";
import { Printer } from "lucide-react";
import { Head, card, inputCls, btn, money, outstanding, STUDENTS } from "./feesShared";

export default function StudentFeeBill() {
  // The student chosen in the dropdown
  const [studentId, setStudentId] = useState(STUDENTS[0].id);
  const student = STUDENTS.find((s) => s.id === studentId) ?? STUDENTS[0];
  const due = outstanding(student);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Student Fee-Bill"
        sub="Pick a student to see and print the fee bill."
        right={
          <div className="flex gap-3 print:hidden">
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputCls}>
              {STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
            <button onClick={() => window.print()} className={`${btn} flex items-center gap-2`}>
              <Printer size={16} /> Print bill
            </button>
          </div>
        }
      />

      <div className={`${card} mx-auto max-w-2xl p-8`}>
        <p className="text-lg font-bold text-[#27348b]">Your School Name</p>
        <p className="border-b border-gray-200 pb-4 text-sm text-gray-500">Fee bill</p>

        <div className="grid grid-cols-2 gap-4 py-5 text-sm">
          <div><p className="text-gray-500">Student</p><p className="font-semibold">{student.name}</p></div>
          <div><p className="text-gray-500">Student ID</p><p className="font-semibold">{student.id}</p></div>
          <div><p className="text-gray-500">Class</p><p className="font-semibold">{student.className}</p></div>
          <div><p className="text-gray-500">Due date</p><p className="font-semibold">{student.dueDate}</p></div>
        </div>

        <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 text-sm">
          <div className="flex justify-between px-4 py-3"><span>{student.feeType}</span><span>{money(student.total)}</span></div>
          <div className="flex justify-between px-4 py-3"><span>Paid so far</span><span className="text-green-700">{money(student.paid)}</span></div>
          <div className="flex justify-between bg-gray-50 px-4 py-3 font-bold">
            <span>Amount due</span><span className="text-red-600">{money(due)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}