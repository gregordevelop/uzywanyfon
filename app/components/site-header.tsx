import Link from "next/link";
import { getValidCartItems } from "@/lib/cart";
import { auth } from "@/auth";
import { logoutUser } from "@/app/actions/auth";

export async function SiteHeader() {
  const [items, session] = await Promise.all([getValidCartItems(), auth()]);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          UżywanyFon
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:inline">
                Cześć, {session.user.name ?? session.user.email}
              </span>
              <Link
                href="/orders"
                className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
              >
                Moje zamówienia
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
                >
                  Wyloguj
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
            >
              Zaloguj się
            </Link>
          )}

          <Link
            href="/cart"
            className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
          >
            Koszyk{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
