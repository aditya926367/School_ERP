// src/pages/certificateDashboard.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegEdit,
  FaCertificate,
  FaRegCopy,
  FaTrophy,
  FaExchangeAlt,
  FaUser,
  FaLock,
  FaChevronRight,
} from "react-icons/fa";

// ---------- Data for the 8 cards ----------
type CardItem = {
  icon: ReactNode;
  title: string;
  description: string;
  path?: string; // route of the page, only for cards whose page already exists
};

const cards: CardItem[] = [
  {
    icon: <FaStar />,
    title: "Create Certificate",
    description: "Generate customized certificates for students. Easily design and issue them.",
    path: "/createCertificate",
  },
  {
    icon: <FaRegEdit />,
    title: "Manage Certificate",
    description: "Edit, update, or delete certificates. Keep all records organized efficiently.",
    path: "/manageCertificates",
  },
  {
    icon: <FaCertificate />,
    title: "Bulk Certificate",
    description: "Create multiple certificates at once. Save time with batch processing.",
    path: "/bulkCertificate",
  },
  {
    icon: <FaRegCopy />,
    title: "Individual Certificate",
    description: "Generate a certificate for a single student. Customize details as needed.",
    path: "/individualCertificate",
  },
  {
    icon: <FaTrophy />,
    title: "Awards Distribution",
    description: "Manage and distribute awards. Keep track of achievements effortlessly.",
    path: "/awards",
  },
  {
    icon: <FaExchangeAlt />,
    title: "Transfer Certificate",
    description: "Issue transfer certificates quickly. Ensure smooth student transitions.",
    path: "/transferCertificate",
  },
  {
    icon: <FaUser />,
    title: "Character Certificate",
    description: "Generate a student's character certificate. Verify and authenticate records.",
    path: "/characterCertificate",
  },
  {
    icon: <FaLock />,
    title: "Lock-Unlock Certificate",
    description: "Secure certificates from edits. Unlock when necessary for modifications.",
    path: "/lockUnlockCertificate",
  },
];

// ---------- One card (written once, used 8 times) ----------
function CertificateCard({ item }: { item: CardItem }) {
  const navigate = useNavigate();

  function handleClick() {
    if (item.path) navigate(item.path);
    else console.log("Clicked:", item.title); // page not built yet
  }

  return (
    <button
      onClick={handleClick}
      className="block h-full w-full text-left bg-white border border-[#b9b9e6] rounded-[3px] px-4 pt-4 pb-5 shadow-[0_12px_14px_-10px_rgba(39,52,139,0.35)] hover:border-[#27348b] transition-colors"
    >
      {/* Icon */}
      <div className="text-[24px] text-[#2a2a63]">{item.icon}</div>

      {/* Title + arrow on the right */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[15px] font-bold text-[#2a2a63]">{item.title}</span>
        <FaChevronRight className="text-[14px] text-[#2a2a63]" />
      </div>

      {/* Description */}
      <p className="mt-1 text-[13px] leading-[1.3] text-[#2a2a63]">
        {item.description}
      </p>
    </button>
  );
}

// ---------- Page (no wrapper needed, DashboardLayout adds header and sidebar) ----------
export default function CertificateDashboard() {
  return (
    <div className="bg-white border border-gray-200 rounded-[4px] px-4 pt-6 pb-8">
      <h1 className="text-center text-[22px] font-bold text-[#2a2a63]">
        Welcome, Certificate Management
      </h1>

      {/* Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => (
          <CertificateCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}