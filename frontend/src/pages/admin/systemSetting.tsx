import { useEffect, useState, type FormEvent } from "react";
import {
  Settings2,
  School,
  CalendarDays,
  Bell,
  ShieldCheck,
  Hash,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

type SettingsTab = "general" | "academic" | "notifications" | "formats" | "security";

type AdminSettingsForm = {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  address: string;
  timezone: string;
  dateFormat: string;
  currentAcademicYear: string;
  termStart: string;
  termEnd: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  admissionPrefix: string;
  receiptPrefix: string;
  studentIdPrefix: string;
  sessionTimeout: string;
  requireStrongPasswords: boolean;
  twoFactorForAdmins: boolean;
};

const STORAGE_KEY = "schoolerp:admin:settings:v1";

const defaultSettings: AdminSettingsForm = {
  schoolName: "My School",
  schoolEmail: "admin@school.edu",
  schoolPhone: "",
  address: "",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  currentAcademicYear: "2026-2027",
  termStart: "2026-04-01",
  termEnd: "2027-03-31",
  emailNotifications: true,
  smsNotifications: false,
  whatsappNotifications: false,
  admissionPrefix: "ADM",
  receiptPrefix: "REC",
  studentIdPrefix: "STU",
  sessionTimeout: "30",
  requireStrongPasswords: true,
  twoFactorForAdmins: false,
};

const tabs: { id: SettingsTab; label: string; icon: typeof Settings2 }[] = [
  { id: "general", label: "General", icon: School },
  { id: "academic", label: "Academic", icon: CalendarDays },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "formats", label: "ID & Receipt Formats", icon: Hash },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10";
const labelClass = "block text-sm font-medium text-gray-700";

function loadSettings(): AdminSettingsForm {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...(JSON.parse(saved) as Partial<AdminSettingsForm>) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [form, setForm] = useState<AdminSettingsForm>(loadSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [saved]);

  function update<K extends keyof AdminSettingsForm>(key: K, value: AdminSettingsForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSaved(true);
    } catch {
      window.alert("Unable to save settings in this browser. Please check your browser storage.");
    }
  }

  function resetSettings() {
    if (!window.confirm("Reset all settings to their default values?")) return;
    setForm(defaultSettings);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  }

  const toggle = (key: "emailNotifications" | "smsNotifications" | "whatsappNotifications" | "requireStrongPasswords" | "twoFactorForAdmins", title: string, description: string) => (
    <label key={key} className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-gray-200 p-4">
      <span>
        <span className="block text-sm font-semibold text-gray-800">{title}</span>
        <span className="mt-1 block text-sm text-gray-500">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={form[key]}
        onChange={(event) => update(key, event.target.checked)}
        className="mt-1 h-4 w-4 accent-[#27348b]"
      />
    </label>
  );

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        title="Admin Settings"
        description="Manage school information, academic settings, notifications and system preferences"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-[#27348b]">
                <Settings2 size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">System configuration</h2>
                <p className="text-sm text-gray-500">Settings are stored in this browser for this demo.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={resetSettings} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                <RotateCcw size={16} /> Reset
              </button>
              <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2a73]">
                <Save size={16} /> Save settings
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 px-4 pt-3 sm:px-5">
            <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Settings sections">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${activeTab === id ? "border-[#27348b] text-[#27348b]" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            {activeTab === "general" && (
              <>
                <div>
                  <h3 className="font-semibold text-gray-900">School profile</h3>
                  <p className="mt-1 text-sm text-gray-500">Basic information used across the school ERP.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>School name<input required maxLength={150} value={form.schoolName} onChange={(e) => update("schoolName", e.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>School email<input type="email" value={form.schoolEmail} onChange={(e) => update("schoolEmail", e.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Contact number<input type="tel" maxLength={25} value={form.schoolPhone} onChange={(e) => update("schoolPhone", e.target.value)} className={inputClass} placeholder="Enter school phone number" /></label>
                  <label className={labelClass}>Timezone<select value={form.timezone} onChange={(e) => update("timezone", e.target.value)} className={inputClass}><option value="Asia/Kolkata">India (Asia/Kolkata)</option><option value="UTC">UTC</option><option value="Asia/Dubai">Dubai (Asia/Dubai)</option><option value="Europe/London">London (Europe/London)</option></select></label>
                  <label className={`${labelClass} sm:col-span-2`}>School address<textarea rows={3} maxLength={500} value={form.address} onChange={(e) => update("address", e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10" placeholder="Enter full school address" /></label>
                  <label className={labelClass}>Date format<select value={form.dateFormat} onChange={(e) => update("dateFormat", e.target.value)} className={inputClass}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></label>
                </div>
              </>
            )}

            {activeTab === "academic" && (
              <>
                <div><h3 className="font-semibold text-gray-900">Academic year</h3><p className="mt-1 text-sm text-gray-500">Set the active school year and its date range.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>Current academic year<input required value={form.currentAcademicYear} onChange={(e) => update("currentAcademicYear", e.target.value)} className={inputClass} placeholder="2026-2027" /></label>
                  <div />
                  <label className={labelClass}>Academic year start<input type="date" value={form.termStart} onChange={(e) => update("termStart", e.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Academic year end<input type="date" value={form.termEnd} min={form.termStart || undefined} onChange={(e) => update("termEnd", e.target.value)} className={inputClass} /></label>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <div><h3 className="font-semibold text-gray-900">Notification channels</h3><p className="mt-1 text-sm text-gray-500">Choose which channels the school intends to use.</p></div>
                <div className="space-y-3">
                  {toggle("emailNotifications", "Email notifications", "Send school updates and alerts by email.")}
                  {toggle("smsNotifications", "SMS notifications", "Send attendance, fee and urgent alerts by SMS. An SMS provider must be configured.")}
                  {toggle("whatsappNotifications", "WhatsApp notifications", "Send updates through an approved WhatsApp provider.")}
                </div>
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Enabling a channel here records the preference only. Actual delivery requires backend integration and provider credentials.</p>
              </>
            )}

            {activeTab === "formats" && (
              <>
                <div><h3 className="font-semibold text-gray-900">Numbering formats</h3><p className="mt-1 text-sm text-gray-500">Configure prefixes for IDs and receipts generated by the system.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>Admission number prefix<input required maxLength={12} pattern="[A-Za-z0-9-]+" value={form.admissionPrefix} onChange={(e) => update("admissionPrefix", e.target.value.toUpperCase())} className={inputClass} /><span className="mt-1 block text-xs font-normal text-gray-500">Example: {form.admissionPrefix || "ADM"}-0001</span></label>
                  <label className={labelClass}>Fee receipt prefix<input required maxLength={12} pattern="[A-Za-z0-9-]+" value={form.receiptPrefix} onChange={(e) => update("receiptPrefix", e.target.value.toUpperCase())} className={inputClass} /><span className="mt-1 block text-xs font-normal text-gray-500">Example: {form.receiptPrefix || "REC"}-0001</span></label>
                  <label className={labelClass}>Student ID prefix<input required maxLength={12} pattern="[A-Za-z0-9-]+" value={form.studentIdPrefix} onChange={(e) => update("studentIdPrefix", e.target.value.toUpperCase())} className={inputClass} /><span className="mt-1 block text-xs font-normal text-gray-500">Example: {form.studentIdPrefix || "STU"}-0001</span></label>
                </div>
              </>
            )}

            {activeTab === "security" && (
              <>
                <div><h3 className="font-semibold text-gray-900">Security preferences</h3><p className="mt-1 text-sm text-gray-500">Set basic account and session preferences.</p></div>
                <label className={labelClass}>Session timeout<select value={form.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)} className={inputClass}><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="120">2 hours</option></select></label>
                <div className="space-y-3">
                  {toggle("requireStrongPasswords", "Require strong passwords", "Recommend strong passwords for school accounts. Enforce this in the backend authentication logic.")}
                  {toggle("twoFactorForAdmins", "Two-factor authentication for admins", "Enable this only after an authentication provider is implemented.")}
                </div>
                <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">These controls save preferences in the browser; security policies must also be enforced by your backend.</p>
              </>
            )}
          </div>

          {saved && (
            <div role="status" className="flex items-center gap-2 border-t border-green-200 bg-green-50 px-5 py-3 text-sm font-medium text-green-800">
              <CheckCircle2 size={17} /> Settings saved successfully.
            </div>
          )}
        </section>
      </form>
    </div>
  );
}
