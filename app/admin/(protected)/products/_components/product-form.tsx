"use client";

import { useActionState } from "react";
import Image from "next/image";
import {
  createProduct,
  updateProduct,
  type CreateProductState,
} from "@/app/actions/products";
import { BRANDS } from "@/lib/phone-options";
import { SelectOrOther } from "./select-or-other";
import { VariantFields, type VariantFieldValues } from "./variant-fields";
import { ImageIcon } from "../../_components/icons";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800";

type ExistingProduct = {
  id: string;
  name: string;
  brand: string;
  description: string;
  images: string[];
  variants: VariantFieldValues[];
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function ProductForm({ product }: { product?: ExistingProduct }) {
  const action = product ? updateProduct.bind(null, product.id) : createProduct;
  const [state, formAction, pending] = useActionState<
    CreateProductState,
    FormData
  >(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Section title="Podstawowe informacje">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Nazwa
              <input
                name="name"
                required
                defaultValue={product?.name}
                className={inputClass}
              />
            </label>
            <SelectOrOther
              name="brand"
              label="Marka"
              options={BRANDS}
              defaultValue={product?.brand}
            />
          </div>

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Opis
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={product?.description}
              className={inputClass}
            />
          </label>
        </div>
      </Section>

      <Section
        title="Warianty"
        description="Kolor, pojemność, cena, stan magazynowy, stan telefonu i simlock"
      >
        <VariantFields initialVariants={product?.variants} />
      </Section>

      <Section
        title="Zdjęcia"
        description={
          product
            ? "Odznacz zdjęcie, żeby je usunąć, albo dorzuć nowe"
            : "Możesz wybrać kilka lub kilkanaście naraz"
        }
      >
        <div className="flex flex-col gap-4">
          {product && product.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {product.images.map((src) => (
                <label
                  key={src}
                  className="group relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <input
                    type="checkbox"
                    name="keepImage"
                    value={src}
                    defaultChecked
                    className="absolute left-1.5 top-1.5 h-4 w-4 rounded border-white text-indigo-600 shadow focus:ring-indigo-500/30"
                  />
                </label>
              ))}
            </div>
          )}

          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center transition-colors hover:border-indigo-400 dark:border-zinc-700 dark:hover:border-indigo-500">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
              <ImageIcon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {product ? "Dodaj kolejne zdjęcia" : "Wybierz zdjęcia"}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Kliknij, aby wybrać pliki
            </span>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="hidden"
            />
          </label>
        </div>
      </Section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending
            ? "Zapisywanie…"
            : product
              ? "Zapisz zmiany"
              : "Dodaj ogłoszenie"}
        </button>

        {state && !state.ok && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
