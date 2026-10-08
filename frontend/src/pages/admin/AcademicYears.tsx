import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";
import { useState } from "react";

interface Term {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "Current" | "Inactive";
  terms: Term[];
}

function AcademicYears() {
  const [showYearForm, setShowYearForm] = useState(false);
  const [showTermForm, setShowTermForm] = useState(false);

  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([
    {
      id: 1,
      name: "2026-2027",
      startDate: "2026-04-01",
      endDate: "2027-03-31",
      status: "Current",
      terms: [
        {
          id: 1,
          name: "Term 1",
          startDate: "2026-04-01",
          endDate: "2026-09-30",
        },
        {
          id: 2,
          name: "Term 2",
          startDate: "2026-10-01",
          endDate: "2027-03-31",
        },
      ],
    },
    {
      id: 2,
      name: "2025-2026",
      startDate: "2025-04-01",
      endDate: "2026-03-31",
      status: "Inactive",
      terms: [
        {
          id: 3,
          name: "Term 1",
          startDate: "2025-04-01",
          endDate: "2025-09-30",
        },
        {
          id: 4,
          name: "Term 2",
          startDate: "2025-10-01",
          endDate: "2026-03-31",
        },
      ],
    },
  ]);

  const [yearForm, setYearForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [termForm, setTermForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const handleAddYear = () => {
    if (!yearForm.name || !yearForm.startDate || !yearForm.endDate) {
      return;
    }

    const newYear: AcademicYear = {
      id: Date.now(),
      name: yearForm.name,
      startDate: yearForm.startDate,
      endDate: yearForm.endDate,
      status: "Inactive",
      terms: [],
    };

    setAcademicYears([...academicYears, newYear]);

    setYearForm({
      name: "",
      startDate: "",
      endDate: "",
    });

    setShowYearForm(false);
  };

  const handleAddTerm = () => {
    if (
      selectedYearId === null ||
      !termForm.name ||
      !termForm.startDate ||
      !termForm.endDate
    ) {
      return;
    }

    setAcademicYears(
      academicYears.map((year) =>
        year.id === selectedYearId
          ? {
              ...year,
              terms: [
                ...year.terms,
                {
                  id: Date.now(),
                  name: termForm.name,
                  startDate: termForm.startDate,
                  endDate: termForm.endDate,
                },
              ],
            }
          : year
      )
    );

    setTermForm({
      name: "",
      startDate: "",
      endDate: "",
    });

    setShowTermForm(false);
  };

  const setCurrentYear = (id: number) => {
    setAcademicYears(
      academicYears.map((year) => ({
        ...year,
        status: year.id === id ? "Current" : "Inactive",
      }))
    );
  };

  const deleteYear = (id: number) => {
    setAcademicYears(academicYears.filter((year) => year.id !== id));
  };

  const deleteTerm = (yearId: number, termId: number) => {
    setAcademicYears(
      academicYears.map((year) =>
        year.id === yearId
          ? {
              ...year,
              terms: year.terms.filter((term) => term.id !== termId),
            }
          : year
      )
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Academic Years & Terms
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage academic years and their term dates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowYearForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
        >
          <Plus size={18} />
          Add Academic Year
        </button>
      </div>

      {/* Academic Year Cards */}
      <div className="space-y-6">
        {academicYears.map((year) => (
          <div
            key={year.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Year Header */}
            <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {year.name}
                    </h2>

                    {year.status === "Current" && (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 size={13} />
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {year.startDate} → {year.endDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {year.status !== "Current" && (
                  <button
                    type="button"
                    onClick={() => setCurrentYear(year.id)}
                    className="rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-700 transition hover:bg-green-50"
                  >
                    Set as Current
                  </button>
                )}

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-[#27348b]"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => deleteYear(year.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Terms
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Manage terms within this academic year.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedYearId(year.id);
                    setShowTermForm(true);
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-[#27348b] px-3 py-2 text-xs font-medium text-[#27348b] transition hover:bg-[#27348b]/5"
                >
                  <Plus size={15} />
                  Add Term
                </button>
              </div>

              {year.terms.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    No terms added yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[600px] text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Term
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Start Date
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          End Date
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {year.terms.map((term) => (
                        <tr key={term.id}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            {term.name}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {term.startDate}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {term.endDate}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                deleteTerm(year.id, term.id)
                              }
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Academic Year Modal */}
      {showYearForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Academic Year
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Create a new academic year.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowYearForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Academic Year
                </label>

                <input
                  type="text"
                  placeholder="Example: 2027-2028"
                  value={yearForm.name}
                  onChange={(e) =>
                    setYearForm({
                      ...yearForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={yearForm.startDate}
                    onChange={(e) =>
                      setYearForm({
                        ...yearForm,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={yearForm.endDate}
                    onChange={(e) =>
                      setYearForm({
                        ...yearForm,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowYearForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddYear}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Academic Year
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Term Modal */}
      {showTermForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Term
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add a term to the selected academic year.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTermForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Term Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Term 1"
                  value={termForm.name}
                  onChange={(e) =>
                    setTermForm({
                      ...termForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={termForm.startDate}
                    onChange={(e) =>
                      setTermForm({
                        ...termForm,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={termForm.endDate}
                    onChange={(e) =>
                      setTermForm({
                        ...termForm,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowTermForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddTerm}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Term
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcademicYears;