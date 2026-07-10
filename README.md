# cofob.dev

My personal website, built with SvelteKit.

## Development

Node.js 24.11 or newer is required.

```sh
npm ci
npm run dev
```

Run the core validation suite with `npm test`. It performs Svelte type checking, formatting and lint checks, unit tests, Chromium accessibility checks at mobile and desktop widths, builds the Node adapter, and smoke-tests pages, endpoints, status codes, content types, and cache headers. Install the accessibility-test browser once with `npx playwright install chromium`. `npm run test:static` validates static artifacts, while `npm run test:cloudflare` starts a local Wrangler runtime and checks Cloudflare responses.

## Blog authoring

Blog posts live in `src/lib/blog/posts/` as MDsveX-flavoured Markdown. Copy `example-post.md` to a lower-kebab-case filename and update its frontmatter. A post is public only when `draft` is `false` and its `published` timestamp has passed at build time; scheduled static posts therefore appear on the next deployment.

Put local images in `static/blog/<post-slug>/` and reference them from Markdown with a relative URL and meaningful alt text, for example `![Terminal showing a successful build](build.webp)`. The build rejects missing local images and Markdown images without alt text. A cover also requires `coverAlt`.

Set the optional `comments` field to a public Mastodon status URL or Pleroma/Akkoma `/notice/` URL to use its replies as blog comments. Node and Cloudflare builds fetch comments server-side; static builds ask the reader before contacting the remote instance. All modes degrade to a link to the original thread if its API is unavailable.

Posts may import Svelte components, but components must support server rendering and provide useful static HTML because RSS and Atom contain the complete server-rendered article.

## Deployment targets

- `npm run build` — Node server in `build/`
- `npm run build:static` — prerendered site with IPFS fallback files and endpoint header metadata
- `npm run build:cloudflare` — Cloudflare Pages worker output in `.svelte-kit/cloudflare/`

The Nix flake builds the Node target and its container image.

## TypeScript compatibility

TypeScript 6.0.3 is intentionally pinned because it is the newest release supported by both SvelteKit 2.69 and typescript-eslint 8. TypeScript 7 will be adopted once those upstream peer ranges support it.
