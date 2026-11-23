-- DropForeignKey
ALTER TABLE "staff_attendance" DROP CONSTRAINT "staff_attendance_school_id_staff_id_fkey";

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_school_id_staff_id_fkey" FOREIGN KEY ("school_id", "staff_id") REFERENCES "staff"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;
