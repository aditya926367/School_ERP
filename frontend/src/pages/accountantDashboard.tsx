// src/pages/feesDashboard.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
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
  FaMoneyBillWave,
  FaCalendarAlt,
  FaWallet,
  FaFileInvoiceDollar,
} from "react-icons/fa";

// ---------- Data for the 10 cards ----------
type CardItem = {
  icon: ReactNode;
  title: string;
  description: string;
  path?: string; // route of the page, only for cards whose page already exists
};

const cards: CardItem[] = [
  {
    icon: <FaRegListAlt />,
    title: "Fee Collection",
    description: "Manage and record student fee payments. Ensure smooth and secure transactions.",
    path: "/feeCollection",
  },
  {
    icon: <FaBars />,
    title: "Student Fee-Bill",
    description: "Generate and track student fee bills. Maintain accurate billing records.",
     path: "/studentFeeBill",
  },
  {
    icon: <FaRegFile />,
    title: "Fee Challan",
    description: "Create and manage fee challans. Streamline the payment process.",
     path: "/feeChallan",
  },
  {
    icon: <FaThList />,
    title: "Pending dues",
    description: "View students with pending fees. Take action on overdue payments.",
    path: "/pendingdues",
  },
  {
    icon: <FaTable />,
    title: "Total Fee Collection",
    description: "Track overall fee collection details. Generate insights on financial status.",
    path: "/financeReports",
  },
  {
    icon: <FaFile />,
    title: "Reconciliation",
    description: "Compare records for accuracy. Ensure balanced financial reports.",
     path: "/reconciliation",
  },
  {
    icon: <FaHistory />,
    title: "MIS Status",
    description: "Monitor and analyze financial reports. Keep track of key metrics and data.",
    path: "/misStatus",
  },
  {
    icon: <FaBell />,
    title: "Monthly Projection",
    description: "Forecast expected fee collections. Plan financial strategies effectively.",
    path: "/monthlyProjection",
  },
  {
    icon: <FaBook />,
    title: "Daybook Report",
    description: "View daily transaction records. Keep a clear day-wise account.",
     path: "/daybookReport",
  },
  {
    icon: <FaFileAlt />,
    title: "Fee Logs",
    description: "Check logs of fee activities. Track every change and entry.",
     path: "/feeLogs",
  },


{
  icon: <FaWallet />,
  title: "Salary Structure",
  description: "Set basic salary, allowances and deductions for each teacher.",
  path: "/salaryStructure",
},
{
  icon: <FaCalendarAlt />,
  title: "Monthly Payroll",
  description: "Generate the month's salary list and approve it for payment.",
  path: "/monthlyPayroll",
},
{
  icon: <FaMoneyBillWave />,
  title: "Salary Payments",
  description: "Record which teachers have been paid for each month.",
  path: "/salaryPayments",
},
{
  icon: <FaFileInvoiceDollar />,
  title: "Payslips",
  description: "View and print a teacher's salary slip.",
  path: "/payslips",
},


];

// ---------- One card (written once, used 10 times) ----------
function FeeCard({ item }: { item: CardItem }) {
  const navigate = useNavigate();

  function handleClick() {
    if (item.path) navigate(item.path);
    else console.log("Clicked:", item.title); // page not built yet
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

// ---------- Page (DashboardLayout already adds the header and sidebar) ----------
export default function AccountantDashboard() {
  return (
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
  );
}