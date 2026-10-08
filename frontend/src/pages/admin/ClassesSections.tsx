import {
  Plus,
  Pencil,
  Trash2,
  Users,
  GraduationCap,
  X,
} from "lucide-react";
import { useState } from "react";

interface Section {
  id: number;
  name: string;
  capacity: number;
  classTeacher: string;
  status: "Active" | "Inactive";
}

interface SchoolClass {
  id: number;
  name: string;
  sections: Section[];
}

function ClassesSections() {
  const [showClassForm, setShowClassForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState<number | null>(
    null
  );

  const [classes, setClasses] = useState<SchoolClass[]>([
    {
      id: 1,
      name: "Class 8",
      sections: [
        {
          id: 1,
          name: "A",
          capacity: 40,
          classTeacher: "Rahul Sharma",
          status: "Active",
        },
        {
          id: 2,
          name: "B",
          capacity: 40,
          classTeacher: "Priya Singh",
          status: "Active",
        },
      ],
    },
    {
      id: 2,
      name: "Class 9",
      sections: [
        {
          id: 3,
          name: "A",
          capacity: 40,
          classTeacher: "Amit Kumar",
          status: "Active",
        },
        {
          id: 4,
          name: "B",
          capacity: 40,
          classTeacher: "Neha Verma",
          status: "Active",
        },
      ],
    },
    {
      id: 3,
      name: "Class 10",
      sections: [
        {
          id: 5,
          name: "A",
          capacity: 40,
          classTeacher: "Vikas Gupta",
          status: "Active",
        },
      ],
    },
  ]);

  const [className, setClassName] = useState("");

  const [sectionForm, setSectionForm] = useState({
    name: "",
    capacity: "",
    classTeacher: "",
  });

  const teachers = [
    "Rahul Sharma",
    "Priya Singh",
    "Amit Kumar",
    "Neha Verma",
    "Vikas Gupta",
  ];

  const handleAddClass = () => {
    if (!className.trim()) return;

    setClasses([
      ...classes,
      {
        id: Date.now(),
        name: className,
        sections: [],
      },
    ]);

    setClassName("");
    setShowClassForm(false);
  };

  const handleAddSection = () => {
    if (
      selectedClassId === null ||
      !sectionForm.name ||
      !sectionForm.capacity ||
      !sectionForm.classTeacher
    ) {
      return;
    }

    setClasses(
      classes.map((schoolClass) =>
        schoolClass.id === selectedClassId
          ? {
              ...schoolClass,
              sections: [
                ...schoolClass.sections,
                {
                  id: Date.now(),
                  name: sectionForm.name,
                  capacity: Number(sectionForm.capacity),
                  classTeacher: sectionForm.classTeacher,
                  status: "Active",
                },
              ],
            }
          : schoolClass
      )
    );

    setSectionForm({
      name: "",
      capacity: "",
      classTeacher: "",
    });

    setShowSectionForm(false);
  };

  const deleteClass = (id: number) => {
    setClasses(classes.filter((schoolClass) => schoolClass.id !== id));
  };

  const deleteSection = (classId: number, sectionId: number) => {
    setClasses(
      classes.map((schoolClass) =>
        schoolClass.id === classId
          ? {
              ...schoolClass,
              sections: schoolClass.sections.filter(
                (section) => section.id !== sectionId
              ),
            }
          : schoolClass
      )
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Classes & Sections
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage classes, sections, capacity and class teachers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowClassForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
        >
          <Plus size={18} />
          Add Class
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Classes</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {classes.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
              <GraduationCap size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sections</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {classes.reduce(
                  (total, schoolClass) =>
                    total + schoolClass.sections.length,
                  0
                )}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Capacity</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {classes.reduce(
                  (total, schoolClass) =>
                    total +
                    schoolClass.sections.reduce(
                      (sectionTotal, section) =>
                        sectionTotal + section.capacity,
                      0
                    ),
                  0
                )}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Users size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-6">
        {classes.map((schoolClass) => (
          <div
            key={schoolClass.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Class Header */}
            <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
                  <GraduationCap size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {schoolClass.name}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {schoolClass.sections.length} section
                    {schoolClass.sections.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClassId(schoolClass.id);
                    setShowSectionForm(true);
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-[#27348b] px-3 py-2 text-xs font-medium text-[#27348b] hover:bg-[#27348b]/5"
                >
                  <Plus size={15} />
                  Add Section
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#27348b]"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => deleteClass(schoolClass.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Sections */}
            <div className="p-6">
              {schoolClass.sections.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    No sections added yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Section
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Capacity
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Class Teacher
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Status
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {schoolClass.sections.map((section) => (
                        <tr key={section.id}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            Section {section.name}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {section.capacity} students
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {section.classTeacher}
                          </td>

                          <td className="px-4 py-3">
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                              {section.status}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                deleteSection(
                                  schoolClass.id,
                                  section.id
                                )
                              }
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
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

      {/* Add Class Modal */}
      {showClassForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Class
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Create a new school class.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowClassForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Class Name
              </label>

              <input
                type="text"
                placeholder="Example: Class 11"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowClassForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddClass}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showSectionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Section
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add a section to this class.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSectionForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Section Name
                </label>

                <input
                  type="text"
                  placeholder="Example: A"
                  value={sectionForm.name}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Student Capacity
                </label>

                <input
                  type="number"
                  placeholder="Example: 40"
                  value={sectionForm.capacity}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      capacity: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Class Teacher
                </label>

                <select
                  value={sectionForm.classTeacher}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      classTeacher: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                >
                  <option value="">Select teacher</option>

                  {teachers.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowSectionForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddSection}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesSections;