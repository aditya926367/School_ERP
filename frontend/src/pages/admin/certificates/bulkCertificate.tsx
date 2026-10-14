// src/pages/admin/certificates/BulkCertificate.tsx
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

const classNames = ["6-A", "7-B", "8-A", "10-B"];
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

// All student ids of one class
function idsOfClass(className: string): string[] {
  return students.filter((s) => s.className === className).map((s) => s.id);
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

export default function BulkCertificate() {
  const [className, setClassName] = useState(classNames[0]);
  const [type, setType] = useState(generalTypes[0]);
  const [date, setDate] = useState(todayIso());
  const [selected, setSelected] = useState<string[]>(idsOfClass(classNames[0]));
  const [message, setMessage] = useState("");

  const printRef = useRef<HTMLDivElement>(null);

  const classStudents = students.filter((s) => s.className === className);
  const selectedStudents = classStudents.filter((s) => selected.includes(s.id));
  const allChecked = classStudents.length > 0 && selectedStudents.length === classStudents.length;

  // Changing the class selects all of its students by default
  function changeClass(c: string) {
    setClassName(c);
    setSelected(idsOfClass(c));
    setMessage("");
  }

  function toggleStudent(id: string) {
    setMessage("");
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  function toggleAll() {
    setMessage("");
    setSelected(allChecked ? [] : idsOfClass(className));
  }

  function handleIssue() {
    // Later: save all issued certificates through the backend API here
    setMessage(`${selectedStudents.length} certificates issued for Class ${className}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Certificate</h1>
        <p className="text-sm text-gray-500">Create certificates for many students at once</p>
      </div>

      {/* Settings card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelStyle}>Class</label>
            <select value={className} onChange={(e) => changeClass(e.target.value)} className={inputStyle}>
              {classNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Certificate type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputStyle}>
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
      </div>

      {/* Student list */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Students of Class {className}</h2>
            <p className="text-sm text-gray-500">
              {selectedStudents.length} of {classStudents.length} selected
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleIssue}
              disabled={selectedStudents.length === 0}
              className="h-10 rounded-lg border border-[#27348b] px-4 text-sm font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent"
            >
              Issue {selectedStudents.length}
            </button>
            <button
              onClick={() => printElement(printRef.current)}
              disabled={selectedStudents.length === 0}
              className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Print {selectedStudents.length}
            </button>
          </div>
        </div>

        {message && (
          <p className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-green-700">{message}</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} className="h-4 w-4" />
                </th>
                <th className="px-4 py-3">Admission No.</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Father's Name</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleStudent(s.id)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.id}</td>
                  <td className="px-4 py-3 font-semibold">{s.name}</td>
                  <td className="px-4 py-3">{s.fatherName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview of the first selected student */}
      {selectedStudents.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-900">
            Preview <span className="text-sm font-normal text-gray-500">(first of {selectedStudents.length})</span>
          </h2>

          <CertificatePaper
            title={`${type} Certificate`}
            body={buildBody(type, selectedStudents[0])}
            date={formatDate(date)}
            serial={`${type.slice(0, 3).toUpperCase()}-${selectedStudents[0].id}`}
          />
        </div>
      )}

      {/* Hidden sheet with ALL selected certificates, used only for printing */}
      <div ref={printRef} style={{ display: "none" }}>
        {selectedStudents.map((s) => (
          <CertificatePaper
            key={s.id}
            title={`${type} Certificate`}
            body={buildBody(type, s)}
            date={formatDate(date)}
            serial={`${type.slice(0, 3).toUpperCase()}-${s.id}`}
          />
        ))}
      </div>
    </div>
  );
}