import {
  Plus,
  Pencil,
  Trash2,
  GraduationCap,
  Settings2,
  X,
} from "lucide-react";
import { useState } from "react";

interface Grade {
  id: number;
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  description: string;
}

interface ExamType {
  id: number;
  name: string;
  weightage: number;
  maxMarks: number;
  passingMarks: number;
  status: "Active" | "Inactive";
}

function GradingExamSettings() {
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);

  const [grades, setGrades] = useState<Grade[]>([
    {
      id: 1,
      grade: "A+",
      minPercentage: 90,
      maxPercentage: 100,
      description: "Outstanding",
    },
    {
      id: 2,
      grade: "A",
      minPercentage: 80,
      maxPercentage: 89,
      description: "Excellent",
    },
    {
      id: 3,
      grade: "B+",
      minPercentage: 70,
      maxPercentage: 79,
      description: "Very Good",
    },
    {
      id: 4,
      grade: "B",
      minPercentage: 60,
      maxPercentage: 69,
      description: "Good",
    },
    {
      id: 5,
      grade: "C",
      minPercentage: 50,
      maxPercentage: 59,
      description: "Satisfactory",
    },
    {
      id: 6,
      grade: "D",
      minPercentage: 40,
      maxPercentage: 49,
      description: "Needs Improvement",
    },
    {
      id: 7,
      grade: "F",
      minPercentage: 0,
      maxPercentage: 39,
      description: "Fail",
    },
  ]);

  const [examTypes, setExamTypes] = useState<ExamType[]>([
    {
      id: 1,
      name: "Unit Test 1",
      weightage: 10,
      maxMarks: 50,
      passingMarks: 20,
      status: "Active",
    },
    {
      id: 2,
      name: "Half Yearly Examination",
      weightage: 30,
      maxMarks: 100,
      passingMarks: 40,
      status: "Active",
    },
    {
      id: 3,
      name: "Unit Test 2",
      weightage: 10,
      maxMarks: 50,
      passingMarks: 20,
      status: "Active",
    },
    {
      id: 4,
      name: "Annual Examination",
      weightage: 50,
      maxMarks: 100,
      passingMarks: 40,
      status: "Active",
    },
  ]);

  const [gradeForm, setGradeForm] = useState({
    grade: "",
    minPercentage: "",
    maxPercentage: "",
    description: "",
  });

  const [examForm, setExamForm] = useState({
    name: "",
    weightage: "",
    maxMarks: "",
    passingMarks: "",
  });

  const handleAddGrade = () => {
    if (
      !gradeForm.grade ||
      gradeForm.minPercentage === "" ||
      gradeForm.maxPercentage === ""
    ) {
      return;
    }

    setGrades([
      ...grades,
      {
        id: Date.now(),
        grade: gradeForm.grade,
        minPercentage: Number(gradeForm.minPercentage),
        maxPercentage: Number(gradeForm.maxPercentage),
        description: gradeForm.description,
      },
    ]);

    setGradeForm({
      grade: "",
      minPercentage: "",
      maxPercentage: "",
      description: "",
    });

    setShowGradeForm(false);
  };

  const handleAddExam = () => {
    if (
      !examForm.name ||
      !examForm.weightage ||
      !examForm.maxMarks ||
      !examForm.passingMarks
    ) {
      return;
    }

    setExamTypes([
      ...examTypes,
      {
        id: Date.now(),
        name: examForm.name,
        weightage: Number(examForm.weightage),
        maxMarks: Number(examForm.maxMarks),
        passingMarks: Number(examForm.passingMarks),
        status: "Active",
      },
    ]);

    setExamForm({
      name: "",
      weightage: "",
      maxMarks: "",
      passingMarks: "",
    });

    setShowExamForm(false);
  };

  const deleteGrade = (id: number) => {
    setGrades(grades.filter((grade) => grade.id !== id));
  };

  const deleteExam = (id: number) => {
    setExamTypes(examTypes.filter((exam) => exam.id !== id));
  };

  const totalWeightage = examTypes.reduce(
    (total, exam) => total + exam.weightage,
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Grading & Exam Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure grading rules, marks and examination settings.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Grade Levels</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {grades.length}
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
              <p className="text-sm text-gray-500">Exam Types</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {examTypes.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Settings2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Exam Weightage</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalWeightage}%
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Settings2 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Grade Scale */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Grade Scale
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Define percentage ranges and corresponding grades.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGradeForm(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#27348b] px-4 py-2.5 text-sm font-medium text-[#27348b] hover:bg-[#27348b]/5"
          >
            <Plus size={17} />
            Add Grade
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Grade
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Min %
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Max %
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-[#27348b]/10 px-3 py-1.5 text-sm font-bold text-[#27348b]">
                      {grade.grade}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {grade.minPercentage}%
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {grade.maxPercentage}%
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {grade.description || "—"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#27348b]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteGrade(grade.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exam Types */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Examination Types
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure exams, marks and weightage.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowExamForm(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
          >
            <Plus size={17} />
            Add Exam Type
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Exam Type
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Weightage
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Maximum Marks
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Passing Marks
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {examTypes.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {exam.name}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {exam.weightage}%
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {exam.maxMarks}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {exam.passingMarks}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      {exam.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#27348b]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteExam(exam.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Grade Modal */}
      {showGradeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Grade
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Define a new grade range.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowGradeForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Grade
                </label>

                <input
                  type="text"
                  placeholder="Example: A+"
                  value={gradeForm.grade}
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      grade: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Minimum Percentage
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="90"
                    value={gradeForm.minPercentage}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        minPercentage: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Maximum Percentage
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="100"
                    value={gradeForm.maxPercentage}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        maxPercentage: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <input
                  type="text"
                  placeholder="Example: Outstanding"
                  value={gradeForm.description}
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowGradeForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddGrade}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Grade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showExamForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Exam Type
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Configure a new examination type.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowExamForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Exam Type
                </label>

                <input
                  type="text"
                  placeholder="Example: Unit Test 3"
                  value={examForm.name}
                  onChange={(e) =>
                    setExamForm({
                      ...examForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Weightage (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="10"
                    value={examForm.weightage}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        weightage: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Maximum Marks
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={examForm.maxMarks}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        maxMarks: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Passing Marks
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="40"
                  value={examForm.passingMarks}
                  onChange={(e) =>
                    setExamForm({
                      ...examForm,
                      passingMarks: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowExamForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddExam}
                className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
              >
                Add Exam Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GradingExamSettings;