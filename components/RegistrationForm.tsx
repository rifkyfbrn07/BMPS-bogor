"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

const initialForm = {
  schoolName: "",
  npsn: "",
  institutionType: "sekolah",
  schoolLevel: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  note: "",
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const update = (field: keyof typeof form, nextValue: string) => {
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(result.message || "Pendaftaran gagal dikirim.");

      setStatus("success");
      setMessage(result.message || "Pendaftaran berhasil dikirim.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Pendaftaran gagal dikirim.");
    }
  }

  return (
    <form onSubmit={submit} className="soft-panel p-5 sm:p-8" noValidate>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">Pendaftaran anggota</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-deep sm:text-3xl">Daftarkan sekolah atau yayasan</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Data akan masuk ke antrean verifikasi BMPS Bogor.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Nama sekolah/yayasan" value={form.schoolName} onChange={(next) => update("schoolName", next)} required />
        <Field label="NPSN" value={form.npsn} onChange={(next) => update("npsn", next.replace(/\D/g, "").slice(0, 8))} required />
        <Field label="Nama penanggung jawab" value={form.contactName} onChange={(next) => update("contactName", next)} required />
        <Select label="Jenis lembaga" value={form.institutionType} onChange={(next) => update("institutionType", next)}>
          <option value="sekolah">Sekolah</option>
          <option value="yayasan">Yayasan</option>
        </Select>
        <Select label="Jenjang" value={form.schoolLevel} onChange={(next) => update("schoolLevel", next)} required>
          <option value="">Pilih jenjang</option>
          {["TK", "SD", "SMP", "SMA", "SMK"].map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
        <Field label="Email" type="email" value={form.email} onChange={(next) => update("email", next)} required />
        <Field label="Nomor WhatsApp/telepon" type="tel" value={form.phone} onChange={(next) => update("phone", next)} required />
      </div>
      <div className="mt-4"><TextArea label="Alamat" value={form.address} onChange={(next) => update("address", next)} required /></div>
      <div className="mt-4"><TextArea label="Catatan (opsional)" value={form.note} onChange={(next) => update("note", next)} /></div>

      {message && <p role="status" className={`mt-5 flex gap-2 rounded-xl px-4 py-3 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{message}</p>}
      <button disabled={status === "loading"} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-royal disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
        {status === "loading" && <LoaderCircle className="h-4 w-4 animate-spin" />}{status === "loading" ? "Mengirim..." : "Kirim pendaftaran"}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100" /></label>;
}

function Select({ label, value, onChange, children, required = false }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode; required?: boolean }) {
  return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100">{children}</select></label>;
}

function TextArea({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}<textarea required={required} rows={3} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100" /></label>;
}
