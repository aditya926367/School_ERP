import ActionButtons from "../../components/common/ActionButtons";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Plus,
  Search,
  X,
  WalletCards,
  Users,
  IndianRupee,
} from "lucide-react";

type FeeStructureItem = {
  id: number;
  className: string;
  academicYear: string;
  feeType: string;
  amount: number;
  frequency: "Monthly" | "Quarterly" | "Annually";
  status: "Active" | "Inactive";
};

const initialFees: FeeStructureItem[] = [];

const emptyForm = {
  className: "Class 6",
  academicYear: "2026-2027",
  feeType: "Tuition Fee",
  amount: "",
  frequency: "Monthly" as FeeStructureItem["frequency"],
  status: "Active" as FeeStructureItem["status"],
};

export default function FeeStructure() {
  const [fees, setFees] = usePersistentState('schoolerp:pages_admin_feestructure_tsx:fees', []);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredFees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return fees.filter((fee) => {
      const matchesSearch =
        fee.feeType.toLowerCase().includes(query) ||
        fee.className.toLowerCase().includes(query) ||
        fee.academicYear.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (classFilter === "All" || fee.className === classFilter)
      );
    });
  }, [fees, search, classFilter]);

  const activeCount = fees.filter((fee) => fee.status === "Active").length;
  const totalAmount = fees
    .filter((fee) => fee.status === "Active")
    .reduce((sum, fee) => sum + fee.amount, 0);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(fee: FeeStructureItem) {
    setEditingId(fee.id);
    setForm({
      className: fee.className,
      academicYear: fee.academicYear,
      feeType: fee.feeType,
      amount: String(fee.amount),
      frequency: fee.frequency,
      status: fee.status,
    });
    setModalOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid fee amount greater than zero.");
      return;
    }

    if (editingId !== null) {
      setFees((current) =>
        current.map((fee) =>
          fee.id === editingId ? { ...fee, ...form, amount } : fee,
        ),
      );
    } else {
      setFees((current) => [
        ...current,
        {
          id: Math.max(0, ...current.map((fee) => fee.id)) + 1,
          ...form,
          amount,
        },
      ]);
    }

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function deleteFee(id: number) {
    if (window.confirm("Are you sure you want to delete this fee structure?")) {
      setFees((current) => current.filter((fee) => fee.id !== id));
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Structure</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage class-wise fees and payment frequencies.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white "
        >
          <Plus size={18} />
          Add Fee Structure
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Fee Structures</p>
            <WalletCards className="text-blue-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{fees.length}</p>
        </div>

        <div className="rounded-xl border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Active Structures</p>
            <Users className="text-green-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{activeCount}</p>
        </div>

        <div className="rounded-xl border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Sum of Active Fee Amounts</p>
            <IndianRupee className="text-purple-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            ₹{totalAmount.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Mixed frequencies; not total revenue.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">          <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search fee type, class or year..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </div>

          <select
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"  >        
  <option value="All">All Classes</option>
            {Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`).map(
              (className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ),
            )}
          </select>
        </div>

<div className="overflow-x-auto rounded-lg border border-gray-200">          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Academic Year</th>
                <th className="px-4 py-3">Fee Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {fee.className}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {fee.academicYear}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{fee.feeType}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    ₹{fee.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{fee.frequency}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${fee.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <ActionButtons
                      onEdit={() => openEditModal(fee)}
                      onDelete={() => deleteFee(fee.id)}
                      showView={false}
                      showEdit={true}
                      showDelete={true}
                      showPrint={false}
                      showDownload={false}
                      editTitle={`Edit ${fee.feeType}`}
                      deleteTitle={`Delete ${fee.feeType}`}
                    />
                  </td>
                </tr>
              ))}

              {filteredFees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No fee structures found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
<div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId !== null ? "Edit Fee Structure" : "Add Fee Structure"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the fee details below.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="block text-sm font-medium text-gray-700">
                    Class
                  </span>
                  <select
                    required
                    value={form.className}
                    onChange={(event) =>
                      setForm({ ...form, className: event.target.value })
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  >
                    {Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`).map(
                      (className) => (
                        <option key={className}>{className}</option>
                      ),
                    )}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="block text-sm font-medium text-gray-700">
                    Academic Year
                  </span>
                  <select
                    required
                    value={form.academicYear}
                    onChange={(event) =>
                      setForm({ ...form, academicYear: event.target.value })
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  >
                    <option>2026-2027</option>
                    <option>2027-2028</option>
                    <option>2025-2026</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="block text-sm font-medium text-gray-700">
                    Fee Type
                  </span>
                  <select
                    required
                    value={form.feeType}
                    onChange={(event) =>
                      setForm({ ...form, feeType: event.target.value })
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  >
                    <option>Tuition Fee</option>
                    <option>Admission Fee</option>
                    <option>Transport Fee</option>
                    <option>Examination Fee</option>
                    <option>Library Fee</option>
                    <option>Laboratory Fee</option>
                    <option>Annual Fee</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="block text-sm font-medium text-gray-700">
                    Amount (₹)
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm({ ...form, amount: event.target.value })
                    }
                    placeholder="Enter amount"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="block text-sm font-medium text-gray-700">
                    Frequency
                  </span>
                  <select
                    value={form.frequency}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        frequency: event.target.value as FeeStructureItem["frequency"],
                      })
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annually</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="block text-sm font-medium text-gray-700">
                    Status
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as FeeStructureItem["status"],
                      })
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingId !== null ? "Update Fee" : "Save Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
