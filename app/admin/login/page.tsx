"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/app/actions/admin-auth";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAdmin,
    null
  );

  return (
    <div className="flex min-h-svh flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Panel administracyjny
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Zaloguj się, aby zarządzać ogłoszeniami
            </p>
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          Hasło
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? "Logowanie…" : "Zaloguj"}
        </button>

        {state?.message && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
