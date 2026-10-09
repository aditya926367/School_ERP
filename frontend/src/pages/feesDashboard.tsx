// src/pages/fees.tsx
import type { ReactNode } from "react";
import PortalLayout from "../layouts/PortalLayout";
import type { MenuItem } from "../layouts/sidebar";
import { FiHome } from "react-icons/fi";
import {
  FaPencilAlt,
  FaFileAlt,
  FaUser,
  FaCreditCard,
  FaRegFile,
  FaRegListAlt,
  FaBars,
  FaThList,
  FaTable,
  FaFile,
  FaHistory,
  FaBell,
  FaBook,
  FaChevronRight,
} from "react-icons/fa";

// ---------- Sidebar menu for the Fees page ----------
const feesMenu: MenuItem[] = [
  { label: "Home", icon: <FiHome />, path: "/dashboard" },
  { label: "Fees Tasks", icon: <FaPencilAlt />, path: "/fees", hasArrow: true },
  { label: "Fees Reports", icon: <FaFileAlt />, path: "/fees", hasArrow: true },
  { label: "Miscellaneous Fee", icon: <FaUser />, path: "/fees", hasArrow: true },
  { label: "Hostel Fee", icon: <FaCreditCard />, path: "/fees", hasArrow: true },
  { label: "Hostel Report", icon: <FaRegFile />, path: "/fees", hasArrow: true },
  { label: "Crons", icon: <FaCreditCard />, path: "/fees", hasArrow: true },
  { label: "Student Transport", icon: <FaCreditCard />, path: "/fees", hasArrow: true },
];

// ---------- Data for the 10 cards ----------
type CardItem = {
  icon: ReactNode;
  title: string;
  description: string;
};

const cards: CardItem[] = [
  {
    icon: <FaRegListAlt />,
    title: "Fee Collection",
    description: "Manage and record student fee payments. Ensure smooth and secure transactions.",
  },
  {
    icon: <FaBars />,
    title: "Student Fee-Bill",
    description: "Generate and track student fee bills. Maintain accurate billing records.",
  },
  {
    icon: <FaRegFile />,
    title: "Fee Challan",
    description: "Create and manage fee challans. Streamline the payment process.",
  },
  {
    icon: <FaThList />,
    title: "Defaulters List",
    description: "View students with pending fees. Take action on overdue payments.",
  },
  {
    icon: <FaTable />,
    title: "Total Fee Collection",
    description: "Track overall fee collection details. Generate insights on financial status.",
  },
  {
    icon: <FaFile />,
    title: "Reconciliation",
    description: "Compare records for accuracy. Ensure balanced financial reports.",
  },
  {
    icon: <FaHistory />,
    title: "MIS Status",
    description: "Monitor and analyze financial reports. Keep track of key metrics and data.",
  },
  {
    icon: <FaBell />,
    title: "Monthly Projection",
    description: "Forecast expected fee collections. Plan financial strategies effectively.",
  },
  {
    icon: <FaBook />,
    title: "Daybook Report",
    description: "View daily transaction records. Keep a clear day-wise account.",
  },
  {
    icon: <FaFileAlt />,
    title: "Fee Logs",
    description: "Check logs of fee activities. Track every change and entry.",
  },
];

// ---------- One card (written once, used 10 times) ----------
function FeeCard({ item }: { item: CardItem }) {
  function handleClick() {
    console.log("Clicked:", item.title); // later: navigate to that page here
  }

  return (
    <button
      onClick={handleClick}
      className="block h-full min-h-[180px] w-full text-left bg-white border border-[#b9b9e6] rounded-[3px] px-4 pt-6 pb-5 shadow-[0_12px_14px_-10px_rgba(39,52,139,0.35)] hover:border-[#27348b] transition-colors"
    >
      {/* Icon */}
      <div className="text-[24px] text-[#2a2a63]">{item.icon}</div>

      {/* Title + arrow on the right */}
      <div className="mt-4 flex items-center justify-between">
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

// ---------- Page ----------
export default function FeesDashboard() {
  return (
    <PortalLayout menu={feesMenu}>
      <div className="bg-white border border-gray-200 rounded-[4px] px-4 pt-6 pb-8">
        <h1 className="text-center text-[22px] font-bold text-[#2a2a63]">
          Welcome, Fees Management
        </h1>

        {/* Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => (
            <FeeCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}