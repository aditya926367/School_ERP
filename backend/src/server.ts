import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import { env } from "./config/env.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);

app.listen(env.port, () => {
  console.log(
    `School ERP backend running on http://localhost:${env.port}`
  );
});