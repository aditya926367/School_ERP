// src/components/Header.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Small icons (drawn with SVG) ----------

// Small arrow pointing down (it turns upside down when the menu is open)
function ChevronDown({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Grid icon (3 x 3 squares) used before "Applications"
function GridIcon() {
  return (
    <svg className="w-5 h-5 text-[#7fa8e8]" viewBox="0 0 20 20" fill="currentColor">
      <rect x="3" y="3" width="3" height="3" rx="0.5" />
      <rect x="8.5" y="3" width="3" height="3" rx="0.5" />
      <rect x="14" y="3" width="3" height="3" rx="0.5" />
      <rect x="3" y="8.5" width="3" height="3" rx="0.5" />
      <rect x="8.5" y="8.5" width="3" height="3" rx="0.5" />
      <rect x="14" y="8.5" width="3" height="3" rx="0.5" />
      <rect x="3" y="14" width="3" height="3" rx="0.5" />
      <rect x="8.5" y="14" width="3" height="3" rx="0.5" />
      <rect x="14" y="14" width="3" height="3" rx="0.5" />
    </svg>
  );
}

// Round user icon used before "Admin"
function UserIcon() {
  return (
    <svg className="w-6 h-6 text-[#27348b]" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="12" />
      <circle cx="12" cy="9" r="3.5" fill="white" />
      <path d="M5.5 19c1.2-3.2 3.7-4.5 6.5-4.5s5.3 1.3 6.5 4.5" fill="white" />
    </svg>
  );
}


// ---------- Random options (change these later) ----------
const applicationList = [
  "Student Management",
  "Fee Management",
  "Attendance",
  "Exam & Results",
  "Transport",
  "Library",
];

const adminList = ["My Profile", "Change Password", "Settings"];

// ---------- Header ----------
export default function Header() {
  const navigate = useNavigate(); // used to go to another page

  // the campus chosen in the dropdown
  const [campus, setCampus] = useState("");

  // which menu is open right now: "" (none), "applications" or "admin"
  const [openMenu, setOpenMenu] = useState("");

  // Click on a menu button: open it, or close it if it is already open
  function toggleMenu(name: string) {
    if (openMenu === name) {
      setOpenMenu("");
    } else {
      setOpenMenu(name);
    }
  }

  // Click on an option inside a menu
  function selectOption(option: string) {
    console.log("Clicked:", option); // later: go to that page here
    setOpenMenu(""); // close the menu
  }

  // Click on Logout
  function logout() {
    setOpenMenu("");
    navigate("/"); // go to the Login page
  }

  // Style shared by every option in the menus
  const itemStyle =
    "block w-full px-4 py-2 text-left text-[13px] text-slate-700 hover:bg-[#f4f7fe] hover:text-[#27348b]";

  return (
    <div>
      {/* Invisible screen behind the menus: clicking outside closes the menu */}
      {openMenu !== "" && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu("")} />
      )}

      {/* ===== TOP WHITE BAR ===== */}
      <div className="flex items-center justify-between bg-white px-4 py-2">
        {/* LEFT: logo + school name */}
        <div className="flex items-center gap-2">
          {/* Logo placeholder: replace with <img src="/logo.png" /> later */}
          <div className="w-10 h-11 border border-gray-300 rounded flex items-center justify-center">
            <span className="text-[8px] text-gray-500 text-center">LOGO</span>
          </div>

          <div className="leading-tight">
            <div className="text-[18px] tracking-wide text-[#3a4a3a]">
              YOUR SCHOOL NAME
            </div>
            <div className="text-[11px] tracking-[0.12em] text-[#3a4a3a] text-center">
              YOUR SCHOOL ADDRESS
            </div>
          </div>
        </div>

        {/* RIGHT: campus dropdown, applications, admin */}
        <div className="flex items-center gap-6">
          {/* Switch Campus */}
          <div className="flex items-center gap-2">
            <label className="text-[13px] font-semibold text-slate-700">
              Switch Campus:
            </label>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-[160px] h-[30px] px-2 text-[13px] text-slate-700 bg-white border border-[#2f4bb3] rounded-[4px] outline-none"
            >
              <option value="">Select Campus</option>
              <option value="rk-puram">R. K. Puram</option>
              <option value="vasant-vihar">Vasant Vihar</option>
            </select>
          </div>

          {/* ===== APPLICATIONS (button + menu) ===== */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("applications")}
              className="flex items-center gap-1 text-[14px] font-bold text-[#27348b]"
            >
              <GridIcon />
              <span>Applications</span>
              <ChevronDown open={openMenu === "applications"} />
            </button>

            {/* The menu: shown only when openMenu is "applications" */}
            {openMenu === "applications" && (
              <div className="absolute right-0 top-full mt-2 z-20 w-[200px] rounded-[4px] border border-gray-200 bg-white py-1 shadow-lg">
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

          {/* ===== ADMIN (button + menu) ===== */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("admin")}
              className="flex items-center gap-2 text-[14px] font-bold text-[#27348b]"
            >
              <UserIcon />
              <span>Admin</span>
              <ChevronDown open={openMenu === "admin"} />
            </button>

            {/* The menu: shown only when openMenu is "admin" */}
            {openMenu === "admin" && (
              <div className="absolute right-0 top-full mt-2 z-20 w-[180px] rounded-[4px] border border-gray-200 bg-white py-1 shadow-lg">
                {adminList.map((item) => (
                  <button
                    key={item}
                    onClick={() => selectOption(item)}
                    className={itemStyle}
                  >
                    {item}
                  </button>
                ))}

                {/* A thin line, then Logout */}
                <div className="my-1 border-t border-gray-200" />
                <button onClick={logout} className={`${itemStyle} text-red-600`}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
}