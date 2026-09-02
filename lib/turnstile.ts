/**
 * Weryfikuje token z widgetu Cloudflare Turnstile.
 * Jeśli TURNSTILE_SECRET_KEY nie jest ustawiony (np. lokalnie, zanim dodasz
 * klucze), weryfikacja jest pomijana — chroni wtedy tylko honeypot + rate limit.
 */
export async function verifyTurnstile(
  token: string | null,
  ip: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: ip,
        }),
      }
    );
    const data: { success?: boolean } = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
