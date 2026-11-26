import { z } from "zod";

// Allowed academic year statuses
export const academicYearStatusSchema = z.enum([
  "planned",
  "active",
  "completed",
]);

// Create academic year validation
export const createAcademicYearSchema = z
  .object({
    name: z.string().trim().min(1).max(40),

    start_date: z.iso.date(),

    end_date: z.iso.date(),

    status: academicYearStatusSchema.default("planned"),
  })
  .strict()
  .refine(
    (data) => data.end_date > data.start_date,
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

// Update academic year validation
export const updateAcademicYearSchema = z
  .object({
    name: z.string().trim().min(1).max(40).optional(),

    start_date: z.iso.date().optional(),

    end_date: z.iso.date().optional(),

    status: academicYearStatusSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  )
  .refine(
    (data) =>
      !data.start_date ||
      !data.end_date ||
      data.end_date > data.start_date,
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

// Academic year ID validation
export const academicYearIdSchema = z.uuid();

// TypeScript types
export type CreateAcademicYearInput = z.infer<
  typeof createAcademicYearSchema
>;

export type UpdateAcademicYearInput = z.infer<
  typeof updateAcademicYearSchema
>;