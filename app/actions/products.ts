"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  deleteProductUploads,
  deleteUploadedImage,
  saveUploadedImage,
} from "@/lib/uploads";
import { Condition } from "@/app/generated/prisma/client";
import { CONDITION_OPTIONS } from "@/lib/phone-options";

export type CreateProductState = { ok: false; message: string } | null;

type VariantInput = {
  id?: string;
  color: string;
  storageGb: number;
  price: number;
  stock: number;
  condition: Condition;
  simlock: boolean;
};

function isCondition(value: unknown): value is Condition {
  return typeof value === "string" && CONDITION_OPTIONS.includes(value);
}

function parseVariants(formData: FormData): VariantInput[] {
  const indices = new Set<string>();
  for (const key of formData.keys()) {
    const match = key.match(/^variantColor-(\d+)$/);
    if (match) indices.add(match[1]);
  }

  const variants: VariantInput[] = [];

  for (const idx of indices) {
    const id = formData.get(`variantId-${idx}`);
    const color = formData.get(`variantColor-${idx}`);
    const storageGb = Number(formData.get(`variantStorageGb-${idx}`));
    const price = Number(formData.get(`variantPrice-${idx}`));
    const stock = Number(formData.get(`variantStock-${idx}`));
    const condition = formData.get(`variantCondition-${idx}`);
    // Nie sprzedajemy telefonów z blokadą simlock — zawsze false.
    const simlock = false;

    if (
      typeof color !== "string" ||
      !color.trim() ||
      !Number.isFinite(storageGb) ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      !isCondition(condition)
    ) {
      continue;
    }

    variants.push({
      id: typeof id === "string" && id ? id : undefined,
      color: color.trim(),
      storageGb,
      price,
      stock,
      condition,
      simlock,
    });
  }

  return variants;
}

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  await requireAdmin();

  const name = formData.get("name");
  const brand = formData.get("brand");
  const description = formData.get("description");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof brand !== "string" ||
    !brand.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return { ok: false, message: "Uzupełnij nazwę, markę i opis." };
  }

  const variants = parseVariants(formData);
  if (variants.length === 0) {
    return {
      ok: false,
      message: "Dodaj przynajmniej jeden poprawny wariant (kolor/pojemność/cena/stan).",
    };
  }

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      brand: brand.trim(),
      description: description.trim(),
      images: [],
      variants: {
        create: variants.map(({ id: _id, ...variant }) => variant),
      },
    },
  });

  const imagePaths: string[] = [];
  for (const file of files) {
    imagePaths.push(await saveUploadedImage(file, product.id));
  }

  if (imagePaths.length > 0) {
    await prisma.product.update({
      where: { id: product.id },
      data: { images: imagePaths },
    });
  }

  redirect("/admin");
}

export async function updateProduct(
  productId: string,
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  await requireAdmin();

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { images: true },
  });
  if (!existingProduct) {
    return { ok: false, message: "Produkt nie istnieje." };
  }

  const name = formData.get("name");
  const brand = formData.get("brand");
  const description = formData.get("description");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof brand !== "string" ||
    !brand.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return { ok: false, message: "Uzupełnij nazwę, markę i opis." };
  }

  const variants = parseVariants(formData);
  if (variants.length === 0) {
    return {
      ok: false,
      message:
        "Dodaj przynajmniej jeden poprawny wariant (kolor/pojemność/cena/stan).",
    };
  }

  const existingVariantIds = new Set(
    (
      await prisma.productVariant.findMany({
        where: { productId },
        select: { id: true },
      })
    ).map((v) => v.id)
  );
  const submittedIds = new Set(
    variants.filter((v) => v.id).map((v) => v.id as string)
  );
  const idsToDelete = [...existingVariantIds].filter(
    (id) => !submittedIds.has(id)
  );

  const keepImages = formData
    .getAll("keepImage")
    .filter((v): v is string => typeof v === "string");
  const removedImages = existingProduct.images.filter(
    (img) => !keepImages.includes(img)
  );

  const newFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const newImagePaths: string[] = [];
  for (const file of newFiles) {
    newImagePaths.push(await saveUploadedImage(file, productId));
  }

  try {
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          name: name.trim(),
          brand: brand.trim(),
          description: description.trim(),
          images: [...keepImages, ...newImagePaths],
        },
      }),
      ...idsToDelete.map((id) => prisma.productVariant.delete({ where: { id } })),
      ...variants
        .filter((v): v is VariantInput & { id: string } => Boolean(v.id))
        .map((v) =>
          prisma.productVariant.update({
            where: { id: v.id },
            data: {
              color: v.color,
              storageGb: v.storageGb,
              price: v.price,
              stock: v.stock,
              condition: v.condition,
              simlock: v.simlock,
            },
          })
        ),
      ...variants
        .filter((v) => !v.id)
        .map((v) =>
          prisma.productVariant.create({
            data: {
              color: v.color,
              storageGb: v.storageGb,
              price: v.price,
              stock: v.stock,
              condition: v.condition,
              simlock: v.simlock,
              productId,
            },
          })
        ),
    ]);
  } catch {
    return {
      ok: false,
      message:
        "Nie udało się zapisać zmian — możliwe, że usuwany wariant ma powiązane zamówienia.",
    };
  }

  for (const img of removedImages) {
    await deleteUploadedImage(img);
  }

  redirect("/admin");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();

  const productId = formData.get("productId");
  if (typeof productId !== "string" || !productId) return;

  try {
    await prisma.product.delete({ where: { id: productId } });
  } catch {
    // prawdopodobnie istnieją powiązane zamówienia – nie usuwamy
    redirect("/admin?error=has-orders");
  }

  await deleteProductUploads(productId);

  redirect("/admin");
}
