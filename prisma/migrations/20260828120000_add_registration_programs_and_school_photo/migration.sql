-- AddProgramsAndSchoolPhoto (aman / non-destruktif)
-- Kolom baru nullable atau berdefault aman; tidak ada data yang diubah/dihapus.

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('BEASISWA', 'BANTUAN_PENDIDIKAN');

-- AlterTable: kolom program (default array kosong) dan foto sekolah (nullable)
ALTER TABLE "SchoolRegistration" ADD COLUMN "programs" "ProgramType"[] DEFAULT ARRAY[]::"ProgramType"[];
ALTER TABLE "SchoolRegistration" ADD COLUMN "schoolPhotoUrl" TEXT;
ALTER TABLE "School" ADD COLUMN "schoolPhotoUrl" TEXT;
