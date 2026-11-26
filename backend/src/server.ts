
import "dotenv/config";
import express from "express";
import prisma from "./lib/prisma"; 
import apiRoutes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";


const app = express();
const PORT = env.port;

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", apiRoutes);

// Database connection check
async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`School ERP backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();