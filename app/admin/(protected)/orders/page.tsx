import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteOrder } from "@/app/actions/admin-orders";
import { StatusSelect } from "./status-select";
import { ConfirmSubmitButton } from "../_components/confirm-submit-button";
import { TrashIcon } from "../_components/icons";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: { include: { variant: { include: { product: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Zamówienia
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Wszystkie zamówienia klientów wraz z danymi do wysyłki
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            Brak zamówień.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Zamówienie #{order.id.slice(-8)} ·{" "}
                    {order.createdAt.toLocaleDateString("pl-PL")}
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {order.user.name ?? order.user.email}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {order.user.email}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusSelect orderId={order.id} status={order.status} />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {Number(order.total).toFixed(2)} zł
                  </span>
                  <form action={deleteOrder}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <ConfirmSubmitButton
                      icon={<TrashIcon className="h-4 w-4" />}
                      label="Usuń zamówienie"
                      confirmMessage="Usunąć to zamówienie na stałe? Zwróci to stan magazynowy zamówionych wariantów. Zwykle lepiej oznaczyć zamówienie jako „Anulowane”, żeby zachować historię sprzedaży."
                    />
                  </form>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                <p className="font-medium">Wysyłka</p>
                <p>{order.recipientName}</p>
                <p>
                  {order.street}, {order.postalCode} {order.city}
                </p>
                <p>tel. {order.phone}</p>
              </div>

              <ul className="mt-3 flex flex-col gap-3">
                {order.items.map((item) => {
                  const image = item.variant.product.images[0];
                  return (
                    <li key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
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
                          {item.variant.color} · {item.variant.storageGb} GB ·{" "}
                          {item.quantity} szt.
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
    </div>
  );
}
