// src/pages/library.tsx
import type { ReactNode } from "react";
import PortalLayout from "../layouts/PortalLayout";
import type { MenuItem } from "../layouts/sidebar";
import { FiHome } from "react-icons/fi";
import {
  FaBook,
  FaSignOutAlt,
  FaThList,
  FaSignInAlt,
  FaRegCopy,
  FaBarcode,
  FaCheck,
  FaShoppingCart,
  FaChevronRight,
  FaPencilAlt,
  FaRegCheckSquare,
} from "react-icons/fa";

// ---------- Sidebar menu for the Library page ----------
// const libraryMenu: MenuItem[] = [
//   { label: "Home", icon: <FiHome />, path: "/dashboard" },
//   { label: "Library Setup", icon: <FaPencilAlt />, path: "/library" },
//   { label: "Stock Verifications", icon: <FaRegCheckSquare />, path: "/library" },
//   { label: "Issue and Return", icon: <FaSignOutAlt />, path: "/library" },
//   { label: "Reports", icon: <FaBook />, path: "/library" },
// ];
const libraryMenu: MenuItem[] = [
  { label: "Home", icon: <FiHome />, path: "/dashboard" },
  { label: "Library Setup", icon: <FaPencilAlt />, path: "/library", hasArrow: true },
  { label: "Stock Verifications", icon: <FaRegCheckSquare />, path: "/library", hasArrow: true },
  { label: "Issue and Return", icon: <FaSignOutAlt />, path: "/library", hasArrow: true },
  { label: "Reports", icon: <FaBook />, path: "/library", hasArrow: true },
];
// ---------- Data for the 8 cards (icon, title, description) ----------
type CardItem = {
  icon: ReactNode;
  title: string;
  description: string;
};

const cards: CardItem[] = [
  {
    icon: <FaBook />,
    title: "Book Master",
    description: "Manage book records efficiently. Store and update book details.",
  },
  {
    icon: <FaSignOutAlt />,
    title: "Issue-Return",
    description: "Handle book lending and returns. Keep track of transactions.",
  },
  {
    icon: <FaThList />,
    title: "Author List",
    description: "Maintain a database of authors. View and manage author details.",
  },
  {
    icon: <FaSignInAlt />,
    title: "Import BookMaster",
    description: "Bulk import book records. Simplify data entry and management.",
  },
  {
    icon: <FaRegCopy />,
    title: "Change Book Status",
    description: "Update book availability status. Mark books as issued or available.",
  },
  {
    icon: <FaBarcode />,
    title: "Barcode Generator",
    description: "Generate barcodes for books. Improve tracking and identification.",
  },
  {
    icon: <FaCheck />,
    title: "Stock Verification",
    description: "Verify library stock periodically. Ensure accurate inventory records.",
  },
  {
    icon: <FaShoppingCart />,
    title: "Acquire Book",
    description: "Add new books to the collection. Manage acquisitions seamlessly.",
  },
];

// ---------- One card (written once, used 8 times) ----------
function LibraryCard({ item }: { item: CardItem }) {
  // Runs when the card is clicked
  function handleClick() {
    console.log("Clicked:", item.title); // later: navigate to that page here
  }

  return (
    <button
      onClick={handleClick}
      className="block w-full text-left bg-white border border-[#b9b9e6] rounded-[3px] px-4 pt-4 pb-5 shadow-[0_12px_14px_-10px_rgba(39,52,139,0.35)] hover:border-[#27348b] transition-colors"
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

// ---------- Page ----------
export default function libraryDashboard() {
  return (
    <PortalLayout menu={libraryMenu}>
      {/* Big white box with the title and the cards */}
      <div className="bg-white border border-gray-200 rounded-[4px] px-4 pt-6 pb-8">
        <h1 className="text-center text-[22px] font-bold text-[#2a2a63]">
          Widget settings form goes here
        </h1>

        {/* Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => (
            <LibraryCard key={item.title} item={item} />
          ))}
        </div>
      </div>

      {/* Empty white box below (same as the screenshot) */}
      <div className="mt-6 h-[34px] bg-white border border-gray-200 rounded-[4px]" />
    </PortalLayout>
  );
}