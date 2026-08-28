"use client";

import { FormEvent, useState } from "react";

type Result = { registrationNumber: string; name: string; status: string; rejectionReason?: string | null };

export default function RegistrationStatusForm() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage(""); setResult(null);
    const response = await fetch(`/api/registrations?registration_number=${encodeURIComponent(registrationNumber)}&email=${encodeURIComponent(email)}`);
    const data = await response.json();
    if (!response.ok) { setMessage(data.message ?? "Status pendaftaran tidak ditemukan."); return; }
    setResult(data.data);
  }
  return <section className="soft-panel p-5 sm:p-8">
    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">Cek pendaftaran</p>
    <h2 className="mt-2 text-2xl font-bold text-navy-deep">Menunggu Approvel Admin</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">Pendaftaran tidak langsung menjadi anggota. Admin BMPS akan meninjau lalu menerima atau menolak permohonan.</p>
    <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
      <input required value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="Nomor pendaftaran" className="rounded-xl border border-slate-200 px-3.5 py-3 outline-none focus:border-blue-royal" />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email pendaftar" className="rounded-xl border border-slate-200 px-3.5 py-3 outline-none focus:border-blue-royal" />
      <button className="sm:col-span-2 w-fit rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">Cek status</button>
    </form>
    {message && <p className="mt-4 text-sm text-red-700">{message}</p>}
    {result && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><p className="font-semibold text-navy-deep">{result.name} · {result.registrationNumber}</p><p className="mt-1">Status: <strong>{result.status}</strong></p>{result.rejectionReason && <p className="mt-1 text-red-700">Alasan: {result.rejectionReason}</p>}</div>}
  </section>;
}
