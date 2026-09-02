"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { ORDER_STATUS_OPTIONS } from "@/lib/order-options";
import { OrderStatus } from "@/app/generated/prisma/client";

function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && ORDER_STATUS_OPTIONS.includes(value);
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();

  const orderId = formData.get("orderId");
  const status = formData.get("status");

  if (typeof orderId !== "string" || !orderId || !isOrderStatus(status)) {
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
}

export async function deleteOrder(formData: FormData) {
  await requireAdmin();

  const orderId = formData.get("orderId");
  if (typeof orderId !== "string" || !orderId) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return;

  await prisma.$transaction([
    // Usunięcie zamówienia zwalnia zarezerwowany stan magazynowy.
    ...order.items.map((item) =>
      prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      })
    ),
    prisma.order.delete({ where: { id: orderId } }),
  ]);

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath("/");
}
