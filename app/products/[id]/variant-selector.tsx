"use client";

import { useActionState, useMemo, useState } from "react";
import { addToCart, type AddToCartState } from "@/app/actions/cart";
import { CONDITION_LABELS } from "@/lib/phone-options";

type Variant = {
  id: string;
  color: string;
  storageGb: number;
  price: number;
  stock: number;
  condition: string;
  simlock: boolean;
};

export function VariantSelector({ variants }: { variants: Variant[] }) {
  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color))),
    [variants]
  );
  const storages = useMemo(
    () =>
      Array.from(new Set(variants.map((v) => v.storageGb))).sort(
        (a, b) => a - b
      ),
    [variants]
  );

  const [color, setColor] = useState(variants[0]?.color);
  const [storageGb, setStorageGb] = useState(variants[0]?.storageGb);
  const [state, formAction, pending] = useActionState<AddToCartState, FormData>(
    addToCart,
    null
  );

  const selected = variants.find(
    (v) => v.color === color && v.storageGb === storageGb
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Kolor
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                c === color
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Pojemność
        </p>
        <div className="flex flex-wrap gap-2">
          {storages.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStorageGb(s)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                s === storageGb
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {s} GB
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {selected.price.toFixed(2)} zł
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {selected.stock > 0
              ? `Dostępne: ${selected.stock} szt.`
              : "Brak na stanie"}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              Stan: {CONDITION_LABELS[selected.condition] ?? selected.condition}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                selected.simlock
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                  : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              }`}
            >
              {selected.simlock ? "Simlock: zablokowany" : "Simlock: brak blokady"}
            </span>
          </div>

          <form action={formAction}>
            <input type="hidden" name="variantId" value={selected.id} />
            <button
              type="submit"
              disabled={pending || selected.stock === 0}
              className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {pending
                ? "Dodawanie…"
                : selected.stock === 0
                  ? "Niedostępny"
                  : "Dodaj do koszyka"}
            </button>
          </form>

          {state && (
            <p
              className={
                state.ok
                  ? "text-sm text-green-600"
                  : "text-sm text-red-600"
              }
            >
              {state.message}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-red-600">
          Ta kombinacja koloru i pojemności jest niedostępna.
        </p>
      )}
    </div>
  );
}
