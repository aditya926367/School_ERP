// src/layouts/sidebar.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

// One menu item = a text, an icon and a page to open
export type MenuItem = {
  label: string;
  icon: ReactNode;
  path: string;
};

export default function Sidebar({ items }: { items: MenuItem[] }) {
  const navigate = useNavigate(); // used to go to another page

  // true = small sidebar (only icons), false = full sidebar
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`shrink-0 bg-white border-r border-gray-200 ${
        collapsed ? "w-[60px]" : "w-[220px]"
      }`}
    >
      {/* Hamburger button */}
      <div className="flex justify-end px-4 py-3">
        <button onClick={() => setCollapsed(!collapsed)} className="text-[#2a2a63]">
          <FaBars />
        </button>
      </div>

      {/* Menu items: one button for each item in the array */}
      <ul>
        {items.map((item) => (
          <li key={item.label} className="border-b border-gray-200">
            <button
              onClick={() => navigate(item.path)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] text-[#2a2a63] hover:bg-[#f4f7fe]"
            >
              <span className="text-[16px]">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}