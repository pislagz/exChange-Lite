import type { Conversion, Currency } from "../types/currency.ts";

const BASE_URL = "/currencybeacon/v1";

type ApiBody = {
  meta: { code: number; error_detail?: string };
  response: unknown;
};

function apiKey(): string {
  const key = import.meta.env.VITE_CURRENCYBEACON_API_KEY?.trim();
  if (!key) {
    throw new Error("Missing VITE_CURRENCYBEACON_API_KEY.");
  }
  return key;
}

async function request(
  path: string,
  params: Record<string, string>,
  signal: AbortSignal,
) {
  const url = new URL(`${BASE_URL}/${path}`, window.location.origin);
  url.searchParams.set("api_key", apiKey());
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }

  const response = await fetch(url, { signal });
  const body = (await response.json()) as ApiBody;

  if (body.meta.code !== 200) {
    throw new Error(body.meta.error_detail ?? "CurrencyBeacon request failed.");
  }

  return body.response;
}

export const currencyApi = {
  async getCurrencies(signal: AbortSignal): Promise<Currency[]> {
    const response = await request("currencies", {}, signal);
    if (!Array.isArray(response)) {
      throw new Error("Unexpected currency list response.");
    }

    return response
      .filter(
        (item): item is Currency =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as Currency).short_code === "string" &&
          typeof (item as Currency).name === "string",
      )
      .map((item) => ({
        short_code: item.short_code,
        name: item.name,
      }));
  },

  async convert(
    { from, to, amount }: { from: string; to: string; amount: number },
    signal: AbortSignal,
  ): Promise<Conversion> {
    const response = (await request(
      "convert",
      { from, to, amount: String(amount) },
      signal,
    )) as Partial<Conversion>;

    if (typeof response.value !== "number") {
      throw new Error("Unexpected convert response.");
    }

    return {
      value: response.value,
      from: response.from ?? from,
      to: response.to ?? to,
      amount: response.amount ?? amount,
      date: response.date ?? "",
    };
  },
};
