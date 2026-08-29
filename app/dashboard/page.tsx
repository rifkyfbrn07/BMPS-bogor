import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusPresentation: Record<string, { headline: string; supporting: string; dotClass: string }> = {
  PENDING: {
    headline: "Menunggu verifikasi",
    supporting: "Pendaftaran sudah diterima dan menunggu peninjauan admin BMPS Bogor.",
    dotClass: "bg-amber-400 ring-amber-400/30",
  },
  UNDER_REVIEW: {
    headline: "Sedang ditinjau",
    supporting: "Admin sedang memeriksa berkas pendaftaran lembaga Anda.",
    dotClass: "bg-blue-royal ring-blue-royal/25",
  },
  APPROVED: {
    headline: "Pendaftaran disetujui",
    supporting: "Lembaga Anda kini terdaftar sebagai anggota BMPS Bogor.",
    dotClass: "bg-emerald-500 ring-emerald-500/30",
  },
  REJECTED: {
    headline: "Pendaftaran belum dapat disetujui",
    supporting: "Silakan periksa catatan admin, perbaiki data, lalu ajukan kembali.",
    dotClass: "bg-red-500 ring-red-500/30",
  },
};

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));

export default async function DashboardPage() {
  const session = await getSession(); if (!session || session.role !== "SCHOOL") redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { name: true, email: true, school: { include: { foundation: true } } } }); if (!user) redirect("/login");
  const registrations = await prisma.schoolRegistration.findMany({ where: { email: user.email }, select: { registrationNumber: true, name: true, status: true, rejectionReason: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 10 });
  return (
    <div className="section-shell w-full max-w-full overflow-x-clip py-12 sm:py-16 lg:py-20">
      <div className="min-w-0 max-w-3xl">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-royal">
          <span aria-hidden="true" className="h-px w-8 bg-blue-royal/50" />
          Dashboard anggota
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-navy-deep sm:text-4xl">Selamat datang, {user.name}</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">Keputusan pendaftaran sekolah Anda tersedia di bawah ini.</p>
        {user.school && (
          <div className="mt-6 border-l-2 border-blue-royal/40 bg-blue-light/50 p-4 text-sm text-navy-deep">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-royal/80">Sekolah terhubung</p>
            <p className="mt-1 font-semibold">{user.school.name}{user.school.foundation ? ` · ${user.school.foundation.name}` : ""}</p>
          </div>
        )}
      </div>

      <section className="mt-12 sm:mt-14" aria-labelledby="dashboard-notifikasi">
        <h2 id="dashboard-notifikasi" className="text-xl font-bold tracking-[-0.01em] text-navy-deep">Notifikasi pendaftaran sekolah</h2>
        <div className="mt-5 space-y-4">
          {registrations.length ? registrations.map((registration) => {
            const presentation = statusPresentation[registration.status] ?? statusPresentation.PENDING;
            return (
              <article key={registration.registrationNumber} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{registration.registrationNumber}</p>
                <div className="mt-2.5 flex items-center gap-3">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ring-4 ${presentation.dotClass}`} />
                  <h3 className="text-lg font-bold tracking-[-0.01em] text-navy-deep">{presentation.headline}</h3>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-slate-700">{registration.name}</span> — {presentation.supporting}
                </p>
                <p className="mt-3 text-xs text-slate-400">Diperbarui {formatDate(registration.updatedAt)}</p>
                {registration.rejectionReason && (
                  <div className="mt-4 rounded-xl border-l-2 border-red-300 bg-red-50/60 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-500">Catatan admin</p>
                    <p className="mt-1.5 text-sm leading-6 text-red-800">{registration.rejectionReason}</p>
                  </div>
                )}
              </article>
            );
          }) : (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              Belum ada pendaftaran sekolah dengan email akun ini.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

