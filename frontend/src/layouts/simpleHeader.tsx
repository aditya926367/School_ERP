// src/components/SimpleHeader.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Small icons (drawn with SVG) ----------

// Small arrow pointing down
function ChevronDown() {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Round user icon (used until we have a real profile photo)
function UserIcon() {
  return (
    <svg className="w-6 h-6 text-[#27348b]" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="12" />
      <circle cx="12" cy="9" r="3.5" fill="white" />
      <path d="M5.5 19c1.2-3.2 3.7-4.5 6.5-4.5s5.3 1.3 6.5 4.5" fill="white" />
    </svg>
  );
}

// ---------- Header ----------
export default function SimpleHeader() {
  const navigate = useNavigate(); // used to go to another page

  // true = menu is open, false = menu is closed
  const [menuOpen, setMenuOpen] = useState(false);

  // Click on the profile button: open or close the menu
  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  // Click on an option inside the menu
  function selectOption(option: string) {
    console.log("Clicked:", option); // later: go to that page here
    setMenuOpen(false);
  }

  // Click on Logout
  function logout() {
    setMenuOpen(false);
    navigate("/"); // go to the Login page
  }

  // Style shared by every option in the menu
  const itemStyle =
    "block w-full px-4 py-2 text-left text-[13px] text-slate-700 hover:bg-[#f4f7fe] hover:text-[#27348b]";

  return (
    <div>
      {/* Invisible screen behind the menu: clicking outside closes the menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
      )}

      {/* ===== WHITE BAR WITH A THIN LINE AT THE BOTTOM ===== */}
      <div className="flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200">
        {/* LEFT: logo + school name */}
        <div className="flex items-center gap-2">
          {/* Logo placeholder: replace with <img src="/logo.png" /> later */}
          <div className="w-7 h-8 border border-gray-300 rounded flex items-center justify-center">
            <span className="text-[6px] text-gray-500 text-center">LOGO</span>
          </div>

          <div className="leading-tight">
            <div className="text-[12px] tracking-wide text-[#3a4a3a]">
              YOUR SCHOOL NAME
            </div>
            <div className="text-[7px] tracking-[0.12em] text-[#3a4a3a] text-center">
              YOUR SCHOOL ADDRESS
            </div>
          </div>
        </div>

        {/* RIGHT: profile photo + arrow (with menu) */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 text-slate-600"
          >
            <UserIcon />
            <ChevronDown />
          </button>

          {/* The menu: shown only when menuOpen is true */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 z-20 w-[170px] rounded-[4px] border border-gray-200 bg-white py-1 shadow-lg">
              <button onClick={() => selectOption("My Profile")} className={itemStyle}>
                My Profile
              </button>
              <button
                onClick={() => selectOption("Change Password")}
                className={itemStyle}
              >
                Change Password
              </button>

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
  );
}