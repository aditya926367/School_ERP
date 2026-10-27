// // src/pages/libraryDashboard.tsx
// import type { ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaBook,
//   FaSignOutAlt,
//   FaThList,
//   FaSignInAlt,
//   FaRegCopy,
//   FaBarcode,
//   FaCheck,
//   FaShoppingCart,
//   FaChevronRight,
// } from "react-icons/fa";

// // ---------- Data for the 8 cards ----------
// type CardItem = {
//   icon: ReactNode;
//   title: string;
//   description: string;
//   path?: string; // route of the page, only for cards whose page already exists
// };

// const cards: CardItem[] = [
//   {
//     icon: <FaBook />,
//     title: "Book Master",
//     description: "Manage book records efficiently. Store and update book details.",
//     path: "/books",
//   },
//   {
//     icon: <FaSignOutAlt />,
//     title: "Issue-Return",
//     description: "Handle book lending and returns. Keep track of transactions.",
//     path: "/issueReturns",
//   },
//   {
//     icon: <FaThList />,
//     title: "Author List",
//     description: "Maintain a database of authors. View and manage author details.",
//      path: "/authorList",
//   },
//   {
//     icon: <FaSignInAlt />,
//     title: "Import BookMaster",
//     description: "Bulk import book records. Simplify data entry and management.",
//     path: "/importBookMaster",
//   },
//   {
//     icon: <FaRegCopy />,
//     title: "Change Book Status",
//     description: "Update book availability status. Mark books as issued or available.",
//     path: "/changeBookStatus",
//   },
//   {
//     icon: <FaBarcode />,
//     title: "Barcode Generator",
//     description: "Generate barcodes for books. Improve tracking and identification.",
//      path: "/barcodeGenerator",
//   },
//   {
//     icon: <FaCheck />,
//     title: "Stock Verification",
//     description: "Verify library stock periodically. Ensure accurate inventory records.",
//      path: "/stockVerification",
//   },
//   {
//     icon: <FaShoppingCart />,
//     title: "Acquire Book",
//     description: "Add new books to the collection. Manage acquisitions seamlessly.",
//       path: "/acquireBook",
//   },
// ];

// // ---------- One card (written once, used 8 times) ----------
// function LibraryCard({ item }: { item: CardItem }) {
//   const navigate = useNavigate();

//   function handleClick() {
//     if (item.path) navigate(item.path);
//     else console.log("Clicked:", item.title); // page not built yet
//   }

//   return (
//     <button
//       onClick={handleClick}
//       className="block h-full w-full text-left bg-white border border-[#b9b9e6] rounded-[3px] px-4 pt-4 pb-5 shadow-[0_12px_14px_-10px_rgba(39,52,139,0.35)] hover:border-[#27348b] transition-colors"
//     >
//       {/* Icon */}
//       <div className="text-[24px] text-[#2a2a63]">{item.icon}</div>

//       {/* Title + arrow on the right */}
//       <div className="mt-3 flex items-center justify-between">
//         <span className="text-[15px] font-bold text-[#2a2a63]">{item.title}</span>
//         <FaChevronRight className="text-[14px] text-[#2a2a63]" />
//       </div>

//       {/* Description */}
//       <p className="mt-1 text-[13px] leading-[1.3] text-[#2a2a63]">
//         {item.description}
//       </p>
//     </button>
//   );
// }

// // ---------- Page (no wrapper needed, DashboardLayout adds header and sidebar) ----------
// export default function LibraryDashboard() {
//   return (
//     <>
//       <div className="bg-white border border-gray-200 rounded-[4px] px-4 pt-6 pb-8">
//         <h1 className="text-center text-[22px] font-bold text-[#2a2a63]">
//           Welcome, Library Management
//         </h1>

//         {/* Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
//         <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {cards.map((item) => (
//             // <LibraryCard key={item.key ?? item.title} item={item} />
//             <LibraryCard key={item.title} item={item} />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }




import {
  ArrowDownLeft,
  ArrowUpRight,
  Barcode,
  BookMarked,
  BookOpen,
  BookPlus,
  CalendarClock,
  ChartNoAxesCombined,
  ChevronRight,
  CircleAlert,
  Clock3,
  LibraryBig,
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const summaryCards = [
  {
    label: "Total book copies",
    value: "2,450",
    note: "Across all categories",
    icon: LibraryBig,
    tone: "text-[#27348b] bg-[#eef0ff]",
  },
  {
    label: "Currently issued",
    value: "386",
    note: "Books with students and staff",
    icon: BookMarked,
    tone: "text-[#0f766e] bg-[#e7f7f4]",
  },
  {
    label: "Available copies",
    value: "2,046",
    note: "Ready to issue",
    icon: BookOpen,
    tone: "text-[#2563eb] bg-[#eff6ff]",
  },
  {
    label: "Overdue books",
    value: "18",
    note: "Need follow-up",
    icon: Clock3,
    tone: "text-[#b45309] bg-[#fff7e8]",
  },
];

const quickActions = [
  {
    title: "Issue / Return Book",
    description: "Record book lending and returns",
    icon: ArrowDownLeft,
    path: "/issueReturns",
  },
  {
    title: "Book Catalogue",
    description: "Search and manage book records",
    icon: BookOpen,
    path: "/books",
  },
  {
    title: "Library Members",
    description: "View student and staff members",
    icon: Users,
    path: "/members",
  },
  {
    title: "Acquire New Books",
    description: "Add new stock to the library",
    icon: BookPlus,
    path: "/acquireBook",
  },
];

const recentActivity = [
  { member: "Aarav Sharma", className: "Class 8-A", book: "Wings of Fire", action: "Issued", date: "Today, 10:15 AM", status: "Issued" },
  { member: "Ananya Singh", className: "Class 6-B", book: "Gitanjali", action: "Returned", date: "Today, 09:40 AM", status: "Returned" },
  { member: "Rohan Gupta", className: "Class 7-A", book: "Concept of Physics", action: "Issued", date: "Yesterday", status: "Issued" },
];

const overdueBooks = [
  { member: "Kabir Mehta", className: "Class 9", book: "Mathematics — Part I", due: "24 Oct 2026", days: "3 days overdue" },
  { member: "Rohan Gupta", className: "Class 7", book: "The Discovery of India", due: "22 Oct 2026", days: "5 days overdue" },
  { member: "Ananya Singh", className: "Class 6", book: "English Reader", due: "20 Oct 2026", days: "7 days overdue" },
];

function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-[#2a2a63] sm:text-lg">{title}</h2>
      {action && onAction && (
        <button onClick={onAction} className="inline-flex items-center gap-1 text-sm font-semibold text-[#27348b] hover:underline">
          {action}<ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

export default function LibraryDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2a2a63] sm:text-[28px]">Welcome, Library Management</h1>
            <p className="mt-1 text-sm text-gray-500">Overview of library inventory and daily circulation.</p>
          </div>
          <button
            onClick={() => navigate("/libraryReports")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#27348b] px-4 text-sm font-semibold text-[#27348b] transition hover:bg-[#27348b] hover:text-white"
          >
            <ChartNoAxesCombined size={17} /> View reports
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-xl border border-[#e1e3f5] bg-white p-4 shadow-[0_8px_18px_-14px_rgba(39,52,139,0.45)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-[#2a2a63]">{card.value}</p>
                  </div>
                  <span className={`rounded-lg p-2.5 ${card.tone}`}><Icon size={21} /></span>
                </div>
                <p className="mt-3 text-xs text-gray-500">{card.note}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-400">Sample figures for UI preview — connect these cards to the API/database before production use.</p>
      </section>

      <section>
        <SectionHeading title="Quick Actions" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group flex min-h-[112px] items-start gap-3 rounded-xl border border-[#dfe2f4] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#27348b] hover:shadow-md"
              >
                <span className="rounded-lg bg-[#eef0ff] p-2.5 text-[#27348b]"><Icon size={22} /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 font-bold text-[#2a2a63]">{action.title}<ChevronRight className="shrink-0 transition group-hover:translate-x-0.5" size={17} /></span>
                  <span className="mt-1 block text-sm leading-5 text-gray-500">{action.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionHeading title="Recent Issue / Return Activity" action="Open transactions" onAction={() => navigate("/issueReturns")} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-3 py-3 font-semibold">Student / Member</th>
                  <th className="px-3 py-3 font-semibold">Book</th>
                  <th className="px-3 py-3 font-semibold">Activity</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((row) => (
                  <tr key={`${row.member}-${row.book}`} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70">
                    <td className="px-3 py-3.5">
                      <p className="font-semibold text-[#2a2a63]">{row.member}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{row.className}</p>
                    </td>
                    <td className="px-3 py-3.5 text-gray-700">{row.book}</td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === "Returned" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-[#27348b]"}`}>
                        {row.status === "Returned" ? <ArrowDownLeft className="mr-1" size={13} /> : <ArrowUpRight className="mr-1" size={13} />}{row.action}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-gray-500">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionHeading title="Overdue Books" action="View all" onAction={() => navigate("/issueReturns")} />
          <div className="space-y-1">
            {overdueBooks.map((row) => (
              <div key={`${row.member}-${row.book}`} className="flex gap-3 border-b border-gray-100 py-3 last:border-0">
                <span className="mt-0.5 rounded-lg bg-amber-50 p-2 text-amber-700"><CircleAlert size={18} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-[#2a2a63]">{row.member}</p>
                    <span className="text-xs font-semibold text-red-600">{row.days}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600">{row.book}</p>
                  <p className="mt-1 text-xs text-gray-400">{row.className} · Due {row.due}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/fines")} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white transition hover:bg-[#202b73]">
            <ReceiptText size={17} /> Manage fines
          </button>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <SectionHeading title="Library Tools" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button onClick={() => navigate("/stockVerification")} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-left transition hover:border-[#27348b] hover:bg-[#f8f9ff]">
            <PackageCheck className="shrink-0 text-[#27348b]" size={20} /><span className="text-sm font-semibold text-[#2a2a63]">Stock Verification</span>
          </button>
          <button onClick={() => navigate("/barcodeGenerator")} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-left transition hover:border-[#27348b] hover:bg-[#f8f9ff]">
            <Barcode className="shrink-0 text-[#27348b]" size={20} /><span className="text-sm font-semibold text-[#2a2a63]">Barcode Generator</span>
          </button>
          <button onClick={() => navigate("/librarySetup")} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-left transition hover:border-[#27348b] hover:bg-[#f8f9ff]">
            <CalendarClock className="shrink-0 text-[#27348b]" size={20} /><span className="text-sm font-semibold text-[#2a2a63]">Library Setup</span>
          </button>
          <button onClick={() => navigate("/acquireBook")} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-left transition hover:border-[#27348b] hover:bg-[#f8f9ff]">
            <ShoppingCart className="shrink-0 text-[#27348b]" size={20} /><span className="text-sm font-semibold text-[#2a2a63]">Purchase / Add Stock</span>
          </button>
        </div>
      </section>
    </div>
  );
}
