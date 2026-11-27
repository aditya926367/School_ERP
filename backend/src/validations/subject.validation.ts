import { z } from "zod";

export const subjectIdSchema = z.uuid();

const statusSchema = z.enum(["active", "inactive"]);

const subjectTypeSchema = z.enum([
  "core",
  "elective",
  "optional",
]);

// Subject fields
const subjectFieldsSchema = z.object({
  name: z.string().trim().min(1).max(120),

  code: z.string().trim().min(1).max(40)
    .transform((value) => value.toUpperCase()),

  subject_type: subjectTypeSchema.optional(),

  description: z.string().trim().max(2000)
    .nullable().optional(),

  status: statusSchema.optional(),
}).strict();

// Create subject
export const createSubjectSchema = subjectFieldsSchema;

// Update subject
export const updateSubjectSchema = subjectFieldsSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// Assign subject to class
export const createClassSubjectSchema = z.object({
  class_id: z.uuid(),

  subject_id: z.uuid(),

  academic_year_id: z.uuid(),

  teacher_staff_id: z.uuid().nullable().optional(),
}).strict();

// Update subject assignment
export const updateClassSubjectSchema = z.object({
  teacher_staff_id: z.uuid().nullable(),
}).strict();

// Filter subject assignments
export const classSubjectQuerySchema = z.object({
  class_id: z.uuid().optional(),

  subject_id: z.uuid().optional(),

  academic_year_id: z.uuid().optional(),
}).strict();

// TypeScript types
export type CreateSubjectInput = z.infer<
  typeof createSubjectSchema
>;

export type UpdateSubjectInput = z.infer<
  typeof updateSubjectSchema
>;

export type CreateClassSubjectInput = z.infer<
  typeof createClassSubjectSchema
>;

export type UpdateClassSubjectInput = z.infer<
  typeof updateClassSubjectSchema
>;

export type ClassSubjectQueryInput = z.infer<
  typeof classSubjectQuerySchema
>;