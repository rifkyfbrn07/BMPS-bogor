"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, AlertCircle } from "lucide-react";

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

type FormStatus = "idle" | "loading" | "success" | "error";

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const update = (
    field: keyof typeof form,
    nextValue: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          schoolName: form.schoolName.trim(),
          npsn: form.npsn.trim(),
          contactName: form.contactName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          note: form.note.trim(),
        }),
      });

      const result = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Pendaftaran gagal dikirim."
        );
      }

      setStatus("success");

      setMessage(
        result.message ||
        "Pendaftaran berhasil dikirim dan sedang menunggu verifikasi admin BMPS Bogor."
      );

      setForm(initialForm);
    } catch (error) {
      console.error(
        "Registration submission error:",
        error
      );

      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Pendaftaran gagal dikirim. Silakan coba lagi."
      );
    }
  }

  return (
    <form
      onSubmit={submit}
      className="soft-panel p-5 sm:p-8"
      noValidate
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">
          Pendaftaran lembaga
        </p>

        <h2 className="mt-2 text-2xl font-bold text-navy-deep sm:text-3xl">
          Daftarkan Sekolah atau Yayasan
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Data yang Anda kirim akan diperiksa terlebih dahulu
          oleh admin BMPS Bogor sebelum dinyatakan diterima.
        </p>
      </div>

      {/* INFORMASI LEMBAGA */}
      <div className="mt-7">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          Informasi lembaga
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nama sekolah/yayasan"
            value={form.schoolName}
            onChange={(next) =>
              update("schoolName", next)
            }
            required
          />

          <Field
            label="NPSN"
            value={form.npsn}
            onChange={(next) =>
              update(
                "npsn",
                next.replace(/\D/g, "").slice(0, 8)
              )
            }
            required
            inputMode="numeric"
            placeholder="Contoh: 20212345"
          />

          <Select
            label="Jenis lembaga"
            value={form.institutionType}
            onChange={(next) =>
              update("institutionType", next)
            }
            required
          >
            <option value="sekolah">Sekolah</option>
            <option value="yayasan">Yayasan</option>
          </Select>

          <Select
            label="Jenjang"
            value={form.schoolLevel}
            onChange={(next) =>
              update("schoolLevel", next)
            }
            required
          >
            <option value="">
              Pilih jenjang
            </option>

            {[
              "TK",
              "SD",
              "SMP",
              "SMA",
              "SMK",
            ].map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* KONTAK */}
      <div className="mt-7">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          Informasi penanggung jawab
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nama penanggung jawab"
            value={form.contactName}
            onChange={(next) =>
              update("contactName", next)
            }
            required
          />

          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(next) =>
              update("email", next)
            }
            required
            autoComplete="email"
          />

          <Field
            label="Nomor WhatsApp/telepon"
            type="tel"
            value={form.phone}
            onChange={(next) =>
              update("phone", next)
            }
            required
            autoComplete="tel"
          />
        </div>
      </div>

      {/* ALAMAT */}
      <div className="mt-7">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          Alamat lembaga
        </p>

        <TextArea
          label="Alamat lengkap"
          value={form.address}
          onChange={(next) =>
            update("address", next)
          }
          required
        />
      </div>

      {/* CATATAN */}
      <div className="mt-4">
        <TextArea
          label="Catatan tambahan (opsional)"
          value={form.note}
          onChange={(next) =>
            update("note", next)
          }
        />
      </div>

      {/* STATUS */}
      {message && (
        <div
          role="alert"
          className={`mt-5 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${status === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
            }`}
        >
          {status === "success" ? (
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          )}

          <span>{message}</span>
        </div>
      )}

      {/* INFO VERIFIKASI */}
      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-xs leading-5 text-blue-800">
          <strong>Catatan:</strong> Setelah dikirim,
          pendaftaran akan berstatus{" "}
          <strong>menunggu verifikasi</strong>. Admin BMPS
          Bogor akan memeriksa data sebelum menyetujui atau
          menolak pendaftaran.
        </p>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-royal disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" && (
          <LoaderCircle
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}

        {status === "loading"
          ? "Mengirim pendaftaran..."
          : "Kirim pendaftaran"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  inputMode,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  inputMode?:
  | "none"
  | "text"
  | "tel"
  | "url"
  | "email"
  | "numeric"
  | "decimal"
  | "search";
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}

      {required && (
        <span className="text-red-500"> *</span>
      )}

      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}

      {required && (
        <span className="text-red-500"> *</span>
      )}

      <select
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}

      {required && (
        <span className="text-red-500"> *</span>
      )}

      <textarea
        required={required}
        rows={4}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-blue-royal focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}