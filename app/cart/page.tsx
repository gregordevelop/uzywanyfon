import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { getValidCartItems } from "@/lib/cart";
import { removeCartItem, updateCartItem } from "@/app/actions/cart";
import { auth } from "@/auth";
import { CheckoutForm } from "./checkout-form";

export default async function CartPage() {
  const [items, session] = await Promise.all([getValidCartItems(), auth()]);

  const total = items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0
  );

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Koszyk
        </h1>

        {items.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            Koszyk jest pusty.{" "}
            <Link href="/" className="underline">
              Wróć do sklepu
            </Link>
            .
          </p>
        ) : (
          <>
            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                const image = item.variant.product.images[0];
                const lineTotal = Number(item.variant.price) * item.quantity;

                return (
                  <li
                    key={item.variantId}
                    className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.variant.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                          Brak zdjęcia
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <Link
                        href={`/products/${item.variant.productId}`}
                        className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
                      >
                        {item.variant.product.name}
                      </Link>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {item.variant.color} · {item.variant.storageGb} GB
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {Number(item.variant.price).toFixed(2)} zł / szt.
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <form action={updateCartItem}>
                          <input
                            type="hidden"
                            name="variantId"
                            value={item.variantId}
                          />
                          <input type="hidden" name="delta" value="-1" />
                          <button
                            type="submit"
                            aria-label="Zmniejsz ilość"
                            className="h-8 w-8 rounded-full border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                          >
                            −
                          </button>
                        </form>

                        <span className="w-6 text-center">
                          {item.quantity}
                        </span>

                        <form action={updateCartItem}>
                          <input
                            type="hidden"
                            name="variantId"
                            value={item.variantId}
                          />
                          <input type="hidden" name="delta" value="1" />
                          <button
                            type="submit"
                            aria-label="Zwiększ ilość"
                            disabled={item.quantity >= item.variant.stock}
                            className="h-8 w-8 rounded-full border border-zinc-300 text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
                          >
                            +
                          </button>
                        </form>

                        <form action={removeCartItem} className="ml-auto">
                          <input
                            type="hidden"
                            name="variantId"
                            value={item.variantId}
                          />
                          <button
                            type="submit"
                            className="text-sm text-red-600 hover:underline"
                          >
                            Usuń
                          </button>
                        </form>
                      </div>
                    </div>

                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {lineTotal.toFixed(2)} zł
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Razem
              </span>
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {total.toFixed(2)} zł
              </span>
            </div>

            <div className="mt-6">
              {session?.user ? (
                <CheckoutForm />
              ) : (
                <p className="text-right text-sm text-zinc-600 dark:text-zinc-400">
                  <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Zaloguj się
                  </Link>
                  , żeby złożyć zamówienie.
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
