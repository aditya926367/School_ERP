
import { useState } from "react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import SummaryCard from "../../components/common/SummaryCard";
import {
  Plus,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Pencil,
  X,
  FileText,
} from "lucide-react";
import ActionButtons from "../../components/common/ActionButtons";

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



  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6">
      <PageHeader
        breadcrumb="School Management / Admissions"
        title="Student Admissions"
        description="Review applications and manage new student enrollment."
        actions={
          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white "
          >
            <Plus size={18} />
            New Application
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Applications"
          value={admissions.length}
          icon={<Users size={22} />}
          iconClassName="text-blue-600"
          iconBackgroundClassName="bg-blue-50"
        />
        <SummaryCard
          label="Pending Review"
          value={pending}
          icon={<Clock size={22} />}
          iconClassName="text-amber-600"
          iconBackgroundClassName="bg-amber-50"
        />
        <SummaryCard
          label="Approved"
          value={approved}
          icon={<CheckCircle size={22} />}
          iconClassName="text-green-600"
          iconBackgroundClassName="bg-green-50"
        />
        <SummaryCard
          label="Rejected"
          value={rejected}
          icon={<XCircle size={22} />}
          iconClassName="text-red-600"
          iconBackgroundClassName="bg-red-50"
        />
      </div>

      {/* Application directory */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900">Admission Applications</h2>
            <p className="mt-1 text-sm text-gray-500">
              Search, review and update applications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by student, application no. or parent"
            />
            <FilterSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              placeholder="All statuses"
              options={["Pending", "Approved", "Rejected"]}
            />
          </div>
        </div>

        <DataTable
          data={visible}
          rowKey={(admission: Admission) => admission.id}
          tableClassName="min-w-[900px]"
          columns={[
            {
              key: "application",
              header: "Application",
              render: (admission: Admission) => (
                <span className="text-sm font-medium text-blue-700">
                  {admission.applicationNo}
                </span>
              ),
            },
            {
              key: "student",
              header: "Student",
              render: (admission: Admission) => (
                <div>
                  <p className="text-sm font-medium text-gray-900">{admission.studentName}</p>
                  <p className="mt-1 text-xs text-gray-500">{admission.gender || "Not specified"}</p>
                </div>
              ),
            },
            {
              key: "class",
              header: "Class",
              render: (admission: Admission) => (
                <span className="text-sm text-gray-600">{admission.classApplied}</span>
              ),
            },
            {
              key: "parent",
              header: "Parent / Guardian",
              render: (admission: Admission) => (
                <div>
                  <p className="text-sm text-gray-800">{admission.parentName}</p>
                  <p className="mt-1 text-xs text-gray-500">{admission.phone}</p>
                </div>
              ),
            },
            {
              key: "appliedDate",
              header: "Applied On",
              render: (admission: Admission) => (
                <span className="text-sm text-gray-600">{admission.appliedDate}</span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (admission: Admission) => <StatusBadge status={admission.status} />,
            },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: (admission: Admission) => (
              
         <ActionButtons
      onView={() => setSelected(admission)}
      onEdit={() => openEditForm(admission)}
      showDelete={false}
      viewTitle={`View ${admission.studentName}`}
      editTitle={`Edit ${admission.studentName}`}
    />
              
              ),
            },
          ]}
          emptyState={
            <div>
              <FileText size={32} className="mx-auto text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-700">No applications found</p>
              <p className="mt-1 text-sm text-gray-500">
                Try another search or status filter.
              </p>
            </div>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          itemLabel="applications"
        />
      </section>

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
