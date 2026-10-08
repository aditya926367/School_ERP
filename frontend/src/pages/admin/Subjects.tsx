import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

interface Subject {
  id: number;
  name: string;
  code: string;
  type: "Core" | "Elective";
  description: string;
  status: "Active" | "Inactive";
}

function Subjects() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 1,
      name: "Mathematics",
      code: "MATH",
      type: "Core",
      description: "Mathematics and problem solving",
      status: "Active",
    },
    {
      id: 2,
      name: "Science",
      code: "SCI",
      type: "Core",
      description: "Physics, Chemistry and Biology",
      status: "Active",
    },
    {
      id: 3,
      name: "English",
      code: "ENG",
      type: "Core",
      description: "English language and literature",
      status: "Active",
    },
    {
      id: 4,
      name: "Computer Science",
      code: "CS",
      type: "Elective",
      description: "Computer fundamentals and programming",
      status: "Active",
    },
    {
      id: 5,
      name: "French",
      code: "FRE",
      type: "Elective",
      description: "French language",
      status: "Active",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "Core" as "Core" | "Elective",
    description: "",
  });

  const handleAddSubject = () => {
    if (!form.name || !form.code) return;

    const newSubject: Subject = {
      id: Date.now(),
      name: form.name,
      code: form.code.toUpperCase(),
      type: form.type,
      description: form.description,
      status: "Active",
    };

    setSubjects([...subjects, newSubject]);

    setForm({
      name: "",
      code: "",
      type: "Core",
      description: "",
    });

    setShowForm(false);
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(search.toLowerCase()) ||
      subject.code.toLowerCase().includes(search.toLowerCase()) ||
      subject.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalSubjects = subjects.length;

  const coreSubjects = subjects.filter(
    (subject) => subject.type === "Core"
  ).length;

  const electiveSubjects = subjects.filter(
    (subject) => subject.type === "Elective"
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Subjects
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the school's subject master.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
        >
          <Plus size={18} />
          Add Subject
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Subjects</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalSubjects}
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
              <p className="text-sm text-gray-500">Core Subjects</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {coreSubjects}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <BookOpen size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Elective Subjects</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {electiveSubjects}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <BookOpen size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Subject List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Subject Master
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All subjects configured for the school.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Subject
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Code
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
                        <BookOpen size={17} />
                      </div>

                      <span className="text-sm font-medium text-gray-800">
                        {subject.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-gray-600">
                    {subject.code}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        subject.type === "Core"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {subject.type}
                    </span>
                  </td>

                  <td className="max-w-xs px-5 py-4 text-sm text-gray-500">
                    {subject.description || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      {subject.status}
                    </span>
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
                        onClick={() => deleteSubject(subject.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSubjects.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Subject
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add a new subject to the subject master.
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
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Mathematics"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              {/* Code */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject Code
                </label>

                <input
                  type="text"
                  placeholder="Example: MATH"
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as "Core" | "Elective",
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                >
                  <option value="Core">Core</option>
                  <option value="Elective">Elective</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows={3}
                  placeholder="Enter subject description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
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
                onClick={handleAddSubject}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;