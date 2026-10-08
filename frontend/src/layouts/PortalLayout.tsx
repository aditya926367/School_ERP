// src/layouts/PortalLayout.tsx
import type { ReactNode } from "react";
import MainHeader from "./mainHeader";
import Sidebar from "./sidebar";
import type { MenuItem } from "./sidebar";

type Props = {
  menu: MenuItem[]; // the sidebar menu for this page
  children: ReactNode; // the page content goes here
};

export default function PortalLayout({ menu, children }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Trebuchet MS', system-ui, sans-serif" }}
    >
      {/* Top header */}
      <MainHeader />

      {/* Sidebar on the left, page content on the right */}
      <div className="flex flex-1">
        <Sidebar items={menu} />
        <main className="flex-1 min-w-0 bg-[#e9ecef] p-4">{children}</main>
      </div>
    </div>
  );
}