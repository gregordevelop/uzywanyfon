import { ProductForm } from "../_components/product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Dodaj telefon
      </h1>
      <ProductForm />
    </div>
  );
}
