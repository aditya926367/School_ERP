
import { useState } from "react";
import { Link } from "react-router-dom";

const NAVY = "#27348b";

// ---------- Left side illustration ----------
function Illustration() {
  return (
    <svg viewBox="0 0 300 220" className="w-[88%] h-auto" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 120c0-45 35-80 85-84 40-3 60-22 100-14 45 9 80 45 75 90-5 45-45 75-100 78-60 3-160 5-160-70z"
        fill="#dfe8f6"
      />
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

      <polygon points="150,18 205,32 150,48 112,34" fill="#243a73" />
      <polygon points="128,38 128,52 150,60 172,52 172,40 150,47" fill="#2c4a8e" />
      <line x1="198" y1="34" x2="198" y2="58" stroke="#f0a35e" strokeWidth="1.5" />
      <circle cx="198" cy="60" r="2.5" fill="#f0a35e" />

      <rect x="95" y="150" width="130" height="14" rx="3" fill="#f6a64e" />
      <rect x="85" y="164" width="150" height="14" rx="3" fill="#6fa8ef" />
      <rect x="105" y="136" width="110" height="14" rx="3" fill="#5a7fd6" />
      <rect x="75" y="178" width="155" height="12" rx="3" fill="#f0883e" />
      <rect x="62" y="190" width="45" height="8" rx="2" fill="#d45b4a" />

      <circle cx="50" cy="150" r="9" fill="#f2c9a5" />
      <path d="M40 148c0-10 8-14 15-11 5 3 4 12 2 18-6-2-13-1-17-7z" fill="#2b2d4a" />
      <rect x="42" y="159" width="18" height="26" rx="6" fill="#f06b4a" />
      <rect x="30" y="178" width="38" height="10" rx="5" fill="#2f4a8f" />
      <rect x="28" y="186" width="14" height="6" rx="3" fill="#2b2d4a" />

      <circle cx="132" cy="78" r="9" fill="#f2c9a5" />
      <path d="M122 76c0-9 8-13 14-10 6 3 5 11 3 16-6-1-13-1-17-6z" fill="#2b2d4a" />
      <rect x="123" y="87" width="19" height="34" rx="6" fill="#f08a3c" />
      <rect x="125" y="119" width="7" height="30" fill="#2f3b7a" />
      <rect x="134" y="119" width="7" height="30" fill="#2f3b7a" />
      <rect x="112" y="92" width="22" height="14" rx="2" fill="#2f4a8f" />

      <circle cx="220" cy="100" r="9" fill="#f2c9a5" />
      <path d="M210 100c-2-10 6-16 14-12 7 4 6 14 2 20-6 1-12-1-16-8z" fill="#2b2d4a" />
      <rect x="211" y="109" width="19" height="26" rx="6" fill="#3a56a8" />
      <rect x="185" y="124" width="26" height="16" rx="2" fill="#fff" />
      <rect x="180" y="138" width="40" height="3" rx="1.5" fill="#d9dfef" />
      <rect x="205" y="132" width="52" height="8" rx="4" fill="#2f4a8f" />
    </svg>
  );
}

// ---------- Dotted pattern ----------
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



// ---------- Main page ----------
export default function ForgotPassword() {
  // step: which screen is showing (1, 2, 3 or 4)
  const [step, setStep] = useState(1);

  // values typed by the user
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // true = show password, false = hide password
  const [showPassword, setShowPassword] = useState(false);

  // error message
  const [error, setError] = useState("");

  // Step 1: Send OTP
  function sendOtp(e: any) {
    e.preventDefault(); // stops page reload
    if (contact.trim() === "") {
      setError("Please enter your email or mobile number.");
      return;
    }
    setError("");
    setStep(2);
  }

  // Step 2: Verify OTP
  function verifyOtp(e: any) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    setError("");
    setStep(3);
  }

  // Step 3: Reset Password
  function resetPassword(e: any) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Both passwords do not match.");
      return;
    }
    setError("");
    setStep(4);
  }

  // Styles
  const inputStyle =
    "w-full h-[26px] box-content py-[5px] px-3 text-[13px] text-slate-700 placeholder-slate-400 " +
    "bg-white border border-[#27348b] rounded-[3px] outline-none focus:ring-2 focus:ring-[#a9c4f5]";

  const labelStyle = "block mb-1 mt-3 text-[11px] font-bold text-[#27348b]";

  const buttonStyle =
    "mt-5 w-full h-[36px] rounded-[3px] bg-[#27348b] text-white text-[13px] font-semibold hover:bg-[#1f2a73]";

  const linkStyle = "text-[11.5px] text-[#27348b] hover:underline";

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-white"
      style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}
    >
      {/* LEFT SIDE */}
      <div className="hidden lg:block">
        <div
          className="absolute top-0 bottom-0 left-[1%] w-[40.5%] rounded-tr-[56px]"
          style={{ backgroundColor: NAVY }}
        />
        <Dots className="left-[43.3%] top-[7%] w-[7%] h-[14%]" />
        <Dots className="left-[43.3%] bottom-[4%] w-[7%] h-[14%]" />
        <div className="absolute left-[11.6%] top-[14%] bottom-[8%] w-[36%] rounded-xl bg-[#e6e9f5] shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex items-center justify-center">
          <Illustration />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative min-h-screen lg:ml-[50%] lg:w-[50%] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[290px]">
          {/* School logo and name */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-9 h-10 border border-gray-300 rounded flex items-center justify-center">
              <span className="text-[8px] text-gray-500 text-center">SCHOOL LOGO</span>
            </div>
            <div className="leading-tight">
              <div className="text-[17px] font-semibold tracking-wide text-[#3d5a26]">
                YOUR SCHOOL NAME
              </div>
              <div className="text-[10.5px] tracking-[0.12em] text-[#3d5a26] text-center">
                YOUR SCHOOL ADDRESS
              </div>
            </div>
          </div>

          {/* Heading changes with the step */}
          <h1 className="mt-5 text-center text-[19px] font-bold text-[#27348b]">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Set New Password"}
            {step === 4 && "All Done!"}
          </h1>

          {/* Error box */}
          {error !== "" && (
            <div className="mt-4 rounded-[3px] border border-red-300 bg-red-50 px-3 py-2 text-[11.5px] text-red-600">
              {error}
            </div>
          )}

          {/* ===== STEP 1: Email / Mobile ===== */}
          {step === 1 && (
            <form onSubmit={sendOtp} className="mt-4">
              <label className={labelStyle}>Email / Mobile Number</label>
              <input
                type="text"
                placeholder="Enter Email or Mobile Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={inputStyle}
              />
              <button type="submit" className={buttonStyle}>
                Send OTP
              </button>
            </form>
          )}

          {/* ===== STEP 2: OTP ===== */}
          {step === 2 && (
            <form onSubmit={verifyOtp} className="mt-4">
              <p className="text-center text-[11.5px] text-slate-600">
                OTP has been sent to: <b>{contact}</b>
              </p>

              <div className="mt-1 text-center">
                <button type="button" onClick={() => setStep(1)} className={linkStyle}>
                  Change email / mobile
                </button>
              </div>

              <label className={labelStyle}>Enter OTP</label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6 digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={inputStyle}
              />
              <button type="submit" className={buttonStyle}>
                Verify OTP
              </button>

              <div className="mt-3 text-center">
                <button type="button" className={linkStyle}>
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* ===== STEP 3: New Password ===== */}
          {step === 3 && (
            <form onSubmit={resetPassword} className="mt-4">
              <label className={labelStyle}>New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputStyle}
              />

              <label className={labelStyle}>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputStyle}
              />

              <label className="mt-3 flex items-center gap-2 text-[11.5px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                Show password
              </label>

              <button type="submit" className={buttonStyle}>
                Reset Password
              </button>
            </form>
          )}

          {/* ===== STEP 4: Success ===== */}
          {step === 4 && (
            <div className="mt-6">
              <div className="rounded-[3px] border border-[#27348b] bg-[#f4f7fe] p-4 text-center">
                <div className="text-[13px] font-bold text-[#27348b]">
                  Your password has been changed ✔
                </div>
                <p className="mt-1 text-[11.5px] text-slate-600">
                  Please log in with your new password.
                </p>
              </div>

              <Link to="/">
                <button type="button" className={buttonStyle}>
                  Go to Login
                </button>
              </Link>
            </div>
          )}

          {/* Back to login (hidden on last step) */}
          {step !== 4 && (
            <div className="mt-5 text-center">
              <Link to="/" className={linkStyle}>
                Back to Login
              </Link>
            </div>
          )}

          {/* Footer */}
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