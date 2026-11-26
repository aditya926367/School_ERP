import type { Request, Response } from "express";
import {
    getSchoolProfile,
    updateSchoolProfile,
} from "../services/admin.service";
import {
    updateSchoolProfileSchema,
} from "../validations/admin.validation";
import { getSchoolId } from "../utils/tenant";

export async function getSchoolProfileController(
    req: Request,
    res: Response
): Promise<void> {
    try {
        // 1. Get authenticated school ID
        const schoolId = getSchoolId(req);

        // 2. Retrieve school profile
        const school = await getSchoolProfile(schoolId);

        // 3. Check whether school exists
        if (!school) {
            res.status(404).json({
                success: false,
                message: "School profile not found",
            });
            return;
        }

        // 4. Return school profile
        res.setHeader("Cache-Control", "no-store");

        res.status(200).json({
            success: true,
            message: "School profile retrieved successfully",
            data: school,
        });
    } catch (error) {
        console.error("Get school profile error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
export async function updateSchoolProfileController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // 1. Get authenticated school ID
    const schoolId = getSchoolId(req);

    // 2. Validate request body
    const parsed = updateSchoolProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid school profile data",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    // 3. Update school profile
    const school = await updateSchoolProfile(
      schoolId,
      parsed.data
    );

    // 4. Return updated school profile
    res.setHeader("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      message: "School profile updated successfully",
      data: school,
    });
  } catch (error) {
    console.error("Update school profile error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}