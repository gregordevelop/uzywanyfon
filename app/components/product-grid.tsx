import Image from "next/image";
import Link from "next/link";

type GridProduct = {
  id: string;
  name: string;
  brand: string;
  images: string[];
  variants: { price: unknown; stock: number }[];
};

export function ProductGrid({ products }: { products: GridProduct[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const prices = product.variants.map((v) => Number(v.price));
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const totalStock = product.variants.reduce(
          (sum, v) => sum + v.stock,
          0
        );
        const image = product.images[0];

        return (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
                {image ? (
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-400">
                    Brak zdjęcia
                  </div>
                )}
                {totalStock === 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-white">
                    Wyprzedane
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1 p-4">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {product.brand}
                </span>
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.name}
                </h2>
                <p className="mt-auto pt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {minPrice !== null
                    ? `od ${minPrice.toFixed(2)} zł`
                    : "Brak wariantów"}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
