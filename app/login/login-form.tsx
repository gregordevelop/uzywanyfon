"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type LoginState } from "@/app/actions/auth";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginUser,
    null
  );

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Zaloguj się
      </h1>

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
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
      >
        {pending ? "Logowanie…" : "Zaloguj się"}
      </button>

      {state?.message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {state.message}
        </p>
      )}

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Nie masz konta?{" "}
        <Link
          href="/register"
          className="text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Zarejestruj się
        </Link>
      </p>
    </form>
  );
}
