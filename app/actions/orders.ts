"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CART_COOKIE, getValidCartItems } from "@/lib/cart";
import { cookies } from "next/headers";

export type CreateOrderState = { message: string } | null;

const ShippingSchema = z.object({
  recipientName: z.string().trim().min(3, "Podaj imię i nazwisko odbiorcy."),
  phone: z
    .string()
    .trim()
    .min(9, "Podaj prawidłowy numer telefonu.")
    .regex(/^[0-9+ ]+$/, "Numer telefonu może zawierać tylko cyfry, spacje i +."),
  street: z.string().trim().min(3, "Podaj ulicę i numer."),
  city: z.string().trim().min(2, "Podaj miasto."),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy w formacie XX-XXX."),
});

export async function createOrder(
  _prevState: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Zaloguj się, żeby złożyć zamówienie." };
  }

  const parsed = ShippingSchema.safeParse({
    recipientName: formData.get("recipientName"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
  });

  if (!parsed.success) {
    return { message: parsed.error.issues[0].message };
  }

  const items = await getValidCartItems();
  if (items.length === 0) {
    return { message: "Koszyk jest pusty." };
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0
  );

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const updated = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (updated.count === 0) {
          throw new Error(
            `Za mało sztuk na stanie: ${item.variant.color} ${item.variant.storageGb}GB`
          );
        }
      }

      await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
          total,
          ...parsed.data,
          items: {
            create: items.map((item) => ({
              quantity: item.quantity,
              price: item.variant.price,
              variantId: item.variantId,
            })),
          },
        },
      });
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się złożyć zamówienia.",
    };
  }

  (await cookies()).delete(CART_COOKIE);
  redirect("/orders");
}
