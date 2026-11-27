import { Router } from "express";

import {
  getClassesController,
  getClassByIdController,
  createClassController,
  updateClassController,
  deleteClassController,
  getSectionsController,
  createSectionController,
  updateSectionController,
  deleteSectionController,
} from "../controllers/class-section.controller";

const router = Router();

// Class routes
router.get("/classes", getClassesController);

router.get("/classes/:id", getClassByIdController);

router.post("/classes", createClassController);

router.patch("/classes/:id", updateClassController);

router.delete("/classes/:id", deleteClassController);

// Section routes
router.get(
  "/classes/:classId/sections",
  getSectionsController
);

router.post(
  "/classes/:classId/sections",
  createSectionController
);

router.patch(
  "/sections/:id",
  updateSectionController
);

router.delete(
  "/sections/:id",
  deleteSectionController
);

export default router;