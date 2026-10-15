// src/utils/currentUser.ts
// One place that knows who is logged in and what role they have.
// MyProfile, ChangePassword and Settings all read from here.

export type UserRole =
  | "admin"
  | "teacher"
  | "student"
  | "parent"
  | "library"
  | "certificate";

type RoleDefaults = {
  name: string;
  title: string;
  email: string;
  phone: string;
  extraLabel: string; // one extra read-only detail that fits the role
  extraValue: string;
};

// Default details per role (this is the fake data, change it freely)
const roleDefaults: Record<UserRole, RoleDefaults> = {
  admin: {
    name: "Admin",
    title: "Administrator",
    email: "admin@yourschool.com",
    phone: "+91 98765 43210",
    extraLabel: "Access Level",
    extraValue: "Full Access",
  },
  teacher: {
    name: "Rahul Sharma",
    title: "Teacher",
    email: "teacher@yourschool.com",
    phone: "+91 98765 43211",
    extraLabel: "Department",
    extraValue: "Mathematics",
  },
  student: {
    name: "Aarav Sharma",
    title: "Student",
    email: "student@yourschool.com",
    phone: "+91 98765 43212",
    extraLabel: "Class",
    extraValue: "10 - A",
  },
  parent: {
    name: "Rajesh Sharma",
    title: "Parent",
    email: "parent@yourschool.com",
    phone: "+91 98765 43213",
    extraLabel: "Child",
    extraValue: "Aarav Sharma",
  },
  library: {
    name: "Librarian",
    title: "Library Management",
    email: "library@yourschool.com",
    phone: "+91 98765 43214",
    extraLabel: "Section",
    extraValue: "Central Library",
  },
  certificate: {
    name: "Certificate Manager",
    title: "Certificate Management",
    email: "certificate@yourschool.com",
    phone: "+91 98765 43215",
    extraLabel: "Section",
    extraValue: "Certificates & Awards",
  },
};

// Same sources the header uses: "logged_in_user" (JSON) first, then "role"
export function getUserRole(): UserRole {
  let role = "";
  try {
    const user = JSON.parse(localStorage.getItem("logged_in_user") || "{}");
    role = user.role || "";
  } catch {
    // broken JSON: ignore and use the next source
  }
  if (!role) role = localStorage.getItem("role") || "";

  return role in roleDefaults ? (role as UserRole) : "admin";
}

export function getCurrentUser() {
  const role = getUserRole();
  const defaults = roleDefaults[role];

  // If login saved real name / email / phone, those win over the defaults
  let saved: { name?: string; email?: string; phone?: string } = {};
  try {
    saved = JSON.parse(localStorage.getItem("logged_in_user") || "{}");
  } catch {
    // ignore
  }

  return {
    role,
    // name: saved.name || localStorage.getItem("username") || defaults.name,
        name: saved.name || defaults.name,
    title: defaults.title,
    email: saved.email || defaults.email,
    phone: saved.phone || defaults.phone,
    campus: "Main Campus",
    extraLabel: defaults.extraLabel,
    extraValue: defaults.extraValue,
  };
}

// Small helpers to remember each role's edits (profile / settings) after refresh
export function loadSaved<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveValue(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: ignore
  }
}