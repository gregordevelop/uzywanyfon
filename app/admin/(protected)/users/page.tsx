import { prisma } from "@/lib/prisma";
import { verifyUserEmail, deleteUser } from "@/app/actions/admin-users";
import { ConfirmSubmitButton } from "../_components/confirm-submit-button";
import { CheckIcon, TrashIcon, UsersIcon } from "../_components/icons";

export default async function AdminUsersPage(
  props: PageProps<"/admin/users">
) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  const verifiedCount = users.filter((u) => u.emailVerified).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Użytkownicy
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Konta klientów zarejestrowanych w sklepie
        </p>
      </div>

      {error === "has-orders" && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          Nie udało się usunąć użytkownika — ma powiązane zamówienia w
          bazie. Usuń najpierw jego zamówienia (albo zostaw konto), jeśli
          chcesz je zachować w historii sprzedaży.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon={<UsersIcon className="h-5 w-5" />}
          label="Wszyscy użytkownicy"
          value={users.length}
        />
        <StatTile
          icon={<CheckIcon className="h-5 w-5" />}
          label="Potwierdzeni"
          value={verifiedCount}
        />
        <StatTile
          icon={<UsersIcon className="h-5 w-5" />}
          label="Niepotwierdzeni"
          value={users.length - verifiedCount}
        />
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
            <UsersIcon className="h-6 w-6" />
          </span>
          <p className="text-zinc-500 dark:text-zinc-400">
            Brak zarejestrowanych użytkowników.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                  {user.name ?? "Bez nazwy"}
                </p>
                <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span
                    className={
                      user.emailVerified
                        ? "rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "rounded-full bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                    }
                  >
                    {user.emailVerified ? "Potwierdzony" : "Niepotwierdzony"}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {user._count.orders} zamówień
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500">
                    dołączył{" "}
                    {user.createdAt.toLocaleString("pl-PL", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!user.emailVerified && (
                  <form action={verifyUserEmail}>
                    <input type="hidden" name="userId" value={user.id} />
                    <ConfirmSubmitButton
                      icon={<CheckIcon className="h-4 w-4" />}
                      label="Potwierdź ręcznie"
                      confirmMessage="Ręcznie potwierdzić adres e-mail tego użytkownika?"
                      variant="success"
                    />
                  </form>
                )}
                <form action={deleteUser}>
                  <input type="hidden" name="userId" value={user.id} />
                  <ConfirmSubmitButton
                    icon={<TrashIcon className="h-4 w-4" />}
                    label="Usuń"
                    confirmMessage="Na pewno usunąć tego użytkownika? Tej operacji nie można cofnąć."
                  />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        {icon}
      </span>
      <div>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </div>
  );
}
