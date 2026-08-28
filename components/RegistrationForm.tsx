"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";

const initialForm = {
  schoolName: "", npsn: "", schoolLevel: "", foundationName: "", principalName: "",
  contactName: "", picPosition: "", email: "", phone: "", address: "", village: "",
  district: "", city: "Bogor", province: "Jawa Barat", website: "", logoUrl: "", description: "", documentUrl: "",
};

type FormStatus = "idle" | "loading" | "success" | "error";

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading"); setMessage("");
    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    try {
      const response = await fetch("/api/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, email: payload.email.toLowerCase(), documents: payload.documentUrl ? [payload.documentUrl] : [] }) });
      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Pendaftaran gagal dikirim.");
      setStatus("success"); setMessage(`${result.message ?? "Pendaftaran berhasil dikirim."} Data Anda masih menunggu verifikasi admin BMPS Bogor.`); setForm(initialForm);
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Pendaftaran gagal dikirim. Silakan coba lagi."); }
  }

  return <form onSubmit={submit} className="soft-panel p-5 sm:p-8">
    <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">Pendaftaran lembaga</p><h2 className="mt-2 text-2xl font-bold text-navy-deep sm:text-3xl">Masukan Data Sekolah/Yayasan ke BMPS</h2><p className="mt-2 text-sm leading-6 text-slate-600">Lengkapi data lembaga Anda. Semua pendaftaran akan diperiksa oleh admin BMPS Bogor.</p></div>
    <Section title="Informasi sekolah"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama sekolah" value={form.schoolName} onChange={(v) => update("schoolName", v)} required /><Field label="NPSN" value={form.npsn} onChange={(v) => update("npsn", v.replace(/\D/g, "").slice(0, 8))} required inputMode="numeric" placeholder="8 digit NPSN" /><Select label="Jenjang" value={form.schoolLevel} onChange={(v) => update("schoolLevel", v)} required><option value="">Pilih jenjang</option>{["TK", "SD", "SMP", "SMA", "SMK"].map((level) => <option key={level}>{level}</option>)}</Select><Field label="Nama yayasan" value={form.foundationName} onChange={(v) => update("foundationName", v)} /><Field label="Nama kepala sekolah" value={form.principalName} onChange={(v) => update("principalName", v)} /></div></Section>
    <Section title="Penanggung jawab"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama penanggung jawab" value={form.contactName} onChange={(v) => update("contactName", v)} required /><Field label="Jabatan penanggung jawab" value={form.picPosition} onChange={(v) => update("picPosition", v)} /><Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required autoComplete="email" /><Field label="Nomor WhatsApp/telepon" type="tel" value={form.phone} onChange={(v) => update("phone", v)} required autoComplete="tel" /></div></Section>
    <Section title="Alamat"><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><TextArea label="Alamat lengkap" value={form.address} onChange={(v) => update("address", v)} required /></div><Field label="Desa/Kelurahan" value={form.village} onChange={(v) => update("village", v)} /><Field label="Kecamatan" value={form.district} onChange={(v) => update("district", v)} /><Field label="Kota/Kabupaten" value={form.city} onChange={(v) => update("city", v)} required /><Field label="Provinsi" value={form.province} onChange={(v) => update("province", v)} required /></div></Section>
    <Section title="Informasi tambahan"><div className="grid gap-4 sm:grid-cols-2"><Field label="Website" type="url" value={form.website} onChange={(v) => update("website", v)} placeholder="https://..." /><Field label="URL logo" type="url" value={form.logoUrl} onChange={(v) => update("logoUrl", v)} placeholder="https://..." /><div className="sm:col-span-2"><Field label="URL dokumen pendukung" type="url" value={form.documentUrl} onChange={(v) => update("documentUrl", v)} placeholder="https://..." /></div><div className="sm:col-span-2"><TextArea label="Deskripsi/profil sekolah atau yayasan" value={form.description} onChange={(v) => update("description", v)} /></div></div></Section>
    {message && <div role="alert" className={`mt-5 flex gap-2 rounded-xl px-4 py-3 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{status === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}<span>{message}</span></div>}
    <button type="submit" disabled={status === "loading"} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-royal disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">{status === "loading" && <LoaderCircle className="h-4 w-4 animate-spin" />}{status === "loading" ? "Mengirim pendaftaran..." : "Kirim pendaftaran"}</button>
  </form>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div className="mt-7"><p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">{title}</p>{children}</div>; }
type FieldProps = { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: "text" | "email" | "tel" | "url"; inputMode?: "numeric"; placeholder?: string; autoComplete?: string };
function Field({ label, value, onChange, required, type = "text", inputMode, placeholder, autoComplete }: FieldProps) { return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} inputMode={inputMode} placeholder={placeholder} autoComplete={autoComplete} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100" /></label>; }
function Select({ label, value, onChange, children, required }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode; required?: boolean }) { return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100">{children}</select></label>; }
function TextArea({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) { return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<textarea required={required} rows={4} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100" /></label>; }
