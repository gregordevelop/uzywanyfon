"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageIcon, PhoneStackIcon, UsersIcon } from "./icons";

const links = [
  { href: "/admin", label: "Ogłoszenia", icon: PhoneStackIcon },
  { href: "/admin/orders", label: "Zamówienia", icon: PackageIcon },
  { href: "/admin/users", label: "Użytkownicy", icon: UsersIcon },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
