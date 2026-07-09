# cofob.dev

My personal website, built with SvelteKit.

## Development

Node.js 24.11 or newer is required.

```sh
npm ci
npm run dev
```

Run the core validation suite with `npm test`. It performs Svelte type checking, formatting and lint checks, builds the Node adapter, and smoke-tests pages, endpoints, status codes, content types, and cache headers. `npm run test:static` validates static artifacts, while `npm run test:cloudflare` starts a local Wrangler runtime and checks Cloudflare responses.

## Deployment targets

- `npm run build` — Node server in `build/`
- `npm run build:static` — prerendered site with IPFS fallback files and endpoint header metadata
- `npm run build:cloudflare` — Cloudflare Pages worker output in `.svelte-kit/cloudflare/`

The Nix flake builds the Node target and its container image.

## TypeScript compatibility

TypeScript 6.0.3 is intentionally pinned because it is the newest release supported by both SvelteKit 2.69 and typescript-eslint 8. TypeScript 7 will be adopted once those upstream peer ranges support it.
