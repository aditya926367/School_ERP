// src/pages/common/changePassword.tsx
import { useState } from "react";
import { getCurrentUser } from "../../utils/currentUser";

const labelStyle =
  "mb-2 block text-[13px] font-semibold uppercase tracking-wide text-gray-500";

const inputStyle =
  "h-[46px] w-full rounded-xl border border-gray-300 bg-white px-4 pr-16 text-[15px] text-gray-900 outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/15";

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className={labelStyle}>{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#27348b]"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  // Shows whose password is being changed
  const user = getCurrentUser();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Simple rules, adjust to match your backend
  const rules = [
    { text: "At least 8 characters", ok: next.length >= 8 },
    { text: "One uppercase letter", ok: /[A-Z]/.test(next) },
    { text: "One number", ok: /\d/.test(next) },
  ];

  function submit() {
    setSuccess(false);

    if (!current || !next || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (rules.some((r) => !r.ok)) {
      setError("New password does not meet the requirements.");
      return;
    }
    if (next !== confirm) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (next === current) {
      setError("New password must be different from the current one.");
      return;
    }

    // TODO: call your API here (e.g. POST /api/change-password)
    setError("");
    setSuccess(true);
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-[32px] font-bold leading-tight text-gray-900">
        Change Password
      </h1>
      <p className="mb-6 mt-1 text-[17px] text-gray-500">
        Keep your account secure with a strong password
      </p>

      {/* Whose account this is */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#27348b] text-[15px] font-bold text-white">
          {user.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[16px] font-semibold text-gray-900">
            {user.name}
          </div>
          <div className="truncate text-[14px] text-gray-500">
            {user.title} · {user.email}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-[20px] font-bold text-gray-900">Update Password</h2>

        <div className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-[14px] font-medium text-green-700">
              Password changed successfully.
            </div>
          )}

          <PasswordField
            label="Current Password"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />
          <PasswordField
            label="New Password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
          />

          {/* Rules shown as small pills, like the working-day buttons */}
          <div className="flex flex-wrap gap-2">
            {rules.map((r) => (
              <span
                key={r.text}
                className={`rounded-full px-3 py-1 text-[13px] font-medium ${
                  r.ok
                    ? "bg-[#27348b] text-white"
                    : "border border-gray-200 bg-white text-gray-500"
                }`}
              >
                {r.text}
              </span>
            ))}
          </div>

          <PasswordField
            label="Confirm New Password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />

          <button
            onClick={submit}
            className="h-[46px] w-full rounded-xl bg-[#27348b] text-[15px] font-semibold text-white hover:bg-[#1f2a73]"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}