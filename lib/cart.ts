import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const CART_COOKIE = "cart";

export type CartItem = { variantId: string; quantity: number };

export async function getCart(): Promise<CartItem[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item.variantId === "string" &&
        typeof item.quantity === "number"
    );
  } catch {
    return [];
  }
}

/**
 * Zwraca zawartość koszyka zweryfikowaną względem bazy: pozycje wskazujące na
 * usunięty wariant znikają, a ilość jest przycinana do aktualnego stanu
 * magazynowego. Cookie z koszykiem samo się nie czyści (Server Components nie
 * mogą zapisywać cookies) — to tylko spójny widok na potrzeby wyświetlania.
 */
export async function getValidCartItems() {
  const cart = await getCart();
  if (cart.length === 0) return [];

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: cart.map((item) => item.variantId) } },
    include: { product: true },
  });

  return cart
    .map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) return null;

      const quantity = Math.min(item.quantity, variant.stock);
      if (quantity <= 0) return null;

      return { variantId: item.variantId, quantity, variant };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}
