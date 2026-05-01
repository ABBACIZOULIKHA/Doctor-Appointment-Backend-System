import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDbSchema1777652299157 implements MigrationInterface {
    name = 'InitDbSchema1777652299157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_roles_role_enum" AS ENUM('patient', 'doctor', 'admin', 'receptionist')`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role" "public"."user_roles_role_enum" NOT NULL, CONSTRAINT "PK_09d115a69b6014d324d592f9c42" PRIMARY KEY ("user_id", "role"))`);
        await queryRunner.query(`CREATE TABLE "medical_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid NOT NULL, "condition" character varying NOT NULL, "diagnosed_at" date NOT NULL, "notes" text, "created_by" uuid NOT NULL, CONSTRAINT "PK_8b0170de8abb52639e20c046533" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_availabilities" ("doctor_id" uuid NOT NULL, "day_of_week" integer NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "slot_duration_mins" integer NOT NULL DEFAULT '30', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_d7c6aa48ca1bcb35d9b11d0095f" PRIMARY KEY ("doctor_id", "day_of_week"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d7c6aa48ca1bcb35d9b11d0095" ON "doctor_availabilities" ("doctor_id", "day_of_week") `);
        await queryRunner.query(`CREATE TABLE "doctor_availability_exceptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "doctor_id" uuid NOT NULL, "exception_date" date NOT NULL, "is_day_off" boolean NOT NULL DEFAULT false, "override_start_time" TIME, "override_end_time" TIME, "reason" character varying, CONSTRAINT "PK_ff65df1a7f8c0a0d691c3a52a6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clinics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" text NOT NULL, "phone" character varying, "map_url" character varying, "email" character varying, "working_hours" jsonb, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_5513b659e4d12b01a8ab3956abc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_clinics" ("doctor_id" uuid NOT NULL, "clinic_id" uuid NOT NULL, "consultation_fee" numeric(10,2) NOT NULL, CONSTRAINT "PK_d834afe319aa3ee7b3b0512f471" PRIMARY KEY ("doctor_id", "clinic_id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid NOT NULL, "doctor_id" uuid NOT NULL, "rating" integer NOT NULL, "text" text, "is_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_profiles" ("user_id" uuid NOT NULL, "name" character varying NOT NULL, "specialization" character varying NOT NULL, "experience_years" integer NOT NULL DEFAULT '0', "max_appointments_per_day" integer NOT NULL DEFAULT '20', "booking_notice_hours" integer NOT NULL DEFAULT '24', "cancellation_window_hrs" integer NOT NULL DEFAULT '24', "bio" text, "avatar_url" character varying, "license_number" character varying, "education" text, "languages" text, "rating_average" numeric(2,1) NOT NULL DEFAULT '0', "total_reviews" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_69995f9059305ab7a9c52cdb10e" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'paid', 'failed', 'refunded', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "appointment_id" uuid NOT NULL, "amount" numeric(10,2) NOT NULL, "currency" character varying NOT NULL DEFAULT 'USD', "stripe_session_id" character varying, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "paid_at" TIMESTAMP, CONSTRAINT "REL_9f49987820da519f855d04c82b" UNIQUE ("appointment_id"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_payment_status_enum" AS ENUM('pending', 'paid', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid NOT NULL, "doctor_id" uuid NOT NULL, "date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "status" "public"."appointments_status_enum" NOT NULL DEFAULT 'pending', "reason" text, "payment_status" "public"."appointments_payment_status_enum" NOT NULL DEFAULT 'pending', "notes" text, "cancelled_at" TIMESTAMP, "cancellation_reason" character varying, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."patient_profiles_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "patient_profiles" ("user_id" uuid NOT NULL, "name" character varying NOT NULL, "dob" date, "gender" "public"."patient_profiles_gender_enum", "address" text, "avatar_url" character varying, "emergency_contact_name" character varying, "emergency_contact_phone" character varying, "blood_type" character varying, "allergies" text, CONSTRAINT "PK_e296010b9088277148d109ba75a" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 'payment_received', 'review_received', 'system')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "message" text NOT NULL, "read" boolean NOT NULL DEFAULT false, "read_at" TIMESTAMP, "action_url" character varying, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."files_entity_type_enum" AS ENUM('user_profile', 'patient_profile', 'doctor_profile', 'medical_report', 'prescription')`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "entity_type" "public"."files_entity_type_enum" NOT NULL, "entity_id" character varying NOT NULL, "file_name" character varying NOT NULL, "file_type" character varying, "file_path" character varying NOT NULL, "file_size" bigint, "mime_type" character varying, "uploaded_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'suspended', 'pending_verification')`);
        await queryRunner.query(`CREATE TABLE "users" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "phone" character varying, "password_hash" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending_verification', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_46c438e5a956fb9c3e86e73e321" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medical_histories" ADD CONSTRAINT "FK_346f79a689d013533a8b6f1c7dd" FOREIGN KEY ("patient_id") REFERENCES "patient_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medical_histories" ADD CONSTRAINT "FK_6b651a33872adfca90f96ac4ae9" FOREIGN KEY ("created_by") REFERENCES "users"("_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" ADD CONSTRAINT "FK_aa49ce7b9ff575a2963abcb6910" FOREIGN KEY ("doctor_id") REFERENCES "doctor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_availability_exceptions" ADD CONSTRAINT "FK_9fdda4dde412661201bcfa628f1" FOREIGN KEY ("doctor_id") REFERENCES "doctor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_clinics" ADD CONSTRAINT "FK_b2e208912ef83837bc062661aad" FOREIGN KEY ("doctor_id") REFERENCES "doctor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_clinics" ADD CONSTRAINT "FK_3b8acdd4f81a745b7cafe31e789" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_402264ba8208a27caf6e6940b34" FOREIGN KEY ("patient_id") REFERENCES "patient_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_eefa239f3536811d445eae9250b" FOREIGN KEY ("doctor_id") REFERENCES "doctor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_profiles" ADD CONSTRAINT "FK_69995f9059305ab7a9c52cdb10e" FOREIGN KEY ("user_id") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_9f49987820da519f855d04c82bd" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "patient_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES "doctor_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_profiles" ADD CONSTRAINT "FK_e296010b9088277148d109ba75a" FOREIGN KEY ("user_id") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_a7435dbb7583938d5e7d1376041" FOREIGN KEY ("user_id") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_a7435dbb7583938d5e7d1376041"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "patient_profiles" DROP CONSTRAINT "FK_e296010b9088277148d109ba75a"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_3330f054416745deaa2cc130700"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_9f49987820da519f855d04c82bd"`);
        await queryRunner.query(`ALTER TABLE "doctor_profiles" DROP CONSTRAINT "FK_69995f9059305ab7a9c52cdb10e"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_eefa239f3536811d445eae9250b"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_402264ba8208a27caf6e6940b34"`);
        await queryRunner.query(`ALTER TABLE "doctor_clinics" DROP CONSTRAINT "FK_3b8acdd4f81a745b7cafe31e789"`);
        await queryRunner.query(`ALTER TABLE "doctor_clinics" DROP CONSTRAINT "FK_b2e208912ef83837bc062661aad"`);
        await queryRunner.query(`ALTER TABLE "doctor_availability_exceptions" DROP CONSTRAINT "FK_9fdda4dde412661201bcfa628f1"`);
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" DROP CONSTRAINT "FK_aa49ce7b9ff575a2963abcb6910"`);
        await queryRunner.query(`ALTER TABLE "medical_histories" DROP CONSTRAINT "FK_6b651a33872adfca90f96ac4ae9"`);
        await queryRunner.query(`ALTER TABLE "medical_histories" DROP CONSTRAINT "FK_346f79a689d013533a8b6f1c7dd"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TYPE "public"."files_entity_type_enum"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "patient_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."patient_profiles_gender_enum"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "doctor_profiles"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "doctor_clinics"`);
        await queryRunner.query(`DROP TABLE "clinics"`);
        await queryRunner.query(`DROP TABLE "doctor_availability_exceptions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7c6aa48ca1bcb35d9b11d0095"`);
        await queryRunner.query(`DROP TABLE "doctor_availabilities"`);
        await queryRunner.query(`DROP TABLE "medical_histories"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_role_enum"`);
    }

}
