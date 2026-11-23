-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "school_erp";

-- CreateTable
CREATE TABLE "academic_years" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'planned',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "application_no" VARCHAR(60) NOT NULL,
    "academic_year_id" UUID,
    "applicant_name" VARCHAR(200) NOT NULL,
    "date_of_birth" DATE,
    "applying_for_class" VARCHAR(80),
    "parent_name" VARCHAR(180),
    "parent_phone" VARCHAR(30),
    "parent_email" VARCHAR(254),
    "application_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "status" VARCHAR(30) NOT NULL DEFAULT 'submitted',
    "remarks" TEXT,
    "student_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campuses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "campus_code" VARCHAR(40) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "address" TEXT,
    "phone" VARCHAR(30),
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_subjects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "teacher_staff_id" UUID,
    "academic_year_id" UUID NOT NULL,

    CONSTRAINT "class_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "campus_id" UUID,
    "name" VARCHAR(80) NOT NULL,
    "sort_order" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "exam_subject_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "marks_obtained" DECIMAL(7,2),
    "grade" VARCHAR(10),
    "remarks" TEXT,
    "entered_by_staff_id" UUID,
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "exam_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_subjects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "exam_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "max_marks" DECIMAL(7,2) NOT NULL,
    "pass_marks" DECIMAL(7,2) NOT NULL DEFAULT 0,
    "exam_date" DATE,

    CONSTRAINT "exam_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "exam_type" VARCHAR(60),
    "start_date" DATE,
    "end_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'planned',

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "expense_no" VARCHAR(60) NOT NULL,
    "expense_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "category" VARCHAR(100) NOT NULL,
    "payee" VARCHAR(180),
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_mode" VARCHAR(30),
    "reference_no" VARCHAR(120),
    "recorded_by_user_id" UUID,
    "status" VARCHAR(20) NOT NULL DEFAULT 'paid',

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_discounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "invoice_id" UUID,
    "discount_type" VARCHAR(20) NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "reason" TEXT,
    "approved_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_heads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "description" TEXT,
    "is_optional" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "fee_heads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "receipt_no" VARCHAR(60) NOT NULL,
    "payment_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_mode" VARCHAR(30) NOT NULL,
    "transaction_reference" VARCHAR(120),
    "collected_by_user_id" UUID,
    "remarks" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'success',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_structure_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "fee_structure_id" UUID NOT NULL,
    "fee_head_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "fee_structure_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_structures" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "name" VARCHAR(140) NOT NULL,
    "frequency" VARCHAR(20) NOT NULL,
    "due_day" SMALLINT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homework" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "teacher_staff_id" UUID NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "instructions" TEXT,
    "assigned_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "due_date" DATE,
    "attachment_url" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'published',

    CONSTRAINT "homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homework_submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "homework_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "submitted_at" TIMESTAMPTZ(6),
    "submission_text" TEXT,
    "attachment_url" TEXT,
    "marks" DECIMAL(7,2),
    "feedback" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',

    CONSTRAINT "homework_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "fee_head_id" UUID NOT NULL,
    "description" VARCHAR(180),
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit_amount" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_authors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "country" VARCHAR(100),

    CONSTRAINT "library_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_book_authors" (
    "school_id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,

    CONSTRAINT "library_book_authors_pkey" PRIMARY KEY ("school_id","book_id","author_id")
);

-- CreateTable
CREATE TABLE "library_book_copies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "barcode" VARCHAR(80) NOT NULL,
    "copy_status" VARCHAR(20) NOT NULL DEFAULT 'available',
    "acquired_on" DATE,
    "purchase_price" DECIMAL(12,2),
    "condition_notes" TEXT,

    CONSTRAINT "library_book_copies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_books" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "category_id" UUID,
    "publisher_id" UUID,
    "isbn" VARCHAR(30),
    "accession_code" VARCHAR(60) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "edition" VARCHAR(60),
    "publication_year" SMALLINT,
    "language" VARCHAR(60),
    "shelf_location" VARCHAR(100),
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "library_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "student_id" UUID,
    "staff_id" UUID,
    "member_code" VARCHAR(60) NOT NULL,
    "member_type" VARCHAR(20) NOT NULL,
    "joined_on" DATE NOT NULL DEFAULT CURRENT_DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "library_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_publishers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "email" VARCHAR(254),
    "phone" VARCHAR(30),
    "address" TEXT,

    CONSTRAINT "library_publishers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents_guardians" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "user_id" UUID,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "relationship" VARCHAR(40),
    "phone" VARCHAR(30) NOT NULL,
    "alternate_phone" VARCHAR(30),
    "email" VARCHAR(254),
    "occupation" VARCHAR(120),
    "address" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parents_guardians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_allocations" (
    "school_id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "payment_allocations_pkey" PRIMARY KEY ("school_id","payment_id","invoice_id")
);

-- CreateTable
CREATE TABLE "payroll_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "payroll_run_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "present_days" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "basic" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "allowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "gross_pay" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "net_pay" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'unpaid',

    CONSTRAINT "payroll_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_runs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "payroll_month" DATE NOT NULL,
    "working_days" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "generated_by_user_id" UUID,
    "approved_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "permission_code" VARCHAR(100) NOT NULL,
    "module" VARCHAR(60) NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "school_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("school_id","role_id","permission_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "role_code" VARCHAR(50) NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_system_role" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "payroll_item_id" UUID NOT NULL,
    "payment_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_mode" VARCHAR(30) NOT NULL,
    "transaction_reference" VARCHAR(120),
    "paid_by_user_id" UUID,

    CONSTRAINT "salary_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_structures" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "effective_from" DATE NOT NULL,
    "basic" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "hra" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "da" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "other_allowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pf_deduction" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_deduction" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "other_deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "salary_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_code" VARCHAR(40) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "legal_name" VARCHAR(200),
    "email" VARCHAR(254),
    "phone" VARCHAR(30),
    "website" TEXT,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(100) NOT NULL DEFAULT 'India',
    "timezone" VARCHAR(80) NOT NULL DEFAULT 'Asia/Kolkata',
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "logo_url" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "capacity" INTEGER,
    "class_teacher_staff_id" UUID,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "campus_id" UUID,
    "user_id" UUID,
    "employee_code" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "gender" VARCHAR(20),
    "date_of_birth" DATE,
    "blood_group" VARCHAR(5),
    "phone" VARCHAR(30),
    "email" VARCHAR(254),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "emergency_contact_name" VARCHAR(160),
    "emergency_contact_phone" VARCHAR(30),
    "designation" VARCHAR(120),
    "department" VARCHAR(120),
    "qualification" TEXT,
    "experience_years" DECIMAL(5,2),
    "joining_date" DATE,
    "employment_type" VARCHAR(30),
    "staff_role" VARCHAR(30) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "photo_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_attendance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "attendance_date" DATE NOT NULL,
    "check_in" TIME(6),
    "check_out" TIME(6),
    "status" VARCHAR(20) NOT NULL,
    "remarks" TEXT,
    "marked_by_user_id" UUID,

    CONSTRAINT "staff_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_attendance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "attendance_date" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "remarks" TEXT,
    "marked_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrollments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "roll_number" VARCHAR(30),
    "enrolled_on" DATE NOT NULL DEFAULT CURRENT_DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "student_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_guardians" (
    "school_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "guardian_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "can_pickup" BOOLEAN NOT NULL DEFAULT false,
    "receives_notifications" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "student_guardians_pkey" PRIMARY KEY ("school_id","student_id","guardian_id")
);

-- CreateTable
CREATE TABLE "student_invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "invoice_no" VARCHAR(60) NOT NULL,
    "issue_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "due_date" DATE NOT NULL,
    "period_start" DATE,
    "period_end" DATE,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fine_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'unpaid',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "campus_id" UUID,
    "user_id" UUID,
    "admission_no" VARCHAR(60) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "date_of_birth" DATE,
    "gender" VARCHAR(20),
    "blood_group" VARCHAR(5),
    "phone" VARCHAR(30),
    "email" VARCHAR(254),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "admission_date" DATE NOT NULL,
    "previous_school" TEXT,
    "previous_result" TEXT,
    "previous_percentage" DECIMAL(5,2),
    "photo_url" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "subject_type" VARCHAR(20) NOT NULL DEFAULT 'core',
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_profiles" (
    "school_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "class_teacher_section_id" UUID,
    "teaching_experience_years" DECIMAL(5,2),
    "employment_notes" TEXT,

    CONSTRAINT "teacher_profiles_pkey" PRIMARY KEY ("school_id","staff_id")
);

-- CreateTable
CREATE TABLE "timetable_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "teacher_staff_id" UUID,
    "day_of_week" SMALLINT NOT NULL,
    "period_number" SMALLINT NOT NULL,
    "starts_at" TIME(6) NOT NULL,
    "ends_at" TIME(6) NOT NULL,
    "room" VARCHAR(60),

    CONSTRAINT "timetable_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "school_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("school_id","user_id","role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "school_id" UUID NOT NULL,
    "campus_id" UUID,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254),
    "phone" VARCHAR(30),
    "password_hash" TEXT NOT NULL,
    "full_name" VARCHAR(180) NOT NULL,
    "avatar_url" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "email_verified_at" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMPTZ(6),
    "password_changed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "one_current_academic_year_per_school" ON "academic_years"("school_id") WHERE (is_current);

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_school_id_id_key" ON "academic_years"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_school_id_name_key" ON "academic_years"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "admissions_school_id_application_no_key" ON "admissions"("school_id", "application_no");

-- CreateIndex
CREATE UNIQUE INDEX "admissions_school_id_id_key" ON "admissions"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "campuses_school_id_campus_code_key" ON "campuses"("school_id", "campus_code");

-- CreateIndex
CREATE UNIQUE INDEX "campuses_school_id_id_key" ON "campuses"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "class_subjects_school_id_class_id_subject_id_academic_year__key" ON "class_subjects"("school_id", "class_id", "subject_id", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_subjects_school_id_id_key" ON "class_subjects"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_school_id_campus_id_name_key" ON "classes"("school_id", "campus_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_school_id_id_key" ON "classes"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "exam_results_school_id_exam_subject_id_student_id_key" ON "exam_results"("school_id", "exam_subject_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "exam_subjects_school_id_id_key" ON "exam_subjects"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "exams_school_id_id_key" ON "exams"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "expenses_school_id_expense_no_key" ON "expenses"("school_id", "expense_no");

-- CreateIndex
CREATE UNIQUE INDEX "fee_heads_school_id_code_key" ON "fee_heads"("school_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "fee_heads_school_id_id_key" ON "fee_heads"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_school_id_id_key" ON "fee_payments"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_school_id_receipt_no_key" ON "fee_payments"("school_id", "receipt_no");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structure_items_school_id_fee_structure_id_fee_head_id_key" ON "fee_structure_items"("school_id", "fee_structure_id", "fee_head_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structures_school_id_id_key" ON "fee_structures"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "homework_school_id_id_key" ON "homework"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "homework_submissions_school_id_homework_id_student_id_key" ON "homework_submissions"("school_id", "homework_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_authors_school_id_id_key" ON "library_authors"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "library_authors_school_id_name_key" ON "library_authors"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "library_book_copies_school_id_barcode_key" ON "library_book_copies"("school_id", "barcode");

-- CreateIndex
CREATE UNIQUE INDEX "library_book_copies_school_id_id_key" ON "library_book_copies"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "library_books_school_id_accession_code_key" ON "library_books"("school_id", "accession_code");

-- CreateIndex
CREATE UNIQUE INDEX "library_books_school_id_id_key" ON "library_books"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "library_categories_school_id_id_key" ON "library_categories"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "library_categories_school_id_name_key" ON "library_categories"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "library_members_school_id_id_key" ON "library_members"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "library_members_school_id_member_code_key" ON "library_members"("school_id", "member_code");

-- CreateIndex
CREATE UNIQUE INDEX "library_publishers_school_id_id_key" ON "library_publishers"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "library_publishers_school_id_name_key" ON "library_publishers"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "parents_guardians_school_id_id_key" ON "parents_guardians"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "parents_guardians_school_id_user_id_key" ON "parents_guardians"("school_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_items_school_id_id_key" ON "payroll_items"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_items_school_id_payroll_run_id_staff_id_key" ON "payroll_items"("school_id", "payroll_run_id", "staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_runs_school_id_id_key" ON "payroll_runs"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_runs_school_id_payroll_month_key" ON "payroll_runs"("school_id", "payroll_month");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_code_key" ON "permissions"("permission_code");

-- CreateIndex
CREATE UNIQUE INDEX "roles_school_id_id_key" ON "roles"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_school_id_role_code_key" ON "roles"("school_id", "role_code");

-- CreateIndex
CREATE UNIQUE INDEX "salary_structures_school_id_id_key" ON "salary_structures"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "schools_school_code_key" ON "schools"("school_code");

-- CreateIndex
CREATE UNIQUE INDEX "sections_school_id_class_id_name_key" ON "sections"("school_id", "class_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sections_school_id_id_key" ON "sections"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_school_id_employee_code_key" ON "staff"("school_id", "employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "staff_school_id_id_key" ON "staff"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_school_id_user_id_key" ON "staff"("school_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_school_id_staff_id_attendance_date_key" ON "staff_attendance"("school_id", "staff_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "student_attendance_school_id_student_id_attendance_date_key" ON "student_attendance"("school_id", "student_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_school_id_id_key" ON "student_enrollments"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_school_id_student_id_academic_year_id_key" ON "student_enrollments"("school_id", "student_id", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_invoices_school_id_id_key" ON "student_invoices"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "student_invoices_school_id_invoice_no_key" ON "student_invoices"("school_id", "invoice_no");

-- CreateIndex
CREATE UNIQUE INDEX "students_school_id_admission_no_key" ON "students"("school_id", "admission_no");

-- CreateIndex
CREATE UNIQUE INDEX "students_school_id_id_key" ON "students"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "students_school_id_user_id_key" ON "students"("school_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_school_id_code_key" ON "subjects"("school_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_school_id_id_key" ON "subjects"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "users_school_id_email_key" ON "users"("school_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_school_id_id_key" ON "users"("school_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "users_school_id_username_key" ON "users"("school_id", "username");

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "academic_years_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admissions" ADD CONSTRAINT "admissions_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admissions" ADD CONSTRAINT "admissions_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admissions" ADD CONSTRAINT "admissions_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campuses" ADD CONSTRAINT "campuses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_school_id_class_id_fkey" FOREIGN KEY ("school_id", "class_id") REFERENCES "classes"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_school_id_subject_id_fkey" FOREIGN KEY ("school_id", "subject_id") REFERENCES "subjects"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_school_id_teacher_staff_id_fkey" FOREIGN KEY ("school_id", "teacher_staff_id") REFERENCES "staff"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_campus_id_fkey" FOREIGN KEY ("school_id", "campus_id") REFERENCES "campuses"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_school_id_entered_by_staff_id_fkey" FOREIGN KEY ("school_id", "entered_by_staff_id") REFERENCES "staff"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_school_id_exam_subject_id_fkey" FOREIGN KEY ("school_id", "exam_subject_id") REFERENCES "exam_subjects"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_school_id_exam_id_fkey" FOREIGN KEY ("school_id", "exam_id") REFERENCES "exams"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_school_id_section_id_fkey" FOREIGN KEY ("school_id", "section_id") REFERENCES "sections"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_school_id_subject_id_fkey" FOREIGN KEY ("school_id", "subject_id") REFERENCES "subjects"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_school_id_recorded_by_user_id_fkey" FOREIGN KEY ("school_id", "recorded_by_user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_discounts" ADD CONSTRAINT "fee_discounts_school_id_approved_by_user_id_fkey" FOREIGN KEY ("school_id", "approved_by_user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_discounts" ADD CONSTRAINT "fee_discounts_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_discounts" ADD CONSTRAINT "fee_discounts_school_id_invoice_id_fkey" FOREIGN KEY ("school_id", "invoice_id") REFERENCES "student_invoices"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_discounts" ADD CONSTRAINT "fee_discounts_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_heads" ADD CONSTRAINT "fee_heads_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_school_id_collected_by_user_id_fkey" FOREIGN KEY ("school_id", "collected_by_user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_structure_items" ADD CONSTRAINT "fee_structure_items_school_id_fee_head_id_fkey" FOREIGN KEY ("school_id", "fee_head_id") REFERENCES "fee_heads"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_structure_items" ADD CONSTRAINT "fee_structure_items_school_id_fee_structure_id_fkey" FOREIGN KEY ("school_id", "fee_structure_id") REFERENCES "fee_structures"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_structure_items" ADD CONSTRAINT "fee_structure_items_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_school_id_class_id_fkey" FOREIGN KEY ("school_id", "class_id") REFERENCES "classes"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_school_id_section_id_fkey" FOREIGN KEY ("school_id", "section_id") REFERENCES "sections"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_school_id_subject_id_fkey" FOREIGN KEY ("school_id", "subject_id") REFERENCES "subjects"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_school_id_teacher_staff_id_fkey" FOREIGN KEY ("school_id", "teacher_staff_id") REFERENCES "staff"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homework_submissions" ADD CONSTRAINT "homework_submissions_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homework_submissions" ADD CONSTRAINT "homework_submissions_school_id_homework_id_fkey" FOREIGN KEY ("school_id", "homework_id") REFERENCES "homework"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homework_submissions" ADD CONSTRAINT "homework_submissions_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_school_id_fee_head_id_fkey" FOREIGN KEY ("school_id", "fee_head_id") REFERENCES "fee_heads"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_school_id_invoice_id_fkey" FOREIGN KEY ("school_id", "invoice_id") REFERENCES "student_invoices"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_authors" ADD CONSTRAINT "library_authors_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_book_authors" ADD CONSTRAINT "library_book_authors_school_id_author_id_fkey" FOREIGN KEY ("school_id", "author_id") REFERENCES "library_authors"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_book_authors" ADD CONSTRAINT "library_book_authors_school_id_book_id_fkey" FOREIGN KEY ("school_id", "book_id") REFERENCES "library_books"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_book_authors" ADD CONSTRAINT "library_book_authors_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_book_copies" ADD CONSTRAINT "library_book_copies_school_id_book_id_fkey" FOREIGN KEY ("school_id", "book_id") REFERENCES "library_books"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_book_copies" ADD CONSTRAINT "library_book_copies_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_books" ADD CONSTRAINT "library_books_school_id_category_id_fkey" FOREIGN KEY ("school_id", "category_id") REFERENCES "library_categories"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_books" ADD CONSTRAINT "library_books_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_books" ADD CONSTRAINT "library_books_school_id_publisher_id_fkey" FOREIGN KEY ("school_id", "publisher_id") REFERENCES "library_publishers"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_categories" ADD CONSTRAINT "library_categories_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_members" ADD CONSTRAINT "library_members_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_members" ADD CONSTRAINT "library_members_school_id_staff_id_fkey" FOREIGN KEY ("school_id", "staff_id") REFERENCES "staff"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_members" ADD CONSTRAINT "library_members_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_publishers" ADD CONSTRAINT "library_publishers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parents_guardians" ADD CONSTRAINT "parents_guardians_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parents_guardians" ADD CONSTRAINT "parents_guardians_school_id_user_id_fkey" FOREIGN KEY ("school_id", "user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_school_id_user_id_fkey" FOREIGN KEY ("school_id", "user_id") REFERENCES "users"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_school_id_invoice_id_fkey" FOREIGN KEY ("school_id", "invoice_id") REFERENCES "student_invoices"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_school_id_payment_id_fkey" FOREIGN KEY ("school_id", "payment_id") REFERENCES "fee_payments"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_school_id_payroll_run_id_fkey" FOREIGN KEY ("school_id", "payroll_run_id") REFERENCES "payroll_runs"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_school_id_staff_id_fkey" FOREIGN KEY ("school_id", "staff_id") REFERENCES "staff"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_school_id_approved_by_user_id_fkey" FOREIGN KEY ("school_id", "approved_by_user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_school_id_generated_by_user_id_fkey" FOREIGN KEY ("school_id", "generated_by_user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_school_id_role_id_fkey" FOREIGN KEY ("school_id", "role_id") REFERENCES "roles"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_school_id_paid_by_user_id_fkey" FOREIGN KEY ("school_id", "paid_by_user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_school_id_payroll_item_id_fkey" FOREIGN KEY ("school_id", "payroll_item_id") REFERENCES "payroll_items"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_school_id_staff_id_fkey" FOREIGN KEY ("school_id", "staff_id") REFERENCES "staff"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_school_id_class_id_fkey" FOREIGN KEY ("school_id", "class_id") REFERENCES "classes"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_school_id_class_teacher_staff_id_fkey" FOREIGN KEY ("school_id", "class_teacher_staff_id") REFERENCES "staff"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_campus_id_fkey" FOREIGN KEY ("school_id", "campus_id") REFERENCES "campuses"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_user_id_fkey" FOREIGN KEY ("school_id", "user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_school_id_marked_by_user_id_fkey" FOREIGN KEY ("school_id", "marked_by_user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_school_id_staff_id_fkey" FOREIGN KEY ("school_id", "staff_id") REFERENCES "staff"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_school_id_marked_by_user_id_fkey" FOREIGN KEY ("school_id", "marked_by_user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_school_id_class_id_fkey" FOREIGN KEY ("school_id", "class_id") REFERENCES "classes"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_school_id_section_id_fkey" FOREIGN KEY ("school_id", "section_id") REFERENCES "sections"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "student_guardians_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "student_guardians_school_id_guardian_id_fkey" FOREIGN KEY ("school_id", "guardian_id") REFERENCES "parents_guardians"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "student_guardians_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_invoices" ADD CONSTRAINT "student_invoices_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_invoices" ADD CONSTRAINT "student_invoices_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_invoices" ADD CONSTRAINT "student_invoices_school_id_student_id_fkey" FOREIGN KEY ("school_id", "student_id") REFERENCES "students"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_campus_id_fkey" FOREIGN KEY ("school_id", "campus_id") REFERENCES "campuses"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_user_id_fkey" FOREIGN KEY ("school_id", "user_id") REFERENCES "users"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_class_teacher_section_fk" FOREIGN KEY ("school_id", "class_teacher_section_id") REFERENCES "sections"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_school_id_staff_id_fkey" FOREIGN KEY ("school_id", "staff_id") REFERENCES "staff"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_school_id_academic_year_id_fkey" FOREIGN KEY ("school_id", "academic_year_id") REFERENCES "academic_years"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_school_id_section_id_fkey" FOREIGN KEY ("school_id", "section_id") REFERENCES "sections"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_school_id_subject_id_fkey" FOREIGN KEY ("school_id", "subject_id") REFERENCES "subjects"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_school_id_teacher_staff_id_fkey" FOREIGN KEY ("school_id", "teacher_staff_id") REFERENCES "staff"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_school_id_role_id_fkey" FOREIGN KEY ("school_id", "role_id") REFERENCES "roles"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_school_id_user_id_fkey" FOREIGN KEY ("school_id", "user_id") REFERENCES "users"("school_id", "id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_campus_id_fkey" FOREIGN KEY ("school_id", "campus_id") REFERENCES "campuses"("school_id", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
