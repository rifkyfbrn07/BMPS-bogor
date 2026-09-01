-- Safe idempotent migration to ensure all school and registration columns exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionType') THEN
        CREATE TYPE "InstitutionType" AS ENUM ('SEKOLAH', 'YAYASAN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProgramType') THEN
        CREATE TYPE "ProgramType" AS ENUM ('BEASISWA', 'BANTUAN_PENDIDIKAN');
    END IF;
END $$;

ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "programs" "ProgramType"[] DEFAULT ARRAY[]::"ProgramType"[];
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "institutionType" "InstitutionType";
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "foundationName" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "principalName" TEXT DEFAULT 'Belum diisi';
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "picRole" TEXT DEFAULT 'Penanggung jawab';
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "ward" TEXT DEFAULT 'Belum diisi';
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "district" TEXT DEFAULT 'Belum diisi';
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "city" TEXT DEFAULT 'Bogor';
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "province" TEXT DEFAULT 'Jawa Barat';
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "youtube" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "tiktok" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "registrationUrl" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "vision" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "mission" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "schoolPhotoUrl" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "documentUrl" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "reviewerId" TEXT;
ALTER TABLE "SchoolRegistration" ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3);

ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "institutionType" "InstitutionType";
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "foundationId" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "principalName" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "picName" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "picRole" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "ward" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "youtube" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "tiktok" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "registrationUrl" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "vision" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "mission" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "schoolPhotoUrl" TEXT;
