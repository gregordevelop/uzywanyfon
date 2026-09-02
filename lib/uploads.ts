import { mkdir, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? path.join(process.cwd(), ".uploads");

export async function saveUploadedImage(
  file: File,
  productId: string
): Promise<string> {
  const extension = path.extname(file.name) || ".jpg";
  const filename = `${crypto.randomUUID()}${extension}`;
  const productDir = path.join(UPLOADS_DIR, productId);

  await mkdir(productDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(productDir, filename), buffer);

  return `/api/uploads/${productId}/${filename}`;
}

export async function deleteUploadedImage(url: string): Promise<void> {
  if (!url.startsWith("/api/uploads/")) return;

  const segments = url.replace("/api/uploads/", "").split("/");
  if (segments.some((segment) => segment.includes("..") || !segment)) return;

  try {
    await unlink(path.join(UPLOADS_DIR, ...segments));
  } catch {
    // plik mógł już nie istnieć – nic nie robimy
  }
}

export async function deleteProductUploads(productId: string): Promise<void> {
  try {
    await rm(path.join(UPLOADS_DIR, productId), {
      recursive: true,
      force: true,
    });
  } catch {
    // brak folderu – nic nie robimy
  }
}
