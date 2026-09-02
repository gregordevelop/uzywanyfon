"use client";

import { useActionState } from "react";
import Link from "next/link";
import Script from "next/script";
import { registerUser, type RegisterState } from "@/app/actions/auth";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerUser,
    null
  );
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Załóż konto
      </h1>

      {/*
        honeypot – niewidoczne dla ludzi, ale wypełniane przez proste boty.
        display:none (a nie tylko przesunięcie poza ekran) jest ważne:
        przeglądarki i menedżery haseł potrafią autouzupełnić pole widoczne
        wizualnie-poza-ekranem (np. nazwane "website"), co fałszywie
        wyzwalało wykrywanie bota realnym użytkownikom.
      */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="hp_check"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Imię
        <input name="name" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Email
        <input type="email" name="email" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Hasło
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className={inputClass}
        />
      </label>

      {siteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
            async
            defer
          />
          <div className="cf-turnstile" data-sitekey={siteKey} />
        </>
      )}

      <label className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="acceptTerms"
          required
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500/30 dark:border-zinc-700"
        />
        <span>
          Akceptuję{" "}
          <Link
            href="/regulamin"
            target="_blank"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            regulamin
          </Link>{" "}
          i{" "}
          <Link
            href="/polityka-prywatnosci"
            target="_blank"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            politykę prywatności
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
      >
        {pending ? "Rejestrowanie…" : "Zarejestruj się"}
      </button>

      {state && (
        <p
          className={
            state.ok
              ? "rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-400"
              : "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400"
          }
        >
          {state.message}
        </p>
      )}

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Masz już konto?{" "}
        <Link
          href="/login"
          className="text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
