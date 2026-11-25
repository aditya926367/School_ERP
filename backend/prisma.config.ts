import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
<<<<<<< HEAD
=======
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

>>>>>>> main
  datasource: {
    url: env("DATABASE_URL"),
  },
});