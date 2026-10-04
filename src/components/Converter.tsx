import { useState } from "react";
import { useConversion } from "../hooks/use-conversion.ts";
import { useCurrencies } from "../hooks/use-currencies.ts";
import { AmountField } from "./AmountField.tsx";
import { CurrencySelect } from "./CurrencySelect.tsx";

export function Converter() {
  const { currencies, status, error, from, to, setFrom, setTo, retry } =
    useCurrencies();
  const [amount, setAmount] = useState("1");
  const {
    invalid,
    loading,
    error: convertError,
    conversion,
    retryConversion,
  } = useConversion(from, to, amount, status === "ready");

  return (
    <main className="w-full max-w-xl border border-gray-200 p-6">
      <h1 className="mb-4 text-2xl font-semibold text-gray-950">
        exChange Lite
      </h1>

      <AmountField value={amount} onChange={setAmount} invalid={invalid} />

      {status === "error" ? (
        <div className="mb-4">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            className="mt-2 cursor-pointer border border-gray-200 bg-white px-3 py-1.5"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <CurrencySelect
            label="From"
            id="from-currency"
            value={from}
            options={currencies}
            disabled={status !== "ready"}
            onChange={setFrom}
          />
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center border border-purple-500/50 bg-purple-500/10 px-3 py-2 disabled:opacity-60"
            disabled={status !== "ready"}
            title="Swap currencies"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
          >
            ⇄
          </button>
          <CurrencySelect
            label="To"
            id="to-currency"
            value={to}
            options={currencies}
            disabled={status !== "ready"}
            onChange={setTo}
          />
        </div>
      )}

      <section className="mt-4 border border-gray-200 bg-stone-100 p-4">
        {loading ? <p>Converting...</p> : null}

        {convertError ? (
          <div>
            <p className="text-sm text-red-600">{convertError}</p>
            <button
              type="button"
              className="mt-2 cursor-pointer border border-gray-200 bg-white px-3 py-1.5"
              onClick={retryConversion}
            >
              Try again
            </button>
          </div>
        ) : null}

        {conversion && !invalid && !loading && !convertError ? (
          <>
            <p className="mb-2 text-2xl font-semibold text-gray-950">
              {formatMoney(conversion.value, conversion.to)}
            </p>
            <p className="mt-1 text-sm">
              Rate: 1 {conversion.from} ={" "}
              {conversion.amount
                ? formatNumber(conversion.value / conversion.amount)
                : "-"}{" "}
              {conversion.to}
            </p>
            {conversion.date ? (
              <p className="mt-1 text-sm">Date: {conversion.date}</p>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  );
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${formatNumber(value)} ${currency}`;
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumSignificantDigits: 6,
  }).format(value);
}
