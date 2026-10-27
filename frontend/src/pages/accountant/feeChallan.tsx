import { useState } from "react";
import { Printer } from "lucide-react";
import { Head, card, inputCls, btn } from "./feesShared";
import { useFees, money, outstanding } from "../../store/feeStore";

export default function FeeChallan() {
  const { students } = useFees();
  const [studentId, setStudentId] = useState(students[0]?.studentId ?? "");
  const student = students.find((s) => s.studentId === studentId) ?? students[0];

  if (!student) {
    return <div className="p-6 text-sm text-gray-500">No students found.</div>;
  }

  // Challan number is built from the student ID and the due date
  const challanNo = "CH-" + student.studentId + "-" + student.dueDate.replaceAll("-", "");

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head
        title="Fee Challan"
        sub="Create a challan that the parent can take to the bank."
        right={
          <div className="flex gap-3 print:hidden">
            <select value={student.studentId} onChange={(e) => setStudentId(e.target.value)} className={inputCls}>
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>{s.studentName} ({s.studentId})</option>
              ))}
            </select>
            <button onClick={() => window.print()} className={`${btn} flex items-center gap-2`}>
              <Printer size={16} /> Print challan
            </button>
          </div>
        }
      />

      <div className={`${card} mx-auto max-w-2xl p-8`}>
        <div className="flex justify-between border-b border-gray-200 pb-4">
          <div>
            <p className="text-lg font-bold text-[#27348b]">Your School Name</p>
            <p className="text-sm text-gray-500">Fee challan</p>
          </div>
          <p className="text-sm font-semibold">{challanNo}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-5 text-sm">
          <div><p className="text-gray-500">Student</p><p className="font-semibold">{student.studentName}</p></div>
          <div><p className="text-gray-500">Class</p><p className="font-semibold">{student.className}</p></div>
          <div><p className="text-gray-500">Fee type</p><p className="font-semibold">{student.feeType}</p></div>
          <div><p className="text-gray-500">Pay before</p><p className="font-semibold">{student.dueDate}</p></div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-[#27348b] px-5 py-4 text-white">
          <span>Amount to pay</span>
          <span className="text-2xl font-bold">{money(outstanding(student))}</span>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Bank: Your Bank Name | Account no: XXXXXXXXXX | IFSC: XXXX0000000
        </p>
      </div>
    </div>
  );
}