import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import {
  getAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  setCurrentAcademicYear,
  deleteAcademicYear,
} from "../services/academic-year.service";

import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
  academicYearIdSchema,
} from "../validations/academic-year.validation";

import { getSchoolId } from "../utils/tenant";

// 1. Get all academic years
export async function getAcademicYearsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const schoolId = getSchoolId(req);

    const academicYears = await getAcademicYears(schoolId);

    res.setHeader("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      message: "Academic years retrieved successfully",
      data: academicYears,
    });
  } catch (error) {
    console.error("Get academic years error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// 2. Get academic year by ID
export async function getAcademicYearByIdController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const schoolId = getSchoolId(req);

    const parsedId = academicYearIdSchema.safeParse(
      req.params.id
    );

    if (!parsedId.success) {
      res.status(400).json({
        success: false,
        message: "Invalid academic year ID",
      });
      return;
    }

    const academicYear = await getAcademicYearById(
      schoolId,
      parsedId.data
    );

    if (!academicYear) {
      res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
      return;
    }

    res.setHeader("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      message: "Academic year retrieved successfully",
      data: academicYear,
    });
  } catch (error) {
    console.error("Get academic year error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// 3. Create academic year
export async function createAcademicYearController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const schoolId = getSchoolId(req);

    const parsed = createAcademicYearSchema.safeParse(
      req.body
    );

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid academic year data",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const academicYear = await createAcademicYear(
      schoolId,
      parsed.data
    );

    res.setHeader("Cache-Control", "no-store");

    res.status(201).json({
      success: true,
      message: "Academic year created successfully",
      data: academicYear,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "Academic year already exists",
      });
      return;
    }

    console.error("Create academic year error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
// 4. Update academic year
export async function updateAcademicYearController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const schoolId = getSchoolId(req);

    const parsedId = academicYearIdSchema.safeParse(
      req.params.id
    );

    if (!parsedId.success) {
      res.status(400).json({
        success: false,
        message: "Invalid academic year ID",
      });
      return;
    }

    const parsed = updateAcademicYearSchema.safeParse(
      req.body
    );

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid academic year data",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const academicYear = await updateAcademicYear(
      schoolId,
      parsedId.data,
      parsed.data
    );

    if (!academicYear) {
      res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
      return;
    }

    res.setHeader("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      message: "Academic year updated successfully",
      data: academicYear,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "End date must be after start date"
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2002") {
        res.status(409).json({
          success: false,
          message: "Academic year already exists",
        });
        return;
      }

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          message: "Academic year not found",
        });
        return;
      }
    }

    console.error("Update academic year error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
// 5. Set current academic year
export async function setCurrentAcademicYearController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const schoolId = getSchoolId(req);

    const parsedId = academicYearIdSchema.safeParse(
      req.params.id
    );

    if (!parsedId.success) {
      res.status(400).json({
        success: false,
        message: "Invalid academic year ID",
      });
      return;
    }

    const academicYear = await setCurrentAcademicYear(
      schoolId,
      parsedId.data
    );

    if (!academicYear) {
      res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
      return;
    }

    res.setHeader("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      message: "Current academic year updated successfully",
      data: academicYear,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (
        error.code === "P2034" ||
        error.code === "P2002"
      ) {
        res.status(409).json({
          success: false,
          message: "Concurrent update detected. Please try again.",
        });
        return;
      }

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          message: "Academic year not found",
        });
        return;
      }
    }

    console.error("Set current academic year error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
// 6. Delete academic year
export async function deleteAcademicYearController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const schoolId = getSchoolId(req);

    const parsedId = academicYearIdSchema.safeParse(
      req.params.id
    );

    if (!parsedId.success) {
      res.status(400).json({
        success: false,
        message: "Invalid academic year ID",
      });
      return;
    }

    const academicYear = await deleteAcademicYear(
      schoolId,
      parsedId.data
    );

    if (!academicYear) {
      res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Academic year deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.message ===
          "Current academic year cannot be deleted" ||
        error.message ===
          "Academic year cannot be deleted because it contains dependent records"
      )
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2003") {
        res.status(409).json({
          success: false,
          message: "Academic year contains dependent records",
        });
        return;
      }

      if (error.code === "P2034") {
        res.status(409).json({
          success: false,
          message: "Concurrent operation detected. Please try again.",
        });
        return;
      }

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          message: "Academic year not found",
        });
        return;
      }
    }

    console.error("Delete academic year error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}