// src/layouts/mainHeader.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Small icons ----------

function ChevronDown({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform ${
        open ? "rotate-180" : ""
      }`}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M2 4l4 4 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      className="h-5 w-5 text-[#7fa8e8]"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
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

function UserIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#27348b]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="12" />
      <circle cx="12" cy="9" r="3.5" fill="white" />
      <path
        d="M5.5 19c1.2-3.2 3.7-4.5 6.5-4.5s5.3 1.3 6.5 4.5"
        fill="white"
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
      {/* Invisible overlay behind dropdown menus */}
      {openMenu !== "" && (
        <div
          className="fixed inset-0 z-[40]"
          onClick={() => setOpenMenu("")}
        />
      )}

      {/* ================= HEADER ================= */}
      <header className="fixed left-0 right-0 top-0 z-[50] h-[72px] border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-full items-center justify-between px-4">
          
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            
            {/* Logo */}
            <div className="flex h-11 w-10 items-center justify-center rounded border border-gray-300">
              <span className="text-center text-[8px] text-gray-500">
                LOGO
              </span>
            </div>

            {/* School Name */}
            <div className="leading-tight">
              <div className="text-[18px] tracking-wide text-[#3a4a3a]">
                YOUR SCHOOL NAME
              </div>

              <div className="text-center text-[11px] tracking-[0.12em] text-[#3a4a3a]">
                YOUR SCHOOL ADDRESS
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            
            {/* Switch Campus */}
            <div className="flex items-center gap-2">
              <label className="text-[13px] font-semibold text-slate-700">
                Switch Campus:
              </label>

              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="h-[30px] w-[160px] rounded-[4px] border border-[#2f4bb3] bg-white px-2 text-[13px] text-slate-700 outline-none"
              >
                <option value="">Select Campus</option>
                <option value="rk-puram">R. K. Puram</option>
                <option value="vasant-vihar">Vasant Vihar</option>
              </select>
            </div>

            {/* APPLICATIONS */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("applications")}
                className="flex items-center gap-1 text-[14px] font-bold text-[#27348b]"
              >
                <GridIcon />

                <span>Applications</span>

                <ChevronDown
                  open={openMenu === "applications"}
                />
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
                className="flex items-center gap-2 text-[14px] font-bold text-[#27348b]"
              >
                <UserIcon />

                <span>Admin</span>

                <ChevronDown
                  open={openMenu === "admin"}
                />
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

                  <button
                    onClick={logout}
                    className={`${itemStyle} text-red-600`}
                  >
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