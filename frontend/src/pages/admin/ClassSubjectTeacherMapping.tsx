import { useMemo, useState } from "react";
import { Plus, X, BookOpen, Users, GraduationCap } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/common/PageHeader";
import SummaryCard from "../../components/common/SummaryCard";
import StatusBadge from "../../components/common/StatusBadge";
import {
  EditButton,
  DeleteButton,
} from "../../components/common/ActionButtons";


interface Mapping {
  id: number;
  className: string;
  section: string;
  subject: string;
  subjectCode: string;
  teacher: string;
  type: "Core" | "Elective";
}

interface MappingForm {
  className: string;
  section: string;
  subject: string;
  teacher: string;
}

const initialMappings: Mapping[] = [
  { id: 1, className: "Class 8", section: "A", subject: "Mathematics", subjectCode: "MATH", teacher: "Rahul Sharma", type: "Core" },
  { id: 2, className: "Class 8", section: "A", subject: "Science", subjectCode: "SCI", teacher: "Priya Singh", type: "Core" },
  { id: 3, className: "Class 8", section: "A", subject: "English", subjectCode: "ENG", teacher: "Neha Verma", type: "Core" },
  { id: 4, className: "Class 8", section: "B", subject: "Mathematics", subjectCode: "MATH", teacher: "Rahul Sharma", type: "Core" },
  { id: 5, className: "Class 9", section: "A", subject: "Science", subjectCode: "SCI", teacher: "Amit Kumar", type: "Core" },
];

const subjects = [
  { name: "Mathematics", code: "MATH", type: "Core" as const },
  { name: "Science", code: "SCI", type: "Core" as const },
  { name: "English", code: "ENG", type: "Core" as const },
  { name: "Computer Science", code: "CS", type: "Elective" as const },
  { name: "French", code: "FRE", type: "Elective" as const },
];

const teachers = ["Rahul Sharma", "Priya Singh", "Amit Kumar", "Neha Verma", "Vikas Gupta"];
const classes = [
  { name: "Class 8", sections: ["A", "B"] },
  { name: "Class 9", sections: ["A", "B"] },
  { name: "Class 10", sections: ["A"] },
];

export default function ClassSubjectTeacherMapping() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [mappings, setMappings] = useState<Mapping[]>(initialMappings);
  const [form, setForm] = useState<MappingForm>({
    className: "",
    section: "",
    subject: "",
    teacher: "",
  });

  const selectedClass = classes.find((schoolClass) => schoolClass.name === form.className);
  const selectedSubject = subjects.find((subject) => subject.name === form.subject);

  const filteredMappings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mappings.filter((mapping) =>
      [mapping.className, mapping.section, mapping.subject, mapping.subjectCode, mapping.teacher, mapping.type]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [mappings, search]);

  const classesCovered = new Set(mappings.map((mapping) => `${mapping.className}-${mapping.section}`)).size;
  const teachersAssigned = new Set(mappings.map((mapping) => mapping.teacher)).size;

  const resetForm = () => {
    setForm({ className: "", section: "", subject: "", teacher: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddMapping = () => {
    if (!form.className || !form.section || !form.subject || !form.teacher || !selectedSubject) return;

    const duplicate = mappings.some(
      (mapping) =>
        mapping.id !== editingId &&
        mapping.className === form.className &&
        mapping.section === form.section &&
        mapping.subject === selectedSubject.name
    );
    if (duplicate) {
      window.alert("This subject is already assigned to the selected class and section.");
      return;
    }

    const updatedMapping: Mapping = {
      id: editingId ?? Date.now(),
      className: form.className,
      section: form.section,
      subject: selectedSubject.name,
      subjectCode: selectedSubject.code,
      teacher: form.teacher,
      type: selectedSubject.type,
    };

    setMappings((current) =>
      editingId === null
        ? [...current, updatedMapping]
        : current.map((mapping) => (mapping.id === editingId ? updatedMapping : mapping))
    );
    resetForm();
  };

  const deleteMapping = (id: number) => {
    setMappings((current) => current.filter((mapping) => mapping.id !== id));
  };

  const columns = [
    {
      key: "className",
      header: "Class",
      render: (mapping: Mapping) => <span className="font-medium text-gray-800">{mapping.className}</span>,
    },
    {
      key: "section",
      header: "Section",
      render: (mapping: Mapping) => (
        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{mapping.section}</span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (mapping: Mapping) => (
        <div>
          <p className="font-medium text-gray-800">{mapping.subject}</p>
          <p className="mt-0.5 text-xs text-gray-400">{mapping.subjectCode}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (mapping: Mapping) => (
        <StatusBadge
          status={mapping.type}
          className={mapping.type === "Core" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}
        />
      ),
    },
    {
      key: "teacher",
      header: "Teacher",
      render: (mapping: Mapping) => <span className="text-gray-600">{mapping.teacher}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (mapping: Mapping) => (
        <div className="flex justify-end gap-1">
  <EditButton
    title="Edit Mapping"
    onClick={() => {
      setEditingId(mapping.id);
      setForm({
        className: mapping.className,
        section: mapping.section,
        subject: mapping.subject,
        teacher: mapping.teacher,
      });
      setShowForm(true);
    }}
  />

  <DeleteButton
    title="Delete Mapping"
    onClick={() => deleteMapping(mapping.id)}
  />
</div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class-Subject-Teacher Mapping"
        description="Assign subjects and teachers to each class and section."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ className: "", section: "", subject: "", teacher: "" });
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
          >
            <Plus size={18} />
            Add Mapping
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SummaryCard
          label="Total Mappings"
          value={mappings.length}
          icon={<BookOpen size={22} />}
          iconBackgroundClassName="bg-[#27348b]/10"
          iconClassName="text-[#27348b]"
        />
        <SummaryCard
          label="Classes Covered"
          value={classesCovered}
          icon={<GraduationCap size={22} />}
          iconBackgroundClassName="bg-blue-50"
          iconClassName="text-blue-600"
        />
        <SummaryCard
          label="Teachers Assigned"
          value={teachersAssigned}
          icon={<Users size={22} />}
          iconBackgroundClassName="bg-green-50"
          iconClassName="text-green-600"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Mapping List</h2>
            <p className="mt-1 text-sm text-gray-500">Current subject and teacher assignments.</p>
          </div>
          <div className="w-full sm:w-72">
            <SearchBar value={search} onChange={setSearch} placeholder="Search mappings..." />
          </div>
        </div>

        <DataTable
          data={filteredMappings}
          columns={columns}
          rowKey={(mapping: Mapping) => mapping.id}
          emptyState={
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-medium text-gray-700">No mappings found.</p>
              <p className="mt-1 text-sm text-gray-500">Try another search or add a mapping.</p>
            </div>
          }
        />
      </section>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) resetForm();
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{editingId === null ? "Add Mapping" : "Edit Mapping"}</h2>
                <p className="mt-1 text-xs text-gray-500">Assign a subject and teacher to a class section.</p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                aria-label="Close mapping form"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="space-y-5 p-6"
              onSubmit={(event) => {
                event.preventDefault();
                handleAddMapping();
              }}
            >
              <FormSelect
                label="Class"
                value={form.className}
                placeholder="Select class"
                options={classes.map((schoolClass) => ({ label: schoolClass.name, value: schoolClass.name }))}
                onChange={(value) =>
                  setForm((current) => ({ ...current, className: value, section: "" }))
                }
                required
              />
              <FormSelect
                label="Section"
                value={form.section}
                placeholder="Select section"
                options={(selectedClass?.sections ?? []).map((section) => ({
                  label: `Section ${section}`,
                  value: section,
                }))}
                onChange={(value) => setForm((current) => ({ ...current, section: value }))}
                disabled={!selectedClass}
                required
              />
              <FormSelect
                label="Subject"
                value={form.subject}
                placeholder="Select subject"
                options={subjects.map((subject) => ({
                  label: `${subject.name} (${subject.code})`,
                  value: subject.name,
                }))}
                onChange={(value) => setForm((current) => ({ ...current, subject: value }))}
                required
              />
              <FormSelect
                label="Teacher"
                value={form.teacher}
                placeholder="Select teacher"
                options={teachers.map((teacher) => ({ label: teacher, value: teacher }))}
                onChange={(value) => setForm((current) => ({ ...current, teacher: value }))}
                required
              />

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#27348b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2a70]"
                >
                  {editingId === null ? "Add Mapping" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FormSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
  required = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        required={required}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10 disabled:bg-gray-100"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
