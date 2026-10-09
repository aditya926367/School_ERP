// src/layouts/PortalLayout.tsx
import type { ReactNode } from "react";
import MainHeader from "./mainHeader";
import Sidebar from "./sidebar";
import type { MenuItem } from "./sidebar";

type Props = {
  menu: MenuItem[];
  children: ReactNode;
};

export default function PortalLayout({ menu, children }: Props) {
  return (
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{ fontFamily: "'Trebuchet MS', system-ui, sans-serif" }}
    >
      {/* Header: kabhi shrink/scroll nahi hoga */}
      <div className="shrink-0">
        <MainHeader />
      </div>

      {/* Neeche ki row: min-h-0 zaroori hai, tabhi andar ka scroll kaam karta hai */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar items={menu} />
        <main className="flex-1 min-w-0 bg-[#e9ecef] p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}