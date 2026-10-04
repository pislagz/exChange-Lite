type AmountFieldProps = {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
};

export function AmountField({ value, onChange, invalid }: AmountFieldProps) {
  return (
    <div className="mb-4 flex flex-col gap-1.5">
      <label htmlFor="amount" className="text-sm font-semibold text-gray-950">
        Amount
      </label>
      <input
        id="amount"
        type="text"
        inputMode="decimal"
        className="w-full border border-gray-200 bg-white px-3 py-2 text-gray-950"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {invalid ? (
        <p className="text-sm text-red-600">
          Enter an amount that is zero or greater.
        </p>
      ) : null}
    </div>
  );
}
