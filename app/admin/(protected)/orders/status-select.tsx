"use client";

import { useRef } from "react";
import { updateOrderStatus } from "@/app/actions/admin-orders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from "@/lib/order-options";

export function StatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateOrderStatus}>
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      >
        {ORDER_STATUS_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {ORDER_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
    </form>
  );
}
