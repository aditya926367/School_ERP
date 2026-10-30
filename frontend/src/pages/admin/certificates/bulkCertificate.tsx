
import { useRef, useState } from "react";
import Pagination from "../../../components/common/Pagination";

// ---------- School Details ----------

const SCHOOL = {
  name: "Your School Name",
  address: "Your school address, City",
};

// ---------- Student Type ----------

type Student = {
  id: string;
  name: string;
  fatherName: string;
  className: string;
  dob: string;
};

// ---------- Demo Data ----------
// Replace this array with data from your backend API later.

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

const classNames = ["All Classes", "6-A", "7-B", "8-A", "10-B"];

const generalTypes = [
  "Bonafide",
  "Merit",
  "Participation",
  "Sports",
  "Other",
];

// ---------- Certificate Templates ----------

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

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  if (!iso) return "";

  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fillTemplate(text: string, student: Student): string {
  return text
    .replace(/\{\{name\}\}/g, student.name)
    .replace(/\{\{father\}\}/g, student.fatherName)
    .replace(/\{\{class\}\}/g, student.className)
    .replace(/\{\{admission\}\}/g, student.id)
    .replace(/\{\{school\}\}/g, SCHOOL.name);
}

function buildBody(type: string, student: Student): string {
  return fillTemplate(
    defaultBodies[type] ?? defaultBodies.Other,
    student
  );
}

function idsOfClass(className: string): string[] {
  if (className === "All Classes") {
    return students.map((student) => student.id);
  }

  return students
    .filter((student) => student.className === className)
    .map((student) => student.id);
}

// ---------- Print Helper ----------

function printElement(
  element: HTMLElement | null,
  orientation: "landscape" | "portrait" = "landscape"
) {
  if (!element) return;

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {
    alert("Please allow pop-ups to print certificates.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Certificates</title>
        <style>
          @page {
            size: A4 ${orientation};
            margin: 10mm;
          }

          body {
            margin: 0;
            padding: 12px;
            font-family: sans-serif;
            background: white;
          }

          .certificate {
            page-break-after: always;
            break-after: page;
          }

          .certificate:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  printWindow.onload = () => {
    printWindow.print();
  };
}

// ---------- Certificate Paper ----------

type PaperProps = {
  title: string;
  body: string;
  date: string;
  serial?: string;
};

function CertificatePaper({
  title,
  body,
  date,
  serial,
}: PaperProps) {
  const accent = "#27348b";

  const signLine = {
    borderTop: "1px solid #6b7280",
    marginTop: 4,
    paddingTop: 2,
  };

  return (
    <div
      className="certificate"
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
        breakAfter: "page",
      }}
    >
      {serial && (
        <div
          style={{
            textAlign: "right",
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          No. {serial}
        </div>
      )}

      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: accent,
          letterSpacing: 1,
        }}
      >
        {SCHOOL.name.toUpperCase()}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          marginTop: 2,
        }}
      >
        {SCHOOL.address}
      </div>

      <div
        style={{
          height: 2,
          background: accent,
          width: 120,
          margin: "16px auto",
        }}
      />

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

      <div
        style={{
          fontSize: 17,
          lineHeight: 1.9,
          padding: "0 24px",
          whiteSpace: "pre-wrap",
        }}
      >
        {body}
      </div>

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
          <div style={{ ...signLine, minWidth: 140 }}>
            Principal
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Styles ----------

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100";

const labelStyle =
  "mb-1 block text-xs font-semibold uppercase text-gray-500";

// ---------- Bulk Certificate Component ----------

export default function BulkCertificate() {
  // All hooks must stay inside this component.
  const [className, setClassName] = useState(classNames[0]);
  const [type, setType] = useState(generalTypes[0]);
  const [date, setDate] = useState(todayIso());
  const [selected, setSelected] = useState<string[]>(
    idsOfClass(classNames[0])
  );
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const printRef = useRef<HTMLDivElement>(null);

  // ---------- Filter Students ----------

  const classStudents =
    className === "All Classes"
      ? students
      : students.filter(
          (student) => student.className === className
        );

  const selectedStudents = classStudents.filter((student) =>
    selected.includes(student.id)
  );

  const allChecked =
    classStudents.length > 0 &&
    classStudents.every((student) =>
      selected.includes(student.id)
    );

  // ---------- Pagination ----------

  const totalPages = Math.max(
    1,
    Math.ceil(classStudents.length / pageSize)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;

  const paginatedStudents = classStudents.slice(
    startIndex,
    startIndex + pageSize
  );

  // ---------- Event Handlers ----------

  function changeClass(newClass: string) {
    setClassName(newClass);
    setCurrentPage(1);
    setSelected(idsOfClass(newClass));
    setMessage("");
  }

  function toggleStudent(id: string) {
    setMessage("");

    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((studentId) => studentId !== id)
        : [...previous, id]
    );
  }

  function toggleAll() {
    setMessage("");

    const currentClassIds = classStudents.map(
      (student) => student.id
    );

    setSelected((previous) => {
      if (allChecked) {
        return previous.filter(
          (id) => !currentClassIds.includes(id)
        );
      }

      return [
        ...previous,
        ...currentClassIds.filter(
          (id) => !previous.includes(id)
        ),
      ];
    });
  }

  function handleIssue() {
    if (selectedStudents.length === 0) {
      setMessage("Please select at least one student.");
      return;
    }

    // Demo only: this does not save certificates to the database.
    setMessage(
      `${selectedStudents.length} certificates prepared for ${className}.`
    );
  }

  // ---------- UI ----------

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Page Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bulk Certificate
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create and print certificates for multiple students at once.
        </p>
      </div>

      {/* Certificate Settings */}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelStyle}>Class</label>

            <select
              value={className}
              onChange={(event) => changeClass(event.target.value)}
              className={inputStyle}
            >
              {classNames.map((classItem) => (
                <option key={classItem} value={classItem}>
                  {classItem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>
              Certificate Type
            </label>

            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value);
                setMessage("");
              }}
              className={inputStyle}
            >
              {generalTypes.map((certificateType) => (
                <option
                  key={certificateType}
                  value={certificateType}
                >
                  {certificateType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Issue Date</label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Student Directory */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Students of {className}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {selectedStudents.length} of {classStudents.length}{" "}
              students selected
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleIssue}
              disabled={selectedStudents.length === 0}
              className="h-10 rounded-lg border border-[#27348b] px-4 text-sm font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Issue {selectedStudents.length}
            </button>

            <button
              type="button"
              onClick={() => printElement(printRef.current)}
              disabled={selectedStudents.length === 0}
              className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Print {selectedStudents.length}
            </button>
          </div>
        </div>

        {message && (
          <p
            role="status"
            className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-green-700"
          >
            {message}
          </p>
        )}

        {/* Responsive Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="Select all students"
                    className="h-4 w-4 rounded border-gray-300 accent-[#27348b]"
                  />
                </th>

                <th className="px-4 py-3">
                  Admission No.
                </th>

                <th className="px-4 py-3">Student</th>

                <th className="px-4 py-3">
                  Father&apos;s Name
                </th>

                <th className="px-4 py-3">Class</th>
              </tr>
            </thead>

            <tbody>
              {paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      aria-label={`Select ${student.name}`}
                      className="h-4 w-4 rounded border-gray-300 accent-[#27348b]"
                    />
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {student.id}
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {student.name}
                  </td>

                  <td className="px-4 py-3">
                    {student.fatherName}
                  </td>

                  <td className="px-4 py-3">
                    {student.className}
                  </td>
                </tr>
              ))}

              {paginatedStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination: same component as Student Management */}

        <div className="border-t border-gray-200">
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalItems={classStudents.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            itemLabel="students"
          />
        </div>
      </div>

      {/* Certificate Preview */}

      {selectedStudents.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-900">
            Certificate Preview{" "}
            <span className="text-sm font-normal text-gray-500">
              (first of {selectedStudents.length} selected)
            </span>
          </h2>

          <CertificatePaper
            title={`${type} Certificate`}
            body={buildBody(type, selectedStudents[0])}
            date={formatDate(date)}
            serial={`${type.slice(0, 3).toUpperCase()}-${selectedStudents[0].id}`}
          />
        </div>
      )}

      {/* Hidden Certificates Used for Bulk Printing */}

      <div
        ref={printRef}
        aria-hidden="true"
        style={{ display: "none" }}
      >
        {selectedStudents.map((student) => (
          <CertificatePaper
            key={student.id}
            title={`${type} Certificate`}
            body={buildBody(type, student)}
            date={formatDate(date)}
            serial={`${type.slice(0, 3).toUpperCase()}-${student.id}`}
          />
        ))}
      </div>
    </div>
  );
}