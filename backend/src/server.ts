import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

// Allow only our frontend (Vite dev server) to call this API
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use("/api/health", healthRoutes);

app.listen(env.port, async () => {
  console.log(`School ERP backend running on http://localhost:${env.port}`);
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("MySQL connected");
  } catch (error) {
    console.error("MySQL connection failed:", error);
  }
});