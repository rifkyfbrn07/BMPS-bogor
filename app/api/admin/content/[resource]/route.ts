import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ resource: string }> }
) {
  try {
    await requireRole("ADMIN", "SUPER_ADMIN");
    const { resource } = await context.params;

    if (resource === "articles") {
      const data = await prisma.article.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data });
    }

    if (resource === "programs") {
      const data = await prisma.program.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data });
    }

    if (resource === "trainings") {
      const data = await prisma.training.findMany({
        orderBy: { startDate: "desc" },
      });
      return NextResponse.json({ data });
    }

    if (resource === "schools") {
      const data = await prisma.school.findMany({
        include: { foundation: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data });
    }

    return NextResponse.json({ message: "Sumber data tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("GET Admin Content Error:", error);
    return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ resource: string }> }
) {
  try {
    const admin = await requireRole("ADMIN", "SUPER_ADMIN");
    const { resource } = await context.params;
    const body = await request.json();

    if (resource === "articles") {
      const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      // Get or create category
      let categoryId = body.categoryId;
      if (!categoryId && body.categoryName) {
        const catSlug = body.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const category = await prisma.articleCategory.upsert({
          where: { slug: catSlug },
          update: { updatedAt: new Date() },
          create: { name: body.categoryName, slug: catSlug, updatedAt: new Date() }
        });
        categoryId = category.id;
      }

      if (!categoryId) {
        const firstCategory = await prisma.articleCategory.findFirst();
        if (firstCategory) categoryId = firstCategory.id;
        else {
          const defaultCategory = await prisma.articleCategory.create({
            data: { name: "Kegiatan", slug: "kegiatan", updatedAt: new Date() }
          });
          categoryId = defaultCategory.id;
        }
      }

      const data = await prisma.article.create({
        data: {
          title: body.title,
          slug,
          content: body.content,
          thumbnailUrl: body.thumbnailUrl || null,
          categoryId,
          status: body.status || "PUBLISHED",
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
          seoTitle: body.title,
          seoDescription: body.description || null,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "ARTICLE_CREATED",
          entity: "Article",
          entityId: data.id,
        }
      });

      return NextResponse.json({ data });
    }

    if (resource === "programs") {
      const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const data = await prisma.program.create({
        data: {
          title: body.title,
          slug,
          description: body.description,
          thumbnailUrl: body.thumbnailUrl || null,
          category: body.category || "Umum",
          status: body.status || "PUBLISHED",
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "PROGRAM_CREATED",
          entity: "Program",
          entityId: data.id,
        }
      });

      return NextResponse.json({ data });
    }

    if (resource === "trainings") {
      const data = await prisma.training.create({
        data: {
          title: body.title,
          description: body.description,
          thumbnailUrl: body.thumbnailUrl || null,
          location: body.location,
          startDate: new Date(body.startDate),
          endDate: body.endDate ? new Date(body.endDate) : new Date(body.startDate),
          quota: parseInt(body.quota) || 50,
          registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : new Date(body.startDate),
          speaker: body.speaker || "Pembicara Utama",
          status: body.status || "PUBLISHED",
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "TRAINING_CREATED",
          entity: "Training",
          entityId: data.id,
        }
      });

      return NextResponse.json({ data });
    }

    if (resource === "schools") {
      const npsn = (body.npsn || "").trim();
      const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      let foundationId = body.foundationId || null;
      if (!foundationId && body.foundationName) {
        const foundSlug = body.foundationName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const found = await prisma.foundation.upsert({
          where: { slug: foundSlug },
          update: {},
          create: {
            name: body.foundationName,
            slug: foundSlug,
          }
        });
        foundationId = found.id;
      }

      const schoolLevel = body.level || "SMA";
      const institutionType = body.institutionType || (body.foundationName ? "YAYASAN" : "SEKOLAH");

      const data = await prisma.school.create({
        data: {
          name: body.name,
          npsn,
          slug,
          level: schoolLevel,
          institutionType,
          foundationId,
          principalName: body.principalName || null,
          picName: body.picName || null,
          picRole: body.picRole || null,
          email: body.email || null,
          phone: body.phone || null,
          whatsapp: body.whatsapp || body.phone || null,
          instagram: body.instagram || null,
          facebook: body.facebook || null,
          youtube: body.youtube || null,
          tiktok: body.tiktok || null,
          address: body.address || null,
          district: body.district || "Bogor",
          ward: body.ward || null,
          city: body.city || "Bogor",
          province: body.province || "Jawa Barat",
          postalCode: body.postalCode || null,
          website: body.website || null,
          registrationUrl: body.registrationUrl || null,
          googleMapsUrl: body.googleMapsUrl || null,
          description: body.description || null,
          vision: body.vision || null,
          mission: body.mission || null,
          schoolPhotoUrl: body.schoolPhotoUrl || body.image || null,
          logoUrl: body.logoUrl || null,
        },
      });

      // Buat / sinkronkan SchoolRegistration APPROVED agar tampil di direktori publik
      const regNum = `BMPS-ADM-${Date.now().toString().slice(-6)}`;
      await prisma.schoolRegistration.upsert({
        where: { npsn },
        update: {
          name: body.name,
          level: schoolLevel,
          institutionType,
          foundationName: body.foundationName || null,
          principalName: body.principalName || "Pimpinan Sekolah",
          picName: body.picName || "Admin Sekolah",
          picRole: body.picRole || "Pengurus",
          email: body.email || "info@sekolah.sch.id",
          phone: body.phone || body.whatsapp || "081234567890",
          whatsapp: body.whatsapp || body.phone || null,
          instagram: body.instagram || null,
          facebook: body.facebook || null,
          youtube: body.youtube || null,
          tiktok: body.tiktok || null,
          address: body.address || "Bogor",
          district: body.district || "Bogor",
          ward: body.ward || "Bogor",
          city: body.city || "Bogor",
          province: body.province || "Jawa Barat",
          postalCode: body.postalCode || null,
          website: body.website || null,
          registrationUrl: body.registrationUrl || null,
          googleMapsUrl: body.googleMapsUrl || null,
          description: body.description || null,
          vision: body.vision || null,
          mission: body.mission || null,
          schoolPhotoUrl: body.schoolPhotoUrl || body.image || null,
          logoUrl: body.logoUrl || null,
          status: "APPROVED",
          reviewedAt: new Date(),
        },
        create: {
          registrationNumber: regNum,
          name: body.name,
          npsn,
          level: schoolLevel,
          institutionType,
          foundationName: body.foundationName || null,
          principalName: body.principalName || "Pimpinan Sekolah",
          picName: body.picName || "Admin Sekolah",
          picRole: body.picRole || "Pengurus",
          email: body.email || "info@sekolah.sch.id",
          phone: body.phone || body.whatsapp || "081234567890",
          whatsapp: body.whatsapp || body.phone || null,
          instagram: body.instagram || null,
          facebook: body.facebook || null,
          youtube: body.youtube || null,
          tiktok: body.tiktok || null,
          address: body.address || "Bogor",
          district: body.district || "Bogor",
          ward: body.ward || "Bogor",
          city: body.city || "Bogor",
          province: body.province || "Jawa Barat",
          postalCode: body.postalCode || null,
          website: body.website || null,
          registrationUrl: body.registrationUrl || null,
          googleMapsUrl: body.googleMapsUrl || null,
          description: body.description || null,
          vision: body.vision || null,
          mission: body.mission || null,
          schoolPhotoUrl: body.schoolPhotoUrl || body.image || null,
          logoUrl: body.logoUrl || null,
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "SCHOOL_CREATED",
          entity: "School",
          entityId: data.id,
        }
      });

      return NextResponse.json({ data });
    }

    return NextResponse.json({ message: "Sumber data tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("POST Admin Content Error:", error);
    return NextResponse.json({ message: "Akses ditolak atau data tidak valid." }, { status: 403 });
  }
}
