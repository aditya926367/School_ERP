import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  CLIENT_URL: z.url().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(64),

  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .regex(/^[1-9]\d*[smhd]$/)
    .default("15m"),

  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce
    .number()
    .int()
    .positive()
    .default(7),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }))
  );

  process.exit(1);
}

export const env = {
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
  clientUrl: parsed.data.CLIENT_URL,
  databaseUrl: parsed.data.DATABASE_URL,
  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
  refreshTokenExpiresDays: parsed.data.REFRESH_TOKEN_EXPIRES_DAYS,
};