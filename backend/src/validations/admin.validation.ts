import { z } from "zod";

export const updateSchoolProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),

    legal_name: z.string().trim().max(200).nullable().optional(),

    email: z.email().max(254).nullable().optional(),

    phone: z.string().trim().min(1).max(30).nullable().optional(),

    website: z.url({ protocol: /^https?$/ }).nullable().optional(),

    address: z.string().trim().max(2000).nullable().optional(),

    city: z.string().trim().max(100).nullable().optional(),

    state: z.string().trim().max(100).nullable().optional(),

    postal_code: z.string().trim().max(20).nullable().optional(),

    country: z.string().trim().min(1).max(100).optional(),

    logo_url: z.url({ protocol: /^https?$/ }).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateSchoolProfileInput = z.infer<
  typeof updateSchoolProfileSchema
>;