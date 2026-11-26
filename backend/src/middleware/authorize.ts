import type { Request, Response, NextFunction } from "express";
import type {} from "../types/auth";

export function authorize(...allowedRoles: string[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    // 1. Check authenticated user
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // 2. Check whether user has an allowed role
    const hasPermission = req.user.roles.some(
      (role) => allowedRoles.includes(role)
    );

    // 3. Reject unauthorized roles
    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      });
      return;
    }

    // 4. Continue to controller
    next();
  };
}