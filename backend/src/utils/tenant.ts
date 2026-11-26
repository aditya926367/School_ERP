import type { Request } from "express";
import type {} from "../types/auth";

export function getSchoolId(req: Request): string {
  if (!req.user?.schoolId) {
    throw new Error("School context is missing");
  }

  return req.user.schoolId;
}