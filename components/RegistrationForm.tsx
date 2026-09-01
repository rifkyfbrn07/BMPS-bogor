"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { 
  AlertCircle, 
  Camera,
  Check,
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Home,
  ImagePlus, 
  LoaderCircle, 
  RefreshCcw, 
  Sparkles,
  Trash2, 
  X 
} from "lucide-react";

const initialForm = {
  schoolName: "",
  npsn: "",
  schoolLevel: "",
  institutionType: "",
  foundationName: "",
  principalName: "",
  contactName: "",
  picPosition: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  village: "",
  district: "",
  city: "Bogor",
  province: "Jawa Barat",
  postalCode: "",
  website: "",
  logoUrl: "",
  instagram: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  registrationUrl: "",
  googleMapsUrl: "",
  description: "",
  vision: "",
  mission: "",
  documentUrl: "",
};

const programOptions = [
  { value: "BEASISWA", label: "Informasi Beasiswa" },
  { value: "BANTUAN_PENDIDIKAN", label: "Bantuan Pendidikan" },
] as const;

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

type FormStatus = "idle" | "loading" | "success" | "error";

type SuccessReceipt = {
  registrationNumber: string;
  schoolName: string;
  email: string;
  phone: string;
  dateStr: string;
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [programs, setPrograms] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");

  // Popup Modal Success State
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [copied, setCopied] = useState(false);

  // Kunci Scroll Body Saat Pop-up Terbuka (Mencegah Halaman di Balik Pop-up Ter-scroll)
  useEffect(() => {
    if (successReceipt) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSuccessReceipt(null);
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [successReceipt]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    // Hapus pesan error kolom secara otomatis saat user mulai mengetik/memperbaiki
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Bersihkan object URL pratinjau agar tidak ada memory leak
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
    setPhotoFile(null); 
    setPhotoPreview(null); 
    setPhotoError("");
  }

  // Fungsi untuk scroll & fokus langsung ke kolom yang salah
  function scrollToFirstError(errorMap: Record<string, string>) {
    const fieldKeys = Object.keys(errorMap);
    if (fieldKeys.length === 0) return;
    const firstKey = fieldKeys[0];
    const element = document.getElementById(`field-${firstKey}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        element.focus();
      }, 300);
    }
  }

  // Copy registration code
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  // Validasi lokal sebelum kirim agar user langsung tahu
  function validateClientForm(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.schoolName.trim() || form.schoolName.trim().length < 2) {
      errs.schoolName = "Nama sekolah/yayasan wajib diisi (minimal 2 karakter).";
    }
    if (!form.npsn.trim() || !/^\d{8}$/.test(form.npsn.trim())) {
      errs.npsn = "NPSN wajib 8 digit angka.";
    }
    if (!form.schoolLevel) {
      errs.schoolLevel = "Silakan pilih jenjang pendidikan.";
    }
    if (!form.contactName.trim() || form.contactName.trim().length < 2) {
      errs.contactName = "Nama penanggung jawab (PIC) wajib diisi.";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Format email tidak valid (contoh: sekolah@gmail.com).";
    }
    if (!form.phone.trim() || form.phone.trim().length < 8) {
      errs.phone = "Nomor WhatsApp/telepon wajib diisi (minimal 8 digit).";
    }
    if (!form.address.trim() || form.address.trim().length < 8) {
      errs.address = "Alamat lengkap wajib diisi (minimal 8 karakter).";
    }
    if (!form.city.trim()) {
      errs.city = "Kota/Kabupaten wajib diisi.";
    }
    if (!form.province.trim()) {
      errs.province = "Provinsi wajib diisi.";
    }
    return errs;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    // 1. Jalankan validasi lokal terlebih dahulu
    const clientErrors = validateClientForm();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setStatus("error");
      setMessage("Mohon periksa kolom formulir yang ditandai merah di bawah.");
      scrollToFirstError(clientErrors);
      return;
    }

    setErrors({});
    setStatus("loading"); 
    setMessage("");

    try {
      // Unggah foto jika ada
      let schoolPhotoUrl = "";
      if (photoFile) {
        const uploadBody = new FormData();
        uploadBody.append("file", photoFile);
        const uploadResponse = await fetch("/api/uploads/school-photo", { method: "POST", body: uploadBody });
        const uploadResult = await uploadResponse.json().catch(() => ({})) as { url?: string; message?: string };
        if (!uploadResponse.ok || !uploadResult.url) {
          throw new Error(uploadResult.message ?? "Foto sekolah gagal diunggah. Silakan coba lagi.");
        }
        schoolPhotoUrl = uploadResult.url;
      }

      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, value.trim()])
      ) as Record<string, string>;

      if (!payload.institutionType) delete payload.institutionType;

      const response = await fetch("/api/registrations", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          ...payload, 
          email: payload.email.toLowerCase(), 
          schoolPhotoUrl, 
          programs, 
          documents: payload.documentUrl ? [payload.documentUrl] : [] 
        }) 
      });

      const result = await response.json().catch(() => ({})) as { 
        message?: string; 
        registrationNumber?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok) {
        if (result.errors && Object.keys(result.errors).length > 0) {
          setErrors(result.errors);
          scrollToFirstError(result.errors);
        }
        throw new Error(result.message ?? "Pendaftaran gagal dikirim.");
      }

      const regNumber = result.registrationNumber || "BMB-2026-TERDAFTAR";
      
      // Buka Pop-up Bukti Pendaftaran / Receipt (Modal Portal)
      setSuccessReceipt({
        registrationNumber: regNumber,
        schoolName: payload.schoolName,
        email: payload.email,
        phone: payload.phone,
        dateStr: new Intl.DateTimeFormat("id-ID", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(new Date()),
      });

      setStatus("success"); 
      setMessage(`Pendaftaran berhasil diterima dengan Nomor Registrasi: ${regNumber}. Data Anda menunggu verifikasi admin BMPS Bogor.`); 
      setForm(initialForm); 
      setPrograms([]); 
      setErrors({});
      clearPhoto();
    } catch (error) { 
      setStatus("error"); 
      setMessage(error instanceof Error ? error.message : "Pendaftaran gagal dikirim. Silakan coba lagi."); 
    }
  }

  return (
    <>
      <form onSubmit={submit} className="soft-panel p-5 sm:p-8" noValidate>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">Pendaftaran lembaga</p>
          <h2 className="mt-2 text-2xl font-bold text-navy-deep sm:text-3xl">Masukan Data Sekolah/Yayasan ke BMPS</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Lengkapi data lembaga Anda. Formulir ini divalidasi langsung dan akan diperiksa oleh admin BMPS Bogor.
          </p>
        </div>

        {/* Global Error Banner with Action Tip */}
        {message && (
          <div 
            role="alert" 
            className={`mt-6 flex items-start gap-3 rounded-2xl p-4 text-sm font-semibold shadow-sm transition ${
              status === "success" 
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800" 
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p>{message}</p>
              {status === "error" && Object.keys(errors).length > 0 && (
                <p className="mt-1 text-xs font-normal text-red-700">
                  Ada <b>{Object.keys(errors).length}</b> kolom yang perlu diperbaiki (ditandai dengan warna merah di bawah).
                </p>
              )}
            </div>
          </div>
        )}

        {/* SECTION 1: INFORMASI SEKOLAH */}
        <Section title="1. Informasi Sekolah/Yayasan">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field 
              id="schoolName"
              label="Nama sekolah/yayasan" 
              value={form.schoolName} 
              onChange={(v) => update("schoolName", v)} 
              required 
              error={errors.schoolName}
              placeholder="Contoh: SMA BMPS Bogor"
            />
            <Field 
              id="npsn"
              label="NPSN" 
              value={form.npsn} 
              onChange={(v) => update("npsn", v.replace(/\D/g, "").slice(0, 8))} 
              required 
              inputMode="numeric" 
              placeholder="8 digit NPSN (contoh: 20210001)" 
              error={errors.npsn}
            />
            <Select 
              id="institutionType"
              label="Jenis lembaga" 
              value={form.institutionType} 
              onChange={(v) => update("institutionType", v)}
              error={errors.institutionType}
            >
              <option value="">Pilih jenis lembaga (Opsional)</option>
              <option value="SEKOLAH">Sekolah</option>
              <option value="YAYASAN">Yayasan</option>
            </Select>
            <Select 
              id="schoolLevel"
              label="Jenjang pendidikan" 
              value={form.schoolLevel} 
              onChange={(v) => update("schoolLevel", v)} 
              required
              error={errors.schoolLevel}
            >
              <option value="">Pilih jenjang</option>
              {["TK", "SD", "MI", "SMP", "MTs", "SMA", "SMK", "MA", "OTHER"].map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>
            <Field 
              id="foundationName"
              label="Nama yayasan (jika ada)" 
              value={form.foundationName} 
              onChange={(v) => update("foundationName", v)} 
              error={errors.foundationName}
              placeholder="Contoh: Yayasan Pendidikan Al-Ikhlas"
            />
            <Field 
              id="principalName"
              label="Nama kepala sekolah/pimpinan" 
              value={form.principalName} 
              onChange={(v) => update("principalName", v)} 
              error={errors.principalName}
              placeholder="Nama kepala sekolah..."
            />
          </div>
        </Section>

        {/* SECTION 2: PROFIL */}
        <Section title="2. Profil Lembaga">
          <div className="grid gap-4">
            <TextArea 
              id="description"
              label="Deskripsi sekolah/yayasan" 
              value={form.description} 
              onChange={(v) => update("description", v)} 
              placeholder="Ceritakan secara singkat mengenai profil sekolah/yayasan, program unggulan, dan keunggulan lembaga." 
              error={errors.description}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextArea 
                id="vision"
                label="Visi" 
                rows={3}
                value={form.vision} 
                onChange={(v) => update("vision", v)} 
                placeholder="Visi lembaga pendidikan Anda..." 
                error={errors.vision}
              />
              <TextArea 
                id="mission"
                label="Misi" 
                rows={3}
                value={form.mission} 
                onChange={(v) => update("mission", v)} 
                placeholder="Misi lembaga pendidikan Anda..." 
                error={errors.mission}
              />
            </div>
          </div>
        </Section>

        {/* SECTION 3: PENANGGUNG JAWAB */}
        <Section title="3. Penanggung Jawab (PIC)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field 
              id="contactName"
              label="Nama penanggung jawab" 
              value={form.contactName} 
              onChange={(v) => update("contactName", v)} 
              required 
              error={errors.contactName}
              placeholder="Nama lengkap PIC"
            />
            <Field 
              id="picPosition"
              label="Jabatan penanggung jawab" 
              value={form.picPosition} 
              onChange={(v) => update("picPosition", v)} 
              error={errors.picPosition}
              placeholder="Contoh: Humas / Kepala TU / Operator"
            />
            <Field 
              id="email"
              label="Email Resmi Sekolah/PIC" 
              type="email" 
              value={form.email} 
              onChange={(v) => update("email", v)} 
              required 
              autoComplete="email" 
              error={errors.email}
              placeholder="sekolah@bmpsbogor.or.id"
            />
            <Field 
              id="phone"
              label="Nomor WhatsApp/telepon" 
              type="tel" 
              value={form.phone} 
              onChange={(v) => update("phone", v)} 
              required 
              autoComplete="tel" 
              error={errors.phone}
              placeholder="081234567890"
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Email dan nomor WhatsApp akan digunakan untuk notifikasi status serta kontak publik sekolah setelah disetujui.
          </p>
        </Section>

        {/* SECTION 4: ALAMAT */}
        <Section title="4. Lokasi & Alamat Lembaga">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextArea 
                id="address"
                label="Alamat lengkap" 
                value={form.address} 
                onChange={(v) => update("address", v)} 
                required 
                error={errors.address}
                placeholder="Jl. Raya No..., RT/RW"
              />
            </div>
            <Field 
              id="village"
              label="Desa/Kelurahan" 
              value={form.village} 
              onChange={(v) => update("village", v)} 
              error={errors.village}
              placeholder="Contoh: Babakan"
            />
            <Field 
              id="district"
              label="Kecamatan" 
              value={form.district} 
              onChange={(v) => update("district", v)} 
              error={errors.district}
              placeholder="Contoh: Bogor Tengah"
            />
            <Field 
              id="city"
              label="Kota/Kabupaten" 
              value={form.city} 
              onChange={(v) => update("city", v)} 
              required 
              error={errors.city}
              placeholder="Kota Bogor / Kab. Bogor"
            />
            <Field 
              id="province"
              label="Provinsi" 
              value={form.province} 
              onChange={(v) => update("province", v)} 
              required 
              error={errors.province}
              placeholder="Jawa Barat"
            />
            <Field 
              id="postalCode"
              label="Kode Pos" 
              value={form.postalCode} 
              onChange={(v) => update("postalCode", v)} 
              inputMode="numeric" 
              placeholder="Contoh: 16115" 
              error={errors.postalCode}
            />
          </div>
        </Section>

        {/* SECTION 5: PROGRAM BMPS */}
        <Section title="5. Program BMPS yang Diikuti">
          <div className="grid gap-3 sm:grid-cols-2">
            {programOptions.map((option) => (
              <label 
                key={option.value} 
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                  programs.includes(option.value) 
                    ? "border-blue-royal bg-blue-light/60 ring-2 ring-blue-royal/20" 
                    : "border-slate-200 bg-white hover:border-blue-royal/50 hover:bg-slate-50/60"
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={programs.includes(option.value)} 
                  onChange={() => toggleProgram(option.value)} 
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#102b6b]" 
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-navy-deep">{option.label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                    Sekolah/yayasan akan tampil pada halaman direktori {option.label} setelah diverifikasi admin.
                  </span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Pilih satu atau lebih program — lembaga boleh mengikuti lebih dari satu program.</p>
        </Section>

        {/* SECTION 6: MEDIA SOSIAL & INFORMASI ONLINE */}
        <Section title="6. Media Sosial & Informasi Online">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field 
              id="whatsapp"
              label="Nomor WhatsApp Resmi (Tombol Chat)" 
              type="tel" 
              value={form.whatsapp} 
              onChange={(v) => update("whatsapp", v)} 
              placeholder="Contoh: 081234567890" 
              error={errors.whatsapp}
            />
            <Field 
              id="website"
              label="Website sekolah/yayasan" 
              type="url" 
              value={form.website} 
              onChange={(v) => update("website", v)} 
              placeholder="https://contoh.sch.id" 
              error={errors.website}
            />
            <Field 
              id="instagram"
              label="Instagram (Username atau Link)" 
              value={form.instagram} 
              onChange={(v) => update("instagram", v)} 
              placeholder="@sekolah_bogor atau https://instagram.com/..." 
              error={errors.instagram}
            />
            <Field 
              id="facebook"
              label="Facebook (Halaman/Akun)" 
              value={form.facebook} 
              onChange={(v) => update("facebook", v)} 
              placeholder="https://facebook.com/..." 
              error={errors.facebook}
            />
            <Field 
              id="youtube"
              label="YouTube Channel" 
              value={form.youtube} 
              onChange={(v) => update("youtube", v)} 
              placeholder="@sekolahbogor atau https://youtube.com/..." 
              error={errors.youtube}
            />
            <Field 
              id="tiktok"
              label="TikTok" 
              value={form.tiktok} 
              onChange={(v) => update("tiktok", v)} 
              placeholder="@sekolahbogor atau https://tiktok.com/..." 
              error={errors.tiktok}
            />
            <Field 
              id="registrationUrl"
              label="Link formulir pendaftaran PPDB online" 
              type="url" 
              value={form.registrationUrl} 
              onChange={(v) => update("registrationUrl", v)} 
              placeholder="https://contoh.sch.id/ppdb" 
              error={errors.registrationUrl}
            />
            <Field 
              id="googleMapsUrl"
              label="Link Google Maps lokasi sekolah" 
              type="url" 
              value={form.googleMapsUrl} 
              onChange={(v) => update("googleMapsUrl", v)} 
              placeholder="https://maps.google.com/..." 
              error={errors.googleMapsUrl}
            />
            <Field 
              id="logoUrl"
              label="URL logo lembaga (Opsional)" 
              type="url" 
              value={form.logoUrl} 
              onChange={(v) => update("logoUrl", v)} 
              placeholder="https://..." 
              error={errors.logoUrl}
            />
            <Field 
              id="documentUrl"
              label="URL dokumen pendukung (Google Drive/PDF)" 
              type="url" 
              value={form.documentUrl} 
              onChange={(v) => update("documentUrl", v)} 
              placeholder="https://drive.google.com/..." 
              error={errors.documentUrl}
            />
          </div>
        </Section>

        {/* SECTION 7: FOTO SEKOLAH */}
        <Section title="7. Foto Sekolah / Gedung Lembaga">
          {photoPreview ? (
            <div className="max-w-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                <Image src={photoPreview} alt="Pratinjau foto sekolah" fill sizes="(max-width: 640px) 100vw, 384px" className="object-cover" unoptimized />
                <span className="absolute left-3 top-3 rounded-full bg-[#0c2866]/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  Foto Sekolah
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-royal hover:text-blue-royal shadow-sm">
                  <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" /> Ganti Foto
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
                </label>
                <button type="button" onClick={clearPhoto} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 shadow-sm">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Hapus
                </button>
              </div>
            </div>
          ) : (
            <label className="flex w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-royal hover:bg-blue-light/40">
              <ImagePlus className="h-8 w-8 text-blue-royal" aria-hidden="true" />
              <span className="text-sm font-bold text-navy-deep">Pilih Foto Sekolah</span>
              <span className="text-xs text-slate-500">JPG, JPEG, PNG, atau WEBP &middot; maksimal 5 MB</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
            </label>
          )}
          {photoError && (
            <p role="alert" className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {photoError}
            </p>
          )}
        </Section>

        {/* SUBMIT BUTTON */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Pastikan semua data bertanda bintang (<span className="text-red-500 font-bold">*</span>) telah terisi dengan benar.
          </p>
          <button 
            type="submit" 
            disabled={status === "loading"} 
            className="btn-editorial inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#0c2866] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-blue-royal hover:scale-105 active:scale-95 shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {status === "loading" ? "Mengirim pendaftaran..." : "Kirim Pendaftaran Sekolah"}
          </button>
        </div>
      </form>

      {/* ============================================================ */}
      {/* SUCCESS POPUP RECEIPT (FULL PORTAL + BODY SCROLL LOCK + TOP-OF-ALL Z-INDEX) */}
      {/* ============================================================ */}
      {typeof document !== "undefined" && successReceipt && createPortal(
        <div 
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSuccessReceipt(null);
          }}
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up my-auto z-10">
            {/* Close button */}
            <button 
              onClick={() => setSuccessReceipt(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              title="Tutup"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Top Badge & Glowing Icon */}
            <div className="text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/20">
                <Check className="h-10 w-10 stroke-[3]" />
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              </div>

              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
                Pendaftaran Berhasil Dikirim
              </span>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-navy-deep sm:text-3xl">
                Pengajuan Diterima!
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Data lembaga Anda telah berhasil terdaftar ke dalam sistem dan saat ini <b>menunggu proses verifikasi admin BMPS Bogor</b>.
              </p>
            </div>

            {/* ======================================== */}
            {/* RECEIPT / KARTU NOMOR REGISTRASI */}
            {/* ======================================== */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-blue-300/80 bg-gradient-to-b from-blue-50/70 via-slate-50/50 to-white p-4 sm:p-5 text-center shadow-inner relative">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-blue-royal">
                Nomor Registrasi Resmi
              </p>

              {/* Big Monospace Code with 1-click Copy */}
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-[#0c2866] select-all bg-white px-4 py-1.5 rounded-xl border border-blue-200 shadow-sm">
                  {successReceipt.registrationNumber}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(successReceipt.registrationNumber)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition shadow-sm ${
                    copied 
                      ? "bg-emerald-600 text-white" 
                      : "bg-[#0c2866] hover:bg-blue-royal text-white active:scale-95"
                  }`}
                  title="Salin Nomor Registrasi"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Tersalin!" : "Salin"}
                </button>
              </div>

              {/* Receipt Summary Meta */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 text-left space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lembaga:</span>
                  <span className="font-bold text-navy-deep text-right truncate max-w-[240px]">{successReceipt.schoolName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Waktu Pengajuan:</span>
                  <span className="font-semibold text-slate-700">{successReceipt.dateStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Menunggu Verifikasi Admin
                  </span>
                </div>
              </div>
            </div>

            {/* ======================================== */}
            {/* INTRUKSI SCREENSHOT (PENTING BANGET!) */}
            {/* ======================================== */}
            <div className="mt-4 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-4 flex items-start gap-3.5 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Camera className="h-5 w-5 animate-bounce" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="font-black text-amber-950 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span>📸 PENTING: Screenshot (SS) Layar Ini Sekarang!</span>
                </p>
                <p className="mt-0.5 text-xs text-amber-900 leading-relaxed">
                  Harap <b>tangkap layar (screenshot)</b> atau simpan <b>Nomor Registrasi</b> di atas agar tidak hilang saat mengecek status atau menghubungi admin BMPS.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href={`/daftar?registration_number=${encodeURIComponent(successReceipt.registrationNumber)}&email=${encodeURIComponent(successReceipt.email)}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#0c2866] hover:bg-blue-royal text-white text-xs sm:text-sm font-bold py-3.5 px-4 shadow-md transition hover:scale-[1.02] active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                Cek Status Pendaftaran
              </Link>
              <button
                type="button"
                onClick={() => setSuccessReceipt(null)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold py-3.5 px-5 shadow-sm transition active:scale-95"
              >
                <Home className="h-4 w-4" />
                Tutup / Selesai
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { 
  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-royal">{title}</p>
      {children}
    </div>
  ); 
}

type FieldProps = { 
  id: string;
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  required?: boolean; 
  type?: "text" | "email" | "tel" | "url"; 
  inputMode?: "numeric"; 
  placeholder?: string; 
  autoComplete?: string;
  error?: string;
};

function Field({ id, label, value, onChange, required, type = "text", inputMode, placeholder, autoComplete, error }: FieldProps) { 
  const isInvalid = Boolean(error);
  return (
    <div className="flex flex-col">
      <label htmlFor={`field-${id}`} className={`text-xs font-bold transition-colors ${isInvalid ? "text-red-600 font-extrabold" : "text-slate-700"}`}>
        {label}
        {required && <span className="text-red-500 font-bold"> *</span>}
      </label>
      <input 
        id={`field-${id}`}
        type={type} 
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
        inputMode={inputMode} 
        placeholder={placeholder} 
        autoComplete={autoComplete} 
        className={`mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition duration-150 ${
          isInvalid 
            ? "border-2 border-red-500 bg-red-50/50 text-red-950 ring-2 ring-red-200 placeholder-red-300 focus:border-red-600 focus:ring-red-300" 
            : "border border-slate-200 bg-white text-navy-deep focus:border-blue-royal focus:ring-2 focus:ring-blue-100"
        }`} 
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600 animate-fade-in-up">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  ); 
}

function Select({ 
  id,
  label, 
  value, 
  onChange, 
  children, 
  required,
  error 
}: { 
  id: string;
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  children: React.ReactNode; 
  required?: boolean;
  error?: string;
}) { 
  const isInvalid = Boolean(error);
  return (
    <div className="flex flex-col">
      <label htmlFor={`field-${id}`} className={`text-xs font-bold transition-colors ${isInvalid ? "text-red-600 font-extrabold" : "text-slate-700"}`}>
        {label}
        {required && <span className="text-red-500 font-bold"> *</span>}
      </label>
      <select 
        id={`field-${id}`}
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
        className={`mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition duration-150 ${
          isInvalid 
            ? "border-2 border-red-500 bg-red-50/50 text-red-950 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300" 
            : "border border-slate-200 bg-white text-navy-deep focus:border-blue-royal focus:ring-2 focus:ring-blue-100"
        }`}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600 animate-fade-in-up">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  ); 
}

function TextArea({ 
  id,
  label, 
  value, 
  onChange, 
  required, 
  placeholder,
  rows = 4,
  error
}: { 
  id: string;
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  required?: boolean; 
  placeholder?: string;
  rows?: number;
  error?: string;
}) { 
  const isInvalid = Boolean(error);
  return (
    <div className="flex flex-col">
      <label htmlFor={`field-${id}`} className={`text-xs font-bold transition-colors ${isInvalid ? "text-red-600 font-extrabold" : "text-slate-700"}`}>
        {label}
        {required && <span className="text-red-500 font-bold"> *</span>}
      </label>
      <textarea 
        id={`field-${id}`}
        rows={rows} 
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
        placeholder={placeholder} 
        className={`mt-1.5 w-full resize-y rounded-xl px-3.5 py-2.5 text-sm outline-none transition duration-150 ${
          isInvalid 
            ? "border-2 border-red-500 bg-red-50/50 text-red-950 ring-2 ring-red-200 placeholder-red-300 focus:border-red-600 focus:ring-red-300" 
            : "border border-slate-200 bg-white text-navy-deep focus:border-blue-royal focus:ring-2 focus:ring-blue-100"
        }`} 
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600 animate-fade-in-up">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  ); 
}
