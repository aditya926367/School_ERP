// src/layouts/mainHeader.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Small icons ----------

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
      className="h-[22px] w-[22px] text-[#8fb4ea]"
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
      className="h-[24px] w-[24px] text-[#2a2a63]"
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

// ---------- Menu options ----------

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

export default function MainHeader() {
  const navigate = useNavigate();

  const [campus, setCampus] = useState("");
  const [openMenu, setOpenMenu] = useState("");

  function toggleMenu(name: string) {
    setOpenMenu(openMenu === name ? "" : name);
  }

  function selectOption(option: string) {
    console.log("Clicked:", option);
    setOpenMenu("");
  }

  function logout() {
    setOpenMenu("");
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
      {/* NOTE: "fixed" hata diya. Layout khud header ko upar rakhta hai. */}
      <header className="relative z-[50] h-[52px] shrink-0 border-b border-gray-200 bg-white">
        <div className="flex h-full items-center justify-between pl-5 pr-8">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-2">
            {/* Logo (baad mein <img src="/logo.png" /> laga dena) */}
            <div className="flex h-[44px] w-[34px] items-center justify-center rounded border border-gray-300">
              <span className="text-[8px] text-gray-500">LOGO</span>
            </div>

            {/* School Name */}
            <div className="leading-[1.1] text-[#3d5a3d]">
              <div className="text-[18px] tracking-wide">YOUR SCHOOL DRESS</div>
              <div className="text-center text-[11px] tracking-[0.1em]">
                YOUR SCHOOL DRESS 
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">
            {/* Switch Campus */}
            <div className="flex items-center gap-2">
              <label className="text-[14px] text-[#2a2a63]">Switch Campus:</label>

              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="h-[34px] w-[200px] rounded-[5px] border border-[#2f4bb3] bg-white px-3 text-[14px] text-[#2a2a63] outline-none"
              >
                <option value="">Select Campus</option>
                <option value="rk-puram">YOUR SCHOOL ADDRESS</option>
                <option value="vasant-vihar">YOUR SCHOOL ADDRESS</option>
              </select>
            </div>

            {/* APPLICATIONS */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("applications")}
                className="flex items-center gap-2 text-[15px] font-bold text-[#2a2a63]"
              >
                <GridIcon />
                <span>Applications</span>
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
                className="flex items-center gap-2 text-[15px] font-bold text-[#2a2a63]"
              >
                <UserIcon />
                <span>Admin</span>
                <ChevronDown open={openMenu === "admin"} />
              </button>

              {openMenu === "admin" && (
                <div className="absolute right-0 top-full z-[60] mt-2 w-[180px] rounded-[4px] border border-gray-200 bg-white py-1 shadow-lg">
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