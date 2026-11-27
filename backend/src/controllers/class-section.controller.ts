import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import {
  ClassSectionError,
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getSections,
  createSection,
  updateSection,
  deleteSection,
} from "../services/class-section.service";

import {
  idSchema,
  createClassSchema,
  updateClassSchema,
  createSectionSchema,
  updateSectionSchema,
} from "../validations/class-section.validation";

import { getSchoolId } from "../utils/tenant";

// Reusable success response
function sendSuccess(
  res: Response,
  message: string,
  data: unknown,
  statusCode = 200
) {
  res.setHeader("Cache-Control", "no-store");

  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

// Reusable error handler
function handleError(res: Response, error: unknown) {
  // Validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Invalid request data",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Business logic errors
  if (error instanceof ClassSectionError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Prisma errors
  if (
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    const errors: Record<
      string,
      { status: number; message: string }
    > = {
      P2002: {
        status: 409,
        message: "Record already exists",
      },
      P2003: {
        status: 409,
        message: "Related record conflict",
      },
      P2025: {
        status: 404,
        message: "Record not found",
      },
      P2034: {
        status: 409,
        message: "Concurrent operation detected. Please try again.",
      },
    };

    const mappedError = errors[error.code];

    if (mappedError) {
      res.status(mappedError.status).json({
        success: false,
        message: mappedError.message,
      });
      return;
    }
  }

  console.error("Class/Section error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

// ================================
// CLASS CONTROLLERS
// ================================

// 1. Get all classes
export async function getClassesController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);

    const data = await getClasses(schoolId);

    sendSuccess(
      res,
      "Classes retrieved successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 2. Get class by ID
export async function getClassByIdController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);
    const id = idSchema.parse(req.params.id);

    const data = await getClassById(schoolId, id);

    sendSuccess(
      res,
      "Class retrieved successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 3. Create class
export async function createClassController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);
    const input = createClassSchema.parse(req.body);

    const data = await createClass(schoolId, input);

    sendSuccess(
      res,
      "Class created successfully",
      data,
      201
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 4. Update class
export async function updateClassController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);
    const id = idSchema.parse(req.params.id);
    const input = updateClassSchema.parse(req.body);

    const data = await updateClass(
      schoolId,
      id,
      input
    );

    sendSuccess(
      res,
      "Class updated successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 5. Delete class
export async function deleteClassController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);
    const id = idSchema.parse(req.params.id);

    await deleteClass(schoolId, id);

    sendSuccess(
      res,
      "Class deleted successfully",
      null
    );
  } catch (error) {
    handleError(res, error);
  }
}

// ================================
// SECTION CONTROLLERS
// ================================

// 6. Get sections
export async function getSectionsController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);
    const classId = idSchema.parse(req.params.classId);

    const data = await getSections(
      schoolId,
      classId
    );

    sendSuccess(
      res,
      "Sections retrieved successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 7. Create section
export async function createSectionController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);
    const classId = idSchema.parse(req.params.classId);
    const input = createSectionSchema.parse(req.body);

    const data = await createSection(
      schoolId,
      classId,
      input
    );

    sendSuccess(
      res,
      "Section created successfully",
      data,
      201
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 8. Update section
export async function updateSectionController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);
    const id = idSchema.parse(req.params.id);
    const input = updateSectionSchema.parse(req.body);

    const data = await updateSection(
      schoolId,
      id,
      input
    );

    sendSuccess(
      res,
      "Section updated successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 9. Delete section
export async function deleteSectionController(
  req: Request,
  res: Response
) {
  try {
    const schoolId = getSchoolId(req);
    const id = idSchema.parse(req.params.id);

    await deleteSection(schoolId, id);

    sendSuccess(
      res,
      "Section deleted successfully",
      null
    );
  } catch (error) {
    handleError(res, error);
  }
}