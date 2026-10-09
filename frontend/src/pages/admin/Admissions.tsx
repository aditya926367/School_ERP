
import { useState } from "react";
import {
  Plus,
  Search,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Pencil,
  X,
  FileText,
} from "lucide-react";

type AdmissionStatus = "Pending" | "Approved" | "Rejected";

type Admission = {
  id: number;
  applicationNo: string;
  studentName: string;
  dateOfBirth: string;
  gender: string;
  classApplied: string;
  parentName: string;
  phone: string;
  email: string;
  previousSchool: string;
  appliedDate: string;
  status: AdmissionStatus;
  documents: {
    birthCertificate: boolean;
    transferCertificate: boolean;
    photograph: boolean;
  };
};

const initialAdmissions: Admission[] = [
  {
    id: 1,
    applicationNo: "ADM-2026-001",
    studentName: "Aarav Sharma",
    dateOfBirth: "2015-04-12",
    gender: "Male",
    classApplied: "Class 6",
    parentName: "Rajesh Sharma",
    phone: "9876543210",
    email: "rajesh@example.com",
    previousSchool: "Sunrise Public School",
    appliedDate: "2026-10-05",
    status: "Pending",
    documents: {
      birthCertificate: true,
      transferCertificate: false,
      photograph: true,
    },
  },
  {
    id: 2,
    applicationNo: "ADM-2026-002",
    studentName: "Ananya Singh",
    dateOfBirth: "2017-08-20",
    gender: "Female",
    classApplied: "Class 4",
    parentName: "Amit Singh",
    phone: "9876543211",
    email: "amit@example.com",
    previousSchool: "Green Valley School",
    appliedDate: "2026-10-04",
    status: "Approved",
    documents: {
      birthCertificate: true,
      transferCertificate: true,
      photograph: true,
    },
  },
  {
    id: 3,
    applicationNo: "ADM-2026-003",
    studentName: "Rohan Kumar",
    dateOfBirth: "2013-02-11",
    gender: "Male",
    classApplied: "Class 8",
    parentName: "Suresh Kumar",
    phone: "9876543212",
    email: "suresh@example.com",
    previousSchool: "City Model School",
    appliedDate: "2026-10-03",
    status: "Rejected",
    documents: {
      birthCertificate: true,
      transferCertificate: false,
      photograph: true,
    },
  },
];

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const emptyForm = {
  studentName: "",
  dateOfBirth: "",
  gender: "",
  classApplied: "Class 1",
  parentName: "",
  phone: "",
  email: "",
  previousSchool: "",
};

export default function Admissions() {
  const [admissions, setAdmissions] = useState(initialAdmissions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Admission | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [documents, setDocuments] = useState({
    birthCertificate: false,
    transferCertificate: false,
    photograph: false,
  });

  const pending = admissions.filter((a) => a.status === "Pending").length;
  const approved = admissions.filter((a) => a.status === "Approved").length;
  const rejected = admissions.filter((a) => a.status === "Rejected").length;

  const filtered = admissions.filter((a) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      a.studentName.toLowerCase().includes(query) ||
      a.applicationNo.toLowerCase().includes(query) ||
      a.parentName.toLowerCase().includes(query);

    return (
      matchesSearch &&
      (statusFilter === "All" || a.status === statusFilter)
    );
  });

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setDocuments({
      birthCertificate: false,
      transferCertificate: false,
      photograph: false,
    });
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setDocuments({
      birthCertificate: false,
      transferCertificate: false,
      photograph: false,
    });
    setShowForm(true);
  }

  function openEditForm(admission: Admission) {
    setEditingId(admission.id);
    setForm({
      studentName: admission.studentName,
      dateOfBirth: admission.dateOfBirth,
      gender: admission.gender,
      classApplied: admission.classApplied,
      parentName: admission.parentName,
      phone: admission.phone,
      email: admission.email,
      previousSchool: admission.previousSchool,
    });
    setDocuments(admission.documents);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editingId !== null) {
      setAdmissions((previous) =>
        previous.map((a) =>
          a.id === editingId
            ? { ...a, ...form, documents }
            : a
        )
      );
    } else {
      const nextNumber =
        Math.max(0, ...admissions.map((a) => a.id)) + 1;

      const newAdmission: Admission = {
        id: nextNumber,
        applicationNo: `ADM-2026-${String(nextNumber).padStart(3, "0")}`,
        ...form,
        appliedDate: new Date().toISOString().slice(0, 10),
        status: "Pending",
        documents,
      };

      setAdmissions((previous) => [newAdmission, ...previous]);
      setPage(1);
    }

    closeForm();
  }

  function updateStatus(id: number, status: AdmissionStatus) {
    setAdmissions((previous) =>
      previous.map((a) => (a.id === id ? { ...a, status } : a))
    );
    setSelected((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );
  }

  function statusClass(status: AdmissionStatus) {
    if (status === "Approved") return "bg-green-50 text-green-700";
    if (status === "Rejected") return "bg-red-50 text-red-700";
    return "bg-amber-50 text-amber-700";
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">
            School Management / Admissions
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Student Admissions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review applications and manage new student enrollment.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          New Application
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Applications",
            value: admissions.length,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Pending Review",
            value: pending,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Approved",
            value: approved,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Rejected",
            value: rejected,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <Icon size={22} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application directory */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Admission Applications
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search, review and update applications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search applications..."
                className={`${inputClass} mt-0 pl-9`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className={`${inputClass} mt-0`}
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Application",
                  "Student",
                  "Class",
                  "Parent / Guardian",
                  "Applied On",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {visible.map((admission) => (
                <tr key={admission.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-blue-700">
                    {admission.applicationNo}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {admission.studentName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {admission.gender || "Not specified"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {admission.classApplied}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-800">
                      {admission.parentName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {admission.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {admission.appliedDate}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                        admission.status
                      )}`}
                    >
                      {admission.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        title="View application"
                        onClick={() => setSelected(admission)}
                        className="rounded-md p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Edit application"
                        onClick={() => openEditForm(admission)}
                        className="rounded-md p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Pencil size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <FileText
                      size={32}
                      className="mx-auto text-gray-300"
                    />
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      No applications found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try another search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}{" "}
            to {Math.min(currentPage * pageSize, filtered.length)} of{" "}
            {filtered.length} applications
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Previous page"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add / edit application form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId !== null
                    ? "Edit Application"
                    : "New Admission Application"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the student and guardian information.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5">
              <div>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Student Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">
                    Student Full Name *
                    <input
                      required
                      value={form.studentName}
                      onChange={(e) =>
                        setForm({ ...form, studentName: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Enter student name"
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Date of Birth *
                    <input
                      required
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        setForm({ ...form, dateOfBirth: e.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Gender *
                    <select
                      required
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      className={inputClass}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Class Applying For *
                    <select
                      required
                      value={form.classApplied}
                      onChange={(e) =>
                        setForm({ ...form, classApplied: e.target.value })
                      }
                      className={inputClass}
                    >
                      {Array.from(
                        { length: 12 },
                        (_, i) => `Class ${i + 1}`
                      ).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                    Previous School
                    <input
                      value={form.previousSchool}
                      onChange={(e) =>
                        setForm({ ...form, previousSchool: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Previous school name (if applicable)"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Parent / Guardian Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">
                    Parent / Guardian Name *
                    <input
                      required
                      value={form.parentName}
                      onChange={(e) =>
                        setForm({ ...form, parentName: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Enter guardian name"
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Phone Number *
                    <input
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      title="Enter a 10-digit phone number"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className={inputClass}
                      placeholder="10-digit phone number"
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                    Email Address *
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className={inputClass}
                      placeholder="parent@example.com"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Document Checklist
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    {
                      key: "birthCertificate",
                      label: "Birth Certificate",
                    },
                    {
                      key: "transferCertificate",
                      label: "Transfer Certificate",
                    },
                    {
                      key: "photograph",
                      label: "Student Photograph",
                    },
                  ].map((item) => {
                    const key = item.key as keyof typeof documents;

                    return (
                      <label
                        key={item.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={documents[key]}
                          onChange={(e) =>
                            setDocuments({
                              ...documents,
                              [key]: e.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-blue-600"
                        />
                        {item.label}
                      </label>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  This checklist records document status; it does not upload files.
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View application details */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Application Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selected.applicationNo}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {[
                ["Student", selected.studentName],
                ["Date of Birth", selected.dateOfBirth || "Not provided"],
                ["Gender", selected.gender || "Not provided"],
                ["Class", selected.classApplied],
                ["Parent / Guardian", selected.parentName],
                ["Phone", selected.phone],
                ["Email", selected.email || "Not provided"],
                ["Previous School", selected.previousSchool || "Not provided"],
                ["Applied On", selected.appliedDate],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-b border-gray-100 pb-3 sm:flex-row sm:justify-between"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {value}
                  </span>
                </div>
              ))}

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium text-gray-800">
                  Document Checklist
                </h3>

                <div className="mt-3 space-y-2 text-sm">
                  {[
                    ["Birth Certificate", selected.documents.birthCertificate],
                    ["Transfer Certificate", selected.documents.transferCertificate],
                    ["Student Photograph", selected.documents.photograph],
                  ].map(([label, complete]) => (
                    <div
                      key={String(label)}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-600">{label}</span>
                      <span
                        className={
                          complete
                            ? "font-medium text-green-700"
                            : "font-medium text-amber-700"
                        }
                      >
                        {complete ? "Received" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Update application status
                </p>

                <div className="flex flex-wrap gap-2">
                  {(["Pending", "Approved", "Rejected"] as const).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selected.id, status)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                          selected.status === status
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
