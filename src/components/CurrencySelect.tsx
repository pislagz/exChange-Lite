import type { Currency } from "../types/currency.ts";

type CurrencySelectProps = {
  label: string;
  id: string;
  value: string;
  options: Currency[];
  disabled: boolean;
  onChange: (shortCode: string) => void;
};

export function CurrencySelect({
  label,
  id,
  value,
  options,
  disabled,
  onChange,
}: CurrencySelectProps) {
  const loading = options.length === 0;

  return (
    <div className="mb-4 flex flex-col gap-1.5 sm:mb-0">
      <label htmlFor={id} className="text-sm font-semibold text-gray-950">
        {label}
      </label>
      <select
        id={id}
        className="w-full border border-gray-200 bg-white px-3 py-2 text-gray-950 disabled:opacity-60"
        value={loading ? "" : value}
        disabled={disabled || loading}
        onChange={(event) => onChange(event.target.value)}
      >
        {loading ? <option value="">Loading currencies...</option> : null}
        {options.map((option) => (
          <option key={option.short_code} value={option.short_code}>
            {option.short_code} - {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
