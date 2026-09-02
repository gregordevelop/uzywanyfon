import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../../_components/product-form";

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]/edit">
) {
  const { id } = await props.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edytuj telefon
      </h1>
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          brand: product.brand,
          description: product.description,
          images: product.images,
          variants: product.variants.map((v) => ({
            id: v.id,
            color: v.color,
            storageGb: v.storageGb,
            price: Number(v.price),
            stock: v.stock,
            condition: v.condition,
            simlock: v.simlock,
          })),
        }}
      />
    </div>
  );
}
