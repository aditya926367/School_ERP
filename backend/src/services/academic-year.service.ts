import prisma from "../lib/prisma";

import type {
  CreateAcademicYearInput,
  UpdateAcademicYearInput,
} from "../validations/academic-year.validation";

// 1. Get all academic years
export async function getAcademicYears(schoolId: string) {
  return prisma.academic_years.findMany({
    where: {
      school_id: schoolId,
    },
    orderBy: {
      start_date: "desc",
    },
  });
}

// 2. Get a specific academic year
export async function getAcademicYearById(
  schoolId: string,
  academicYearId: string
) {
  return prisma.academic_years.findUnique({
    where: {
      school_id_id: {
        school_id: schoolId,
        id: academicYearId,
      },
    },
  });
}

// 3. Create academic year
export async function createAcademicYear(
  schoolId: string,
  data: CreateAcademicYearInput
) {
  return prisma.academic_years.create({
    data: {
      school_id: schoolId,
      name: data.name,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      status: data.status,
      is_current: false,
    },
  });
}
// 4. Update academic year
export async function updateAcademicYear(
  schoolId: string,
  academicYearId: string,
  data: UpdateAcademicYearInput
) {
  // Find academic year within the authenticated school
  const existingYear = await getAcademicYearById(
    schoolId,
    academicYearId
  );

  if (!existingYear) {
    return null;
  }

  // Use new dates if provided, otherwise keep existing dates
  const startDate = data.start_date
    ? new Date(data.start_date)
    : existingYear.start_date;

  const endDate = data.end_date
    ? new Date(data.end_date)
    : existingYear.end_date;

  // Validate the final date range
  if (endDate <= startDate) {
    throw new Error("End date must be after start date");
  }

  // Update school-specific academic year
  return prisma.academic_years.update({
    where: {
      school_id_id: {
        school_id: schoolId,
        id: academicYearId,
      },
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.status !== undefined && {
        status: data.status,
      }),

      start_date: startDate,
      end_date: endDate,
    },
  });
}
// 5. Set current academic year
export async function setCurrentAcademicYear(
  schoolId: string,
  academicYearId: string
) {
  return prisma.$transaction(async (tx) => {
    // 1. Find the academic year within the school
    const academicYear = await tx.academic_years.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: academicYearId,
        },
      },
    });

    if (!academicYear) {
      return null;
    }

    // 2. Remove current status from previous academic years
    await tx.academic_years.updateMany({
      where: {
        school_id: schoolId,
        is_current: true,
      },
      data: {
        is_current: false,
      },
    });

    // 3. Set selected academic year as current
    return tx.academic_years.update({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: academicYearId,
        },
      },
      data: {
        is_current: true,
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}
// 6. Delete academic year
export async function deleteAcademicYear(
  schoolId: string,
  academicYearId: string
) {
  return prisma.$transaction(async (tx) => {
    // 1. Find academic year and dependent records
    const academicYear = await tx.academic_years.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: academicYearId,
        },
      },
      include: {
        _count: {
          select: {
            admissions: true,
            class_subjects: true,
            exams: true,
            fee_structures: true,
            holiday_calendar: true,
            homework: true,
            student_attendance: true,
            student_enrollments: true,
            student_invoices: true,
            timetable_entries: true,
          },
        },
      },
    });

    // 2. Check whether academic year exists
    if (!academicYear) {
      return null;
    }

    // 3. Prevent deletion of current academic year
    if (academicYear.is_current) {
      throw new Error(
        "Current academic year cannot be deleted"
      );
    }

    // 4. Check dependent records
    const hasDependencies = Object.values(
      academicYear._count
    ).some((count) => count > 0);

    if (hasDependencies) {
      throw new Error(
        "Academic year cannot be deleted because it contains dependent records"
      );
    }

    // 5. Delete academic year
    return tx.academic_years.delete({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: academicYearId,
        },
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}