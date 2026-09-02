import { SiteHeader } from "@/app/components/site-header";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <RegisterForm />
      </main>
    </div>
  );
}
