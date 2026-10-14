// src/pages/admin/certificates/TransferCertificate.tsx
import { useRef, useState } from "react";

// ---------- Fake data (replace with backend data later) ----------
const SCHOOL = {
  name: "Your School Name",
  address: "Your school address, City",
};

type Student = {
  id: string; // admission number
  name: string;
  fatherName: string;
  className: string;
  dob: string; // yyyy-mm-dd
};

const students: Student[] = [
  { id: "AD1001", name: "Aarav Sharma", fatherName: "Rajesh Sharma", className: "8-A", dob: "2012-04-12" },
  { id: "AD1002", name: "Priya Verma", fatherName: "Anil Verma", className: "10-B", dob: "2010-09-03" },
  { id: "AD1003", name: "Rohit Gupta", fatherName: "Sunil Gupta", className: "6-A", dob: "2014-01-21" },
  { id: "AD1004", name: "Ananya Singh", fatherName: "Vikram Singh", className: "8-A", dob: "2012-07-30" },
  { id: "AD1005", name: "Karan Mehta", fatherName: "Deepak Mehta", className: "8-A", dob: "2012-11-05" },
  { id: "AD1006", name: "Sneha Rao", fatherName: "Mohan Rao", className: "10-B", dob: "2010-02-18" },
  { id: "AD1007", name: "Ishaan Khan", fatherName: "Imran Khan", className: "6-A", dob: "2014-06-09" },
  { id: "AD1008", name: "Diya Patel", fatherName: "Hitesh Patel", className: "7-B", dob: "2013-03-25" },
  { id: "AD1009", name: "Kabir Yadav", fatherName: "Suresh Yadav", className: "7-B", dob: "2013-10-14" },
  { id: "AD1010", name: "Meera Joshi", fatherName: "Ramesh Joshi", className: "10-B", dob: "2010-12-01" },
  { id: "AD1011", name: "Arjun Malhotra", fatherName: "Pankaj Malhotra", className: "6-A", dob: "2014-08-17" },
  { id: "AD1012", name: "Riya Chopra", fatherName: "Naveen Chopra", className: "7-B", dob: "2013-05-22" },
];

const reasons = [
  "Parent's transfer",
  "Change of residence",
  "Admission in another school",
  "Completion of school",
  "Other",
];
const conducts = ["Excellent", "Very Good", "Good", "Satisfactory"];

// ---------- Helpers ----------
// Today as yyyy-mm-dd
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// 2026-10-14 -> 14 October 2026
function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Opens a new window with only the given element and prints it
function printElement(
  el: HTMLElement | null,
  orientation: "landscape" | "portrait" = "landscape"
) {
  if (!el) return;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert("Please allow pop-ups to print");
    return;
  }

  win.document.write(
    `<html><head><title>Print</title>
     <style>@page{size:A4 ${orientation};margin:10mm}body{margin:0;padding:12px;font-family:sans-serif}</style>
     </head><body>${el.innerHTML}</body></html>`
  );
  win.document.close();
  win.focus();
  win.print();
}

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";
const labelStyle = "mb-1 block text-xs font-semibold uppercase text-gray-500";

type TcData = {
  student: Student;
  tcNo: string;
  leavingDate: string;
  reason: string;
  conduct: string;
  promoted: string;
  feesPaidTill: string;
  issueDate: string;
};

// The TC sheet. Inline styles only, so it prints correctly in a new window.
function TcPaper({ d }: { d: TcData }) {
  const rows: [string, string][] = [
    ["Name of the student", d.student.name],
    ["Father's name", d.student.fatherName],
    ["Admission number", d.student.id],
    ["Date of birth", formatDate(d.student.dob)],
    ["Class last studied", d.student.className],
    ["Date of leaving the school", formatDate(d.leavingDate)],
    ["Reason for leaving", d.reason],
    ["General conduct", d.conduct],
    ["Qualified for promotion to higher class", d.promoted],
    ["Fees paid up to", d.feesPaidTill || "-"],
  ];

  return (
    <div
      style={{
        border: "4px double #27348b",
        padding: 28,
        background: "#fff",
        color: "#1f2937",
        fontFamily: "Georgia, 'Times New Roman', serif",
        maxWidth: 720,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#27348b" }}>{SCHOOL.name.toUpperCase()}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{SCHOOL.address}</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            margin: "16px 0 4px",
            textDecoration: "underline",
          }}
        >
          TRANSFER CERTIFICATE
        </div>
        <div style={{ fontSize: 13 }}>T.C. No.: {d.tcNo}</div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, fontSize: 15 }}>
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label}>
              <td style={{ border: "1px solid #9ca3af", padding: "8px 10px", width: 40 }}>{i + 1}</td>
              <td style={{ border: "1px solid #9ca3af", padding: "8px 10px", width: "50%" }}>{label}</td>
              <td style={{ border: "1px solid #9ca3af", padding: "8px 10px", fontWeight: 600 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 60,
          fontSize: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{formatDate(d.issueDate)}</div>
          <div style={{ borderTop: "1px solid #6b7280", marginTop: 4, paddingTop: 2 }}>Date of issue</div>
        </div>
        <div>
          <div style={{ height: 20 }} />
          <div style={{ borderTop: "1px solid #6b7280", marginTop: 4, paddingTop: 2, minWidth: 140 }}>
            Principal
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransferCertificate() {
  const [studentId, setStudentId] = useState(students[0].id);
  const [leavingDate, setLeavingDate] = useState(todayIso());
  const [reason, setReason] = useState(reasons[0]);
  const [conduct, setConduct] = useState(conducts[1]);
  const [promoted, setPromoted] = useState("Yes");
  const [feesPaidTill, setFeesPaidTill] = useState("");
  const [tcCounter, setTcCounter] = useState(12);
  const [message, setMessage] = useState("");

  const printRef = useRef<HTMLDivElement>(null);

  const student = students.find((s) => s.id === studentId) ?? students[0];
  const tcNo = `TC/${new Date().getFullYear()}/${String(tcCounter).padStart(3, "0")}`;

  const data: TcData = {
    student,
    tcNo,
    leavingDate,
    reason,
    conduct,
    promoted,
    feesPaidTill,
    issueDate: todayIso(),
  };

  function handleIssue() {
    // Later: save the issued TC through the backend API here
    setMessage(`Transfer certificate ${tcNo} issued to ${student.name}`);
    setTcCounter(tcCounter + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfer Certificate</h1>
        <p className="text-sm text-gray-500">Issue a transfer certificate for a leaving student</p>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelStyle}>Student</label>
            <select
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setMessage("");
              }}
              className={inputStyle}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.className}) - {s.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Date of leaving</label>
            <input
              type="date"
              value={leavingDate}
              onChange={(e) => setLeavingDate(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Reason for leaving</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className={inputStyle}>
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>General conduct</label>
            <select value={conduct} onChange={(e) => setConduct(e.target.value)} className={inputStyle}>
              {conducts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Qualified for promotion</label>
            <select value={promoted} onChange={(e) => setPromoted(e.target.value)} className={inputStyle}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Fees paid up to</label>
            <input
              value={feesPaidTill}
              onChange={(e) => setFeesPaidTill(e.target.value)}
              placeholder="e.g. September 2026"
              className={inputStyle}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-green-700">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={handleIssue}
              className="h-10 rounded-lg border border-[#27348b] px-4 text-sm font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
            >
              Issue TC
            </button>
            <button
              onClick={() => printElement(printRef.current, "portrait")}
              className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-900">Preview</h2>
        <div ref={printRef}>
          <TcPaper d={data} />
        </div>
      </div>
    </div>
  );
}