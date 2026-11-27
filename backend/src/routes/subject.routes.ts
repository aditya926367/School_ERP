import { Router } from "express";

import {
  getSubjectsController,
  getSubjectByIdController,
  createSubjectController,
  updateSubjectController,
  deleteSubjectController,
  getClassSubjectsController,
  createClassSubjectController,
  updateClassSubjectController,
  deleteClassSubjectController,
} from "../controllers/subject.controller";

const router = Router();

// Subject Management
router.get("/subjects", getSubjectsController);

router.get("/subjects/:id", getSubjectByIdController);

router.post("/subjects", createSubjectController);

router.patch("/subjects/:id", updateSubjectController);

router.delete("/subjects/:id", deleteSubjectController);

// Class Subject Assignment
router.get(
  "/class-subjects",
  getClassSubjectsController
);

router.post(
  "/class-subjects",
  createClassSubjectController
);

router.patch(
  "/class-subjects/:id",
  updateClassSubjectController
);

router.delete(
  "/class-subjects/:id",
  deleteClassSubjectController
);

export default router;