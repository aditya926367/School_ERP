
import { Router } from "express";

import healthRoutes from "./health.routes";
import adminRoutes from "./admin.routes";
import studentRoutes from "./student.routes";
import parentRoutes from "./parent.routes";
import teacherRoutes from "./teacher.routes";
import libraryRoutes from "./library.routes";
import accountantRoutes from "./accountant.routes";
import authRoutes from "./auth.routes";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use("/health", healthRoutes);
router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/parent", parentRoutes);
router.use("/teacher", teacherRoutes);
router.use("/library", libraryRoutes);
router.use("/accountant", accountantRoutes);
router.use("/auth", authRoutes);

// Public routes
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

// Protected routes
router.use(
  "/admin",
  authenticate,
  authorize("admin"),
  adminRoutes
);

router.use(
  "/teacher",
  authenticate,
  authorize("teacher"),
  teacherRoutes
);

router.use(
  "/student",
  authenticate,
  authorize("student"),
  studentRoutes
);

router.use(
  "/parent",
  authenticate,
  authorize("parent"),
  parentRoutes
);

router.use(
  "/library",
  authenticate,
  authorize("admin", "librarian"),
  libraryRoutes
);

router.use(
  "/accountant",
  authenticate,
  authorize("admin", "accountant"),
  accountantRoutes
);



export default router;
