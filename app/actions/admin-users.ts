"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function verifyUserEmail(formData: FormData) {
  await requireAdmin();

  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  await requireAdmin();

  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) return;

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch {
    // najczęstsza przyczyna: użytkownik ma powiązane zamówienia
    redirect("/admin/users?error=has-orders");
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
