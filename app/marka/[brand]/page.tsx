import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/app/components/site-header";
import { CategoryNav } from "@/app/components/category-nav";
import { ProductGrid } from "@/app/components/product-grid";

const getBrandMatch = cache(async (slug: string) => {
  const rows = await prisma.product.findMany({
    distinct: ["brand"],
    select: { brand: true },
  });
  return rows.map((r) => r.brand).find((b) => b.toLowerCase() === slug.toLowerCase());
});

export async function generateMetadata(
  props: PageProps<"/marka/[brand]">
): Promise<Metadata> {
  const { brand: slug } = await props.params;
  const brand = await getBrandMatch(slug);

  if (!brand) {
    return { title: "Kategoria nie znaleziona — UżywanyFon" };
  }

  return {
    title: `Telefony ${brand} — UżywanyFon`,
    description: `Używane telefony ${brand} w dobrych cenach — sprawdzone, z opisanym stanem technicznym.`,
  };
}

export default async function BrandCategoryPage(
  props: PageProps<"/marka/[brand]">
) {
  const { brand: slug } = await props.params;

  const [brand, brandRows] = await Promise.all([
    getBrandMatch(slug),
    prisma.product.findMany({
      distinct: ["brand"],
      select: { brand: true },
      orderBy: { brand: "asc" },
    }),
  ]);

  if (!brand) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { brand },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  const brands = brandRows.map((b) => b.brand);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {brand}
        </h1>

        <CategoryNav brands={brands} active={brand} />

        {products.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            Brak produktów w tej kategorii.
          </p>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
    </div>
  );
}
