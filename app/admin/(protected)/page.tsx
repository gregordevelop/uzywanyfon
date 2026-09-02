import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/app/actions/products";
import { ConfirmSubmitButton } from "./_components/confirm-submit-button";
import {
  EyeIcon,
  ImageIcon,
  LayersIcon,
  PencilIcon,
  PhoneStackIcon,
  PlusIcon,
  TrashIcon,
} from "./_components/icons";

export default async function AdminDashboardPage(
  props: PageProps<"/admin">
) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0);
  const totalImages = products.reduce((sum, p) => sum + p.images.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Ogłoszenia
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Zarządzaj telefonami wystawionymi w sklepie
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          <PlusIcon className="h-4 w-4" />
          Dodaj telefon
        </Link>
      </div>

      {error === "has-orders" && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          Nie udało się usunąć ogłoszenia — ma powiązane zamówienia w
          bazie.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon={<PhoneStackIcon className="h-5 w-5" />}
          label="Ogłoszenia"
          value={products.length}
        />
        <StatTile
          icon={<LayersIcon className="h-5 w-5" />}
          label="Warianty łącznie"
          value={totalVariants}
        />
        <StatTile
          icon={<ImageIcon className="h-5 w-5" />}
          label="Zdjęcia łącznie"
          value={totalImages}
        />
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
            <PhoneStackIcon className="h-6 w-6" />
          </span>
          <p className="text-zinc-500 dark:text-zinc-400">
            Brak ogłoszeń — dodaj pierwszy telefon.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => {
            const totalStock = product.variants.reduce(
              (sum, v) => sum + v.stock,
              0
            );
            const image = product.images[0];

            return (
              <li
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-400">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                    {product.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {product.brand}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {product.variants.length} wariant(ów)
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {product.images.length} zdjęć
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${
                        totalStock > 0
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}
                    >
                      {totalStock > 0 ? `${totalStock} szt. na stanie` : "Wyprzedane"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/products/${product.id}`}
                    target="_blank"
                    aria-label="Zobacz w sklepie"
                    title="Zobacz w sklepie"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    aria-label="Edytuj"
                    title="Edytuj"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="productId" value={product.id} />
                    <ConfirmSubmitButton
                      icon={<TrashIcon className="h-4 w-4" />}
                      label="Usuń"
                      confirmMessage="Na pewno usunąć to ogłoszenie? Tej operacji nie można cofnąć."
                    />
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        {icon}
      </span>
      <div>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </div>
  );
}
