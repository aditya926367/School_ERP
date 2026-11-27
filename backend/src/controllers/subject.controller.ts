import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import {
  SubjectError,
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getClassSubjects,
  createClassSubject,
  updateClassSubject,
  deleteClassSubject,
} from "../services/subject.service";

import {
  subjectIdSchema,
  createSubjectSchema,
  updateSubjectSchema,
  createClassSubjectSchema,
  updateClassSubjectSchema,
  classSubjectQuerySchema,
} from "../validations/subject.validation";

import { getSchoolId } from "../utils/tenant";

// Success response
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

// Error handler
function handleError(res: Response, error: unknown) {
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

  if (error instanceof SubjectError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    const errors: Record<
      string,
      { status: number; message: string }
    > = {
      P2002: {
        status: 409,
        message: "Subject or assignment already exists",
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

    const mapped = errors[error.code];

    if (mapped) {
      res.status(mapped.status).json({
        success: false,
        message: mapped.message,
      });
      return;
    }
  }

  console.error("Subject management error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

// ================================
// SUBJECT CONTROLLERS
// ================================

// 1. Get all subjects
export async function getSubjectsController(
  req: Request,
  res: Response
) {
  try {
    const data = await getSubjects(getSchoolId(req));

    sendSuccess(
      res,
      "Subjects retrieved successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 2. Get subject by ID
export async function getSubjectByIdController(
  req: Request,
  res: Response
) {
  try {
    const id = subjectIdSchema.parse(req.params.id);

    const data = await getSubjectById(
      getSchoolId(req),
      id
    );

    sendSuccess(
      res,
      "Subject retrieved successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 3. Create subject
export async function createSubjectController(
  req: Request,
  res: Response
) {
  try {
    const input = createSubjectSchema.parse(req.body);

    const data = await createSubject(
      getSchoolId(req),
      input
    );

    sendSuccess(
      res,
      "Subject created successfully",
      data,
      201
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 4. Update subject
export async function updateSubjectController(
  req: Request,
  res: Response
) {
  try {
    const id = subjectIdSchema.parse(req.params.id);
    const input = updateSubjectSchema.parse(req.body);

    const data = await updateSubject(
      getSchoolId(req),
      id,
      input
    );

    sendSuccess(
      res,
      "Subject updated successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 5. Delete subject
export async function deleteSubjectController(
  req: Request,
  res: Response
) {
  try {
    const id = subjectIdSchema.parse(req.params.id);

    await deleteSubject(getSchoolId(req), id);

    sendSuccess(
      res,
      "Subject deleted successfully",
      null
    );
  } catch (error) {
    handleError(res, error);
  }
}

// ================================
// CLASS SUBJECT CONTROLLERS
// ================================

// 6. Get subject assignments
export async function getClassSubjectsController(
  req: Request,
  res: Response
) {
  try {
    const filters =
      classSubjectQuerySchema.parse(req.query);

    const data = await getClassSubjects(
      getSchoolId(req),
      filters
    );

    sendSuccess(
      res,
      "Class subjects retrieved successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 7. Assign subject to class
export async function createClassSubjectController(
  req: Request,
  res: Response
) {
  try {
    const input =
      createClassSubjectSchema.parse(req.body);

    const data = await createClassSubject(
      getSchoolId(req),
      input
    );

    sendSuccess(
      res,
      "Subject assigned successfully",
      data,
      201
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 8. Update assigned teacher
export async function updateClassSubjectController(
  req: Request,
  res: Response
) {
  try {
    const id = subjectIdSchema.parse(req.params.id);

    const input =
      updateClassSubjectSchema.parse(req.body);

    const data = await updateClassSubject(
      getSchoolId(req),
      id,
      input
    );

    sendSuccess(
      res,
      "Subject assignment updated successfully",
      data
    );
  } catch (error) {
    handleError(res, error);
  }
}

// 9. Delete subject assignment
export async function deleteClassSubjectController(
  req: Request,
  res: Response
) {
  try {
    const id = subjectIdSchema.parse(req.params.id);

    await deleteClassSubject(getSchoolId(req), id);

    sendSuccess(
      res,
      "Subject assignment deleted successfully",
      null
    );
  } catch (error) {
    handleError(res, error);
  }
}