import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/app/components/site-header";
import { ImageGallery } from "./image-gallery";
import { VariantSelector } from "./variant-selector";

const getProduct = cache(async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
});

export async function generateMetadata(
  props: PageProps<"/products/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Produkt nie znaleziony — UżywanyFon" };
  }

  const title = `${product.brand} ${product.name} — UżywanyFon`;
  const description =
    product.description.length > 155
      ? `${product.description.slice(0, 155)}…`
      : product.description;
  const image = product.images[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const variants = product.variants.map((v) => ({
    id: v.id,
    color: v.color,
    storageGb: v.storageGb,
    price: Number(v.price),
    stock: v.stock,
    condition: v.condition,
    simlock: v.simlock,
  }));

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-6 py-10 md:grid-cols-2">
        <ImageGallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {product.brand}
            </span>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {product.name}
            </h1>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>

          <VariantSelector variants={variants} />
        </div>
      </main>
    </div>
  );
}
