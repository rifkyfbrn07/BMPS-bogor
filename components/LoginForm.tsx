"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) { setMessage(data.message ?? "Login gagal."); return; } router.push(data.redirectTo);
  }
  return <form onSubmit={submit} className="soft-panel mx-auto max-w-md p-6 sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">Akses anggota</p><h1 className="mt-2 text-3xl font-bold text-navy-deep">Login BMPS Bogor</h1><p className="mt-2 text-sm text-slate-600">Untuk admin dan akun yang telah disetujui.</p><label className="mt-6 block text-sm font-medium">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3" /></label><label className="mt-4 block text-sm font-medium">Kata sandi<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3" /></label>{message && <p className="mt-4 text-sm text-red-700">{message}</p>}<button disabled={loading} className="mt-6 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? "Memproses..." : "Login"}</button><div className="mt-7 border-t border-slate-200 pt-5 text-center text-sm text-slate-600"><p>Belum memiliki akun?</p><Link href="/daftar" className="mt-3 inline-flex rounded-full border border-blue-royal px-4 py-2 font-semibold text-blue-royal transition hover:bg-blue-light">Daftar akun login</Link><p className="mt-3 text-xs leading-5 text-slate-500">Akun baru harus disetujui admin sebelum dapat digunakan.</p></div></form>;
}
