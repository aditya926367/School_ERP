
import { useMemo, useState } from "react";
import {
  Search,
  Upload,
  FileText,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Filter,
} from "lucide-react";

type DocumentStatus = "Pending" | "Verified" | "Rejected";

type StudentDocument = {
  id: number;
  studentName: string;
  admissionNo: string;
  className: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  status: DocumentStatus;
};

const initialDocuments: StudentDocument[] = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    admissionNo: "ADM-2026-001",
    className: "Class 10-A",
    documentType: "Birth Certificate",
    fileName: "aarav_birth_certificate.pdf",
    uploadDate: "2026-04-10",
    status: "Verified",
  },
  {
    id: 2,
    studentName: "Ananya Verma",
    admissionNo: "ADM-2026-002",
    className: "Class 9-B",
    documentType: "Transfer Certificate",
    fileName: "ananya_transfer_certificate.pdf",
    uploadDate: "2026-04-12",
    status: "Pending",
  },
  {
    id: 3,
    studentName: "Rohan Kumar",
    admissionNo: "ADM-2026-003",
    className: "Class 8-A",
    documentType: "Previous Marksheet",
    fileName: "rohan_marksheet.pdf",
    uploadDate: "2026-04-14",
    status: "Rejected",
  },
  {
    id: 4,
    studentName: "Priya Singh",
    admissionNo: "ADM-2026-004",
    className: "Class 7-C",
    documentType: "Aadhaar Card",
    fileName: "priya_identity.pdf",
    uploadDate: "2026-04-16",
    status: "Verified",
  },
  {
    id: 5,
    studentName: "Rahul Gupta",
    admissionNo: "ADM-2026-005",
    className: "Class 10-B",
    documentType: "Passport Photograph",
    fileName: "rahul_photo.jpg",
    uploadDate: "2026-04-18",
    status: "Pending",
  },
];

const documentTypes = [
  "Birth Certificate",
  "Transfer Certificate",
  "Previous Marksheet",
  "Aadhaar Card",
  "Passport Photograph",
  "Other",
];

export default function StudentDocuments() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<StudentDocument | null>(null);

  const [studentName, setStudentName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [className, setClassName] = useState("");
  const [documentType, setDocumentType] = useState(documentTypes[0]);
  const [file, setFile] = useState<File | null>(null);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const query = search.toLowerCase();

      const matchesSearch =
        doc.studentName.toLowerCase().includes(query) ||
        doc.admissionNo.toLowerCase().includes(query) ||
        doc.fileName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || doc.status === statusFilter;

      const matchesType =
        typeFilter === "All" || doc.documentType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, search, statusFilter, typeFilter]);

  const stats = [
    {
      label: "Total Documents",
      value: documents.length,
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Verified",
      value: documents.filter((doc) => doc.status === "Verified").length,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Pending Review",
      value: documents.filter((doc) => doc.status === "Pending").length,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Rejected",
      value: documents.filter((doc) => doc.status === "Rejected").length,
      icon: XCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

  function resetUploadForm() {
    setStudentName("");
    setAdmissionNo("");
    setClassName("");
    setDocumentType(documentTypes[0]);
    setFile(null);
  }

  function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      window.alert("Please select a document file.");
      return;
    }

    const newDocument: StudentDocument = {
      id: Date.now(),
      studentName: studentName.trim(),
      admissionNo: admissionNo.trim(),
      className: className.trim(),
      documentType,
      fileName: file.name,
      uploadDate: new Date().toISOString().slice(0, 10),
      status: "Pending",
    };

    setDocuments((current) => [newDocument, ...current]);
    setShowUploadModal(false);
    resetUploadForm();
  }

  function updateStatus(id: number, status: DocumentStatus) {
    setDocuments((current) =>
      current.map((doc) => (doc.id === id ? { ...doc, status } : doc)),
    );

    setSelectedDocument((current) =>
      current?.id === id ? { ...current, status } : current,
    );
  }

  function handleDownload(doc: StudentDocument) {
    window.alert(
      `Demo only: "${doc.fileName}" is a mock record. Actual file download requires backend file storage.`,
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Student Documents
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage, review, and verify student documents.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Upload size={18} />
            Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, admission number, or filename..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="max-w-48 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All types</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Student</th>
                  <th className="px-5 py-4 font-semibold">Document</th>
                  <th className="px-5 py-4 font-semibold">Uploaded</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {doc.studentName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {doc.admissionNo} · {doc.className}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">
                            {doc.documentType}
                          </p>
                          <p className="mt-1 max-w-64 truncate text-xs text-slate-400">
                            {doc.fileName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {doc.uploadDate}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          doc.status === "Verified"
                            ? "bg-green-50 text-green-700"
                            : doc.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDocument(doc)}
                          title="View document details"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          title="Download document"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Download size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDocuments.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No documents found. Try changing your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Upload Student Document
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a document record for a student.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close upload dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Student Name
                </label>
                <input
                  required
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  placeholder="Enter student name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Admission Number
                  </label>
                  <input
                    required
                    value={admissionNo}
                    onChange={(event) => setAdmissionNo(event.target.value)}
                    placeholder="ADM-2026-006"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Class & Section
                  </label>
                  <input
                    required
                    value={className}
                    onChange={(event) => setClassName(event.target.value)}
                    placeholder="Class 8-A"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Select File
                </label>
                <input
                  required
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    setFile(event.target.files?.[0] ?? null)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-medium file:text-blue-700"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Supported formats: PDF, JPG, JPEG, PNG.
                </p>
                {file && (
                  <p className="mt-2 text-sm text-blue-700">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Upload size={16} />
                  Add Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDocument && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="text-lg font-bold text-slate-800">
                Document Details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close document details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
                  <FileText size={24} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800">
                    {selectedDocument.documentType}
                  </p>
                  <p className="break-all text-sm text-slate-500">
                    {selectedDocument.fileName}
                  </p>
                </div>
              </div>

              {[
                ["Student", selectedDocument.studentName],
                ["Admission Number", selectedDocument.admissionNo],
                ["Class & Section", selectedDocument.className],
                ["Upload Date", selectedDocument.uploadDate],
                ["Status", selectedDocument.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-800">
                    {value}
                  </span>
                </div>
              ))}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Update Verification Status
                </label>
                <select
                  value={selectedDocument.status}
                  onChange={(event) =>
                    updateStatus(
                      selectedDocument.id,
                      event.target.value as DocumentStatus,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDocument(null)}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
