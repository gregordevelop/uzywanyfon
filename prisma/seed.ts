import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "iPhone 13",
    brand: "Apple",
    description:
      "Używany iPhone 13 w bardzo dobrym stanie, bateria powyżej 85% kondycji. Pełny zestaw: telefon, kabel, brak ładowarki (zgodnie ze standardem Apple).",
    images: [
      "https://images.unsplash.com/photo-1632661674596-618e73da4c25",
    ],
    variants: [
      { color: "Północ", storageGb: 128, price: 1899.0, stock: 3, condition: "BARDZO_DOBRY" as const, simlock: false },
      { color: "Północ", storageGb: 256, price: 2199.0, stock: 1, condition: "NOWY" as const, simlock: false },
      { color: "Czerwony", storageGb: 128, price: 1949.0, stock: 2, condition: "DOBRY" as const, simlock: false },
    ],
  },
  {
    name: "iPhone 14 Pro",
    brand: "Apple",
    description:
      "Używany iPhone 14 Pro, ekran Dynamic Island, aparat 48MP. Drobne ślady użytkowania na obudowie, ekran bez rys.",
    images: [
      "https://images.unsplash.com/photo-1678652197831-2d180705cd2c",
    ],
    variants: [
      { color: "Głęboka purpura", storageGb: 256, price: 3299.0, stock: 2, condition: "BARDZO_DOBRY" as const, simlock: false },
      { color: "Srebrny", storageGb: 128, price: 2999.0, stock: 0, condition: "DOBRY" as const, simlock: false },
    ],
  },
  {
    name: "Samsung Galaxy S22",
    brand: "Samsung",
    description:
      "Używany Samsung Galaxy S22 w dobrym stanie. Wyświetlacz Dynamic AMOLED 2X, szybkie ładowanie. Sprawdzony i odblokowany na wszystkie sieci.",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
    ],
    variants: [
      { color: "Czarny fantom", storageGb: 128, price: 1499.0, stock: 4, condition: "DOBRY" as const, simlock: false },
      { color: "Zielony", storageGb: 256, price: 1699.0, stock: 2, condition: "BARDZO_DOBRY" as const, simlock: false },
    ],
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    brand: "Samsung",
    description:
      "Używany flagowiec Samsunga z rysikiem S Pen w komplecie. Aparat 200MP, świetny stan baterii.",
    images: [
      "https://images.unsplash.com/photo-1678483789111-3a04c4628bd6",
    ],
    variants: [
      { color: "Kremowy", storageGb: 256, price: 3599.0, stock: 1, condition: "NOWY" as const, simlock: false },
      { color: "Czarny", storageGb: 512, price: 3999.0, stock: 1, condition: "BARDZO_DOBRY" as const, simlock: false },
    ],
  },
  {
    name: "Xiaomi Redmi Note 12",
    brand: "Xiaomi",
    description:
      "Budżetowy, używany Xiaomi w bardzo dobrym stanie. Idealny na pierwszy telefon lub zapasowy.",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
    ],
    variants: [
      { color: "Niebieski", storageGb: 64, price: 599.0, stock: 5, condition: "ZADOWALAJACY" as const, simlock: false },
      { color: "Szary", storageGb: 128, price: 699.0, stock: 3, condition: "DOBRY" as const, simlock: false },
    ],
  },
  {
    name: "Google Pixel 7",
    brand: "Google",
    description:
      "Używany Google Pixel 7, czysty Android bez nakładek, świetny aparat. Stan bardzo dobry, komplet akcesoriów.",
    images: [
      "https://images.unsplash.com/photo-1667239518881-3f7078b3f4c1",
    ],
    variants: [
      { color: "Obsydian", storageGb: 128, price: 1599.0, stock: 2, condition: "BARDZO_DOBRY" as const, simlock: false },
    ],
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  for (const { variants, ...product } of products) {
    await prisma.product.create({
      data: {
        ...product,
        variants: { create: variants },
      },
    });
  }

  console.log(`Zseedowano ${products.length} produktów.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
