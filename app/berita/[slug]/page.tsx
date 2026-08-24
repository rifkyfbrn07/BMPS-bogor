import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Eye } from "lucide-react";
import { notFound } from "next/navigation";
import { getNewsBySlug, news } from "@/lib/data/news";
import { formatDate, formatViews } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import type { NewsItem } from "@/lib/types";

export async function generateStaticParams() {
  try {
    const dbArticles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true }
    });
    if (dbArticles.length > 0) {
      return dbArticles.map((item) => ({ slug: item.slug }));
    }
  } catch (err) {
    console.warn("Gagal membuat static params berita dari DB, gunakan fallback:", err);
  }
  return news.map((item) => ({ slug: item.slug }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let item: NewsItem | null = null;

  try {
    const dbArticle = await prisma.article.findUnique({
      where: { slug },
      include: { category: true }
    });
    if (dbArticle) {
      item = {
        slug: dbArticle.slug,
        title: dbArticle.title,
        category: dbArticle.category?.name || "Umum",
        date: dbArticle.publishedAt?.toISOString().split("T")[0] || dbArticle.createdAt.toISOString().split("T")[0],
        image: dbArticle.thumbnailUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
        excerpt: dbArticle.seoDescription || "",
        content: dbArticle.content,
        views: 1240, // standard mockup views
        tab: "terbaru",
      };
    }
  } catch (dbErr) {
    console.error("Gagal mengambil berita dari DB:", dbErr);
  }

  // Fallback to static news
  if (!item) {
    item = getNewsBySlug(slug) || null;
  }

  if (!item) {
    notFound();
  }

  // Fetch related news
  let relatedNews: Array<{ slug: string; title: string; category: string; image: string }> = [];
  try {
    const dbRelated = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        slug: { not: slug }
      },
      include: { category: true },
      take: 2,
      orderBy: { publishedAt: "desc" }
    });
    if (dbRelated.length > 0) {
      relatedNews = dbRelated.map(dbItem => ({
        slug: dbItem.slug,
        title: dbItem.title,
        category: dbItem.category?.name || "Umum",
        image: dbItem.thumbnailUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
      }));
    }
  } catch (err) {
    console.warn("Gagal memuat berita terkait dari DB:", err);
  }

  if (relatedNews.length === 0) {
    relatedNews = news.filter((newsItem) => newsItem.slug !== item.slug).slice(0, 2);
  }

  return (
    <div className="section-shell py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-royal transition hover:text-navy-deep"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>

        <article className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,35,80,0.03)]">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[3/1]">
            <Image src={item.image} alt={item.title} fill className="object-cover" priority />
          </div>
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-royal">
              <span>{item.category}</span>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-2 text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(item.date)}
              </span>
              <span className="inline-flex items-center gap-2 text-slate-500">
                <Eye className="h-3.5 w-3.5" />
                {formatViews(item.views)}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.03em] text-navy-deep sm:text-4xl lg:text-[2.6rem]">
              {item.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{item.excerpt}</p>

            <div className="mt-8 rounded-[20px] border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <p className="whitespace-pre-line text-base leading-8 text-slate-700">{item.content}</p>
            </div>
          </div>
        </article>

        {relatedNews.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-navy-deep">Berita terkait</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {relatedNews.map((related) => (
                <Link key={related.slug} href={`/berita/${related.slug}`} className="soft-panel overflow-hidden p-0">
                  <div className="relative aspect-[16/9] w-full">
                    <Image src={related.image} alt={related.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-royal">
                      {related.category}
                    </p>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-navy-deep">{related.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
