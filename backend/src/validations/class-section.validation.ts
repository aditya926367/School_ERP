import { z } from "zod";

export const idSchema = z.uuid();

const statusSchema = z.enum(["active", "inactive"]);

// Class fields
const classFieldsSchema = z.object({
  name: z.string().trim().min(1).max(80),

  campus_id: z.uuid().nullable().optional(),

  sort_order: z.number().int().min(0).max(2147483647)
    .nullable().optional(),

  status: statusSchema.optional(),
}).strict();

// Create class
export const createClassSchema = classFieldsSchema;

// Update class
export const updateClassSchema = classFieldsSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// Section fields
const sectionFieldsSchema = z.object({
  name: z.string().trim().min(1).max(40),

  capacity: z.number().int().positive().max(2147483647)
    .nullable().optional(),

  class_teacher_staff_id: z.uuid().nullable().optional(),

  status: statusSchema.optional(),
}).strict();

// Create section
export const createSectionSchema = sectionFieldsSchema;

// Update section
export const updateSectionSchema = sectionFieldsSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// TypeScript types
export type CreateClassInput = z.infer<
  typeof createClassSchema
>;

export type UpdateClassInput = z.infer<
  typeof updateClassSchema
>;

export type CreateSectionInput = z.infer<
  typeof createSectionSchema
>;

export type UpdateSectionInput = z.infer<
  typeof updateSectionSchema
>;