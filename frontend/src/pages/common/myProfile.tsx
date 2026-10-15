// src/pages/common/myProfile.tsx
import { useState } from "react";
import { getCurrentUser, loadSaved, saveValue } from "../../utils/currentUser";

type Profile = {
  name: string;
  email: string;
  phone: string;
};

const labelStyle =
  "mb-2 block text-[13px] font-semibold uppercase tracking-wide text-gray-500";

const inputStyle =
  "h-[46px] w-full rounded-xl border border-gray-300 bg-white px-4 text-[15px] text-gray-900 outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/15 disabled:bg-gray-50 disabled:text-gray-500";

const primaryBtn =
  "h-[44px] rounded-xl bg-[#27348b] px-6 text-[15px] font-semibold text-white hover:bg-[#1f2a73]";

const secondaryBtn =
  "h-[44px] rounded-xl border border-gray-300 bg-white px-6 text-[15px] font-semibold text-gray-700 hover:bg-gray-50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function MyProfile() {
  // Who is logged in (role decides name, title and the extra detail)
  const user = getCurrentUser();
  const storageKey = `profile_${user.role}`;

  const startProfile: Profile = loadSaved<Profile>(storageKey, {
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const [profile, setProfile] = useState<Profile>(startProfile);
  const [draft, setDraft] = useState<Profile>(startProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: keyof Profile, value: string) {
    setDraft({ ...draft, [key]: value });
  }

  function save() {
    // TODO: call your API here (e.g. PUT /api/profile)
    saveValue(storageKey, draft);
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function cancel() {
    setDraft(profile);
    setEditing(false);
  }

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-3xl">
      <h1 className="text-[32px] font-bold leading-tight text-gray-900">My Profile</h1>
      <p className="mb-6 mt-1 text-[17px] text-gray-500">
        View and update your personal details
      </p>

      {saved && (
        <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-[14px] font-medium text-green-700">
          Profile updated successfully.
        </div>
      )}

      {/* Card: identity */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#27348b] text-[22px] font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[20px] font-bold text-gray-900">
            {profile.name}
          </div>
          <div className="text-[15px] text-gray-500">{user.title}</div>
        </div>
      </div>

      {/* Card: details */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-[20px] font-bold text-gray-900">Personal Details</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full Name">
            <input
              className={inputStyle}
              value={draft.name}
              disabled={!editing}
              onChange={(e) => update("name", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputStyle}
              value={draft.email}
              disabled={!editing}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputStyle}
              value={draft.phone}
              disabled={!editing}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Role">
            <input className={inputStyle} value={user.title} disabled />
          </Field>
          <Field label="Campus">
            <input className={inputStyle} value={user.campus} disabled />
          </Field>
          <Field label={user.extraLabel}>
            <input className={inputStyle} value={user.extraValue} disabled />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {editing ? (
            <>
              <button onClick={cancel} className={secondaryBtn}>
                Cancel
              </button>
              <button onClick={save} className={primaryBtn}>
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className={primaryBtn}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}