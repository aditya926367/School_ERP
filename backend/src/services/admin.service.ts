import prisma from "../lib/prisma";
import type {
  UpdateSchoolProfileInput,
} from "../validations/admin.validation";

export async function getSchoolProfile(schoolId: string) {
  return prisma.schools.findUnique({
    where: {
      id: schoolId,
    },
    select: {
      id: true,
      school_code: true,
      name: true,
      legal_name: true,
      email: true,
      phone: true,
      website: true,
      address: true,
      city: true,
      state: true,
      postal_code: true,
      country: true,
      timezone: true,
      currency: true,
      logo_url: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
}
export async function updateSchoolProfile(
  schoolId: string,
  data: UpdateSchoolProfileInput
) {
  return prisma.schools.update({
    where: {
      id: schoolId,
    },
    data: {
      ...data,
      updated_at: new Date(),
    },
    select: {
      id: true,
      school_code: true,
      name: true,
      legal_name: true,
      email: true,
      phone: true,
      website: true,
      address: true,
      city: true,
      state: true,
      postal_code: true,
      country: true,
      timezone: true,
      currency: true,
      logo_url: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
}