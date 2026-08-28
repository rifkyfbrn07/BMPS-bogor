import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Import starter/fallback static data
import { news as staticNews } from "@/lib/data/news";
import { programs as staticPrograms } from "@/lib/data/programs";
import { schools as staticSchools } from "@/lib/data/schools";
import { trainings as staticTrainings } from "@/lib/data/trainings";

export async function GET(
  _request: Request,
  context: { params: Promise<{ resource: string }> }
) {
  try {
    const { resource } = await context.params;

    // 1. News / Articles Resource
    if (resource === "news") {
      try {
        const dbArticles = await prisma.article.findMany({
          where: { status: "PUBLISHED" },
          include: { category: true },
          orderBy: { publishedAt: "desc" },
        });

        if (dbArticles.length > 0) {
          const mappedArticles = dbArticles.map((item) => ({
            slug: item.slug,
            title: item.title,
            category: item.category?.name || "Umum",
            date: item.publishedAt?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
            image: item.thumbnailUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
            excerpt: item.seoDescription || "",
            content: item.content,
            views: 0,
            tab: "terbaru",
          }));
          return NextResponse.json({ data: mappedArticles });
        }
      } catch (dbErr) {
        console.warn("DB fetch failed for news, falling back to static:", dbErr);
      }
      return NextResponse.json({ data: staticNews });
    }

    // 2. Programs Resource
    if (resource === "programs") {
      try {
        const dbPrograms = await prisma.program.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
        });

        if (dbPrograms.length > 0) {
          const mappedPrograms = dbPrograms.map((item) => ({
            slug: item.slug,
            title: item.title,
            category: item.category,
            description: item.description,
            image: item.thumbnailUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
            status: item.status === "ARCHIVED" ? "closed" : "active",
            startDate: item.createdAt.toISOString().split("T")[0],
            content: item.description,
          }));
          return NextResponse.json({ data: mappedPrograms });
        }
      } catch (dbErr) {
        console.warn("DB fetch failed for programs, falling back to static:", dbErr);
      }
      return NextResponse.json({ data: staticPrograms });
    }

    // 3. Trainings Resource
    if (resource === "trainings") {
      try {
        const dbTrainings = await prisma.training.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { startDate: "desc" },
        });

        if (dbTrainings.length > 0) {
          const mappedTrainings = dbTrainings.map((item) => ({
            slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            title: item.title,
            image: item.thumbnailUrl || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
            date: item.startDate.toISOString().split("T")[0],
            location: item.location,
            quota: item.quota,
            status: item.status === "ARCHIVED" ? "closed" : "active",
            description: item.description,
            content: item.description,
          }));
          return NextResponse.json({ data: mappedTrainings });
        }
      } catch (dbErr) {
        console.warn("DB fetch failed for trainings, falling back to static:", dbErr);
      }
      return NextResponse.json({ data: staticTrainings });
    }

    // 4. Schools Resource
    if (resource === "schools") {
      try {
        const dbRegistrations = await prisma.schoolRegistration.findMany({
          where: { status: "APPROVED" },
          // Sekolah yang paling baru disetujui (reviewedAt terbaru) tampil lebih dulu.
          // nulls: "last" menjaga data lama yang belum memiliki reviewedAt tetap di urutan akhir.
          orderBy: [
            { reviewedAt: { sort: "desc", nulls: "last" } },
            { createdAt: "desc" },
          ],
        });

        if (dbRegistrations.length > 0) {
          const dbSchools = await prisma.school.findMany({
            select: { npsn: true, slug: true },
          });
          const slugMap = new Map(dbSchools.map((s) => [s.npsn, s.slug]));
          const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

          const mappedSchools = dbRegistrations.map((item) => {
            const slug = slugMap.get(item.npsn) || slugify(item.name);
            return {
              slug,
              name: item.name,
              type: item.foundationName ? "yayasan" : "sekolah",
              level: item.level,
              address: item.address || "",
              image: item.logoUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
              accreditation: "A",
              studentCount: 150,
              description: item.description || "",
              district: item.district,
              city: item.city,
            };
          });
          return NextResponse.json({ data: mappedSchools });
        }
      } catch (dbErr) {
        console.warn("DB fetch failed for schools, falling back to static:", dbErr);
      }
      return NextResponse.json({ data: staticSchools });
    }

    return NextResponse.json({ message: "Sumber data tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("GET Public Content Error:", error);
    return NextResponse.json({ message: "Gagal memproses data." }, { status: 500 });
  }
}
