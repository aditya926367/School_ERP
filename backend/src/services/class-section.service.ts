import prisma from "../lib/prisma";
import type { Prisma } from "@prisma/client";

import type {
  CreateClassInput,
  UpdateClassInput,
  CreateSectionInput,
  UpdateSectionInput,
} from "../validations/class-section.validation";

// Reusable module error
export class ClassSectionError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ClassSectionError";
  }
}

// Validate campus ownership
async function validateCampus(
  tx: Prisma.TransactionClient,
  schoolId: string,
  campusId: string | null | undefined
) {
  if (!campusId) return;

  const campus = await tx.campuses.findFirst({
    where: {
      id: campusId,
      school_id: schoolId,
    },
  });

  if (!campus) {
    throw new ClassSectionError(404, "Campus not found");
  }
}

// Validate staff ownership
async function validateStaff(
  tx: Prisma.TransactionClient,
  schoolId: string,
  staffId: string | null | undefined
) {
  if (!staffId) return;

  const staff = await tx.staff.findFirst({
    where: {
      id: staffId,
      school_id: schoolId,
    },
  });

  if (!staff) {
    throw new ClassSectionError(
      404,
      "Staff member not found"
    );
  }
}

// Prevent duplicate class names within a campus
async function checkDuplicateClass(
  tx: Prisma.TransactionClient,
  schoolId: string,
  name: string,
  campusId: string | null,
  excludeId?: string
) {
  const existing = await tx.classes.findFirst({
    where: {
      school_id: schoolId,
      campus_id: campusId,
      name: {
        equals: name,
        mode: "insensitive",
      },
      ...(excludeId && {
        id: { not: excludeId },
      }),
    },
  });

  if (existing) {
    throw new ClassSectionError(
      409,
      "Class already exists"
    );
  }
}

// ================================
// CLASS MANAGEMENT
// ================================

// 1. Get all classes with sections
export async function getClasses(schoolId: string) {
  return prisma.classes.findMany({
    where: {
      school_id: schoolId,
    },
    include: {
      sections: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: [
      { sort_order: "asc" },
      { name: "asc" },
    ],
  });
}

// 2. Get class by ID
export async function getClassById(
  schoolId: string,
  classId: string
) {
  const result = await prisma.classes.findUnique({
    where: {
      school_id_id: {
        school_id: schoolId,
        id: classId,
      },
    },
    include: {
      sections: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!result) {
    throw new ClassSectionError(404, "Class not found");
  }

  return result;
}

// 3. Create class
export async function createClass(
  schoolId: string,
  data: CreateClassInput
) {
  return prisma.$transaction(async (tx) => {
    const campusId = data.campus_id ?? null;

    await validateCampus(tx, schoolId, campusId);

    await checkDuplicateClass(
      tx,
      schoolId,
      data.name,
      campusId
    );

    return tx.classes.create({
      data: {
        school_id: schoolId,
        campus_id: campusId,
        name: data.name,
        sort_order: data.sort_order ?? null,
        status: data.status ?? "active",
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}

// 4. Update class
export async function updateClass(
  schoolId: string,
  classId: string,
  data: UpdateClassInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.classes.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: classId,
        },
      },
    });

    if (!existing) {
      throw new ClassSectionError(404, "Class not found");
    }

    const name = data.name ?? existing.name;

    const campusId =
      data.campus_id !== undefined
        ? data.campus_id
        : existing.campus_id;

    // Validate campus ownership
    await validateCampus(tx, schoolId, campusId);

    // Prevent moving an existing class between campuses
    if (campusId !== existing.campus_id) {
      throw new ClassSectionError(
        409,
        "Changing the campus of an existing class is not supported"
      );
    }

    await checkDuplicateClass(
      tx,
      schoolId,
      name,
      campusId,
      classId
    );

    return tx.classes.update({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: classId,
        },
      },
      data,
    });
  }, {
    isolationLevel: "Serializable",
  });
}

// 5. Delete class
export async function deleteClass(
  schoolId: string,
  classId: string
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.classes.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: classId,
        },
      },
      include: {
        _count: {
          select: {
            sections: true,
            class_subjects: true,
            fee_structures: true,
            student_enrollments: true,
          },
        },
      },
    });

    if (!existing) {
      throw new ClassSectionError(404, "Class not found");
    }

    const hasDependencies = Object.values(
      existing._count
    ).some((count) => count > 0);

    if (hasDependencies) {
      throw new ClassSectionError(
        409,
        "Class cannot be deleted because it contains dependent records"
      );
    }

    return tx.classes.delete({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: classId,
        },
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}

// ================================
// SECTION MANAGEMENT
// ================================

// 6. Get sections by class ID
export async function getSections(
  schoolId: string,
  classId: string
) {
  await getClassById(schoolId, classId);

  return prisma.sections.findMany({
    where: {
      school_id: schoolId,
      class_id: classId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

// 7. Create section
export async function createSection(
  schoolId: string,
  classId: string,
  data: CreateSectionInput
) {
  return prisma.$transaction(async (tx) => {
    const existingClass = await tx.classes.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: classId,
        },
      },
    });

    if (!existingClass) {
      throw new ClassSectionError(404, "Class not found");
    }

    await validateStaff(
      tx,
      schoolId,
      data.class_teacher_staff_id
    );

    const duplicate = await tx.sections.findFirst({
      where: {
        school_id: schoolId,
        class_id: classId,
        name: {
          equals: data.name,
          mode: "insensitive",
        },
      },
    });

    if (duplicate) {
      throw new ClassSectionError(
        409,
        "Section already exists"
      );
    }

    return tx.sections.create({
      data: {
        school_id: schoolId,
        class_id: classId,
        name: data.name,
        capacity: data.capacity ?? null,
        class_teacher_staff_id:
          data.class_teacher_staff_id ?? null,
        status: data.status ?? "active",
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}

// 8. Update section
export async function updateSection(
  schoolId: string,
  sectionId: string,
  data: UpdateSectionInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.sections.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: sectionId,
        },
      },
    });

    if (!existing) {
      throw new ClassSectionError(
        404,
        "Section not found"
      );
    }

    await validateStaff(
      tx,
      schoolId,
      data.class_teacher_staff_id
    );

    if (data.name !== undefined) {
      const duplicate = await tx.sections.findFirst({
        where: {
          school_id: schoolId,
          class_id: existing.class_id,
          id: {
            not: sectionId,
          },
          name: {
            equals: data.name,
            mode: "insensitive",
          },
        },
      });

      if (duplicate) {
        throw new ClassSectionError(
          409,
          "Section already exists"
        );
      }
    }

    return tx.sections.update({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: sectionId,
        },
      },
      data,
    });
  }, {
    isolationLevel: "Serializable",
  });
}

// 9. Delete section
export async function deleteSection(
  schoolId: string,
  sectionId: string
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.sections.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: sectionId,
        },
      },
      include: {
        _count: {
          select: {
            exam_subjects: true,
            homework: true,
            student_enrollments: true,
            teacher_profiles: true,
            timetable_entries: true,
          },
        },
      },
    });

    if (!existing) {
      throw new ClassSectionError(
        404,
        "Section not found"
      );
    }

    const hasDependencies = Object.values(
      existing._count
    ).some((count) => count > 0);

    if (hasDependencies) {
      throw new ClassSectionError(
        409,
        "Section cannot be deleted because it contains dependent records"
      );
    }

    return tx.sections.delete({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: sectionId,
        },
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}