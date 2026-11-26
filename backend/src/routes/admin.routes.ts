import { Router } from "express";

import {
  getSchoolProfileController,
  updateSchoolProfileController,
} from "../controllers/admin.controller";

import academicYearRoutes from "./academic-year.routes";

const router = Router();

// School Profile
router.get("/school-profile", getSchoolProfileController);
router.patch("/school-profile", updateSchoolProfileController);

// Academic Year Management
router.use("/academic-years", academicYearRoutes);

export default router;