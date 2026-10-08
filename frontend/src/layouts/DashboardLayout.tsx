import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex min-h-[calc(100vh-48px)] overflow-hidden rounded-2xl bg-white shadow-sm">

        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-[#27348b] text-white">
          <div className="border-b border-white/20 px-6 py-5">
            <h1 className="text-xl font-bold">
              School ERP
            </h1>

            <p className="mt-1 text-xs text-white/70">
              Admin Portal
            </p>
          </div>

          <nav className="px-4 py-5">
            <p className="mb-2 px-3 text-xs font-semibold uppercase text-white/50">
              Main
            </p>

            <a
              href="/dashboard"
              className="block rounded-lg bg-white/10 px-3 py-2.5 text-sm"
            >
              Dashboard
            </a>
          </nav>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Topbar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Dashboard
            </h2>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  Admin
                </p>

                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#27348b] text-sm font-bold text-white">
                A
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto bg-gray-100 p-8">
            <div className="mx-auto max-w-[1400px]">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;