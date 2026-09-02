"use client";

import { useState } from "react";
import { COLORS, CONDITION_LABELS, CONDITION_OPTIONS, STORAGE_OPTIONS } from "@/lib/phone-options";
import { SelectOrOther } from "./select-or-other";
import { PlusIcon, TrashIcon } from "../../_components/icons";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800";

export type VariantFieldValues = {
  id?: string;
  color: string;
  storageGb: number;
  price: number;
  stock: number;
  condition: string;
  simlock: boolean;
};

type Row = { key: number; initial?: VariantFieldValues };

export function VariantFields({
  initialVariants,
}: {
  initialVariants?: VariantFieldValues[];
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    initialVariants && initialVariants.length > 0
      ? initialVariants.map((v, i) => ({ key: i, initial: v }))
      : [{ key: 0 }]
  );
  const [nextKey, setNextKey] = useState(rows.length);

  return (
    <div className="flex flex-col gap-4">
      {rows.map(({ key, initial }, index) => (
        <div
          key={key}
          className="relative rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Wariant {index + 1}
            </span>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((row) => row.key !== key))}
                aria-label="Usuń wariant"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {initial?.id && (
            <input type="hidden" name={`variantId-${key}`} value={initial.id} />
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SelectOrOther
              name={`variantColor-${key}`}
              label="Kolor"
              options={COLORS}
              defaultValue={initial?.color}
            />

            <SelectOrOther
              name={`variantStorageGb-${key}`}
              label="Pojemność (GB)"
              options={STORAGE_OPTIONS}
              defaultValue={initial?.storageGb}
              inputType="number"
            />

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Cena (zł)
              <input
                name={`variantPrice-${key}`}
                type="number"
                step="0.01"
                min={0}
                required
                defaultValue={initial?.price}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Sztuk na stanie
              <input
                name={`variantStock-${key}`}
                type="number"
                min={0}
                required
                defaultValue={initial?.stock ?? 1}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Stan telefonu
              <select
                name={`variantCondition-${key}`}
                required
                defaultValue={initial?.condition ?? "BARDZO_DOBRY"}
                className={inputClass}
              >
                {CONDITION_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {CONDITION_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          setRows((r) => [...r, { key: nextKey }]);
          setNextKey((k) => k + 1);
        }}
        className="flex items-center justify-center gap-1.5 self-start rounded-full border border-dashed border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        Dodaj wariant
      </button>
    </div>
  );
}
