// src/pages/admin/certificates/IndividualCertificate.tsx
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

const generalTypes = ["Bonafide", "Merit", "Participation", "Sports", "Other"];

// Default certificate text. {{name}} style placeholders are filled per student.
const defaultBodies: Record<string, string> = {
  Bonafide:
    "This is to certify that {{name}}, ward of {{father}}, is a bonafide student of {{school}}, studying in Class {{class}} (Admission No. {{admission}}) in the current academic session.",
  Merit:
    "This Certificate of Merit is proudly awarded to {{name}} of Class {{class}} in recognition of outstanding academic performance and dedication.",
  Participation:
    "This is to certify that {{name}} of Class {{class}} has actively participated in the event organised by {{school}}. We appreciate the enthusiasm shown.",
  Sports:
    "This certificate is awarded to {{name}} of Class {{class}} for excellent sportsmanship and achievement in sports at {{school}}.",
  Other:
    "This is to certify that {{name}}, ward of {{father}}, a student of Class {{class}} at {{school}}, has been issued this certificate.",
};

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

// Replaces {{name}}, {{father}}, {{class}}, {{admission}}, {{school}}
function fillTemplate(text: string, s: Student): string {
  return text
    .replace(/\{\{name\}\}/g, s.name)
    .replace(/\{\{father\}\}/g, s.fatherName)
    .replace(/\{\{class\}\}/g, s.className)
    .replace(/\{\{admission\}\}/g, s.id)
    .replace(/\{\{school\}\}/g, SCHOOL.name);
}

function buildBody(type: string, s: Student): string {
  return fillTemplate(defaultBodies[type] ?? defaultBodies.Other, s);
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

// ---------- Certificate sheet ----------
type PaperProps = {
  title: string;
  body: string;
  date: string; // already formatted, for example 14 October 2026
  serial?: string;
};

// Inline styles only, so it prints correctly in a new window
function CertificatePaper({ title, body, date, serial }: PaperProps) {
  const accent = "#27348b";
  const signLine = { borderTop: "1px solid #6b7280", marginTop: 4, paddingTop: 2 };

  return (
    <div
      style={{
        border: `6px double ${accent}`,
        padding: 28,
        background: "#fff",
        color: "#1f2937",
        fontFamily: "Georgia, 'Times New Roman', serif",
        textAlign: "center",
        maxWidth: 820,
        margin: "0 auto 16px",
        boxSizing: "border-box",
        pageBreakAfter: "always",
      }}
    >
      {serial && <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280" }}>No. {serial}</div>}

      <div style={{ fontSize: 26, fontWeight: 700, color: accent, letterSpacing: 1 }}>
        {SCHOOL.name.toUpperCase()}
      </div>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{SCHOOL.address}</div>

      <div style={{ height: 2, background: accent, width: 120, margin: "16px auto" }} />

      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: accent,
          margin: "8px 0 20px",
        }}
      >
        {title}
      </div>

      <div style={{ fontSize: 17, lineHeight: 1.9, padding: "0 24px", whiteSpace: "pre-wrap" }}>{body}</div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 64,
          padding: "0 24px",
          fontSize: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{date}</div>
          <div style={signLine}>Date</div>
        </div>
        <div>
          <div style={{ height: 20 }} />
          <div style={{ ...signLine, minWidth: 140 }}>Principal</div>
        </div>
      </div>
    </div>
  );
}

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";
const labelStyle = "mb-1 block text-xs font-semibold uppercase text-gray-500";

export default function IndividualCertificate() {
  const [studentId, setStudentId] = useState(students[0].id);
  const [type, setType] = useState(generalTypes[0]);
  const [date, setDate] = useState(todayIso());

  // null means "use the default text", a string means the user edited it
  const [customBody, setCustomBody] = useState<string | null>(null);

  const [serialNo, setSerialNo] = useState(8);
  const [message, setMessage] = useState("");

  const printRef = useRef<HTMLDivElement>(null);

  const student = students.find((s) => s.id === studentId) ?? students[0];
  const body = customBody ?? buildBody(type, student);
  const serial = "CE" + String(serialNo).padStart(3, "0");

  function changeStudent(id: string) {
    setStudentId(id);
    setCustomBody(null);
    setMessage("");
  }

  function changeType(t: string) {
    setType(t);
    setCustomBody(null);
    setMessage("");
  }

  function handleIssue() {
    // Later: save the issued certificate through the backend API here
    setMessage(`Certificate ${serial} issued to ${student.name}`);
    setSerialNo(serialNo + 1);
  }

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Individual Certificate</h1>
        <p className="text-sm text-gray-500">Generate a certificate for a single student</p>
      </div>

      {/* Settings card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelStyle}>Student</label>
            <select value={studentId} onChange={(e) => changeStudent(e.target.value)} className={inputStyle}>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.className}) - {s.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Certificate type</label>
            <select value={type} onChange={(e) => changeType(e.target.value)} className={inputStyle}>
              {generalTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Issue date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase text-gray-500">Certificate text (editable)</label>
            {customBody !== null && (
              <button
                onClick={() => setCustomBody(null)}
                className="text-xs font-semibold text-[#27348b] hover:underline"
              >
                Reset text
              </button>
            )}
          </div>
          <textarea
            value={body}
            onChange={(e) => setCustomBody(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b]"
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-green-700">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={handleIssue}
              className="h-10 rounded-lg border border-[#27348b] px-4 text-sm font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
            >
              Issue Certificate
            </button>
            <button
              onClick={() => printElement(printRef.current)}
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
          <CertificatePaper
            title={`${type} Certificate`}
            body={body}
            date={formatDate(date)}
            serial={serial}
          />
        </div>
      </div>
    </div>
  );
}