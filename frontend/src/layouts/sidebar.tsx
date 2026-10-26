// src/layouts/sidebar.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaChevronRight } from "react-icons/fa";

export type MenuItem = {
  label: string;
  icon: ReactNode;
  path: string;
  hasArrow?: boolean; // true = right side par ">" dikhega
};

export default function Sidebar({ items }: { items: MenuItem[] }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`shrink-0 h-full bg-white flex flex-col transition-all duration-200 ${
        collapsed ? "w-[60px]" : "w-[235px]"
      }`}
    >
      {/* Hamburger button */}
      <div className="flex justify-end px-5 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[18px] text-[#2a2a63]"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

      {/* Menu items */}
      <ul className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <li key={item.label} className="mx-1 border-b border-gray-200">
            <button
              onClick={() => navigate(item.path)}
              className="flex w-full items-center gap-3 px-4 py-[11px] text-left text-[15px] text-[#2a2a63] hover:bg-[#f4f7fe]"
            >
              <span className="text-[16px] shrink-0">{item.icon}</span>

              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.hasArrow && (
                    <FaChevronRight className="text-[11px] text-[#2a2a63]" />
                  )}
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}