import { useEffect, useState } from "react";
import { currencyApi } from "../api/currency-api.ts";
import type { Conversion } from "../types/currency.ts";

const DEBOUNCE_MS = 300;

function parseAmount(raw: string): number | null {
  const value = Number(raw.trim());
  if (raw.trim() === "" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return value;
}

export function useConversion(
  from: string,
  to: string,
  amountInput: string,
  enabled: boolean,
) {
  const amount = parseAmount(amountInput);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversion, setConversion] = useState<Conversion | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!enabled || amount === null || !from || !to) {
      setLoading(false);
      setError("");
      setConversion(null);
      return;
    }

    if (from === to) {
      setLoading(false);
      setError("");
      setConversion({ value: amount, from, to, amount, date: "" });
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);
    setError("");

    const timeout = window.setTimeout(() => {
      currencyApi
        .convert({ from, to, amount }, controller.signal)
        .then((result) => {
          if (cancelled) return;
          setConversion(result);
          setLoading(false);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setConversion(null);
          setError(err instanceof Error ? err.message : "Conversion failed.");
          setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [amount, enabled, from, retry, to]);

  return {
    amount,
    invalid: amount === null,
    loading,
    error,
    conversion,
    retryConversion: () => setRetry((n) => n + 1),
  };
}
