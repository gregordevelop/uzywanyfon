import nodemailer from "nodemailer";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    tls: {
      // Serwery pocztowe na hostingach współdzielonych (cPanel) często mają
      // certyfikat, który nie jest zaufany przez domyślną listę CA w Node.js.
      rejectUnauthorized: false,
    },
  });
}

export async function sendVerificationEmail(
  to: string,
  verifyUrl: string
): Promise<void> {
  const transport = getTransport();

  if (!transport) {
    // SMTP jeszcze nie skonfigurowane (brak zmiennych w .env) — logujemy link,
    // żeby dało się przetestować rejestrację lokalnie bez wysyłki maila.
    console.log(`[mailer] SMTP nieskonfigurowane. Link weryfikacyjny dla ${to}: ${verifyUrl}`);
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transport.sendMail({
    from,
    to,
    subject: "Potwierdź adres e-mail — UżywanyFon",
    text: `Cześć!\n\nPotwierdź swój adres e-mail, klikając w link:\n${verifyUrl}\n\nLink jest ważny 24 godziny. Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.`,
    html: `
      <p>Cześć!</p>
      <p>Potwierdź swój adres e-mail, klikając w poniższy link:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>Link jest ważny 24 godziny. Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.</p>
    `,
  });
}
