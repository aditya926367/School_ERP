import { Router } from "express";

import {
  getSchoolProfileController,
  updateSchoolProfileController,
} from "../controllers/admin.controller";

import academicYearRoutes from "./academic-year.routes";
import classSectionRoutes from "./class-section.routes";
import subjectRoutes from "./subject.routes";

const router = Router();

// School Profile
router.get(
  "/school-profile",
  getSchoolProfileController
);

router.patch(
  "/school-profile",
  updateSchoolProfileController
);

// Academic Year Management
router.use("/academic-years", academicYearRoutes);

// Classes and Sections Management
router.use("/", classSectionRoutes);

// Subject Management
router.use("/", subjectRoutes);

export default router;