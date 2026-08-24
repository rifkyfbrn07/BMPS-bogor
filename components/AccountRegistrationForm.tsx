"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";

export default function AccountRegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await response.json();
      setSuccess(response.ok);
      setMessage(data.message ?? "Pendaftaran akun belum dapat diproses.");
    } catch {
      setSuccess(false);
      setMessage("Pendaftaran akun belum dapat diproses.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="animate-fade-in-up w-full max-w-[460px] text-center" aria-live="polite">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Pendaftaran berhasil</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-navy-deep">Akun Anda Telah Aktif</h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">{message}</p>
        <Link href="/login" className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(16,43,107,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-medium/25 active:translate-y-0">
          Kembali ke Login <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="animate-fade-in-up w-full max-w-[460px]" noValidate={false}>
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-royal">Pendaftaran anggota</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-navy-deep sm:text-[2.15rem]">Bergabung dengan BMPS Bogor</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Lengkapi data berikut untuk membuat akun BMPS Bogor.</p>
      </div>

      {message && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </div>
      )}

      <fieldset className="space-y-5">
        <legend className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-400">Data anggota</legend>
        <label htmlFor="register-name" className="block text-sm font-semibold text-slate-700">
          Nama lengkap
          <span className="relative mt-2 block">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="register-name" required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="auth-input w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-base text-slate-800 outline-none transition duration-200 placeholder:text-slate-400" placeholder="Nama lengkap Anda" />
          </span>
        </label>

        <label htmlFor="register-email" className="block text-sm font-semibold text-slate-700">
          Email
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="register-email" required type="email" maxLength={255} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="auth-input w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-base text-slate-800 outline-none transition duration-200 placeholder:text-slate-400" placeholder="nama@email.com" />
          </span>
        </label>
      </fieldset>

      <fieldset className="mt-7 space-y-5">
        <legend className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-400">Keamanan akun</legend>
        <label htmlFor="register-password" className="block text-sm font-semibold text-slate-700">
          Kata sandi
          <span className="relative mt-2 block">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="register-password" required minLength={8} maxLength={128} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-base text-slate-800 outline-none transition duration-200 placeholder:text-slate-400" placeholder="Buat kata sandi" />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-light hover:text-blue-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium/40">
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" /> : <Eye className="h-[18px] w-[18px]" aria-hidden="true" />}
            </button>
          </span>
          <span className="mt-2 block text-xs font-normal text-slate-400">Minimal 8 karakter</span>
        </label>
      </fieldset>

      <button type="submit" disabled={loading} className="mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(16,43,107,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-medium/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
        {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" /> Mendaftarkan...</> : <>Daftar <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
      </button>

      <div className="mt-7 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
        <p>Sudah memiliki akun? <Link href="/login" className="font-bold text-blue-royal transition hover:text-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium/40 focus-visible:ring-offset-4">Masuk</Link></p>
        <p className="mx-auto mt-4 max-w-xs text-xs leading-5 text-slate-400">Akun baru langsung aktif dan dapat digunakan.</p>
      </div>
    </form>
  );
}