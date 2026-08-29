-- AddSchoolProfileFields (aman / non-destruktif)
-- Semua kolom baru nullable; tidak ada data yang diubah/dihapus.

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('SEKOLAH', 'YAYASAN');

-- AlterTable SchoolRegistration: profil lengkap dari formulir pendaftaran
ALTER TABLE "SchoolRegistration" ADD COLUMN "institutionType" "InstitutionType",
  ADD COLUMN "vision" TEXT,
  ADD COLUMN "mission" TEXT,
  ADD COLUMN "postalCode" TEXT,
  ADD COLUMN "registrationUrl" TEXT,
  ADD COLUMN "googleMapsUrl" TEXT;

-- AlterTable School: salinan publik dari data pendaftaran saat approve
ALTER TABLE "School" ADD COLUMN "institutionType" "InstitutionType",
  ADD COLUMN "vision" TEXT,
  ADD COLUMN "mission" TEXT,
  ADD COLUMN "postalCode" TEXT,
  ADD COLUMN "registrationUrl" TEXT,
  ADD COLUMN "googleMapsUrl" TEXT;
