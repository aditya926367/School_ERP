// src/layouts/mainHeader.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  // Opens the sidebar on small screens. Optional, so the header also works on its own.
  onMenuClick?: () => void;
};

// ---------- Small icons ----------

function MenuIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ChevronDown({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      className="h-[22px] w-[22px] shrink-0 text-[#8fb4ea]"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <rect x="2" y="2" width="18" height="18" rx="3" />
      {[6, 11, 16].map((x) =>
        [6, 11, 16].map((y) => (
          <rect
            key={`${x}-${y}`}
            x={x - 1.2}
            y={y - 1.2}
            width="2.4"
            height="2.4"
            rx="0.4"
            fill="currentColor"
            stroke="none"
          />
        ))
      )}
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-[24px] w-[24px] shrink-0 text-[#2a2a63]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="10.5" />
      <circle cx="12" cy="9.5" r="3.6" fill="currentColor" stroke="none" />
      <path
        d="M5.2 18.6c1.4-2.6 3.8-3.9 6.8-3.9s5.4 1.3 6.8 3.9"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

// ---------- Campus dropdown (used in two places, so it is a small component) ----------

function CampusSelect({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-[34px] rounded-[5px] border border-[#2f4bb3] bg-white px-3 text-[14px] text-[#2a2a63] outline-none ${className}`}
    >
      <option value="">Select Campus</option>
      <option value="main">Main Campus</option>
      <option value="second">Second Campus</option>
    </select>
  );
}

// ---------- Role based menu (RBAC) ----------
// Each role only sees the applications listed for it.
const roleBasedApps: Record<string, string[]> = {
  admin: [
    "Student Management",
    "Fee Management",
    "Attendance",
    "Exam & Results",
    "Transport",
    "Library",
  ],
  teacher: ["Student Management", "Attendance", "Exam & Results"],
  library: ["Library", "Student Management"],
  student: ["Attendance", "Exam & Results", "Library"],
  parent: ["Fee Management", "Attendance", "Exam & Results"],
};

// Reads the role saved at login. Supports both ways your app stores it.
function getUserRole(): string {
  try {
    const user = JSON.parse(localStorage.getItem("logged_in_user") || "{}");
    if (user.role) return user.role;
  } catch {
    // ignore broken JSON and fall through
  }
  return localStorage.getItem("role") || "admin";
}

const adminList = ["My Profile", "Change Password", "Settings"];

// ---------- Header ----------

export default function MainHeader({ onMenuClick }: Props) {
  const navigate = useNavigate();

  const userRole = getUserRole();

  // Applications menu is built from the user's role. Unknown role falls back to admin.
  const applicationList = roleBasedApps[userRole] || roleBasedApps.admin;

  // Label next to the user icon: "Admin", "Teacher", "Library" ...
  const roleLabel = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  const [campus, setCampus] = useState("");
  const [openMenu, setOpenMenu] = useState("");

  function toggleMenu(name: string) {
    setOpenMenu(openMenu === name ? "" : name);
  }

  function selectOption(option: string) {
    setOpenMenu("");

    if (option === "My Profile") {
      navigate("/myProfile");
    } else if (option === "Change Password") {
      navigate("/myProChangePassword");
    } else if (option === "Settings") {
      navigate("/settings");
    }
  }

  function logout() {
    setOpenMenu("");
    localStorage.removeItem("logged_in_user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  }

  const itemStyle =
    "block w-full px-4 py-2 text-left text-[13px] text-slate-700 hover:bg-[#f4f7fe] hover:text-[#27348b]";

  return (
    <>
      {/* Invisible screen behind the menus: clicking outside closes the menu */}
      {openMenu !== "" && (
        <div className="fixed inset-0 z-[40]" onClick={() => setOpenMenu("")} />
      )}

      {/* ================= HEADER ================= */}
      {/* Fixed at the top. DashboardLayout keeps its sidebar and content below this 72px. */}
      <header className="fixed left-0 right-0 top-0 z-[50] h-[72px] border-b border-gray-200 bg-white">
        <div className="flex h-full items-center justify-between gap-2 px-3 sm:px-5 lg:pr-8">
          {/* LEFT SIDE */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* Hamburger: opens the sidebar, visible only below the lg breakpoint */}
            <button
              onClick={onMenuClick}
              className="shrink-0 rounded-lg p-2 text-[#2a2a63] hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>

            {/* Logo (later: replace with <img src="/logo.png" />) */}
            <div className="flex h-[40px] w-[32px] shrink-0 items-center justify-center rounded border border-gray-300 sm:h-[44px] sm:w-[34px]">
              <span className="text-[8px] text-gray-500">LOGO</span>
            </div>

            {/* School name: one line on mobile, address hidden on mobile */}
            <div className="min-w-0 leading-[1.1] text-[#3d5a3d]">
              <div className="truncate text-[14px] tracking-wide sm:text-[18px]">
                YOUR SCHOOL NAME
              </div>
              <div className="hidden truncate text-center text-[11px] tracking-[0.1em] sm:block">
                YOUR SCHOOL ADDRESS
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3 lg:gap-5">
            {/* Switch Campus: shown in the header on lg screens and bigger */}
            <div className="hidden items-center gap-2 lg:flex">
              <label className="text-[14px] text-[#2a2a63]">Switch Campus:</label>
              <CampusSelect
                value={campus}
                onChange={setCampus}
                className="w-[180px] xl:w-[200px]"
              />
            </div>

            {/* APPLICATIONS */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("applications")}
                className="flex items-center gap-2 rounded-lg p-2 text-[15px] font-bold text-[#2a2a63] hover:bg-gray-50"
                aria-label="Applications"
              >
                <GridIcon />
                {/* Text only from the md breakpoint, icon only on mobile */}
                <span className="hidden md:inline">Applications</span>
                <ChevronDown open={openMenu === "applications"} />
              </button>

              {openMenu === "applications" && (
                <div className="absolute right-0 top-full z-[60] mt-2 w-[200px] rounded-[4px] border border-gray-200 bg-white py-1 shadow-lg">
                  {applicationList.map((item) => (
                    <button
                      key={item}
                      onClick={() => selectOption(item)}
                      className={itemStyle}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ADMIN */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("admin")}
                className="flex items-center gap-2 rounded-lg p-2 text-[15px] font-bold text-[#2a2a63] hover:bg-gray-50"
                aria-label={`${roleLabel} menu`}
              >
                <UserIcon />
                <span className="hidden sm:inline">{roleLabel}</span>
                <ChevronDown open={openMenu === "admin"} />
              </button>

              {openMenu === "admin" && (
                <div className="absolute right-0 top-full z-[60] mt-2 w-[220px] rounded-[4px] border border-gray-200 bg-white py-1 shadow-lg">
                  {/* Campus switcher inside this menu: only on screens smaller than lg */}
                  <div className="border-b border-gray-200 px-4 py-2 lg:hidden">
                    <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">
                      Campus
                    </label>
                    <CampusSelect value={campus} onChange={setCampus} className="w-full" />
                  </div>

                  {adminList.map((item) => (
                    <button
                      key={item}
                      onClick={() => selectOption(item)}
                      className={itemStyle}
                    >
                      {item}
                    </button>
                  ))}

                  <div className="my-1 border-t border-gray-200" />

                  <button onClick={logout} className={`${itemStyle} text-red-600`}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}