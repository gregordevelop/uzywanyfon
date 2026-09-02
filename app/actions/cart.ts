"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CART_COOKIE, getCart, type CartItem } from "@/lib/cart";

async function saveCart(cart: CartItem[]) {
  (await cookies()).set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export type AddToCartState = { ok: boolean; message: string } | null;

export async function addToCart(
  _prevState: AddToCartState,
  formData: FormData
): Promise<AddToCartState> {
  const variantId = formData.get("variantId");
  if (typeof variantId !== "string" || !variantId) {
    return { ok: false, message: "Wybierz wariant." };
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!variant) {
    return { ok: false, message: "Wariant nie istnieje." };
  }

  const cart = await getCart();
  const existing = cart.find((item) => item.variantId === variantId);
  const currentQuantity = existing?.quantity ?? 0;

  if (currentQuantity >= variant.stock) {
    return { ok: false, message: "Brak większej ilości na stanie." };
  }

  const nextCart = existing
    ? cart.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    : [...cart, { variantId, quantity: 1 }];

  await saveCart(nextCart);

  return { ok: true, message: "Dodano do koszyka." };
}

export async function updateCartItem(formData: FormData) {
  const variantId = formData.get("variantId");
  const delta = Number(formData.get("delta"));
  if (typeof variantId !== "string" || !variantId || Number.isNaN(delta)) {
    return;
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!variant) return;

  const cart = await getCart();
  const existing = cart.find((item) => item.variantId === variantId);
  if (!existing) return;

  const nextQuantity = Math.min(
    Math.max(existing.quantity + delta, 0),
    variant.stock
  );

  const nextCart =
    nextQuantity === 0
      ? cart.filter((item) => item.variantId !== variantId)
      : cart.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: nextQuantity }
            : item
        );

  await saveCart(nextCart);
}

export async function removeCartItem(formData: FormData) {
  const variantId = formData.get("variantId");
  if (typeof variantId !== "string" || !variantId) return;

  const cart = await getCart();
  await saveCart(cart.filter((item) => item.variantId !== variantId));
}
