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

    return NextResponse.json({ message: "Sumber data tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("DELETE Admin Content Error:", error);
    return NextResponse.json({ message: "Akses ditolak atau gagal menghapus data." }, { status: 403 });
  }
}
