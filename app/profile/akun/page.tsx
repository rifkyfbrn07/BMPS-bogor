import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function UserProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, role: true, accountStatus: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="section-shell pt-28 pb-12 sm:pt-32 sm:pb-16">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-royal">Profil akun</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-navy-deep sm:text-4xl">Profil Saya</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Informasi akun yang sedang digunakan untuk mengakses BMPS Bogor.</p>
      </div>

      <section className="soft-panel mt-8 max-w-2xl p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-light text-blue-royal">
            <span className="text-lg font-bold">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-bold text-navy-deep">{user.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <dl className="grid gap-5 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Peran</dt>
            <dd className="mt-2 text-sm font-medium text-slate-700">{user.role === "SCHOOL" ? "Anggota sekolah" : "Administrator BMPS"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Status akun</dt>
            <dd className="mt-2 text-sm font-medium text-slate-700">{user.accountStatus === "APPROVED" ? "Disetujui" : user.accountStatus === "PENDING" ? "Menunggu verifikasi" : "Ditolak"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}