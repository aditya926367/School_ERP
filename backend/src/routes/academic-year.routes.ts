import { Router } from "express";

import {
  getAcademicYearsController,
  getAcademicYearByIdController,
  createAcademicYearController,
  updateAcademicYearController,
  setCurrentAcademicYearController,
  deleteAcademicYearController,
} from "../controllers/academic-year.controller";

const router = Router();

// Get all academic years
router.get("/", getAcademicYearsController);

// Get academic year by ID
router.get("/:id", getAcademicYearByIdController);

// Create academic year
router.post("/", createAcademicYearController);

// Update academic year
router.patch("/:id", updateAcademicYearController);

// Set current academic year
router.patch("/:id/set-current", setCurrentAcademicYearController);

// Delete academic year
router.delete("/:id", deleteAcademicYearController);

export default router;