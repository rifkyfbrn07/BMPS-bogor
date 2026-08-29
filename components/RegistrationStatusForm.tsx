"use client";

import { FormEvent, useState } from "react";

type Result = { registrationNumber: string; name: string; status: string; rejectionReason?: string | null };

type StatusPresentation = {
  headline: string;
  supporting: string;
  dotClass: string;
};

const statusPresentation: Record<string, StatusPresentation> = {
  PENDING: {
    headline: "Menunggu verifikasi",
    supporting: "Pendaftaran Anda sudah kami terima dan sedang dalam antrean peninjauan admin BMPS Bogor.",
    dotClass: "bg-amber-400 ring-amber-400/30",
  },
  UNDER_REVIEW: {
    headline: "Sedang ditinjau",
    supporting: "Admin BMPS Bogor sedang memeriksa berkas pendaftaran lembaga Anda.",
    dotClass: "bg-blue-royal ring-blue-royal/25",
  },
  APPROVED: {
    headline: "Pendaftaran disetujui",
    supporting: "Selamat — lembaga Anda kini terdaftar sebagai anggota BMPS Bogor. Informasi akun telah dikirim ke email pendaftar.",
    dotClass: "bg-emerald-500 ring-emerald-500/30",
  },
  REJECTED: {
    headline: "Pendaftaran belum dapat disetujui",
    supporting: "Admin menemukan kendala pada pendaftaran ini. Periksa catatan di bawah, perbaiki data, lalu ajukan kembali.",
    dotClass: "bg-red-500 ring-red-500/30",
  },
};

export default function RegistrationStatusForm() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setResult(null);
    const response = await fetch(`/api/registrations?registration_number=${encodeURIComponent(registrationNumber)}&email=${encodeURIComponent(email)}`);
    const data = await response.json();
    if (!response.ok) { setMessage(data.message ?? "Status pendaftaran tidak ditemukan."); return; }
    setResult(data.data);
  }

  const presentation = result ? statusPresentation[result.status] ?? statusPresentation.PENDING : null;

  return (
    <section className="soft-panel p-5 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-royal">Cek pendaftaran</p>
      <h2 className="mt-3 text-2xl font-bold tracking-[-0.01em] text-navy-deep">Cek Status Pendaftaran</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Pendaftaran tidak langsung menjadi anggota. Admin BMPS akan meninjau lalu menerima atau menolak permohonan.
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
        <input required value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="Nomor pendaftaran" aria-label="Nomor pendaftaran" className="rounded-xl border border-slate-200 px-3.5 py-3 outline-none transition focus:border-blue-royal" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email pendaftar" aria-label="Email pendaftar" className="rounded-xl border border-slate-200 px-3.5 py-3 outline-none transition focus:border-blue-royal" />
        <button className="sm:col-span-2 w-fit rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-royal">Cek status</button>
      </form>
      {message && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}

      {result && presentation && (
        <div className="mt-8 border-t border-slate-100 pt-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Status pendaftaran</p>
          <div className="mt-3 flex items-center gap-3">
            <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ring-4 ${presentation.dotClass}`} />
            <h3 className="text-xl font-bold tracking-[-0.01em] text-navy-deep">{presentation.headline}</h3>
          </div>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">{presentation.supporting}</p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Lembaga</dt>
              <dd className="mt-1 text-sm font-semibold text-navy-deep">{result.name}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Nomor pendaftaran</dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-navy-deep">{result.registrationNumber}</dd>
            </div>
          </dl>

          {result.rejectionReason && (
            <div className="mt-6 rounded-xl border-l-2 border-red-300 bg-red-50/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-500">Catatan admin</p>
              <p className="mt-1.5 text-sm leading-6 text-red-800">{result.rejectionReason}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

