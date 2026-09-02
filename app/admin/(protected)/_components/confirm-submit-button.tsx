"use client";

export function ConfirmSubmitButton({
  icon,
  label,
  confirmMessage,
  variant = "danger",
}: {
  icon: React.ReactNode;
  label: string;
  confirmMessage: string;
  variant?: "danger" | "success";
}) {
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors dark:text-zinc-400 ${
        variant === "danger"
          ? "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          : "hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
      }`}
    >
      {icon}
    </button>
  );
}
