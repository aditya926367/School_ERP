// src/pages/admin/certificates/CreateCertificate.tsx

import { useEffect, useState } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";

// ---------- Demo data (replace with backend data later) ----------
const SCHOOL = {
  name: "Your School Name",
  address: "Your school address, City",
};

type Student = {
  id: string;
  name: string;
  fatherName: string;
  className: string;
  dob: string;
};

const sample: Student = {
  id: "AD1001",
  name: "Aarav Sharma",
  fatherName: "Rajesh Sharma",
  className: "8-A",
  dob: "2012-04-12",
};

const certTypes = [
  "Bonafide",
  "Character",
  "Transfer",
  "Merit",
  "Participation",
  "Sports",
  "Other",
];

const defaultBodies: Record<string, string> = {
  Bonafide:
    "This is to certify that {{name}}, ward of {{father}}, is a bonafide student of {{school}}, studying in Class {{class}} (Admission No. {{admission}}) in the current academic session.",
  Character:
    "This is to certify that {{name}}, ward of {{father}}, studying in Class {{class}} at {{school}}, has demonstrated good conduct and character during their time at the school.",
  Transfer:
    "This is to certify that {{name}}, ward of {{father}}, was a student of Class {{class}} at {{school}}. Admission No. {{admission}}. This certificate is issued upon request.",
  Merit:
    "This Certificate of Merit is proudly awarded to {{name}} of Class {{class}} in recognition of outstanding academic performance and dedication.",
  Participation:
    "This is to certify that {{name}} of Class {{class}} has actively participated in the event organised by {{school}}. We appreciate the enthusiasm shown.",
  Sports:
    "This certificate is awarded to {{name}} of Class {{class}} for excellent sportsmanship and achievement in sports at {{school}}.",
  Other:
    "This is to certify that {{name}}, ward of {{father}}, a student of Class {{class}} at {{school}}, has been issued this certificate.",
};

type Template = {
  id: string;
  name: string;
  type: string;
  title: string;
  body: string;
  accent: string;
  leftLabel: string;
  rightLabel: string;
};

const STORAGE_KEY =
  "schoolerp:pages_admin_certificates_createcertificate_tsx:templates";

const PLACEHOLDERS = [
  "{{name}}",
  "{{father}}",
  "{{class}}",
  "{{admission}}",
  "{{school}}",
];

const emptyForm = {
  name: "",
  type: "Bonafide",
  title: "",
  body: defaultBodies.Bonafide,
  accent: "#27348b",
  leftLabel: "Date",
  rightLabel: "Principal",
};

function todayIso(): string {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
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

function usePersistentState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Could not save certificate templates:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

// ---------- Certificate preview ----------
type PaperProps = {
  title: string;
  body: string;
  date: string;
  serial?: string;
  accent?: string;
  leftLabel?: string;
  rightLabel?: string;
};

function CertificatePaper({
  title,
  body,
  date,
  serial,
  accent = "#27348b",
  leftLabel = "Date",
  rightLabel = "Principal",
}: PaperProps) {
  const signLine: CSSProperties = {
    borderTop: "1px solid #6b7280",
    marginTop: 4,
    paddingTop: 4,
  };

  return (
    <div
      className="certificate-paper"
      style={{
        border: `6px double ${accent}`,
        padding: 28,
        background: "#fff",
        color: "#1f2937",
        fontFamily: "Georgia, 'Times New Roman', serif",
        textAlign: "center",
        maxWidth: 820,
        minHeight: 480,
        margin: "0 auto 16px",
        boxSizing: "border-box",
      }}
    >
      {serial && (
        <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280" }}>
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
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
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
          gap: 24,
          marginTop: 64,
          padding: "0 24px",
          fontSize: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{date}</div>
          <div style={signLine}>{leftLabel}</div>
        </div>
        <div>
          <div style={{ height: 20 }} />
          <div style={{ ...signLine, minWidth: 140 }}>{rightLabel}</div>
        </div>
      </div>
    </div>
  );
}

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10";
const labelStyle =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500";

export default function CreateCertificate() {
  const [templates, setTemplates] = usePersistentState<Template[]>(
    STORAGE_KEY,
    [],
  );
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function nextId(): string {
    const max = templates.reduce((highest, template) => {
      const number = Number(template.id.replace(/^T/, ""));
      return Number.isFinite(number) ? Math.max(highest, number) : highest;
    }, 0);
    return `T${String(max + 1).padStart(3, "0")}`;
  }

  function change<K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K],
  ) {
    setMessage("");
    setError("");
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function changeType(type: string) {
    setMessage("");
    setError("");
    setForm((previous) => {
      const bodyIsDefault =
        previous.body.trim() === "" ||
        Object.values(defaultBodies).includes(previous.body);
      return {
        ...previous,
        type,
        body: bodyIsDefault
          ? (defaultBodies[type] ?? defaultBodies.Other)
          : previous.body,
      };
    });
  }

  function handleSave() {
    if (!form.name.trim() || !form.title.trim() || !form.body.trim()) {
      setError("Template name, certificate title and text are required.");
      setMessage("");
      return;
    }

    if (editingId) {
      setTemplates((previous) =>
        previous.map((template) =>
          template.id === editingId
            ? {
                ...template,
                ...form,
                name: form.name.trim(),
                title: form.title.trim(),
                body: form.body.trim(),
              }
            : template,
        ),
      );
      setMessage("Template updated successfully.");
    } else {
      const newTemplate: Template = {
        id: nextId(),
        ...form,
        name: form.name.trim(),
        title: form.title.trim(),
        body: form.body.trim(),
      };
      setTemplates((previous) => [newTemplate, ...previous]);
      setMessage("Template saved successfully.");
    }

    setError("");
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function handleEdit(template: Template) {
    setEditingId(template.id);
    setError("");
    setMessage("");
    setForm({
      name: template.name,
      type: template.type,
      title: template.title,
      body: template.body,
      accent: template.accent,
      leftLabel: template.leftLabel,
      rightLabel: template.rightLabel,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this certificate template?")) return;

    setTemplates((previous) =>
      previous.filter((template) => template.id !== id),
    );

    if (editingId === id) {
      setEditingId(null);
      setForm({ ...emptyForm });
    }
    setError("");
    setMessage("Template deleted.");
  }

  function handleReset() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setMessage("");
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank", "width=1000,height=750");
    if (!printWindow) {
      setError("Please allow pop-ups in your browser to print the certificate.");
      return;
    }

    const preview = document.getElementById("certificate-preview");
    if (!preview) {
      printWindow.close();
      setError("Certificate preview could not be found.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${escapeHtml(form.title || "Certificate")}</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4 landscape; margin: 12mm; }
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; background: white; }
            .certificate-paper { width: 100%; max-width: none !important; min-height: 0 !important; margin: 0 !important; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${preview.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
    };
    setError("");
  }

  const previewBody = fillTemplate(
    form.body || "Your certificate text will appear here.",
    sample,
  );

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Certificate
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Design, preview, save and print reusable certificate templates.
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Print Preview
        </button>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          {editingId ? "Edit Template" : "New Template"}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelStyle} htmlFor="template-name">
              Template name
            </label>
            <input
              id="template-name"
              value={form.name}
              onChange={(event) => change("name", event.target.value)}
              placeholder="e.g. Standard Bonafide"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle} htmlFor="certificate-type">
              Certificate type
            </label>
            <select
              id="certificate-type"
              value={form.type}
              onChange={(event) => changeType(event.target.value)}
              className={inputStyle}
            >
              {certTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle} htmlFor="certificate-title">
              Heading on certificate
            </label>
            <input
              id="certificate-title"
              value={form.title}
              onChange={(event) => change("title", event.target.value)}
              placeholder="e.g. Bonafide Certificate"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle} htmlFor="certificate-accent">
              Accent color
            </label>
            <input
              id="certificate-accent"
              type="color"
              value={form.accent}
              onChange={(event) => change("accent", event.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 p-1"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelStyle} htmlFor="certificate-body">
            Certificate text
          </label>
          <textarea
            id="certificate-body"
            value={form.body}
            onChange={(event) => change("body", event.target.value)}
            rows={4}
            placeholder="Write the certificate text. Use the placeholders below."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
          />
          <p className="mt-2 text-xs text-gray-500">
            Placeholders:{" "}
            {PLACEHOLDERS.map((placeholder) => (
              <code
                key={placeholder}
                className="mb-1 mr-2 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-gray-700"
              >
                {placeholder}
              </code>
            ))}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelStyle} htmlFor="left-label">
              Left signature label
            </label>
            <input
              id="left-label"
              value={form.leftLabel}
              onChange={(event) => change("leftLabel", event.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle} htmlFor="right-label">
              Right signature label
            </label>
            <input
              id="right-label"
              value={form.rightLabel}
              onChange={(event) => change("rightLabel", event.target.value)}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div aria-live="polite" className="text-sm">
            {error && <p className="font-semibold text-red-600">{error}</p>}
            {message && (
              <p className="font-semibold text-green-700">{message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {editingId ? "Cancel Edit" : "Reset"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
            >
              {editingId ? "Update Template" : "Save Template"}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Live Preview
          </h2>
          <p className="text-sm text-gray-500">
            Sample student: {sample.name} ({sample.className})
          </p>
        </div>
        <div id="certificate-preview">
          <CertificatePaper
            title={form.title || "Certificate Heading"}
            body={previewBody}
            date={formatDate(todayIso())}
            serial="PREVIEW"
            accent={form.accent}
            leftLabel={form.leftLabel}
            rightLabel={form.rightLabel}
          />
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Preview uses sample student data. Connect real student records before
          issuing certificates.
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900">
            Saved Templates ({templates.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Heading</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">{template.id}</td>
                  <td className="px-4 py-3 font-semibold">{template.name}</td>
                  <td className="px-4 py-3">{template.type}</td>
                  <td className="px-4 py-3">{template.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(template)}
                        className="rounded-lg border border-[#27348b] px-3 py-1.5 text-xs font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(template.id)}
                        className="rounded-lg border border-red-500 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No templates yet. Create and save your first template above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
