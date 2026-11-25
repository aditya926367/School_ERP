import prisma from "../lib/prisma";
import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../config/env";
import { login, refreshSession } from "../services/auth.service";

const loginSchema = z.object({
  schoolCode: z.string().trim().min(1).max(40),
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(72),
});

export async function loginController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // 1. Validate request body
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid login request",
      });
      return;
    }

    // 2. Call authentication service
    const result = await login(parsed.data);

    // 3. Handle invalid credentials
    if (!result) {
      res.status(401).json({
        success: false,
        message: "Invalid school code, username or password",
      });
      return;
    }

    // 4. Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      expires: result.refreshTokenExpiresAt,
      path: "/api/auth",
    });

    // 5. Prevent caching of authentication response
    res.setHeader("Cache-Control", "no-store");

    // 6. Send successful response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function meController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await prisma.users.findFirst({
      where: {
        id: req.user.userId,
        school_id: req.user.schoolId,
        status: "active",
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        avatar_url: true,
        schools: {
          select: {
            id: true,
            school_code: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not available",
      });
      return;
    }

    res.setHeader("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        avatarUrl: user.avatar_url,
        roles: req.user.roles,
        schoolId: user.schools.id,
        schoolCode: user.schools.school_code,
        schoolName: user.schools.name,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function refreshController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // 1. Read refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;

    // 2. Validate refresh token
    if (
      typeof refreshToken !== "string" ||
      !/^[a-f0-9]{128}$/.test(refreshToken)
    ) {
      res.status(401).json({
        success: false,
        message: "Refresh token missing or invalid",
      });
      return;
    }

    // 3. Refresh the session
    const result = await refreshSession(refreshToken);

    if (!result) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
      return;
    }

    // 4. Set the rotated refresh token cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      expires: result.refreshTokenExpiresAt,
      path: "/api/auth",
    });

    res.setHeader("Cache-Control", "no-store");

    // 5. Return the new access token
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}