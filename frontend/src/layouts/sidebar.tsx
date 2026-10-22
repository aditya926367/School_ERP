import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaChevronRight } from "react-icons/fa";

export type MenuItem = {
  label: string;
  icon: ReactNode;
  path: string;
  hasArrow?: boolean;
};

export default function Sidebar({ items }: { items: MenuItem[] }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-full shrink-0 flex-col bg-white">
      {/* Hamburger stays at the top, always visible */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-12 w-12 shrink-0 items-center justify-center text-[18px] text-[#2a2a63] hover:bg-[#f4f7fe]"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        <FaBars />
      </button>

      {/* Animated width: 235px when open, 0 when closed */}
      <aside
        className={`flex-1 overflow-hidden transition-all duration-200 ${
          isOpen ? "w-[235px]" : "w-0"
        }`}
      >
        {/* Inner fixed-width wrapper prevents text from wrapping while collapsing */}
        <ul className="h-full w-[235px] overflow-y-auto">
          {items.map((item) => (
            <li key={item.label} className="mx-1 border-b border-gray-200">
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className="flex w-full items-center gap-3 px-4 py-[11px] text-left text-[15px] text-[#2a2a63] hover:bg-[#f4f7fe]"
              >
                <span className="shrink-0 text-[16px]">{item.icon}</span>
                <span className="flex-1 whitespace-nowrap">{item.label}</span>
                {item.hasArrow && <FaChevronRight className="text-[11px]" />}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}