
import { useState } from "react";
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  X,
} from "lucide-react";
import ActionButtons from "../../components/common/ActionButtons";

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

interface YearForm {
  name: string;
  startDate: string;
  endDate: string;
}

interface TermForm {
  name: string;
  startDate: string;
  endDate: string;
}

const emptyYearForm: YearForm = {
  name: "",
  startDate: "",
  endDate: "",
};

const emptyTermForm: TermForm = {
  name: "",
  startDate: "",
  endDate: "",
};

function AcademicYears() {
  const [showYearForm, setShowYearForm] = useState(false);
  const [showTermForm, setShowTermForm] = useState(false);

  const [editingYearId, setEditingYearId] = useState<number | null>(null);
  const [editingTermId, setEditingTermId] = useState<number | null>(null);
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

  const [yearForm, setYearForm] = useState<YearForm>(emptyYearForm);
  const [termForm, setTermForm] = useState<TermForm>(emptyTermForm);

  // Open the form to add an academic year.
  const openAddYearForm = () => {
    setEditingYearId(null);
    setYearForm(emptyYearForm);
    setShowYearForm(true);
  };

  // Open the form to edit an academic year.
  const handleEditYear = (year: AcademicYear) => {
    setEditingYearId(year.id);
    setYearForm({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate,
    });
    setShowYearForm(true);
  };

  // Add or update an academic year.
  const handleSaveYear = () => {
    const name = yearForm.name.trim();

    if (!name || !yearForm.startDate || !yearForm.endDate) {
      alert("Please fill in all academic year fields.");
      return;
    }

    if (yearForm.endDate < yearForm.startDate) {
      alert("End date must be after the start date.");
      return;
    }

    if (
      academicYears.some(
        (year) =>
          year.name.toLowerCase() === name.toLowerCase() &&
          year.id !== editingYearId
      )
    ) {
      alert("This academic year already exists.");
      return;
    }

    if (editingYearId !== null) {
      setAcademicYears((previousYears) =>
        previousYears.map((year) =>
          year.id === editingYearId
            ? {
                ...year,
                name,
                startDate: yearForm.startDate,
                endDate: yearForm.endDate,
              }
            : year
        )
      );
    } else {
      const newYear: AcademicYear = {
        id: Date.now(),
        name,
        startDate: yearForm.startDate,
        endDate: yearForm.endDate,
        status: academicYears.length === 0 ? "Current" : "Inactive",
        terms: [],
      };

      setAcademicYears((previousYears) => [...previousYears, newYear]);
    }

    setYearForm(emptyYearForm);
    setEditingYearId(null);
    setShowYearForm(false);
  };

  // Delete an academic year and its terms.
  const deleteYear = (id: number) => {
    const year = academicYears.find((item) => item.id === id);

    if (!year) return;

    if (
      !window.confirm(
        `Delete academic year "${year.name}" and all its terms?`
      )
    ) {
      return;
    }

    setAcademicYears((previousYears) =>
      previousYears.filter((item) => item.id !== id)
    );

    if (selectedYearId === id) {
      setSelectedYearId(null);
      setShowTermForm(false);
      setEditingTermId(null);
    }
  };

  // Set one academic year as current.
  const setCurrentYear = (id: number) => {
    setAcademicYears((previousYears) =>
      previousYears.map((year) => ({
        ...year,
        status: year.id === id ? "Current" : "Inactive",
      }))
    );
  };

  // Open the form to add a term.
  const openAddTermForm = (yearId: number) => {
    setSelectedYearId(yearId);
    setEditingTermId(null);
    setTermForm(emptyTermForm);
    setShowTermForm(true);
  };

  // Open the form to edit a term.
  const handleEditTerm = (yearId: number, term: Term) => {
    setSelectedYearId(yearId);
    setEditingTermId(term.id);
    setTermForm({
      name: term.name,
      startDate: term.startDate,
      endDate: term.endDate,
    });
    setShowTermForm(true);
  };

  // Add or update a term.
  const handleSaveTerm = () => {
    const name = termForm.name.trim();

    if (
      selectedYearId === null ||
      !name ||
      !termForm.startDate ||
      !termForm.endDate
    ) {
      alert("Please fill in all term fields.");
      return;
    }

    if (termForm.endDate < termForm.startDate) {
      alert("Term end date must be after the start date.");
      return;
    }

    const selectedYear = academicYears.find(
      (year) => year.id === selectedYearId
    );

    if (!selectedYear) {
      alert("Academic year not found.");
      return;
    }

    if (
      selectedYear.terms.some(
        (term) =>
          term.name.toLowerCase() === name.toLowerCase() &&
          term.id !== editingTermId
      )
    ) {
      alert("A term with this name already exists in this academic year.");
      return;
    }

    setAcademicYears((previousYears) =>
      previousYears.map((year) => {
        if (year.id !== selectedYearId) return year;

        if (editingTermId !== null) {
          return {
            ...year,
            terms: year.terms.map((term) =>
              term.id === editingTermId
                ? {
                    ...term,
                    name,
                    startDate: termForm.startDate,
                    endDate: termForm.endDate,
                  }
                : term
            ),
          };
        }

        return {
          ...year,
          terms: [
            ...year.terms,
            {
              id: Date.now(),
              name,
              startDate: termForm.startDate,
              endDate: termForm.endDate,
            },
          ],
        };
      })
    );

    setTermForm(emptyTermForm);
    setEditingTermId(null);
    setShowTermForm(false);
  };

  // Delete a term.
  const deleteTerm = (yearId: number, termId: number) => {
    const year = academicYears.find((item) => item.id === yearId);
    const term = year?.terms.find((item) => item.id === termId);

    if (!year || !term) return;

    if (
      !window.confirm(
        `Delete "${term.name}" from academic year "${year.name}"?`
      )
    ) {
      return;
    }

    setAcademicYears((previousYears) =>
      previousYears.map((item) =>
        item.id === yearId
          ? {
              ...item,
              terms: item.terms.filter(
                (existingTerm) => existingTerm.id !== termId
              ),
            }
          : item
      )
    );
  };

  return (
    <div>
      {/* Page Header */}
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
          onClick={openAddYearForm}
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

              {/* Academic Year Actions */}
              <div className="flex items-center justify-end gap-2">
                {year.status !== "Current" && (
                  <button
                    type="button"
                    onClick={() => setCurrentYear(year.id)}
                    className="rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-700 transition hover:bg-green-50"
                  >
                    Set as Current
                  </button>
                )}

                <ActionButtons
                  onEdit={() => handleEditYear(year)}
                  onDelete={() => deleteYear(year.id)}
                />
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
                  onClick={() => openAddTermForm(year.id)}
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
                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              <ActionButtons
                                onEdit={() =>
                                  handleEditTerm(year.id, term)
                                }
                                onDelete={() =>
                                  deleteTerm(year.id, term.id)
                                }
                              />
                            </div>
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

      {/* Add/Edit Academic Year Modal */}
      {showYearForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {editingYearId !== null
                    ? "Edit Academic Year"
                    : "Add Academic Year"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {editingYearId !== null
                    ? "Update the academic year details."
                    : "Create a new academic year."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowYearForm(false);
                  setEditingYearId(null);
                  setYearForm(emptyYearForm);
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close academic year form"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="year-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Academic Year
                </label>
                <input
                  id="year-name"
                  type="text"
                  placeholder="Example: 2027-2028"
                  value={yearForm.name}
                  onChange={(e) =>
                    setYearForm({ ...yearForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="year-start"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    id="year-start"
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
                  <label
                    htmlFor="year-end"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    id="year-end"
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
                onClick={() => {
                  setShowYearForm(false);
                  setEditingYearId(null);
                  setYearForm(emptyYearForm);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveYear}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                {editingYearId !== null ? "Save Changes" : "Add Academic Year"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Term Modal */}
      {showTermForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {editingTermId !== null ? "Edit Term" : "Add Term"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {editingTermId !== null
                    ? "Update the term details."
                    : "Add a term to the selected academic year."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowTermForm(false);
                  setEditingTermId(null);
                  setTermForm(emptyTermForm);
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close term form"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="term-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Term Name
                </label>
                <input
                  id="term-name"
                  type="text"
                  placeholder="Example: Term 1"
                  value={termForm.name}
                  onChange={(e) =>
                    setTermForm({ ...termForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="term-start"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    id="term-start"
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
                  <label
                    htmlFor="term-end"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    id="term-end"
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
                onClick={() => {
                  setShowTermForm(false);
                  setEditingTermId(null);
                  setTermForm(emptyTermForm);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveTerm}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                {editingTermId !== null ? "Save Changes" : "Add Term"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcademicYears;
