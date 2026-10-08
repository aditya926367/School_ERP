import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";

interface Mapping {
  id: number;
  className: string;
  section: string;
  subject: string;
  subjectCode: string;
  teacher: string;
  type: "Core" | "Elective";
}

function ClassSubjectTeacherMapping() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [mappings, setMappings] = useState<Mapping[]>([
    {
      id: 1,
      className: "Class 8",
      section: "A",
      subject: "Mathematics",
      subjectCode: "MATH",
      teacher: "Rahul Sharma",
      type: "Core",
    },
    {
      id: 2,
      className: "Class 8",
      section: "A",
      subject: "Science",
      subjectCode: "SCI",
      teacher: "Priya Singh",
      type: "Core",
    },
    {
      id: 3,
      className: "Class 8",
      section: "A",
      subject: "English",
      subjectCode: "ENG",
      teacher: "Neha Verma",
      type: "Core",
    },
    {
      id: 4,
      className: "Class 8",
      section: "B",
      subject: "Mathematics",
      subjectCode: "MATH",
      teacher: "Rahul Sharma",
      type: "Core",
    },
    {
      id: 5,
      className: "Class 9",
      section: "A",
      subject: "Science",
      subjectCode: "SCI",
      teacher: "Amit Kumar",
      type: "Core",
    },
  ]);

  const [form, setForm] = useState({
    className: "",
    section: "",
    subject: "",
    teacher: "",
  });

  const subjects = [
    {
      name: "Mathematics",
      code: "MATH",
      type: "Core" as const,
    },
    {
      name: "Science",
      code: "SCI",
      type: "Core" as const,
    },
    {
      name: "English",
      code: "ENG",
      type: "Core" as const,
    },
    {
      name: "Computer Science",
      code: "CS",
      type: "Elective" as const,
    },
    {
      name: "French",
      code: "FRE",
      type: "Elective" as const,
    },
  ];

  const teachers = [
    "Rahul Sharma",
    "Priya Singh",
    "Amit Kumar",
    "Neha Verma",
    "Vikas Gupta",
  ];

  const classes = [
    {
      name: "Class 8",
      sections: ["A", "B"],
    },
    {
      name: "Class 9",
      sections: ["A", "B"],
    },
    {
      name: "Class 10",
      sections: ["A"],
    },
  ];

  const selectedClass = classes.find(
    (schoolClass) => schoolClass.name === form.className
  );

  const selectedSubject = subjects.find(
    (subject) => subject.name === form.subject
  );

  const handleAddMapping = () => {
    if (
      !form.className ||
      !form.section ||
      !form.subject ||
      !form.teacher ||
      !selectedSubject
    ) {
      return;
    }

    const newMapping: Mapping = {
      id: Date.now(),
      className: form.className,
      section: form.section,
      subject: selectedSubject.name,
      subjectCode: selectedSubject.code,
      teacher: form.teacher,
      type: selectedSubject.type,
    };

    setMappings([...mappings, newMapping]);

    setForm({
      className: "",
      section: "",
      subject: "",
      teacher: "",
    });

    setShowForm(false);
  };

  const deleteMapping = (id: number) => {
    setMappings(mappings.filter((mapping) => mapping.id !== id));
  };

  const filteredMappings = mappings.filter((mapping) => {
    const value = search.toLowerCase();

    return (
      mapping.className.toLowerCase().includes(value) ||
      mapping.section.toLowerCase().includes(value) ||
      mapping.subject.toLowerCase().includes(value) ||
      mapping.teacher.toLowerCase().includes(value)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Class-Subject-Teacher Mapping
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Assign subjects and teachers to each class and section.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
        >
          <Plus size={18} />
          Add Mapping
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Mappings</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {mappings.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
              <BookOpen size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Classes Covered</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {new Set(
                  mappings.map(
                    (mapping) =>
                      `${mapping.className}-${mapping.section}`
                  )
                ).size}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <GraduationCap size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Teachers Assigned</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {new Set(mappings.map((mapping) => mapping.teacher)).size}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Users size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Mapping Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Mapping List
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current subject and teacher assignments.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search mappings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Class
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Section
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Subject
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Teacher
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredMappings.map((mapping) => (
                <tr key={mapping.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-gray-800">
                    {mapping.className}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {mapping.section}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {mapping.subject}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {mapping.subjectCode}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        mapping.type === "Core"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {mapping.type}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {mapping.teacher}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#27348b]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMapping(mapping.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMappings.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No mappings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Mapping Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Mapping
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Assign a subject and teacher to a class section.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Class */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Class
                </label>

                <select
                  value={form.className}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      className: e.target.value,
                      section: "",
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                >
                  <option value="">Select class</option>

                  {classes.map((schoolClass) => (
                    <option
                      key={schoolClass.name}
                      value={schoolClass.name}
                    >
                      {schoolClass.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Section
                </label>

                <select
                  value={form.section}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      section: e.target.value,
                    })
                  }
                  disabled={!selectedClass}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none disabled:bg-gray-100 focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                >
                  <option value="">Select section</option>

                  {selectedClass?.sections.map((section) => (
                    <option key={section} value={section}>
                      Section {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>

                <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                >
                  <option value="">Select subject</option>

                  {subjects.map((subject) => (
                    <option key={subject.code} value={subject.name}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Teacher
                </label>

                <select
                  value={form.teacher}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      teacher: e.target.value,
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
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddMapping}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Mapping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassSubjectTeacherMapping;