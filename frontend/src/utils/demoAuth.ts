
export type DemoUser = {
  userId: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student" | "parent" | "library"|"accountant";
};

const STORAGE_KEY = "school_erp_demo_users";

const defaultUsers: DemoUser[] = [
  {
    userId: "ADMIN",
    email: "admin@school.demo",
    password: "ADMIN",
    role: "admin",
  },
  {
    userId: "TEACHER",
    email: "teacher@school.demo",
    password: "TEACHER",
    role: "teacher",
  },
  {
    userId: "STUDENT",
    email: "student@school.demo",
    password: "STUDENT",
    role: "student",
  },
  {
    userId: "PARENT",
    email: "parent@school.demo",
    password: "PARENT",
    role: "parent",
  },
  {
    userId: "LIBRARY",
    email: "library@school.demo",
    password: "LIBRARY",
    role: "library",
  },
   {
    userId: "ACCOUNTANT",
    email: "accountant@school.demo",
    password: "ACCOUNTANT",
    role: "accountant",
  },
];

// export function getDemoUsers(): DemoUser[] {
//   const savedUsers = localStorage.getItem(STORAGE_KEY);

//   if (savedUsers) {
//     return JSON.parse(savedUsers) as DemoUser[];
//   }

//   localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
//   return defaultUsers;
// }
export function getDemoUsers(): DemoUser[] {
  const savedUsers = localStorage.getItem(STORAGE_KEY);

  if (savedUsers) {
    const saved = JSON.parse(savedUsers) as DemoUser[];

    // Add any default user that is missing (for example a newly added role)
    const missing = defaultUsers.filter(
      (d) => !saved.some((s) => s.userId === d.userId)
    );

    if (missing.length > 0) {
      const merged = [...saved, ...missing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return saved;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function saveDemoUsers(users: DemoUser[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function loginDemoUser(
  userId: string,
  password: string
): DemoUser | undefined {
  const users = getDemoUsers();

  return users.find(
    (user) =>
      (user.userId.toLowerCase() === userId.trim().toLowerCase() ||
        user.email.toLowerCase() === userId.trim().toLowerCase()) &&
      user.password === password
  );
}

export function resetDemoPassword(
  email: string,
  newPassword: string
): boolean {
  const users = getDemoUsers();

  const userIndex = users.findIndex(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (userIndex === -1) {
    return false;
  }

  users[userIndex].password = newPassword;
  saveDemoUsers(users);

  return true;
}
