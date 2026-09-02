import Link from "next/link";

export function brandSlug(brand: string) {
  return brand.toLowerCase();
}

export function CategoryNav({
  brands,
  active,
}: {
  brands: string[];
  active?: string;
}) {
  const pillClass = (isActive: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
        : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
    }`;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link href="/" className={pillClass(!active)}>
        Wszystkie
      </Link>
      {brands.map((b) => (
        <Link
          key={b}
          href={`/marka/${brandSlug(b)}`}
          className={pillClass(active === b)}
        >
          {b}
        </Link>
      ))}
    </div>
  );
}
