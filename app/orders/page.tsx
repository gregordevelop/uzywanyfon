import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/app/components/site-header";
import { ORDER_STATUS_LABELS } from "@/lib/order-options";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Moje zamówienia
        </h1>

        {orders.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            Nie masz jeszcze żadnych zamówień.{" "}
            <Link href="/" className="underline">
              Przejdź do sklepu
            </Link>
            .
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Zamówienie #{order.id.slice(-8)}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {order.createdAt.toLocaleDateString("pl-PL")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {Number(order.total).toFixed(2)} zł
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  Wysyłka: {order.recipientName}, {order.street},{" "}
                  {order.postalCode} {order.city}, tel. {order.phone}
                </p>

                <ul className="mt-3 flex flex-col gap-3">
                  {order.items.map((item) => {
                    const image = item.variant.product.images[0];
                    return (
                      <li key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                          {image && (
                            <Image
                              src={image}
                              alt={item.variant.product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {item.variant.product.name}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {item.variant.color} · {item.variant.storageGb} GB
                            · {item.quantity} szt.
                          </p>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {(Number(item.price) * item.quantity).toFixed(2)} zł
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
