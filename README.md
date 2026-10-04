# exChange Lite Currency converter

React app that converts two currencies using the CurrencyBeacon API.

## Run locally

1. Register for a free API key at [currencybeacon.com/register](https://currencybeacon.com/register).

2. Set `VITE_CURRENCYBEACON_API_KEY` in `.env`.

3. Install and start:

   ```bash
   npm i
   npm run dev
   ```

## Notes

The API key ends up in the client, which is ok for a demo. I proxy `/currencybeacon` through Vite so the browser doesn't get CORS.

Dropdown values are CurrencyBeacon `short_code`s. Convert is debounced (~300ms) and aborted if you change something mid-request. Same currency just prints the amount without API call. Empty / negative / NaN amounts don't convert.
