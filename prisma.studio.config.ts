import { defineConfig } from "prisma/config";

// Prisma Studio ma błąd/quirk: jeśli prisma.config.ts ręcznie ładuje .env
// (import "dotenv/config"), Studio zgłasza fałszywy "conflict between env
// vars" dla każdej zmiennej. `db push`/`migrate` potrzebują tego importu
// (inaczej brakuje im DIRECT_URL), więc Studio dostaje własny, czystszy
// config bez niego — DATABASE_URL i tak wczytuje się poprawnie dzięki
// wbudowanemu mechanizmowi Prisma powiązanemu ze schema.prisma.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
