import { sendEmail } from "./provider";

export async function sendRegistrationSubmittedEmail(to: string, schoolName: string, registrationNumber: string) {
  const subject = `Pendaftaran Sekolah Diterima - ${registrationNumber}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #102b6b;">Pendaftaran Sekolah Berhasil Diterima</h2>
      <p>Halo Pengelola <strong>${schoolName}</strong>,</p>
      <p>Pendaftaran sekolah/yayasan Anda telah berhasil dikirim ke BMPS Bogor dan saat ini sedang menunggu antrean verifikasi.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Nomor Registrasi:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${registrationNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Status:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #d97706;">PENDING (Menunggu Verifikasi)</td>
        </tr>
      </table>
      <p>Kami akan mengabari Anda kembali melalui email ini setelah tim admin melakukan tinjauan.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Email ini dikirim secara otomatis oleh sistem BMPS Bogor. Harap tidak membalas email ini.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendRegistrationApprovedEmail(to: string, contactName: string, schoolName: string, activationUrl: string) {
  const subject = "Pendaftaran Sekolah Disetujui - Aktivasi Akun";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #16a34a;">Selamat! Pendaftaran Sekolah Disetujui</h2>
      <p>Halo <strong>${contactName}</strong>,</p>
      <p>Pendaftaran untuk <strong>${schoolName}</strong> telah disetujui oleh Administrator BMPS Bogor.</p>
      <p>Langkah selanjutnya adalah mengaktifkan akun Anda dan membuat kata sandi baru untuk mengakses dashboard sekolah BMPS Bogor.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${activationUrl}" style="background-color: #102b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Buat Password / Aktivasi Akun</a>
      </div>
      <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
        Jika tombol di atas tidak dapat diklik, silakan salin dan tempel tautan berikut ke browser Anda:
        <br />
        <a href="${activationUrl}">${activationUrl}</a>
      </p>
      <p style="font-size: 13px; color: #dc2626; font-weight: bold; margin-top: 10px;">Tautan aktivasi ini berlaku selama 24 jam.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Email ini dikirim secara otomatis oleh sistem BMPS Bogor. Harap tidak membalas email ini.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendRegistrationRejectedEmail(to: string, contactName: string, schoolName: string, reason: string) {
  const subject = "Pendaftaran Sekolah Ditolak";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #dc2626;">Pendaftaran Sekolah Belum Disetujui</h2>
      <p>Halo <strong>${contactName}</strong>,</p>
      <p>Dengan menyesal kami informasikan bahwa pendaftaran sekolah/yayasan Anda untuk <strong>${schoolName}</strong> belum dapat disetujui oleh Administrator BMPS Bogor.</p>
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="color: #991b1b; margin-top: 0; margin-bottom: 8px;">Alasan Penolakan:</h4>
        <p style="color: #7f1d1d; margin: 0;">${reason}</p>
      </div>
      <p>Silakan lakukan pendaftaran kembali dengan memperbaiki data sesuai alasan penolakan di atas.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Email ini dikirim secara otomatis oleh sistem BMPS Bogor. Harap tidak membalas email ini.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  const subject = "Permintaan Reset Kata Sandi Akun BMPS Bogor";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #102b6b;">Reset Kata Sandi Akun Anda</h2>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Kami menerima permintaan untuk menyetel ulang kata sandi akun Anda di portal BMPS Bogor.</p>
      <p>Silakan klik tautan di bawah ini untuk mengganti kata sandi Anda:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #102b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Reset Kata Sandi</a>
      </div>
      <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
        Jika Anda tidak merasa meminta reset kata sandi, harap abaikan email ini. Keamanan akun Anda tidak terganggu.
      </p>
      <p style="font-size: 13px; color: #64748b; margin-top: 10px;">
        Tautan reset ini berlaku selama 24 jam.
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Email ini dikirim secara otomatis oleh sistem BMPS Bogor. Harap tidak membalas email ini.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}
