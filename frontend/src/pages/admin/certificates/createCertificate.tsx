// src/pages/admin/certificates/CreateCertificate.tsx
import { useState } from "react";

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

// The preview uses this student as a sample
const sample: Student = {
  id: "AD1001",
  name: "Aarav Sharma",
  fatherName: "Rajesh Sharma",
  className: "8-A",
  dob: "2012-04-12",
};

const certTypes = ["Bonafide", "Character", "Transfer", "Merit", "Participation", "Sports", "Other"];

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

const initialTemplates: Template[] = [];

const PLACEHOLDERS = ["{{name}}", "{{father}}", "{{class}}", "{{admission}}", "{{school}}"];

const emptyForm = {
  name: "",
  type: "Bonafide",
  title: "",
  body: "",
  accent: "#27348b",
  leftLabel: "Date",
  rightLabel: "Principal",
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

// ---------- Certificate sheet ----------
type PaperProps = {
  title: string;
  body: string;
  date: string; // already formatted, for example 14 October 2026
  serial?: string;
  accent?: string;
  leftLabel?: string;
  rightLabel?: string;
};

// Inline styles only, so it prints correctly in a new window
function CertificatePaper({
  title,
  body,
  date,
  serial,
  accent = "#27348b",
  leftLabel = "Date",
  rightLabel = "Principal",
}: PaperProps) {
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
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b]";
const labelStyle = "mb-1 block text-xs font-semibold uppercase text-gray-500";

export default function CreateCertificate() {
  const [templates, setTemplates] = usePersistentState<Template[]>('schoolerp:pages_admin_certificates_createcertificate_tsx:templates', []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Next ID: highest number + 1
  function nextId(): string {
    const max = templates.reduce((m, t) => Math.max(m, Number(t.id.slice(1))), 0);
    return "T" + String(max + 1).padStart(3, "0");
  }

  function change<K extends keyof typeof emptyForm>(key: K, value: string) {
    setMessage("");
    setForm({ ...form, [key]: value });
  }

  // When the type changes, fill the default text (only if the body is empty or still a default)
  function changeType(type: string) {
    setMessage("");
    const wasDefault = form.body === "" || Object.values(defaultBodies).includes(form.body);
    setForm({
      ...form,
      type,
      body: wasDefault ? defaultBodies[type] ?? defaultBodies.Other : form.body,
    });
  }

  function handleSave() {
    if (!form.name.trim() || !form.title.trim() || !form.body.trim()) {
      setError("Template name, certificate title and text are required");
      return;
    }

    setError("");

    if (editingId) {
      setTemplates(templates.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
      setMessage("Template updated");
    } else {
      setTemplates([{ id: nextId(), ...form }, ...templates]);
      setMessage("Template saved");
    }

    setEditingId(null);
    setForm(emptyForm);
  }

  function handleEdit(t: Template) {
    setEditingId(t.id);
    setError("");
    setMessage("");
    setForm({
      name: t.name,
      type: t.type,
      title: t.title,
      body: t.body,
      accent: t.accent,
      leftLabel: t.leftLabel,
      rightLabel: t.rightLabel,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this template?")) return;
    setTemplates(templates.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  function handleReset() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Certificate</h1>
        <p className="text-sm text-gray-500">Design a certificate template and reuse it</p>
      </div>

      {/* Designer card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          {editingId ? "Edit Template" : "New Template"}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelStyle}>Template name</label>
            <input
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              placeholder="e.g. Standard Bonafide"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Certificate type</label>
            <select value={form.type} onChange={(e) => changeType(e.target.value)} className={inputStyle}>
              {certTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Heading on certificate</label>
            <input
              value={form.title}
              onChange={(e) => change("title", e.target.value)}
              placeholder="e.g. Bonafide Certificate"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Accent color</label>
            <input
              type="color"
              value={form.accent}
              onChange={(e) => change("accent", e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 p-1"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelStyle}>Certificate text</label>
          <textarea
            value={form.body}
            onChange={(e) => change("body", e.target.value)}
            rows={4}
            placeholder="Write the certificate text. Use the placeholders below."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b]"
          />
          <p className="mt-2 text-xs text-gray-500">
            Placeholders:{" "}
            {PLACEHOLDERS.map((p) => (
              <code key={p} className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-gray-700">
                {p}
              </code>
            ))}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelStyle}>Left signature label</label>
            <input
              value={form.leftLabel}
              onChange={(e) => change("leftLabel", e.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Right signature label</label>
            <input
              value={form.rightLabel}
              onChange={(e) => change("rightLabel", e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            {error && <p className="font-semibold text-red-600">{error}</p>}
            {message && <p className="font-semibold text-green-700">{message}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
            >
              {editingId ? "Update Template" : "Save Template"}
            </button>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Live preview <span className="text-sm font-normal text-gray-500">(sample student: {sample.name})</span>
        </h2>

        <CertificatePaper
          title={form.title || "Certificate Heading"}
          body={fillTemplate(form.body || "Your certificate text will appear here.", sample)}
          date={formatDate(todayIso())}
          accent={form.accent}
          leftLabel={form.leftLabel}
          rightLabel={form.rightLabel}
        />
      </div>

      {/* Saved templates */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-200 p-4 text-base font-semibold text-gray-900">
          Saved Templates ({templates.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
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
              {templates.map((t) => (
                <tr key={t.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{t.id}</td>
                  <td className="px-4 py-3 font-semibold">{t.name}</td>
                  <td className="px-4 py-3">{t.type}</td>
                  <td className="px-4 py-3">{t.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="rounded-lg border border-[#27348b] px-3 py-1 text-xs font-semibold text-[#27348b] hover:bg-[#27348b] hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="rounded-lg border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {templates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No templates yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}