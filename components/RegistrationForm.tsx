"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, ImagePlus, LoaderCircle, RefreshCcw, Trash2 } from "lucide-react";

const initialForm = {
  schoolName: "", npsn: "", schoolLevel: "", institutionType: "", foundationName: "", principalName: "",
  contactName: "", picPosition: "", email: "", phone: "", address: "", village: "",
  district: "", city: "Bogor", province: "Jawa Barat", postalCode: "", website: "", logoUrl: "",
  registrationUrl: "", googleMapsUrl: "", description: "", vision: "", mission: "", documentUrl: "",
};


const programOptions = [
  { value: "BEASISWA", label: "Informasi Beasiswa" },
  { value: "BANTUAN_PENDIDIKAN", label: "Bantuan Pendidikan" },
] as const;

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

type FormStatus = "idle" | "loading" | "success" | "error";

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [programs, setPrograms] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  // Bersihkan object URL pratinjau agar tidak ada memory leak.
  useEffect(() => () => { if (photoPreview) URL.revokeObjectURL(photoPreview); }, [photoPreview]);

  function toggleProgram(value: string) {
    setPrograms((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPhotoError("");
    if (!file) return;
    if (!allowedPhotoTypes.includes(file.type)) { setPhotoError("Format foto harus JPG, JPEG, PNG, atau WEBP."); return; }
    if (file.size > MAX_PHOTO_SIZE) { setPhotoError("Ukuran foto maksimal 5 MB."); return; }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function clearPhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null); setPhotoPreview(null); setPhotoError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading"); setMessage("");
    try {
      // Unggah foto lebih dulu — jika gagal, pendaftaran TIDAK dikirim.
      let schoolPhotoUrl = "";
      if (photoFile) {
        const uploadBody = new FormData();
        uploadBody.append("file", photoFile);
        const uploadResponse = await fetch("/api/uploads/school-photo", { method: "POST", body: uploadBody });
        const uploadResult = await uploadResponse.json().catch(() => ({})) as { url?: string; message?: string };
        if (!uploadResponse.ok || !uploadResult.url) throw new Error(uploadResult.message ?? "Foto sekolah gagal diunggah. Silakan coba lagi.");
        schoolPhotoUrl = uploadResult.url;
      }
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])) as Record<string, string>;
      // Jenis lembaga bersifat opsional — kosong tidak dikirim agar lolos validasi enum.
      if (!payload.institutionType) delete payload.institutionType;
      const response = await fetch("/api/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, email: payload.email.toLowerCase(), schoolPhotoUrl, programs, documents: payload.documentUrl ? [payload.documentUrl] : [] }) });

      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Pendaftaran gagal dikirim.");
      setStatus("success"); setMessage(`${result.message ?? "Pendaftaran berhasil dikirim."} Data Anda masih menunggu verifikasi admin BMPS Bogor.`); setForm(initialForm); setPrograms([]); clearPhoto();
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Pendaftaran gagal dikirim. Silakan coba lagi."); }
  }

  return <form onSubmit={submit} className="soft-panel p-5 sm:p-8">
    <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">Pendaftaran lembaga</p><h2 className="mt-2 text-2xl font-bold text-navy-deep sm:text-3xl">Masukan Data Sekolah/Yayasan ke BMPS</h2><p className="mt-2 text-sm leading-6 text-slate-600">Lengkapi data lembaga Anda. Semua pendaftaran akan diperiksa oleh admin BMPS Bogor.</p></div>
    <Section title="1. Informasi Sekolah/Yayasan"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama sekolah/yayasan" value={form.schoolName} onChange={(v) => update("schoolName", v)} required /><Field label="NPSN" value={form.npsn} onChange={(v) => update("npsn", v.replace(/\D/g, "").slice(0, 8))} required inputMode="numeric" placeholder="8 digit NPSN" /><Select label="Jenis lembaga" value={form.institutionType} onChange={(v) => update("institutionType", v)}><option value="">Pilih jenis lembaga</option><option value="SEKOLAH">Sekolah</option><option value="YAYASAN">Yayasan</option></Select><Select label="Jenjang pendidikan" value={form.schoolLevel} onChange={(v) => update("schoolLevel", v)} required><option value="">Pilih jenjang</option>{["TK", "SD", "MI", "SMP", "MTs", "SMA", "SMK", "MA"].map((level) => <option key={level}>{level}</option>)}</Select><Field label="Nama yayasan (jika ada)" value={form.foundationName} onChange={(v) => update("foundationName", v)} /><Field label="Nama kepala sekolah/pimpinan" value={form.principalName} onChange={(v) => update("principalName", v)} /></div></Section>
    <Section title="2. Profil"><div className="grid gap-4"><div><TextArea label="Deskripsi sekolah/yayasan" value={form.description} onChange={(v) => update("description", v)} placeholder="Ceritakan secara singkat mengenai sekolah/yayasan, visi misi, program unggulan, dan informasi lainnya." /></div><TextArea label="Visi" value={form.vision} onChange={(v) => update("vision", v)} placeholder="Visi lembaga pendidikan Anda..." /><TextArea label="Misi" value={form.mission} onChange={(v) => update("mission", v)} placeholder="Misi lembaga pendidikan Anda..." /></div></Section>
    <Section title="3. Penanggung jawab"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama penanggung jawab" value={form.contactName} onChange={(v) => update("contactName", v)} required /><Field label="Jabatan penanggung jawab" value={form.picPosition} onChange={(v) => update("picPosition", v)} /><Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required autoComplete="email" /><Field label="Nomor WhatsApp/telepon" type="tel" value={form.phone} onChange={(v) => update("phone", v)} required autoComplete="tel" /></div><p className="mt-3 text-xs leading-5 text-slate-500">Email dan nomor WhatsApp akan ditampilkan sebagai kontak publik sekolah/yayasan pada halaman profil setelah pendaftaran disetujui.</p></Section>
    <Section title="4. Alamat"><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><TextArea label="Alamat lengkap" value={form.address} onChange={(v) => update("address", v)} required /></div><Field label="Desa/Kelurahan" value={form.village} onChange={(v) => update("village", v)} /><Field label="Kecamatan" value={form.district} onChange={(v) => update("district", v)} /><Field label="Kota/Kabupaten" value={form.city} onChange={(v) => update("city", v)} required /><Field label="Provinsi" value={form.province} onChange={(v) => update("province", v)} required /><Field label="Kode Pos" value={form.postalCode} onChange={(v) => update("postalCode", v)} inputMode="numeric" placeholder="Contoh: 16115" /></div></Section>
    <Section title="5. Program BMPS">
      <div className="grid gap-3 sm:grid-cols-2">
        {programOptions.map((option) => (
          <label key={option.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${programs.includes(option.value) ? "border-blue-royal bg-blue-light/60" : "border-slate-200 bg-white hover:border-blue-royal/50"}`}>
            <input type="checkbox" checked={programs.includes(option.value)} onChange={() => toggleProgram(option.value)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#102b6b]" />
            <span className="min-w-0"><span className="block text-sm font-semibold text-navy-deep">{option.label}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">Sekolah/yayasan akan tampil pada halaman {option.label} setelah diverifikasi admin.</span></span>
          </label>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Pilih satu atau lebih program — satu sekolah/yayasan boleh mengikuti lebih dari satu program.</p>
    </Section>
    <Section title="6. Informasi Online"><div className="grid gap-4 sm:grid-cols-2"><Field label="Website sekolah/yayasan" type="url" value={form.website} onChange={(v) => update("website", v)} placeholder="https://contoh.sch.id" /><Field label="Link pendaftaran" type="url" value={form.registrationUrl} onChange={(v) => update("registrationUrl", v)} placeholder="https://contoh.sch.id/pendaftaran" /><Field label="Google Maps" type="url" value={form.googleMapsUrl} onChange={(v) => update("googleMapsUrl", v)} placeholder="https://maps.google.com/..." /><Field label="URL logo" type="url" value={form.logoUrl} onChange={(v) => update("logoUrl", v)} placeholder="https://..." /><div className="sm:col-span-2"><Field label="URL dokumen pendukung" type="url" value={form.documentUrl} onChange={(v) => update("documentUrl", v)} placeholder="https://..." /></div></div></Section>
    <Section title="7. Foto Sekolah">
      {photoPreview ? (
        <div className="max-w-sm">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <Image src={photoPreview} alt="Pratinjau foto sekolah" fill sizes="(max-width: 640px) 100vw, 384px" className="object-cover" unoptimized />
            <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">Foto Sekolah</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-royal hover:text-blue-royal">
              <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Ganti Foto
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
            </label>
            <button type="button" onClick={clearPhoto} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100">
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <label className="flex w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-royal hover:bg-blue-light/40">
          <ImagePlus className="h-7 w-7 text-blue-royal" aria-hidden="true" />
          <span className="text-sm font-semibold text-navy-deep">Pilih Foto Sekolah</span>
          <span className="text-xs text-slate-500">JPG, JPEG, PNG, atau WEBP &middot; maksimal 5 MB</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
        </label>
      )}
      {photoError && <p role="alert" className="mt-3 flex items-center gap-2 text-sm font-medium text-red-700"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />{photoError}</p>}
    </Section>
    {message && <div role="alert" className={`mt-5 flex gap-2 rounded-xl px-4 py-3 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{status === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}<span>{message}</span></div>}
    <button type="submit" disabled={status === "loading"} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-royal disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">{status === "loading" && <LoaderCircle className="h-4 w-4 animate-spin" />}{status === "loading" ? "Mengirim pendaftaran..." : "Kirim pendaftaran"}</button>
  </form>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div className="mt-7"><p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">{title}</p>{children}</div>; }
type FieldProps = { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: "text" | "email" | "tel" | "url"; inputMode?: "numeric"; placeholder?: string; autoComplete?: string };
function Field({ label, value, onChange, required, type = "text", inputMode, placeholder, autoComplete }: FieldProps) { return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} inputMode={inputMode} placeholder={placeholder} autoComplete={autoComplete} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100" /></label>; }
function Select({ label, value, onChange, children, required }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode; required?: boolean }) { return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100">{children}</select></label>; }
function TextArea({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) { return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<textarea required={required} rows={4} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100" /></label>; }
