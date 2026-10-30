
import {
  useMemo,
  useState,
  type ReactNode,
  type FormEvent,
} from "react";

import {
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Check,
  LockKeyhole,
  UsersRound,
  BookOpen,
  GraduationCap,
  Wallet,
  Megaphone,
  BarChart3,
  Settings2,
  LayoutDashboard,
} from "lucide-react";

type Permission = {
  key: string;
  label: string;
  description: string;
};

type Category = {
  name: string;
  icon: ReactNode;
  permissions: Permission[];
};

type Role = {
  id: string;
  name: string;
  description: string;
  system: boolean;
  permissions: string[];
};

const KEY = "schoolerp:admin:roles-permissions:v2";

const categories: Category[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    permissions: [
      {
        key: "dashboard.view",
        label: "View dashboard",
        description: "Access dashboard and summary widgets",
      },
    ],
  },
  {
    name: "Users & roles",
    icon: <UsersRound size={18} />,
    permissions: [
      {
        key: "users.view",
        label: "View users",
        description: "View the user account directory",
      },
      {
        key: "users.create",
        label: "Create users",
        description: "Create new user accounts",
      },
      {
        key: "users.edit",
        label: "Edit users",
        description: "Update user details and status",
      },
      {
        key: "users.delete",
        label: "Delete users",
        description: "Remove user accounts",
      },
      {
        key: "roles.manage",
        label: "Manage roles",
        description: "Create roles and configure permissions",
      },
    ],
  },
  {
    name: "Students",
    icon: <GraduationCap size={18} />,
    permissions: [
      {
        key: "students.view",
        label: "View students",
        description: "View student profiles and records",
      },
      {
        key: "students.manage",
        label: "Manage students",
        description: "Add, edit, and archive students",
      },
    ],
  },
  {
    name: "Academics",
    icon: <BookOpen size={18} />,
    permissions: [
      {
        key: "classes.view",
        label: "View classes",
        description: "View classes, sections, and subjects",
      },
      {
        key: "classes.manage",
        label: "Manage classes",
        description: "Create and edit academic structure",
      },
      {
        key: "attendance.manage",
        label: "Manage attendance",
        description: "Record and correct attendance",
      },
      {
        key: "exams.manage",
        label: "Manage exams & marks",
        description: "Configure exams and enter marks",
      },
    ],
  },
  {
    name: "Finance",
    icon: <Wallet size={18} />,
    permissions: [
      {
        key: "fees.view",
        label: "View fees",
        description: "View fee plans and payment status",
      },
      {
        key: "fees.manage",
        label: "Manage fees",
        description: "Create invoices and record payments",
      },
    ],
  },
  {
    name: "Communication",
    icon: <Megaphone size={18} />,
    permissions: [
      {
        key: "announcements.manage",
        label: "Manage announcements",
        description: "Create and publish school notices",
      },
    ],
  },
  {
    name: "Reports",
    icon: <BarChart3 size={18} />,
    permissions: [
      {
        key: "reports.view",
        label: "View reports",
        description: "Access school reports and exports",
      },
    ],
  },
  {
    name: "Settings",
    icon: <Settings2 size={18} />,
    permissions: [
      {
        key: "settings.manage",
        label: "Manage settings",
        description: "Change school-wide configuration",
      },
    ],
  },
];

const allKeys = categories.flatMap((category) =>
  category.permissions.map((permission) => permission.key)
);

const defaultRoles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all school ERP modules.",
    system: true,
    permissions: [...allKeys],
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "Classroom, attendance, and academic tasks.",
    system: true,
    permissions: [
      "dashboard.view",
      "students.view",
      "classes.view",
      "attendance.manage",
      "exams.manage",
      "announcements.manage",
      "reports.view",
    ],
  },
  {
    id: "student",
    name: "Student",
    description: "Read-only access to personal academic information.",
    system: true,
    permissions: [
      "dashboard.view",
      "students.view",
      "classes.view",
      "fees.view",
    ],
  },
  {
    id: "parent",
    name: "Parent",
    description: "View child progress, attendance, and fees.",
    system: true,
    permissions: [
      "dashboard.view",
      "students.view",
      "attendance.manage",
      "fees.view",
    ],
  },
];

function readRoles(): Role[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Role[]) : defaultRoles;
  } catch {
    return defaultRoles;
  }
}

const roleColors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
];

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(readRoles);
  const [selectedId, setSelectedId] = useState("admin");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All modules");

  const [editing, setEditing] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPermissions, setFormPermissions] = useState<string[]>([]);
  const [error, setError] = useState("");

  const selected =
    roles.find((role) => role.id === selectedId) ?? roles[0];

  const persist = (next: Role[]) => {
    setRoles(next);

    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage may be disabled.
    }
  };

  const visibleCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          (categoryFilter === "All modules" ||
            category.name === categoryFilter) &&
          `${category.name} ${category.permissions
            .map(
              (permission) =>
                permission.label + " " + permission.description
            )
            .join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [query, categoryFilter]
  );

  const openNew = () => {
    setEditing(null);
    setFormName("");
    setFormDescription("");
    setFormPermissions([]);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditing(role);
    setFormName(role.name);
    setFormDescription(role.description);
    setFormPermissions([...role.permissions]);
    setError("");
    setModalOpen(true);
  };

  const togglePermission = (key: string) => {
    if (!selected || selected.name === "Administrator") return;

    persist(
      roles.map((role) =>
        role.id === selectedId
          ? {
              ...role,
              permissions: role.permissions.includes(key)
                ? role.permissions.filter((item) => item !== key)
                : [...role.permissions, key],
            }
          : role
      )
    );
  };

  const toggleCategory = (keys: string[]) => {
    if (!selected || selected.name === "Administrator") return;

    const hasAll = keys.every((key) =>
      selected.permissions.includes(key)
    );

    persist(
      roles.map((role) =>
        role.id === selectedId
          ? {
              ...role,
              permissions: hasAll
                ? role.permissions.filter((key) => !keys.includes(key))
                : [...new Set([...role.permissions, ...keys])],
            }
          : role
      )
    );
  };

  const saveRole = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formName.trim()) {
      setError("Enter a role name.");
      return;
    }

    if (
      roles.some(
        (role) =>
          role.name.toLowerCase() === formName.trim().toLowerCase() &&
          role.id !== editing?.id
      )
    ) {
      setError("A role with this name already exists.");
      return;
    }

    if (editing) {
      const next = roles.map((role) =>
        role.id === editing.id
          ? {
              ...role,
              name: formName.trim(),
              description: formDescription.trim(),
              permissions:
                role.name === "Administrator"
                  ? [...allKeys]
                  : formPermissions,
            }
          : role
      );

      persist(next);
      setSelectedId(editing.id);
    } else {
      const id = `role-${Date.now()}`;

      persist([
        ...roles,
        {
          id,
          name: formName.trim(),
          description: formDescription.trim(),
          system: false,
          permissions: formPermissions,
        },
      ]);

      setSelectedId(id);
    }

    setEditing(null);
    setModalOpen(false);
  };

  const deleteRole = (role: Role) => {
    if (role.system) return;

    if (window.confirm(`Delete the "${role.name}" role?`)) {
      const next = roles.filter((item) => item.id !== role.id);

      persist(next);

      if (selectedId === role.id) {
        setSelectedId(next[0]?.id ?? "");
      }
    }
  };

  const activeCount = roles.filter(
    (role) => role.permissions.length > 0
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <ShieldCheck size={16} />
              Administration <span>/</span> Access control
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Roles & Permissions
            </h1>

            <p className="mt-1 max-w-2xl text-slate-500">
              Define what each role can view and manage across your
              school ERP.
            </p>
          </div>

          <button
            onClick={openNew}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#27348b] px-4 py-3 text-sm font-semibold text-white shadow-sm "
          >
            <Plus size={18} />
            Create role
          </button>
        </header>

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Total roles"
            value={roles.length}
            icon={<ShieldCheck size={20} />}
            detail="System and custom roles"
          />

          <Stat
            label="System roles"
            value={roles.filter((role) => role.system).length}
            icon={<LockKeyhole size={20} />}
            detail="Protected default roles"
          />

          <Stat
            label="Permission modules"
            value={categories.length}
            icon={<Settings2 size={20} />}
            detail={`${allKeys.length} configurable permissions`}
          />
        </section>

        {/* Role directory and permission matrix */}
        <div className="grid items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="font-semibold text-slate-900">
                Role directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a role to configure access.
              </p>
            </div>

            <div className="space-y-2 p-3">
              {roles.map((role, index) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedId(role.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedId === role.id
                      ? "border-indigo-200 bg-indigo-50 ring-1 ring-indigo-100"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        roleColors[index % roleColors.length]
                      }`}
                    >
                      <ShieldCheck size={19} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-semibold text-slate-800">
                        {role.name}

                        {role.system && (
                          <LockKeyhole
                            size={12}
                            className="text-slate-400"
                          />
                        )}
                      </span>

                      <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-500">
                        {role.description || "No description added."}
                      </span>

                      <span className="mt-2 inline-flex rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                        {role.permissions.length} permissions
                      </span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
              {activeCount} roles have at least one permission.
            </div>
          </aside>

          {/* Permission configuration */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {selected?.name ?? "Select a role"}
                    </h2>

                    {selected?.system && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        <LockKeyhole size={12} />
                        System role
                      </span>
                    )}
                  </div>

                  <p className="mt-1 max-w-xl text-sm text-slate-500">
                    {selected?.description}
                  </p>

                  <p className="mt-3 text-sm font-medium text-indigo-700">
                    {selected?.permissions.length ?? 0} of{" "}
                    {allKeys.length} permissions enabled
                  </p>
                </div>

                {selected && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => openEdit(selected)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      {selected.system ? "Edit details" : "Edit role"}
                    </button>

                    {!selected.system && (
                      <button
                        onClick={() => deleteRole(selected)}
                        className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                        title="Delete role"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${
                      selected
                        ? (selected.permissions.length / allKeys.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Search and module filter */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Permission matrix
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Enable only the access this role needs.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Find a permission"
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 sm:w-52"
                  />
                </label>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
                >
                  {[
                    "All modules",
                    ...categories.map((category) => category.name),
                  ].map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Permission groups */}
            <div className="divide-y divide-slate-100">
              {visibleCategories.map((category) => {
                const keys = category.permissions.map(
                  (permission) => permission.key
                );

                const enabled = keys.filter((key) =>
                  selected?.permissions.includes(key)
                ).length;

                const hasAll = keys.every((key) =>
                  selected?.permissions.includes(key)
                );

                return (
                  <div key={category.name}>
                    <div className="flex items-center justify-between bg-slate-50/70 px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-indigo-600">
                          {category.icon}
                        </span>

                        <h4 className="text-sm font-bold text-slate-800">
                          {category.name}
                        </h4>

                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                          {enabled}/{keys.length}
                        </span>
                      </div>

                      <button
                        disabled={
                          !selected ||
                          selected.name === "Administrator"
                        }
                        onClick={() => toggleCategory(keys)}
                        className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        {hasAll ? "Deselect all" : "Select all"}
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {category.permissions.map((permission) => {
                        const checked =
                          selected?.permissions.includes(
                            permission.key
                          ) ?? false;

                        return (
                          <label
                            key={permission.key}
                            className={`flex cursor-pointer items-center gap-3 px-5 py-3.5 transition hover:bg-slate-50 ${
                              selected?.name === "Administrator"
                                ? "cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={
                                !selected ||
                                selected.name === "Administrator"
                              }
                              onChange={() =>
                                togglePermission(permission.key)
                              }
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-60"
                            />

                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-slate-800">
                                {permission.label}
                              </span>

                              <span className="mt-0.5 block text-xs text-slate-500">
                                {permission.description}
                              </span>
                            </span>

                            {checked ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                <Check size={14} />
                                Enabled
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">
                                Disabled
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {visibleCategories.length === 0 && (
                <div className="p-10 text-center text-sm text-slate-500">
                  No matching permissions found.
                </div>
              )}
            </div>

           
          </section>
        </div>
      </div>

      {/* Create/edit role modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <form
            onSubmit={saveRole}
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editing ? "Edit role details" : "Create custom role"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Name the role and choose its permissions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <label className="block text-sm font-medium text-slate-700">
                Role name

                <input
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="e.g. Accountant"
                  autoFocus
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Description

                <textarea
                  value={formDescription}
                  onChange={(event) =>
                    setFormDescription(event.target.value)
                  }
                  rows={2}
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Describe what this role is responsible for"
                />
              </label>

              {editing?.system && (
                <p className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  System roles cannot be deleted. The Administrator
                  role always retains all permissions.
                </p>
              )}

              {!editing?.system && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Permissions
                    </span>

                    <span className="text-xs text-slate-500">
                      {formPermissions.length} selected
                    </span>
                  </div>

                  <div className="max-h-52 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                    {categories.map((category) => (
                      <div key={category.name} className="py-1">
                        <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                          {category.name}
                        </p>

                        {category.permissions.map((permission) => (
                          <label
                            key={permission.key}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50"
                          >
                            <input
                              type="checkbox"
                              checked={formPermissions.includes(
                                permission.key
                              )}
                              onChange={() =>
                                setFormPermissions((previous) =>
                                  previous.includes(permission.key)
                                    ? previous.filter(
                                        (key) =>
                                          key !== permission.key
                                      )
                                    : [...previous, permission.key]
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />

                            {permission.label}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Save size={16} />
                Save role
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
  detail,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
