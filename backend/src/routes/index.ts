
import { Router } from "express";

import healthRoutes from "./health.routes";
import adminRoutes from "./admin.routes";
import studentRoutes from "./student.routes";
import parentRoutes from "./parent.routes";
import teacherRoutes from "./teacher.routes";
import libraryRoutes from "./library.routes";
import accountantRoutes from "./accountant.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/parent", parentRoutes);
router.use("/teacher", teacherRoutes);
router.use("/library", libraryRoutes);
router.use("/accountant", accountantRoutes);

export default router;
