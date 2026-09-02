import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/app/components/site-header";
import { ProductFilters } from "@/app/components/product-filters";
import { CategoryNav } from "@/app/components/category-nav";
import { ProductGrid } from "@/app/components/product-grid";
import { CONDITION_OPTIONS } from "@/lib/phone-options";
import type { Condition, Prisma } from "@/app/generated/prisma/client";

export default async function Home(props: PageProps<"/">) {
  const params = await props.searchParams;

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const brand = typeof params.brand === "string" ? params.brand : "";
  const condition =
    typeof params.condition === "string" &&
    CONDITION_OPTIONS.includes(params.condition)
      ? params.condition
      : "";
  const minPrice =
    typeof params.minPrice === "string" && params.minPrice !== ""
      ? Number(params.minPrice)
      : undefined;
  const maxPrice =
    typeof params.maxPrice === "string" && params.maxPrice !== ""
      ? Number(params.maxPrice)
      : undefined;

  const priceFilter: Prisma.DecimalFilter<"ProductVariant"> = {};
  if (minPrice !== undefined && Number.isFinite(minPrice)) {
    priceFilter.gte = minPrice;
  }
  if (maxPrice !== undefined && Number.isFinite(maxPrice)) {
    priceFilter.lte = maxPrice;
  }

  const variantFilter: Prisma.ProductVariantWhereInput = {
    ...(condition ? { condition: condition as Condition } : {}),
    ...(Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {}),
  };
  const hasVariantFilter = Object.keys(variantFilter).length > 0;
  const hasActiveFilters = Boolean(
    q || brand || condition || minPrice !== undefined || maxPrice !== undefined
  );

  const where: Prisma.ProductWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(brand ? { brand } : {}),
    ...(hasVariantFilter ? { variants: { some: variantFilter } } : {}),
  };

  const [products, brandRows] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      distinct: ["brand"],
      select: { brand: true },
      orderBy: { brand: "asc" },
    }),
  ]);

  const brands = brandRows.map((b) => b.brand);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <CategoryNav brands={brands} />

        <ProductFilters
          brands={brands}
          current={{ q, brand, condition, minPrice, maxPrice }}
        />

        {products.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            {hasActiveFilters ? (
              <>
                Brak wyników pasujących do filtrów.{" "}
                <Link href="/" className="underline">
                  Wyczyść filtry
                </Link>
                .
              </>
            ) : (
              "Brak produktów w bazie."
            )}
          </p>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
    </div>
  );
}
