import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { verifyEmailToken } from "@/app/actions/auth";

export default async function VerifyEmailPage(
  props: PageProps<"/verify-email">
) {
  const params = await props.searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;
  const email = typeof params.email === "string" ? params.email : undefined;

  const result =
    token && email
      ? await verifyEmailToken(token, email)
      : { ok: false, message: "Brak tokenu weryfikacyjnego w linku." };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p
            className={
              result.ok
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }
          >
            {result.message}
          </p>
          <Link
            href={result.ok ? "/login" : "/register"}
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {result.ok ? "Przejdź do logowania" : "Wróć do rejestracji"}
          </Link>
        </div>
      </main>
    </div>
  );
}
