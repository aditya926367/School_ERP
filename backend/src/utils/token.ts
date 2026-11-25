import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { randomBytes, createHash } from "node:crypto";
import { env } from "../config/env";

export interface AccessTokenPayload {
  userId: string;
  schoolId: string;
  sessionId: string;
}

export function generateAccessToken(
  payload: AccessTokenPayload
): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    algorithm: "HS256",
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtAccessSecret, {
    algorithms: ["HS256"],
  });
}

export function generateRefreshToken(): string {
  return randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenExpiry(): Date {
  return new Date(
    Date.now() +
      env.refreshTokenExpiresDays * 24 * 60 * 60 * 1000
  );
}