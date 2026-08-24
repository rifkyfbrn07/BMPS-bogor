import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ArticleStatus } from "../generated/prisma/client";

// Import starter data
import { news } from "../lib/data/news";
import { programs } from "../lib/data/programs";
import { trainings } from "../lib/data/trainings";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL belum dikonfigurasi.");
const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? "";
if (seedPassword.length < 12) throw new Error("Setel SEED_ADMIN_PASSWORD minimal 12 karakter sebelum menjalankan seed.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

async function main() {
  // 1. Seed Super Admin
  const passwordHash = await bcrypt.hash(seedPassword, 12);
  await prisma.user.upsert({
    where: { email: "superadmin@bmpsbogor.or.id" },
    update: { name: "Super Admin BMPS", role: "SUPER_ADMIN", password: passwordHash, accountStatus: "APPROVED" },
    create: { name: "Super Admin BMPS", email: "superadmin@bmpsbogor.or.id", role: "SUPER_ADMIN", password: passwordHash, accountStatus: "APPROVED" },
  });
  console.log("✔ Seeded Super Admin account.");

  // 2. Seed Article Categories (News Categories)
  const categoryNames = ["Kegiatan", "Pelatihan", "Beasiswa", "Kemitraan", "Organisasi"];
  const categories: Record<string, string> = {};

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await prisma.articleCategory.upsert({
      where: { slug },
      update: { name, updatedAt: new Date() },
      create: { name, slug, description: `Kategori berita tentang ${name}`, updatedAt: new Date() },
    });
    categories[name] = category.id;
  }
  console.log("✔ Seeded Article Categories.");

  // 3. Seed Articles (News)
  for (const item of news) {
    const categoryId = categories[item.category] || Object.values(categories)[0];
    const status: ArticleStatus = "PUBLISHED";
    await prisma.article.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        content: item.content,
        thumbnailUrl: item.image,
        categoryId,
        status,
        publishedAt: new Date(item.date),
        seoTitle: item.title,
        seoDescription: item.excerpt,
      },
      create: {
        title: item.title,
        slug: item.slug,
        content: item.content,
        thumbnailUrl: item.image,
        categoryId,
        status,
        publishedAt: new Date(item.date),
        seoTitle: item.title,
        seoDescription: item.excerpt,
      },
    });
  }
  console.log("✔ Seeded Articles (News).");

  // 4. Seed Programs
  for (const program of programs) {
    const status: ArticleStatus = program.status === "closed" ? "ARCHIVED" : "PUBLISHED";
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        title: program.title,
        description: program.description,
        thumbnailUrl: program.image,
        category: program.category,
        status,
      },
      create: {
        title: program.title,
        slug: program.slug,
        description: program.description,
        thumbnailUrl: program.image,
        category: program.category,
        status,
      },
    });
  }
  console.log("✔ Seeded Programs.");

  // 5. Seed Trainings
  for (const training of trainings) {
    const status: ArticleStatus = training.status === "closed" ? "ARCHIVED" : "PUBLISHED";
    const dateObj = new Date(training.date);
    
    // find or create based on title or slug
    const existing = await prisma.training.findFirst({
      where: { title: training.title }
    });
    if (existing) {
      await prisma.training.update({
        where: { id: existing.id },
        data: {
          description: training.description,
          thumbnailUrl: training.image,
          location: training.location,
          startDate: dateObj,
          endDate: dateObj,
          quota: training.quota,
          registrationDeadline: dateObj,
          speaker: "Pembicara Utama",
          status,
        }
      });
    } else {
      await prisma.training.create({
        data: {
          title: training.title,
          description: training.description,
          thumbnailUrl: training.image,
          location: training.location,
          startDate: dateObj,
          endDate: dateObj,
          quota: training.quota,
          registrationDeadline: dateObj,
          speaker: "Pembicara Utama",
          status,
        }
      });
    }
  }
  console.log("✔ Seeded Trainings.");
}

main()
  .catch((e) => {
    console.error("Error in seeding database:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
