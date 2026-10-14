// src/pages/libraryDashboard.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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
    icon: <FaBook />,
    title: "Book Master",
    description: "Manage book records efficiently. Store and update book details.",
    path: "/books",
  },
  {
    icon: <FaSignOutAlt />,
    title: "Issue-Return",
    description: "Handle book lending and returns. Keep track of transactions.",
    path: "/issueReturns",
  },
  {
    icon: <FaThList />,
    title: "Author List",
    description: "Maintain a database of authors. View and manage author details.",
     path: "/authorList",
  },
  {
    icon: <FaSignInAlt />,
    title: "Import BookMaster",
    description: "Bulk import book records. Simplify data entry and management.",
    path: "/importBookMaster",
  },
  {
    icon: <FaRegCopy />,
    title: "Change Book Status",
    description: "Update book availability status. Mark books as issued or available.",
    path: "/changeBookStatus",
  },
  {
    icon: <FaBarcode />,
    title: "Barcode Generator",
    description: "Generate barcodes for books. Improve tracking and identification.",
     path: "/barcodeGenerator",
  },
  {
    icon: <FaCheck />,
    title: "Stock Verification",
    description: "Verify library stock periodically. Ensure accurate inventory records.",
     path: "/stockVerification",
  },
  {
    icon: <FaShoppingCart />,
    title: "Acquire Book",
    description: "Add new books to the collection. Manage acquisitions seamlessly.",
      path: "/acquireBook",
  },
];

// ---------- One card (written once, used 8 times) ----------
function LibraryCard({ item }: { item: CardItem }) {
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
export default function LibraryDashboard() {
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-[4px] px-4 pt-6 pb-8">
        <h1 className="text-center text-[22px] font-bold text-[#2a2a63]">
          Welcome, Library Management
        </h1>

        {/* Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => (
            // <LibraryCard key={item.key ?? item.title} item={item} />
            <LibraryCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}