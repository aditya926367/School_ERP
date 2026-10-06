import { useState } from "react";
import type { FormEvent } from "react";


const NAVY = "#27348b";

/* ---------- Left side illustration (inline SVG, replace with your own image if you have one) ---------- */
function Illustration() {
  return (
    <svg viewBox="0 0 300 220" className="w-[88%] h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* soft blob */}
      <path
        d="M20 120c0-45 35-80 85-84 40-3 60-22 100-14 45 9 80 45 75 90-5 45-45 75-100 78-60 3-160 5-160-70z"
        fill="#dfe8f6"
      />
      {/* browser window */}
      <rect x="22" y="40" width="130" height="95" rx="5" fill="#fff" />
      <rect x="22" y="40" width="130" height="14" rx="5" fill="#5b9bf0" />
      <circle cx="31" cy="47" r="2" fill="#fff" />
      <circle cx="38" cy="47" r="2" fill="#fff" />
      <circle cx="45" cy="47" r="2" fill="#fff" />
      <rect x="30" y="62" width="34" height="34" rx="2" fill="#dce7fa" />
      <text x="40" y="87" fontSize="22" fontWeight="700" fill="#8fb3ee" fontFamily="sans-serif">A</text>
      <rect x="72" y="64" width="64" height="4" rx="2" fill="#e5ecf8" />
      <rect x="72" y="73" width="50" height="4" rx="2" fill="#e5ecf8" />
      <rect x="30" y="102" width="26" height="8" fill="#f08a3c" />
      <rect x="30" y="111" width="26" height="8" fill="#6c4fd1" />
      <rect x="30" y="120" width="26" height="8" fill="#f08a3c" />
      <rect x="62" y="104" width="24" height="3" rx="1.5" fill="#f0a35e" />
      <rect x="62" y="113" width="24" height="3" rx="1.5" fill="#f0a35e" />

      {/* graduation cap */}
      <polygon points="150,18 205,32 150,48 112,34" fill="#243a73" />
      <polygon points="128,38 128,52 150,60 172,52 172,40 150,47" fill="#2c4a8e" />
      <line x1="198" y1="34" x2="198" y2="58" stroke="#f0a35e" strokeWidth="1.5" />
      <circle cx="198" cy="60" r="2.5" fill="#f0a35e" />

      {/* book stack */}
      <rect x="95" y="150" width="130" height="14" rx="3" fill="#f6a64e" />
      <rect x="85" y="164" width="150" height="14" rx="3" fill="#6fa8ef" />
      <rect x="105" y="136" width="110" height="14" rx="3" fill="#5a7fd6" />
      <rect x="75" y="178" width="155" height="12" rx="3" fill="#f0883e" />
      <rect x="62" y="190" width="45" height="8" rx="2" fill="#d45b4a" />

      {/* person left (sitting) */}
      <circle cx="50" cy="150" r="9" fill="#f2c9a5" />
      <path d="M40 148c0-10 8-14 15-11 5 3 4 12 2 18-6-2-13-1-17-7z" fill="#2b2d4a" />
      <rect x="42" y="159" width="18" height="26" rx="6" fill="#f06b4a" />
      <rect x="30" y="178" width="38" height="10" rx="5" fill="#2f4a8f" />
      <rect x="28" y="186" width="14" height="6" rx="3" fill="#2b2d4a" />

      {/* person middle (standing) */}
      <circle cx="132" cy="78" r="9" fill="#f2c9a5" />
      <path d="M122 76c0-9 8-13 14-10 6 3 5 11 3 16-6-1-13-1-17-6z" fill="#2b2d4a" />
      <rect x="123" y="87" width="19" height="34" rx="6" fill="#f08a3c" />
      <rect x="125" y="119" width="7" height="30" fill="#2f3b7a" />
      <rect x="134" y="119" width="7" height="30" fill="#2f3b7a" />
      <rect x="112" y="92" width="22" height="14" rx="2" fill="#2f4a8f" />

      {/* person right (laptop) */}
      <circle cx="220" cy="100" r="9" fill="#f2c9a5" />
      <path d="M210 100c-2-10 6-16 14-12 7 4 6 14 2 20-6 1-12-1-16-8z" fill="#2b2d4a" />
      <rect x="211" y="109" width="19" height="26" rx="6" fill="#3a56a8" />
      <rect x="185" y="124" width="26" height="16" rx="2" fill="#fff" />
      <rect x="180" y="138" width="40" height="3" rx="1.5" fill="#d9dfef" />
      <rect x="205" y="132" width="52" height="8" rx="4" fill="#2f4a8f" />
    </svg>
  );
}

/* ---------- School emblem (approximation) ---------- */
function Emblem() {
  return (
    <svg viewBox="0 0 40 46" className="w-9 h-10" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2c10 0 17 3 17 3v16c0 12-8 21-17 24C11 42 3 33 3 21V5s7-3 17-3z" fill="#fff" stroke="#4a6b2f" strokeWidth="2" />
      <circle cx="20" cy="20" r="9" fill="none" stroke="#4a6b2f" strokeWidth="1.5" />
      <path d="M20 11v18M12 20h16M14 14l12 12M26 14L14 26" stroke="#4a6b2f" strokeWidth="1.2" />
      <path d="M8 34c4 3 8 5 12 5s8-2 12-5" fill="none" stroke="#4a6b2f" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- Dotted pattern ---------- */
function Dots({ className = "" }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        backgroundImage: `radial-gradient(${NAVY} 2px, transparent 2.5px)`,
        backgroundSize: "11px 11px",
      }}
    />
  );
}

/* ---------- Page ---------- */
export default function AdminLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("2024");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({ userId, password, year });
//   };
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log({ userId, password, year });
};

  const inputCls =
    "w-full h-[26px] box-content py-[5px] px-3 text-[13px] text-slate-700 placeholder-slate-400 " +
    "bg-white border border-[#27348b] rounded-[3px] outline-none " +
    "focus:ring-2 focus:ring-[#a9c4f5]";

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-white"
      style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}
    >
      {/* ===== LEFT PANEL (hidden on small screens) ===== */}
      <div className="hidden lg:block">
        {/* navy block */}
        <div
          className="absolute top-0 bottom-0 left-[1%] w-[40.5%] rounded-tr-[56px]"
          style={{ backgroundColor: NAVY }}
        />
        {/* dots */}
        <Dots className="left-[43.3%] top-[7%] w-[7%] h-[14%]" />
        <Dots className="left-[43.3%] bottom-[4%] w-[7%] h-[14%]" />

        {/* light card with illustration */}
        <div className="absolute left-[11.6%] top-[14%] bottom-[8%] w-[36%] rounded-xl bg-[#e6e9f5] shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex items-center justify-center">
          <Illustration />
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="relative min-h-screen lg:ml-[50%] lg:w-[50%] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[290px]">
          {/* school logo */}
          <div className="flex items-center justify-center gap-2">
            <Emblem />
            <div className="leading-tight">
              <div className="text-[17px] font-semibold tracking-wide text-[#3d5a26]">
                DELHI PUBLIC SCHOOL
              </div>
              <div className="text-[10.5px] tracking-[0.12em] text-[#3d5a26] text-center">
                R. K. PURAM, NEW DELHI
              </div>
            </div>
          </div>

          <h1 className="mt-5 text-center text-[19px] font-bold text-[#27348b]">
            Welcome to Admin Portal
          </h1>

          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="userId" className="block mb-1 text-[11px] font-bold text-[#27348b]">
              Emp Id / User Id
            </label>
            <input
              id="userId"
              type="text"
              placeholder="Enter User Id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={inputCls}
            />

            <label htmlFor="password" className="block mt-3 mb-1 text-[11px] font-bold text-[#27348b]">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />

            <label htmlFor="year" className="block mt-3 mb-1 text-[11px] font-bold text-[#27348b]">
              Financial Year
            </label>
            <div className="relative">
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`${inputCls} appearance-none h-[26px] pr-8 bg-[#f4f7fe] border-[#27348b]`}
              >
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <button
              type="submit"
              className="mt-5 w-full h-[36px] rounded-[3px] bg-[#27348b] text-white text-[13px] font-semibold hover:bg-[#1f2a73] transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-5 text-center">
            <a href="#" className="text-[11.5px] text-[#27348b] hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="mt-5 text-center text-[10.5px] text-slate-600">
            © 2024 All rights reserved . Powered by
            <div className="mt-1 text-[17px] font-bold tracking-tight text-[#27348b] lowercase">
              Aditech
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}