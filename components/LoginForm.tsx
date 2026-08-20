"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setMessage(data.message ?? "Login gagal."); return; }
    router.push(data.redirectTo);
  }

  return (
    <form onSubmit={submit} className="animate-fade-in-up w-full max-w-[430px]" noValidate={false}>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-royal">Akses anggota</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-navy-deep sm:text-[2.15rem]">Selamat Datang Kembali</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Masuk untuk melanjutkan ke akun BMPS Bogor.</p>
      </div>

      {message && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </div>
      )}

      <div className="space-y-5">
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
          Email
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="auth-input w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-base text-slate-800 outline-none transition duration-200 placeholder:text-slate-400" placeholder="nama@email.com" />
          </span>
        </label>

        <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
          Kata sandi
          <span className="relative mt-2 block">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="password" required type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-base text-slate-800 outline-none transition duration-200 placeholder:text-slate-400" placeholder="Masukkan kata sandi" />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-light hover:text-blue-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium/40">
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" /> : <Eye className="h-[18px] w-[18px]" aria-hidden="true" />}
            </button>
          </span>
        </label>
      </div>

      <button type="submit" disabled={loading} className="mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(16,43,107,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-medium/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
        {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" /> Memproses...</> : <>Masuk <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
      </button>

      <div className="mt-8 border-t border-slate-200 pt-6 text-center">
        <p className="text-sm text-slate-500">Belum memiliki akun?</p>
        <Link href="/daftar" className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-blue-royal transition hover:text-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium/40 focus-visible:ring-offset-4">
          Daftar akun login <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <p className="mx-auto mt-4 max-w-xs text-xs leading-5 text-slate-400">Akun baru harus disetujui admin sebelum dapat digunakan.</p>
      </div>
    </form>
  );
}
