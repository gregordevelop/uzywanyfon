"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mailer";
import { verifyTurnstile } from "@/lib/turnstile";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię (min. 2 znaki)."),
  email: z.email("Podaj prawidłowy adres e-mail.").trim(),
  password: z
    .string()
    .min(8, "Hasło musi mieć min. 8 znaków.")
    .regex(/[a-zA-Z]/, "Hasło musi zawierać literę.")
    .regex(/[0-9]/, "Hasło musi zawierać cyfrę."),
});

export type RegisterState = { ok: boolean; message: string } | null;

const VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // Honeypot: prawdziwy użytkownik nigdy tego pola nie wypełni.
  if (formData.get("hp_check")) {
    return {
      ok: true,
      message: "Sprawdź skrzynkę e-mail, aby potwierdzić rejestrację.",
    };
  }

  const ip = await getClientIp();
  if (isRateLimited(`register:${ip}`, 5, 1000 * 60 * 60)) {
    return {
      ok: false,
      message: "Zbyt wiele prób rejestracji. Spróbuj ponownie za godzinę.",
    };
  }

  const turnstileToken = formData.get("cf-turnstile-response");
  const turnstileOk = await verifyTurnstile(
    typeof turnstileToken === "string" ? turnstileToken : null,
    ip
  );
  if (!turnstileOk) {
    return { ok: false, message: "Nie udało się zweryfikować, że nie jesteś botem." };
  }

  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  if (formData.get("acceptTerms") !== "on") {
    return {
      ok: false,
      message: "Musisz zaakceptować regulamin i politykę prywatności.",
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      ok: false,
      message: "Konto z tym adresem e-mail już istnieje.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash, termsAcceptedAt: new Date() },
  });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + VERIFICATION_TTL_MS),
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  try {
    await sendVerificationEmail(email, verifyUrl);
  } catch (error) {
    console.error("Nie udało się wysłać maila weryfikacyjnego:", error);
    return {
      ok: true,
      message:
        "Konto zostało utworzone, ale nie udało się wysłać maila z potwierdzeniem (problem z serwerem pocztowym). Poproś administratora o ręczne potwierdzenie konta w panelu.",
    };
  }

  return {
    ok: true,
    message: "Sprawdź skrzynkę e-mail, aby potwierdzić rejestrację.",
  };
}

export async function verifyEmailToken(
  token: string,
  email: string
): Promise<{ ok: boolean; message: string }> {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });

  if (!record || record.expires < new Date()) {
    return {
      ok: false,
      message: "Link jest nieprawidłowy albo wygasł. Zarejestruj się ponownie.",
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    }),
  ]);

  return { ok: true, message: "Adres e-mail potwierdzony — możesz się zalogować." };
}

export type LoginState = { message: string } | null;

export async function loginUser(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = await getClientIp();
  if (isRateLimited(`login:${ip}`, 10, 1000 * 60 * 15)) {
    return { message: "Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut." };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message:
          "Nieprawidłowy e-mail lub hasło, albo konto nie zostało jeszcze potwierdzone mailem.",
      };
    }
    throw error;
  }

  return null;
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}
