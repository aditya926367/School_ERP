
import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  GraduationCap,
  CalendarDays,
  Eye,
  X,
} from "lucide-react";

type Child = {
  id: number;
  name: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNo: number;
  academicYear: string;
  dateOfBirth: string;
  bloodGroup: string;
  classTeacher: string;
  email: string;
  attendance: number;
  status: "Active" | "Inactive";
};

const demoChildren: Child[] = [];

export default function Children() {
  const [children] = useState<Child[]>(demoChildren);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const filteredChildren = useMemo(() => {
    const query = search.trim().toLowerCase();

    return children.filter((child) => {
      const matchesSearch =
        child.name.toLowerCase().includes(query) ||
        child.admissionNo.toLowerCase().includes(query);

      const matchesClass =
        classFilter === "All" || child.className === classFilter;

      return matchesSearch && matchesClass;
    });
  }, [children, search, classFilter]);

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-indigo-100";

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Children</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your children's profiles and academic information.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Linked Children</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {children.length}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Children linked to your account
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3 text-[#27348b]">
              <Users size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Enrollments</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {children.filter((child) => child.status === "Active").length}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Currently enrolled
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <GraduationCap size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search Child
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or admission number"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Class
            </label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Classes</option>
              {Array.from(
                new Set(children.map((child) => child.className))
              ).map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Child Cards */}
      {filteredChildren.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <Users size={36} className="mx-auto text-gray-300" />
          <h2 className="mt-3 font-semibold text-gray-800">
            No children found
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or class filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredChildren.map((child) => (
            <div
              key={child.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#27348b] text-lg font-bold text-white">
                  {child.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold text-gray-800">
                    {child.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {child.className}-{child.section} · Roll No. {child.rollNo}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    child.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {child.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-5">
                <div>
                  <p className="text-xs text-gray-500">Admission Number</p>
                  <p className="mt-1 break-words text-sm font-medium text-gray-800">
                    {child.admissionNo}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Academic Year</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {child.academicYear}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Attendance</p>
                  <p className="mt-1 text-sm font-semibold text-green-700">
                    {child.attendance}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Class Teacher</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {child.classTeacher}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 p-4">
                <button
                  type="button"
                  onClick={() => setSelectedChild(child)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#27348b] px-4 py-2.5 text-sm font-semibold text-[#27348b] transition hover:bg-indigo-50"
                >
                  <Eye size={17} />
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      {selectedChild && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedChild(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="child-profile-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-5">
              <h2
                id="child-profile-title"
                className="text-lg font-bold text-gray-800"
              >
                Child Profile
              </h2>
              <button
                type="button"
                onClick={() => setSelectedChild(null)}
                aria-label="Close profile"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#27348b] text-lg font-bold text-white">
                  {selectedChild.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedChild.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedChild.className}-{selectedChild.section}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["Admission Number", selectedChild.admissionNo],
                  ["Roll Number", String(selectedChild.rollNo)],
                  ["Academic Year", selectedChild.academicYear],
                  ["Date of Birth", selectedChild.dateOfBirth],
                  ["Blood Group", selectedChild.bloodGroup],
                  ["Class Teacher", selectedChild.classTeacher],
                  ["Attendance", `${selectedChild.attendance}%`],
                  ["Status", selectedChild.status],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-gray-50 p-3"
                  >
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-medium text-gray-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-50 p-3 text-sm text-[#27348b]">
                <CalendarDays size={18} />
                Academic year {selectedChild.academicYear}
              </div>

              <button
                type="button"
                onClick={() => setSelectedChild(null)}
                className="mt-5 w-full rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202b75]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
