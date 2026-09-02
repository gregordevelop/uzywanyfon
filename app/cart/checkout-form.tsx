"use client";

import { useActionState } from "react";
import { createOrder, type CreateOrderState } from "@/app/actions/orders";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900";

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState<
    CreateOrderState,
    FormData
  >(createOrder, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
        Dane do wysyłki
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Imię i nazwisko odbiorcy
          <input name="recipientName" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Telefon
          <input
            name="phone"
            type="tel"
            required
            placeholder="+48 500 000 000"
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Ulica i numer
        <input name="street" required className={inputClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Kod pocztowy
          <input
            name="postalCode"
            required
            placeholder="00-000"
            pattern="\d{2}-\d{3}"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Miasto
          <input name="city" required className={inputClass} />
        </label>
      </div>

      <div className="flex flex-col items-end gap-2 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? "Składanie zamówienia…" : "Złóż zamówienie"}
        </button>

        {state?.message && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
