-- Safe idempotent migration to ensure all school and registration columns exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionType') THEN
        CREATE TYPE "InstitutionType" AS ENUM ('SEKOLAH', 'YAYASAN');
    END IF;
END $$;

ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "institutionType" "InstitutionType";
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "vision" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "mission" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "registrationUrl" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "youtube" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "tiktok" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "schoolPhotoUrl" TEXT;

ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "institutionType" "InstitutionType";
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "vision" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "mission" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "registrationUrl" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "youtube" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "tiktok" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "schoolPhotoUrl" TEXT;
