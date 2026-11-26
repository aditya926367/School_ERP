import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { verifyAccessToken } from "../utils/token";
import type { AuthUser } from "../types/auth";

const tokenPayloadSchema = z.object({
  userId: z.uuid(),
  schoolId: z.uuid(),
  sessionId: z.uuid(),
  exp: z.number(),
});

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // 1. Extract authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Access token required",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  // 2. Verify access token
  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
    return;
  }

  // 3. Validate token payload
  const parsed = tokenPayloadSchema.safeParse(decoded);

  if (!parsed.success) {
    res.status(401).json({
      success: false,
      message: "Invalid token payload",
    });
    return;
  }

  const { userId, schoolId, sessionId } = parsed.data;

  try {
    // 4. Verify active database session
    const session = await prisma.user_sessions.findFirst({
      where: {
        id: sessionId,
        user_id: userId,
        school_id: schoolId,
        revoked_at: null,
        expires_at: {
          gt: new Date(),
        },
        users: {
          status: "active",
        },
        schools: {
          status: "active",
        },
      },
      include: {
        users: {
          include: {
            user_roles: {
              include: {
                roles: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      res.status(401).json({
        success: false,
        message: "Session expired or revoked",
      });
      return;
    }

    // 5. Extract current user roles
    const roles = session.users.user_roles.map(
      (userRole) => userRole.roles.role_code
    );

    // 6. Attach authenticated user to request
    const authUser: AuthUser = {
      userId,
      schoolId,
      sessionId,
      roles,
    };

    req.user = authUser;

    // 7. Continue to next middleware or controller
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}