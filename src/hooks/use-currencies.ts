import { useEffect, useState } from "react";
import { currencyApi } from "../api/currency-api.ts";
import type { Currency } from "../types/currency.ts";

function defaultPair(list: Currency[]) {
  const codes = list.map((c) => c.short_code);
  if (codes.includes("PLN") && codes.includes("EUR")) {
    return { from: "PLN", to: "EUR" };
  }
  return { from: codes[0] ?? "", to: codes[1] ?? codes[0] ?? "" };
}

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    currencyApi
      .getCurrencies(controller.signal)
      .then((list) => {
        const sorted = [...list].sort((a, b) =>
          a.short_code.localeCompare(b.short_code),
        );
        const pair = defaultPair(sorted);
        setCurrencies(sorted);
        setFrom(pair.from);
        setTo(pair.to);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "Could not load currencies.",
        );
      });

    return () => controller.abort();
  }, [reload]);

  return {
    currencies,
    status,
    error,
    from,
    to,
    setFrom,
    setTo,
    retry: () => {
      setStatus("loading");
      setError("");
      setReload((n) => n + 1);
    },
  };
}
