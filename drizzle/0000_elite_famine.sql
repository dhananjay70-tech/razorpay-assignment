CREATE TYPE "public"."role" AS ENUM('EMP', 'RM', 'APE', 'CFO');--> statement-breakpoint
CREATE TYPE "public"."reimbursement_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "app_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'EMP' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "employee_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"manager_id" uuid NOT NULL,
	CONSTRAINT "employee_assignments_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
CREATE TABLE "reimbursements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"amount" double precision NOT NULL,
	"status" "reimbursement_status" DEFAULT 'PENDING' NOT NULL,
	"employee_id" uuid NOT NULL,
	"rm_approved" boolean DEFAULT false NOT NULL,
	"ape_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "employee_assignments" ADD CONSTRAINT "employee_assignments_employee_id_app_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_assignments" ADD CONSTRAINT "employee_assignments_manager_id_app_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_employee_id_app_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;