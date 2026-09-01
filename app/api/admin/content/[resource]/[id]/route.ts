import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  try {
    const admin = await requireRole("ADMIN", "SUPER_ADMIN");
    const { resource, id } = await context.params;
    const body = await request.json();

    if (resource === "articles") {
      const data = await prisma.article.update({
        where: { id },
        data: {
          title: body.title,
          content: body.content,
          thumbnailUrl: body.thumbnailUrl || null,
          categoryId: body.categoryId,
          status: body.status,
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
          seoTitle: body.title,
          seoDescription: body.description,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "ARTICLE_UPDATED",
          entity: "Article",
          entityId: id,
        }
      });

      return NextResponse.json({ data });
    }

    if (resource === "programs") {
      const data = await prisma.program.update({
        where: { id },
        data: {
          title: body.title,
          description: body.description,
          thumbnailUrl: body.thumbnailUrl || null,
          category: body.category,
          status: body.status,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "PROGRAM_UPDATED",
          entity: "Program",
          entityId: id,
        }
      });

      return NextResponse.json({ data });
    }

    if (resource === "trainings") {
      const data = await prisma.training.update({
        where: { id },
        data: {
          title: body.title,
          description: body.description,
          thumbnailUrl: body.thumbnailUrl || null,
          location: body.location,
          startDate: body.startDate ? new Date(body.startDate) : undefined,
          endDate: body.endDate ? new Date(body.endDate) : (body.startDate ? new Date(body.startDate) : undefined),
          quota: body.quota ? parseInt(body.quota) : undefined,
          registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : undefined,
          speaker: body.speaker,
          status: body.status,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "TRAINING_UPDATED",
          entity: "Training",
          entityId: id,
        }
      });

      return NextResponse.json({ data });
    }

    if (resource === "schools") {
      const existingSchool = await prisma.school.findUnique({ where: { id } });
      if (!existingSchool) return NextResponse.json({ message: "Sekolah tidak ditemukan." }, { status: 404 });

      let foundationId = body.foundationId !== undefined ? body.foundationId : existingSchool.foundationId;
      if (body.foundationName) {
        const foundSlug = body.foundationName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const found = await prisma.foundation.upsert({
          where: { slug: foundSlug },
          update: {},
          create: { name: body.foundationName, slug: foundSlug }
        });
        foundationId = found.id;
      }

      const data = await prisma.school.update({
        where: { id },
        data: {
          name: body.name !== undefined ? body.name : undefined,
          npsn: body.npsn !== undefined ? body.npsn : undefined,
          level: body.level !== undefined ? body.level : undefined,
          institutionType: body.institutionType !== undefined ? body.institutionType : undefined,
          foundationId,
          principalName: body.principalName !== undefined ? body.principalName : undefined,
          picName: body.picName !== undefined ? body.picName : undefined,
          picRole: body.picRole !== undefined ? body.picRole : undefined,
          email: body.email !== undefined ? body.email : undefined,
          phone: body.phone !== undefined ? body.phone : undefined,
          whatsapp: body.whatsapp !== undefined ? body.whatsapp : undefined,
          instagram: body.instagram !== undefined ? body.instagram : undefined,
          facebook: body.facebook !== undefined ? body.facebook : undefined,
          youtube: body.youtube !== undefined ? body.youtube : undefined,
          tiktok: body.tiktok !== undefined ? body.tiktok : undefined,
          address: body.address !== undefined ? body.address : undefined,
          district: body.district !== undefined ? body.district : undefined,
          ward: body.ward !== undefined ? body.ward : undefined,
          city: body.city !== undefined ? body.city : undefined,
          province: body.province !== undefined ? body.province : undefined,
          postalCode: body.postalCode !== undefined ? body.postalCode : undefined,
          website: body.website !== undefined ? body.website : undefined,
          registrationUrl: body.registrationUrl !== undefined ? body.registrationUrl : undefined,
          googleMapsUrl: body.googleMapsUrl !== undefined ? body.googleMapsUrl : undefined,
          description: body.description !== undefined ? body.description : undefined,
          vision: body.vision !== undefined ? body.vision : undefined,
          mission: body.mission !== undefined ? body.mission : undefined,
          schoolPhotoUrl: body.schoolPhotoUrl !== undefined ? body.schoolPhotoUrl : (body.image !== undefined ? body.image : undefined),
          logoUrl: body.logoUrl !== undefined ? body.logoUrl : undefined,
        },
      });

      if (existingSchool.npsn) {
        await prisma.schoolRegistration.updateMany({
          where: { npsn: existingSchool.npsn },
          data: {
            name: data.name,
            level: data.level,
            institutionType: data.institutionType,
            principalName: data.principalName || undefined,
            email: data.email || undefined,
            phone: data.phone || undefined,
            whatsapp: data.whatsapp || undefined,
            instagram: data.instagram || undefined,
            facebook: data.facebook || undefined,
            youtube: data.youtube || undefined,
            tiktok: data.tiktok || undefined,
            address: data.address || undefined,
            district: data.district,
            ward: data.ward || undefined,
            city: data.city,
            website: data.website || undefined,
            registrationUrl: data.registrationUrl || undefined,
            googleMapsUrl: data.googleMapsUrl || undefined,
            description: data.description || undefined,
            vision: data.vision || undefined,
            mission: data.mission || undefined,
            schoolPhotoUrl: data.schoolPhotoUrl || undefined,
            logoUrl: data.logoUrl || undefined,
          }
        }).catch((e) => console.warn("Sync registration update failed:", e));
      }

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "SCHOOL_UPDATED",
          entity: "School",
          entityId: id,
        }
      });

      return NextResponse.json({ data });
    }

    return NextResponse.json({ message: "Sumber data tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("PATCH Admin Content Error:", error);
    return NextResponse.json({ message: "Akses ditolak atau data tidak ditemukan." }, { status: 403 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  try {
    const admin = await requireRole("ADMIN", "SUPER_ADMIN");
    const { resource, id } = await context.params;

    if (resource === "articles") {
      const data = await prisma.article.delete({ where: { id } });
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "ARTICLE_DELETED",
          entity: "Article",
          entityId: id,
        }
      });
      return NextResponse.json({ data });
    }

    if (resource === "programs") {
      const data = await prisma.program.delete({ where: { id } });
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "PROGRAM_DELETED",
          entity: "Program",
          entityId: id,
        }
      });
      return NextResponse.json({ data });
    }

    if (resource === "trainings") {
      const data = await prisma.training.delete({ where: { id } });
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "TRAINING_DELETED",
          entity: "Training",
          entityId: id,
        }
      });
      return NextResponse.json({ data });
    }

    if (resource === "schools") {
      const existing = await prisma.school.findUnique({ where: { id } });
      if (existing?.npsn) {
        await prisma.schoolRegistration.deleteMany({ where: { npsn: existing.npsn } }).catch(() => null);
      }
      const data = await prisma.school.delete({ where: { id } });
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "SCHOOL_DELETED",
          entity: "School",
          entityId: id,
        }
      });
      return NextResponse.json({ data });
    }

    return NextResponse.json({ message: "Sumber data tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("DELETE Admin Content Error:", error);
    return NextResponse.json({ message: "Akses ditolak atau gagal menghapus data." }, { status: 403 });
  }
}
