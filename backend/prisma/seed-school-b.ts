import "dotenv/config";
import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/utils/password";

async function main() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Seeding is allowed only in development");
  }

  const password = process.env.SEED_ADMIN_B_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error(
      "SEED_ADMIN_B_PASSWORD must contain at least 12 characters"
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction(async (tx) => {
    // 1. Create School B
    const school = await tx.schools.upsert({
      where: {
        school_code: "demo002",
      },
      update: {},
      create: {
        school_code: "demo002",
        name: "Demo International School",
        status: "active",
      },
    });

    // 2. Create Admin role
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

    // 3. Create Admin user
    const user = await tx.users.upsert({
      where: {
        school_id_username: {
          school_id: school.id,
          username: "admin002",
        },
      },
      update: {},
      create: {
        school_id: school.id,
        username: "admin002",
        full_name: "Demo Administrator B",
        password_hash: passwordHash,
        status: "active",
      },
    });

    // 4. Assign Admin role
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

    console.log("School B created successfully!");
    console.log("School code:", school.school_code);
    console.log("Username:", user.username);
  });
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });