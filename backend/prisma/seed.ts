import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/utils/password";

async function main() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Test seeding is allowed only in development");
  }

  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error("Set SEED_ADMIN_PASSWORD with at least 12 characters");
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction(async (tx) => {
    // 1. Create test school
    const school = await tx.schools.upsert({
      where: {
        school_code: "demo001",
      },
      update: {},
      create: {
        school_code: "demo001",
        name: "Demo Public School",
        status: "active",
      },
    });

    // 2. Create admin role
    const role = await tx.roles.upsert({
      where: {
        school_id_role_code: {
          school_id: school.id,
          role_code: "admin",
        },
      },
      update: {},
      create: {
        school_id: school.id,
        role_code: "admin",
        role_name: "Administrator",
        is_system_role: true,
      },
    });

    // 3. Create admin user
    const user = await tx.users.upsert({
      where: {
        school_id_username: {
          school_id: school.id,
          username: "admin001",
        },
      },
      update: {},
      create: {
        school_id: school.id,
        username: "admin001",
        full_name: "Demo Administrator",
        password_hash: passwordHash,
        status: "active",
      },
    });

    // 4. Assign admin role
    await tx.user_roles.upsert({
      where: {
        school_id_user_id_role_id: {
          school_id: school.id,
          user_id: user.id,
          role_id: role.id,
        },
      },
      update: {},
      create: {
        school_id: school.id,
        user_id: user.id,
        role_id: role.id,
      },
    });
  });

  console.log("Database seeding completed successfully!");
  console.log("School Code: demo001");
  console.log("Username: admin001");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });