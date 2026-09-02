import { CONDITION_LABELS, CONDITION_OPTIONS } from "@/lib/phone-options";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900";

export function ProductFilters({
  brands,
  current,
}: {
  brands: string[];
  current: {
    q: string;
    brand: string;
    condition: string;
    minPrice?: number;
    maxPrice?: number;
  };
}) {
  return (
    <form
      method="get"
      className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Szukaj
        <input
          type="text"
          name="q"
          defaultValue={current.q}
          placeholder="np. iPhone 13"
          className={`${inputClass} w-40`}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Marka
        <select name="brand" defaultValue={current.brand} className={inputClass}>
          <option value="">Wszystkie</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Stan
        <select
          name="condition"
          defaultValue={current.condition}
          className={inputClass}
        >
          <option value="">Wszystkie</option>
          {CONDITION_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {CONDITION_LABELS[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Cena od
        <input
          type="number"
          name="minPrice"
          min={0}
          defaultValue={current.minPrice ?? ""}
          className={`${inputClass} w-24`}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Cena do
        <input
          type="number"
          name="maxPrice"
          min={0}
          defaultValue={current.maxPrice ?? ""}
          className={`${inputClass} w-24`}
        />
      </label>

      <button
        type="submit"
        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        Filtruj
      </button>

      <a
        href="/"
        className="text-sm text-zinc-500 hover:underline dark:text-zinc-400"
      >
        Wyczyść
      </a>
    </form>
  );
}
