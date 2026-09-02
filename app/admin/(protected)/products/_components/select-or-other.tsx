"use client";

import { useState } from "react";

const OTHER = "__other__";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800";

export function SelectOrOther({
  name,
  label,
  options,
  defaultValue,
  otherLabel = "Inna wartość…",
  inputType = "text",
  required = true,
}: {
  name: string;
  label: string;
  options: (string | number)[];
  defaultValue?: string | number;
  otherLabel?: string;
  inputType?: "text" | "number";
  required?: boolean;
}) {
  const knownValues = options.map(String);
  const defaultIsKnown =
    defaultValue !== undefined && knownValues.includes(String(defaultValue));

  const [value, setValue] = useState<string>(
    defaultValue !== undefined
      ? defaultIsKnown
        ? String(defaultValue)
        : OTHER
      : String(options[0] ?? OTHER)
  );

  const otherDefault =
    defaultValue !== undefined && !defaultIsKnown ? String(defaultValue) : "";

  return (
    <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
      {label}
      {value === OTHER ? (
        <div className="flex gap-2">
          <input
            name={name}
            type={inputType}
            required={required}
            autoFocus
            defaultValue={otherDefault}
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="button"
            onClick={() => setValue(String(options[0] ?? OTHER))}
            className="whitespace-nowrap text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            wróć do listy
          </button>
        </div>
      ) : (
        <select
          name={name}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value={OTHER}>{otherLabel}</option>
        </select>
      )}
    </label>
  );
}
