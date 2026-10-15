// src/pages/common/settings.tsx
import { useState } from "react";
import {
  getCurrentUser,
  loadSaved,
  saveValue,
  type UserRole,
} from "../../utils/currentUser";

type NotificationOption = {
  key: string;
  title: string;
  description: string;
  on: boolean; // default value
};

// Notification options that make sense for each role
const notificationsByRole: Record<UserRole, NotificationOption[]> = {
  admin: [
    { key: "email", title: "Email alerts", description: "Receive important updates by email", on: true },
    { key: "sms", title: "SMS alerts", description: "Receive important updates by text message", on: false },
    { key: "fees", title: "Fee reminders", description: "Get notified about pending and overdue fees", on: true },
    { key: "attendance", title: "Attendance alerts", description: "Get notified when attendance is not marked", on: true },
  ],
  teacher: [
    { key: "email", title: "Email alerts", description: "Receive important updates by email", on: true },
    { key: "attendance", title: "Attendance reminders", description: "Remind me to mark attendance for my classes", on: true },
    { key: "homework", title: "Homework submissions", description: "Get notified when students submit homework", on: true },
    { key: "timetable", title: "Timetable changes", description: "Get notified when my timetable changes", on: true },
  ],
  student: [
    { key: "email", title: "Email alerts", description: "Receive important updates by email", on: true },
    { key: "homework", title: "Homework reminders", description: "Get reminded before homework is due", on: true },
    { key: "results", title: "Results published", description: "Get notified when new results are out", on: true },
    { key: "notices", title: "School notices", description: "Get notified about announcements", on: true },
  ],
  parent: [
    { key: "email", title: "Email alerts", description: "Receive important updates by email", on: true },
    { key: "sms", title: "SMS alerts", description: "Receive important updates by text message", on: true },
    { key: "fees", title: "Fee due reminders", description: "Get reminded before the fee due date", on: true },
    { key: "attendance", title: "Child absent alerts", description: "Get notified if my child is marked absent", on: true },
  ],
  library: [
    { key: "email", title: "Email alerts", description: "Receive important updates by email", on: true },
    { key: "overdue", title: "Overdue books", description: "Get notified when books are overdue", on: true },
    { key: "stock", title: "Stock verification due", description: "Remind me when stock verification is due", on: true },
    { key: "requests", title: "New book requests", description: "Get notified about new book requests", on: false },
  ],
  certificate: [
    { key: "email", title: "Email alerts", description: "Receive important updates by email", on: true },
    { key: "requests", title: "New certificate requests", description: "Get notified when a certificate is requested", on: true },
    { key: "approvals", title: "Pending approvals", description: "Remind me about certificates waiting for approval", on: true },
  ],
};

type SettingsState = {
  language: string;
  dateFormat: string;
  timezone: string;
  notifications: Record<string, boolean>;
  twoFactor: boolean;
  sessionTimeout: string;
};

const labelStyle =
  "mb-2 block text-[13px] font-semibold uppercase tracking-wide text-gray-500";

const selectStyle =
  "h-[46px] w-full rounded-xl border border-gray-300 bg-white px-4 text-[15px] text-gray-900 outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/15";

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-[20px] font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-1 text-[15px] text-gray-500">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectStyle}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <div className="text-[16px] font-semibold text-gray-900">{title}</div>
        <div className="text-[14px] text-gray-500">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#27348b]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const user = getCurrentUser();
  const options = notificationsByRole[user.role];
  const storageKey = `settings_${user.role}`;

  // Defaults for this role, then anything the user saved earlier
  const defaults: SettingsState = {
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timezone: "Asia/Kolkata",
    notifications: Object.fromEntries(options.map((o) => [o.key, o.on])),
    twoFactor: false,
    sessionTimeout: "30",
  };
  const start = loadSaved<SettingsState>(storageKey, defaults);
  // keep only the notification keys that exist for this role
  start.notifications = { ...defaults.notifications, ...start.notifications };

  const [saved, setSaved] = useState<SettingsState>(start);
  const [form, setForm] = useState<SettingsState>(start);
  const [showSaved, setShowSaved] = useState(false);

  function set<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setForm({ ...form, [key]: value });
  }

  function setNotification(key: string, value: boolean) {
    setForm({ ...form, notifications: { ...form.notifications, [key]: value } });
  }

  const changed = JSON.stringify(form) !== JSON.stringify(saved);

  function save() {
    // TODO: call your API here (e.g. PUT /api/settings)
    saveValue(storageKey, form);
    setSaved(form);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  }

  function reset() {
    setForm(saved);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-[32px] font-bold leading-tight text-gray-900">Settings</h1>
      <p className="mb-6 mt-1 text-[17px] text-gray-500">
        Preferences, notifications and security for {user.title}
      </p>

      {showSaved && (
        <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-[14px] font-medium text-green-700">
          Settings saved successfully.
        </div>
      )}

      <Card title="Preferences" subtitle="Language, date format and time zone">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectField
            label="Language"
            value={form.language}
            onChange={(v) => set("language", v)}
            options={[
              { value: "en", label: "English" },
              { value: "hi", label: "Hindi" },
            ]}
          />
          <SelectField
            label="Date Format"
            value={form.dateFormat}
            onChange={(v) => set("dateFormat", v)}
            options={[
              { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
              { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
              { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
            ]}
          />
          <div className="sm:col-span-2">
            <SelectField
              label="Time Zone"
              value={form.timezone}
              onChange={(v) => set("timezone", v)}
              options={[
                { value: "Asia/Kolkata", label: "India (GMT+5:30)" },
                { value: "Asia/Dubai", label: "Dubai (GMT+4:00)" },
                { value: "UTC", label: "UTC (GMT+0:00)" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* These rows change with the role */}
      <Card title="Notifications" subtitle="Choose what you want to be alerted about">
        {options.map((o) => (
          <ToggleRow
            key={o.key}
            title={o.title}
            description={o.description}
            checked={!!form.notifications[o.key]}
            onChange={(v) => setNotification(o.key, v)}
          />
        ))}
      </Card>

      <Card title="Security" subtitle="Protect your account">
        <ToggleRow
          title="Two-factor authentication"
          description="Ask for a verification code when you sign in"
          checked={form.twoFactor}
          onChange={(v) => set("twoFactor", v)}
        />
        <div className="mt-5 sm:w-1/2">
          <SelectField
            label="Auto logout after"
            value={form.sessionTimeout}
            onChange={(v) => set("sessionTimeout", v)}
            options={[
              { value: "15", label: "15 minutes" },
              { value: "30", label: "30 minutes" },
              { value: "60", label: "1 hour" },
              { value: "120", label: "2 hours" },
            ]}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <button
          onClick={reset}
          disabled={!changed}
          className="h-[44px] rounded-xl border border-gray-300 bg-white px-6 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={save}
          disabled={!changed}
          className="h-[44px] rounded-xl bg-[#27348b] px-6 text-[15px] font-semibold text-white hover:bg-[#1f2a73] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}