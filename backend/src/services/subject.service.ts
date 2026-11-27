import prisma from "../lib/prisma";
import type { Prisma } from "@prisma/client";

import type {
  CreateSubjectInput,
  UpdateSubjectInput,
  CreateClassSubjectInput,
  UpdateClassSubjectInput,
  ClassSubjectQueryInput,
} from "../validations/subject.validation";

// Reusable subject error
export class SubjectError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "SubjectError";
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
    throw new SubjectError(404, "Staff member not found");
  }
}

// ================================
// SUBJECT MANAGEMENT
// ================================

// 1. Get all subjects
export async function getSubjects(schoolId: string) {
  return prisma.subjects.findMany({
    where: {
      school_id: schoolId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

// 2. Get subject by ID
export async function getSubjectById(
  schoolId: string,
  subjectId: string
) {
  const subject = await prisma.subjects.findUnique({
    where: {
      school_id_id: {
        school_id: schoolId,
        id: subjectId,
      },
    },
  });

  if (!subject) {
    throw new SubjectError(404, "Subject not found");
  }

  return subject;
}

// 3. Create subject
export async function createSubject(
  schoolId: string,
  data: CreateSubjectInput
) {
  return prisma.subjects.create({
    data: {
      school_id: schoolId,
      name: data.name,
      code: data.code,
      subject_type: data.subject_type ?? "core",
      description: data.description ?? null,
      status: data.status ?? "active",
    },
  });
}

// 4. Update subject
export async function updateSubject(
  schoolId: string,
  subjectId: string,
  data: UpdateSubjectInput
) {
  return prisma.subjects.update({
    where: {
      school_id_id: {
        school_id: schoolId,
        id: subjectId,
      },
    },
    data,
  });
}

// 5. Delete subject
export async function deleteSubject(
  schoolId: string,
  subjectId: string
) {
  return prisma.$transaction(async (tx) => {
    const subject = await tx.subjects.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: subjectId,
        },
      },
      include: {
        _count: {
          select: {
            class_subjects: true,
            exam_subjects: true,
            homework: true,
            timetable_entries: true,
          },
        },
      },
    });

    if (!subject) {
      throw new SubjectError(404, "Subject not found");
    }

    const hasDependencies = Object.values(
      subject._count
    ).some((count) => count > 0);

    if (hasDependencies) {
      throw new SubjectError(
        409,
        "Subject cannot be deleted because it contains dependent records"
      );
    }

    return tx.subjects.delete({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: subjectId,
        },
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}

// ================================
// CLASS SUBJECT ASSIGNMENT
// ================================

// 6. Get subject assignments
export async function getClassSubjects(
  schoolId: string,
  filters: ClassSubjectQueryInput
) {
  return prisma.class_subjects.findMany({
    where: {
      school_id: schoolId,

      ...(filters.class_id && {
        class_id: filters.class_id,
      }),

      ...(filters.subject_id && {
        subject_id: filters.subject_id,
      }),

      ...(filters.academic_year_id && {
        academic_year_id: filters.academic_year_id,
      }),
    },
    include: {
      classes: {
        select: {
          id: true,
          name: true,
        },
      },

      subjects: {
        select: {
          id: true,
          name: true,
          code: true,
          subject_type: true,
        },
      },

      academic_years: {
        select: {
          id: true,
          name: true,
          is_current: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

// 7. Assign subject to class
export async function createClassSubject(
  schoolId: string,
  data: CreateClassSubjectInput
) {
  return prisma.$transaction(async (tx) => {
    // Verify class ownership
    const classRecord = await tx.classes.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: data.class_id,
        },
      },
    });

    if (!classRecord) {
      throw new SubjectError(404, "Class not found");
    }

    if (classRecord.status !== "active") {
      throw new SubjectError(409, "Class is inactive");
    }

    // Verify subject ownership
    const subject = await tx.subjects.findUnique({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: data.subject_id,
        },
      },
    });

    if (!subject) {
      throw new SubjectError(404, "Subject not found");
    }

    if (subject.status !== "active") {
      throw new SubjectError(409, "Subject is inactive");
    }

    // Verify academic year ownership
    const academicYear =
      await tx.academic_years.findUnique({
        where: {
          school_id_id: {
            school_id: schoolId,
            id: data.academic_year_id,
          },
        },
      });

    if (!academicYear) {
      throw new SubjectError(
        404,
        "Academic year not found"
      );
    }

    if (academicYear.status === "completed") {
      throw new SubjectError(
        409,
        "Cannot assign subjects to a completed academic year"
      );
    }

    // Verify teacher/staff ownership
    await validateStaff(
      tx,
      schoolId,
      data.teacher_staff_id
    );

    // Create subject assignment
    return tx.class_subjects.create({
      data: {
        school_id: schoolId,
        class_id: data.class_id,
        subject_id: data.subject_id,
        academic_year_id: data.academic_year_id,
        teacher_staff_id:
          data.teacher_staff_id ?? null,
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}

// 8. Update assigned teacher
export async function updateClassSubject(
  schoolId: string,
  assignmentId: string,
  data: UpdateClassSubjectInput
) {
  return prisma.$transaction(async (tx) => {
    const assignment =
      await tx.class_subjects.findUnique({
        where: {
          school_id_id: {
            school_id: schoolId,
            id: assignmentId,
          },
        },
        include: {
          academic_years: {
            select: {
              status: true,
            },
          },
        },
      });

    if (!assignment) {
      throw new SubjectError(
        404,
        "Subject assignment not found"
      );
    }

    if (assignment.academic_years.status === "completed") {
      throw new SubjectError(
        409,
        "Completed academic year assignments cannot be modified"
      );
    }

    await validateStaff(
      tx,
      schoolId,
      data.teacher_staff_id
    );

    return tx.class_subjects.update({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: assignmentId,
        },
      },
      data: {
        teacher_staff_id: data.teacher_staff_id,
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}

// 9. Remove subject assignment
export async function deleteClassSubject(
  schoolId: string,
  assignmentId: string
) {
  return prisma.$transaction(async (tx) => {
    const assignment =
      await tx.class_subjects.findUnique({
        where: {
          school_id_id: {
            school_id: schoolId,
            id: assignmentId,
          },
        },
        include: {
          academic_years: {
            select: {
              status: true,
            },
          },
        },
      });

    if (!assignment) {
      throw new SubjectError(
        404,
        "Subject assignment not found"
      );
    }

    if (assignment.academic_years.status === "completed") {
      throw new SubjectError(
        409,
        "Completed academic year assignments cannot be deleted"
      );
    }

    return tx.class_subjects.delete({
      where: {
        school_id_id: {
          school_id: schoolId,
          id: assignmentId,
        },
      },
    });
  }, {
    isolationLevel: "Serializable",
  });
}