"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export type LoginState = { message: string } | null;

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = await getClientIp();
  if (isRateLimited(`admin-login:${ip}`, 5, 1000 * 60 * 15)) {
    return {
      message: "Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.",
    };
  }

  const password = formData.get("password");

  if (!process.env.ADMIN_PASSWORD) {
    return {
      message: "Panel admina nie jest skonfigurowany (brak ADMIN_PASSWORD w .env).",
    };
  }

  if (typeof password !== "string" || !verifyPassword(password)) {
    return { message: "Nieprawidłowe hasło." };
  }

  (await cookies()).set(ADMIN_COOKIE_NAME, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  (await cookies()).delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
