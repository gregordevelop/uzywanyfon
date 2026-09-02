import { SiteHeader } from "@/app/components/site-header";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <LoginForm />
      </main>
    </div>
  );
}
