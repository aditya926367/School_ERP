

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { BookUser, Plus, Users, X, CheckCircle2, AlertCircle } from "lucide-react";

import {
  useMembers,
  type Member,
} from "../../../store/libraryStore";

import { useStudents } from "../../../store/studentStore";

import DataTable from "../../../components/common/DataTable";
import FilterSelect from "../../../components/common/FilterSelect";
import PageHeader from "../../../components/common/PageHeader";
import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import StatusBadge from "../../../components/common/StatusBadge";
import SummaryCard from "../../../components/common/SummaryCard";

type MemberType = "Student" | "Staff";

const PAGE_SIZES = [5, 10, 25, 50];

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100";

const emptyForm = {
  type: "Student" as MemberType,
  admissionNo: "",
  name: "",
  className: "",
  active: true,
};

export default function Members() {
  const [members, setMembers] = useMembers();
  const [students] = useStudents();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // Find student in Student Master using Admission Number.
  const normalizedAdmissionNo = form.admissionNo.trim().toLowerCase();

  const selectedStudent = useMemo(() => {
    if (form.type !== "Student" || !normalizedAdmissionNo) {
      return undefined;
    }

    return students.find(
      (student) =>
        student.admissionNo.trim().toLowerCase() ===
        normalizedAdmissionNo
    );
  }, [students, form.type, normalizedAdmissionNo]);

  // Check whether this student is already a Library Member.
  const alreadyRegistered = useMemo(() => {
    if (!selectedStudent) return false;

    return members.some(
      (member) =>
        member.studentId === selectedStudent.id ||
        (member.admissionNo || "").trim().toLowerCase() ===
          normalizedAdmissionNo
    );
  }, [members, selectedStudent, normalizedAdmissionNo]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch = [
        member.id,
        member.name,
        member.className,
        member.admissionNo || "",
      ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (typeFilter === "All" || member.type === typeFilter) &&
        (statusFilter === "All" ||
          (statusFilter === "Active" ? member.active : !member.active))
      );
    });
  }, [members, search, typeFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const pagedMembers = filteredMembers.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const activeCount = members.filter((member) => member.active).length;

  const studentCount = members.filter(
    (member) => member.type === "Student"
  ).length;

  const issuedCount = members.reduce(
    (sum, member) => sum + member.booksIssued,
    0
  );

  function nextId() {
    const max = members.reduce(
      (currentMax, member) =>
        Math.max(
          currentMax,
          Number(member.id.slice(1)) || 0
        ),
      0
    );

    return `M${max + 1}`;
  }

  function closeForm() {
    setShowForm(false);
    setForm(emptyForm);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    let newMember: Member;

    // Student verification
    if (form.type === "Student") {
      if (!form.admissionNo.trim()) {
        setError("Please enter the student's Admission Number.");
        return;
      }

      // Check current Student Master record.
      const student = students.find(
        (item) =>
          item.admissionNo.trim().toLowerCase() ===
          normalizedAdmissionNo
      );

      if (!student) {
        setError(
          "Student not found in Student Master. Please check the Admission Number."
        );
        return;
      }

      if (student.status !== "Active") {
        setError(
          "This student is inactive. Library membership cannot be created."
        );
        return;
      }

      const duplicate = members.some(
        (member) =>
          member.studentId === student.id ||
          (member.admissionNo || "").trim().toLowerCase() ===
            normalizedAdmissionNo
      );

      if (duplicate) {
        setError("This student is already registered as a Library Member.");
        return;
      }

      newMember = {
        id: nextId(),
        studentId: student.id,
        admissionNo: student.admissionNo,
        name: student.name,
        type: "Student",
        className: `${student.className}${student.section ? `-${student.section}` : ""}`,
        booksIssued: 0,
        active: form.active,
      };
    } else {
      // Staff registration is manual for now.
      if (!form.name.trim()) {
        setError("Staff name is required.");
        return;
      }

      newMember = {
        id: nextId(),
        studentId: null,
        admissionNo: "",
        name: form.name.trim(),
        type: "Staff",
        className: "-",
        booksIssued: 0,
        active: form.active,
      };
    }

    setMembers((current) => [newMember, ...current]);

    setPage(1);
    closeForm();
  }

  const columns = [
    {
      key: "member",
      header: "Member",
      render: (member: Member) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {member.name.charAt(0).toUpperCase()}
          </span>

          <div>
            <p className="font-semibold text-gray-900">{member.name}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              {member.id}
            </p>
            {member.type === "Student" && member.admissionNo && (
              <p className="mt-0.5 text-xs text-gray-400">
                Admission No: {member.admissionNo}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Member Type",
      render: (member: Member) => (
        <span className="inline-flex items-center gap-1.5 text-gray-700">
          <BookUser size={15} className="text-gray-400" />
          {member.type}
        </span>
      ),
    },
    {
      key: "className",
      header: "Class",
      render: (member: Member) => member.className,
    },
    {
      key: "booksIssued",
      header: "Books Issued",
      render: (member: Member) => (
        <span className="font-medium">{member.booksIssued}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (member: Member) => (
        <StatusBadge status={member.active ? "Active" : "Inactive"} />
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <PageHeader
        title="Library Members"
        description="Manage students and staff who are allowed to borrow library books."
        actions={
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setError("");
              setShowForm(true);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            <Plus size={17} />
            Add Member
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Members"
          value={members.length}
          icon={<Users size={21} />}
          iconClassName="text-indigo-700"
          iconBackgroundClassName="bg-indigo-50"
        />

        <SummaryCard
          label="Student Members"
          value={studentCount}
          icon={<BookUser size={21} />}
          iconClassName="text-blue-700"
          iconBackgroundClassName="bg-blue-50"
        />

        <SummaryCard
          label="Active Members"
          value={activeCount}
          icon={<Users size={21} />}
          iconClassName="text-green-700"
          iconBackgroundClassName="bg-green-50"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by member name, ID, or class..."
            />
          </div>

          <div className="w-full sm:w-44">
            <FilterSelect
              value={typeFilter}
              onChange={(value) => {
                setTypeFilter(value);
                setPage(1);
              }}
              options={["Student", "Staff"]}
              placeholder="All member types"
            />
          </div>

          <div className="w-full sm:w-40">
            <FilterSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              options={["Active", "Inactive"]}
              placeholder="All statuses"
            />
          </div>
        </div>

        <DataTable<Member>
          data={pagedMembers}
          columns={columns}
          rowKey={(member) => member.id}
          tableClassName="min-w-[750px] text-sm text-gray-800"
          emptyState="No members match your search or filters."
        />

        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            Rows per page

            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredMembers.length}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="members"
          />
        </div>
      </section>

      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={closeForm}
        >
          <div
            className="w-full max-w-[480px] rounded-xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Add Member
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Register an existing student or add a staff member.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
              {/* Member Type */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Member Type
                </label>

                <select
                  value={form.type}
                  onChange={(event) => {
                    setForm({
                      ...emptyForm,
                      type: event.target.value as MemberType,
                    });
                    setError("");
                  }}
                  className={inputStyle}
                >
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              {form.type === "Student" ? (
                <>
                  {/* Student Admission Number */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Student Admission Number
                    </label>

                    <input
                      value={form.admissionNo}
                      onChange={(event) => {
                        setForm({
                          ...form,
                          admissionNo: event.target.value,
                        });
                        setError("");
                      }}
                      placeholder="Enter student admission number"
                      className={inputStyle}
                    />
                  </div>

                  {/* Student Verification Result */}
                  {normalizedAdmissionNo && (
                    <div className="rounded-lg border p-3">
                      {selectedStudent ? (
                        selectedStudent.status === "Inactive" ? (
                          <div className="flex items-start gap-2 text-red-600">
                            <AlertCircle size={19} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold">
                                Student is Inactive
                              </p>
                              <p className="mt-1 text-xs">
                                This student cannot be registered as a new
                                Library Member.
                              </p>
                            </div>
                          </div>
                        ) : alreadyRegistered ? (
                          <div className="flex items-start gap-2 text-amber-600">
                            <AlertCircle size={19} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold">
                                Already Registered
                              </p>
                              <p className="mt-1 text-xs">
                                This student is already a Library Member.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle2 size={18} />
                              <p className="text-sm font-semibold">
                                Student Verified Successfully
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Student Name
                                </p>
                                <p className="font-medium text-gray-800">
                                  {selectedStudent.name}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">
                                  Admission Number
                                </p>
                                <p className="font-medium text-gray-800">
                                  {selectedStudent.admissionNo}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">
                                  Class
                                </p>
                                <p className="font-medium text-gray-800">
                                  {selectedStudent.className}
                                  {selectedStudent.section
                                    ? `-${selectedStudent.section}`
                                    : ""}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">
                                  Student Status
                                </p>
                                <p className="font-medium text-green-700">
                                  {selectedStudent.status}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex items-start gap-2 text-red-600">
                          <AlertCircle size={19} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold">
                              Student Not Found
                            </p>
                            <p className="mt-1 text-xs">
                              No student with this Admission Number exists in
                              Student Master.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Staff Full Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="Enter staff full name"
                    className={inputStyle}
                  />

                  <p className="mt-1 text-xs text-amber-600">
                    Staff verification with Staff Master is not connected yet.
                  </p>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    setForm({ ...form, active: event.target.checked })
                  }
                  className="h-4 w-4"
                />
                Active member
              </label>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Library members are saved in browser LocalStorage. Student membership
        is verified against Student Master. Staff verification is not connected
        yet. {issuedCount} books are currently issued across these members.
      </p>
    </div>
  );
}
