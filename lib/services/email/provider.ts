export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailPayload): Promise<{ success: boolean; message?: string }> {
  const apiKey = process.env.EMAIL_API_KEY;

  console.log(`[Email Service] Ke: ${to} | Subjek: "${subject}"`);

  if (!apiKey || apiKey === "mock-email-api-key") {
    console.log("[Email Service] MOCK MODE AKTIF. Konten email:");
    console.log(html);
    return { success: true, message: "Mock email logged to console successfully." };
  }

  try {
    // If the API key starts with re_, it is a Resend API key
    if (apiKey.startsWith("re_")) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "BMPS Bogor <noreply@bmpsbogor.or.id>",
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`Resend API error (${response.status}): ${errorDetail}`);
      }

      return { success: true };
    }

    // Default fallback if a different generic key is provided (log to console)
    console.log(`[Email Service] API key '${apiKey}' tidak dikenal sebagai Resend. Email masuk ke logs.`);
    return { success: true, message: "Logged to console due to unrecognized provider key." };
  } catch (error) {
    console.error("[Email Service] Gagal mengirim email:", error);
    // Return success: false, but don't crash the server request
    return { success: false, message: error instanceof Error ? error.message : "Unknown email error" };
  }
}
