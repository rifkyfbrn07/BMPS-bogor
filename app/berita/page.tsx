"use client";

import { useMemo, useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import SectionHeading from "@/components/SectionHeading";
import { news as staticNews } from "@/lib/data/news";
import type { NewsItem } from "@/lib/types";

const itemsPerPage = 6;

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>(staticNews);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/content/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setNews(data.data);
      })
      .catch((err) => console.error("Gagal memuat berita:", err));
  }, []);

  const categories = useMemo(() => {
    return ["Semua", ...new Set(news.map((item) => item.category))];
  }, [news]);

  const filteredNews = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return news.filter((item) => {
      const matchesCategory =
        activeCategory === "Semua" || item.category === activeCategory;
      const matchesSearch =
        normalized.length === 0 ||
        item.title.toLowerCase().includes(normalized) ||
        item.excerpt.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [query, activeCategory, news]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage));
  const currentItems = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="section-shell py-12 sm:py-16 lg:py-20">
      <SectionHeading
        eyebrow="Berita & Kegiatan"
        title="Informasi terbaru BMPS Bogor"
        description="Kumpulan berita, kegiatan, dan perkembangan pendidikan swasta di wilayah Bogor."
      />

      <div className="mt-8 flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,35,80,0.03)] sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full xl:max-w-md">
          <SearchBar
            value={query}
            onChange={(value) => {
              setQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Cari berita..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-blue-light hover:text-blue-royal"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {currentItems.length > 0 ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {currentItems.map((item) => (
                <NewsCard key={item.slug} item={item} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="soft-panel p-8 text-center text-slate-600">
            Tidak ada berita yang cocok dengan pencarian saat ini.
          </div>
        )}
      </div>
    </div>
  );
}
