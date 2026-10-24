// src/pages/admin/library/Members.tsx
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { BookUser, Plus, Users, X } from "lucide-react";

import DataTable from "../../../components/common/DataTable";
import FilterSelect from "../../../components/common/FilterSelect";
import PageHeader from "../../../components/common/PageHeader";
import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import StatusBadge from "../../../components/common/StatusBadge";
import SummaryCard from "../../../components/common/SummaryCard";

type MemberType = "Student" | "Staff";
type Member = {
  id: string;
  name: string;
  type: MemberType;
  className: string;
  booksIssued: number;
  active: boolean;
};

const initialMembers: Member[] = [
  { id: "M101", name: "Aarav Sharma", type: "Student", className: "8-A", booksIssued: 2, active: true },
  { id: "M102", name: "Priya Verma", type: "Student", className: "10-B", booksIssued: 1, active: true },
  { id: "M103", name: "Rohit Gupta", type: "Student", className: "6-C", booksIssued: 0, active: false },
  { id: "M201", name: "Mrs. Sunita Rao", type: "Staff", className: "-", booksIssued: 3, active: true },
];

const PAGE_SIZES = [5, 10, 25, 50];
const inputStyle = "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100";
const emptyForm = { name: "", type: "Student" as MemberType, className: "", active: true };

export default function Members() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return members.filter((member) => {
      const matchesSearch = [member.id, member.name, member.className].some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (typeFilter === "All" || member.type === typeFilter) && (statusFilter === "All" || (statusFilter === "Active" ? member.active : !member.active));
    });
  }, [members, search, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedMembers = filteredMembers.slice((safePage - 1) * pageSize, safePage * pageSize);
  const activeCount = members.filter((member) => member.active).length;
  const studentCount = members.filter((member) => member.type === "Student").length;
  const issuedCount = members.reduce((sum, member) => sum + member.booksIssued, 0);

  function nextId() {
    const max = members.reduce((currentMax, member) => Math.max(currentMax, Number(member.id.slice(1)) || 0), 0);
    return `M${max + 1}`;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (form.type === "Student" && !form.className.trim()) {
      setError("Class is required for a student.");
      return;
    }

    const newMember: Member = {
      id: nextId(), name: form.name.trim(), type: form.type,
      className: form.type === "Student" ? form.className.trim() : "-",
      booksIssued: 0, active: form.active,
    };
    setMembers((current) => [newMember, ...current]);
    setPage(1);
    setForm(emptyForm);
    setError("");
    setShowForm(false);
  }

  const columns = [
    { key: "member", header: "Member", render: (member: Member) => <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{member.name.charAt(0).toUpperCase()}</span><div><p className="font-semibold text-gray-900">{member.name}</p><p className="mt-0.5 text-xs text-gray-500">{member.id}</p></div></div> },
    { key: "type", header: "Member Type", render: (member: Member) => <span className="inline-flex items-center gap-1.5 text-gray-700"><BookUser size={15} className="text-gray-400" />{member.type}</span> },
    { key: "className", header: "Class", render: (member: Member) => member.className },
    { key: "booksIssued", header: "Books Issued", render: (member: Member) => <span className="font-medium">{member.booksIssued}</span> },
    { key: "status", header: "Status", render: (member: Member) => <StatusBadge status={member.active ? "Active" : "Inactive"} /> },
  ];

  return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader title="Library Members" description="Manage students and staff who are allowed to borrow library books." actions={<button type="button" onClick={() => { setForm(emptyForm); setError(""); setShowForm(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"><Plus size={17} /> Add Member</button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Members" value={members.length} icon={<Users size={21} />} iconClassName="text-indigo-700" iconBackgroundClassName="bg-indigo-50" />
        <SummaryCard label="Student Members" value={studentCount} icon={<BookUser size={21} />} iconClassName="text-blue-700" iconBackgroundClassName="bg-blue-50" />
        <SummaryCard label="Active Members" value={activeCount} icon={<Users size={21} />} iconClassName="text-green-700" iconBackgroundClassName="bg-green-50" />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1"><SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search by member name, ID, or class..." /></div>
          <div className="w-full sm:w-44"><FilterSelect value={typeFilter} onChange={(value) => { setTypeFilter(value); setPage(1); }} options={["Student", "Staff"]} placeholder="All member types" /></div>
          <div className="w-full sm:w-40"><FilterSelect value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} options={["Active", "Inactive"]} placeholder="All statuses" /></div>
        </div>
        <DataTable<Member> data={pagedMembers} columns={columns} rowKey={(member) => member.id} tableClassName="min-w-[750px] text-sm text-gray-800" emptyState="No members match your search or filters." />
        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-500">Rows per page<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500">{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
          <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filteredMembers.length} pageSize={pageSize} onPageChange={setPage} itemLabel="members" />
        </div>
      </section>

      {showForm && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
        <div className="w-full max-w-[480px] rounded-xl bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4"><div><h2 className="text-lg font-bold text-gray-900">Add Member</h2><p className="mt-1 text-sm text-gray-500">Add a student or staff member to the library.</p></div><button type="button" onClick={() => setShowForm(false)} aria-label="Close" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={20} /></button></div>
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Aarav Sharma" className={inputStyle} /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="mb-1 block text-sm font-medium text-gray-700">Member Type</label><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as MemberType })} className={inputStyle}><option value="Student">Student</option><option value="Staff">Staff</option></select></div><div><label className="mb-1 block text-sm font-medium text-gray-700">Class</label><input value={form.type === "Student" ? form.className : ""} onChange={(event) => setForm({ ...form, className: event.target.value })} disabled={form.type === "Staff"} placeholder={form.type === "Staff" ? "Not required" : "e.g. 8-A"} className={`${inputStyle} disabled:bg-gray-100 disabled:text-gray-400`} /></div></div>
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} className="h-4 w-4" />Active member</label>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setShowForm(false)} className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button><button type="submit" className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]">Save Member</button></div>
          </form>
        </div>
      </div>}
      <p className="text-xs text-gray-500">Demo data only. Changes are held in page state and are not saved to the backend. {issuedCount} books are currently shown as issued across these sample members.</p>
    </div>
  );
}
