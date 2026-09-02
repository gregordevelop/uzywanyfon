import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-6 text-sm text-zinc-500 sm:flex-row sm:justify-between dark:text-zinc-400">
        <p>© {new Date().getFullYear()} UżywanyFon</p>
        <div className="flex gap-4">
          <Link href="/regulamin" className="hover:underline">
            Regulamin
          </Link>
          <Link href="/polityka-prywatnosci" className="hover:underline">
            Polityka prywatności
          </Link>
        </div>
      </div>
    </footer>
  );
}
