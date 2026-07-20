# cofob.dev

My personal website, built with SvelteKit.

## License

Original cofob.dev source code and website content owned by cofob are covered by the reusable custom [cofob.dev License](LICENSE), whose canonical public copy is available at [cofob.dev/license](https://cofob.dev/license/). It permits attributed non-commercial use, modification, and sharing, and expressly prohibits AI or machine-learning training, evaluation, and model improvement. Third-party materials, dependencies, and vendored software retain their own terms.

## Development

Node.js 24.11 or newer is required.

The site uses `@cofob/design-system-css` and `@cofob/design-system-svelte` as its only presentation layer. Configure a classic GitHub token with `read:packages` once in the user npm configuration before installing the public packages from GitHub Packages:

```sh
npm config set @cofob:registry https://npm.pkg.github.com --location=user
npm config set //npm.pkg.github.com/:_authToken "$(gh auth token)" --location=user
npm ci
npm run dev
```

The token must never be committed. GitHub Actions configures an ephemeral user credential from `GITHUB_TOKEN`. Cloudflare Production and Preview builds need `GITHUB_PACKAGES_TOKEN` as an encrypted build variable and `NPM_CONFIG_USERCONFIG=.npmrc.github-packages` as a plain build variable. No registry credential is passed into the Nix sandbox: Nix substitutes packages built from the pinned public design-system release commit.

Run the core validation suite with `npm test`. It performs Svelte type checking, formatting and lint checks, unit tests, Chromium accessibility checks at mobile and desktop widths, builds the Node adapter, and smoke-tests pages, endpoints, status codes, content types, and cache headers. Install the accessibility-test browser once with `npx playwright install chromium`. `npm run test:cloudflare` starts a local Wrangler runtime and checks Cloudflare responses.

`npm run check:styles` enforces the DS-only boundary: Tailwind dependencies and utilities, local PostCSS, `@apply`, `@reference`, and authored component style blocks are rejected.

`npm run test:visual` compares intentional light/dark home-page snapshots at the configured desktop and mobile widths.

## Blog authoring

Blog posts live in `src/lib/blog/posts/` as MDsveX-flavoured Markdown. Copy `example-post.md` to a lower-kebab-case filename and update its frontmatter. A post is public only when `draft` is `false` and its `published` timestamp has passed at build time; scheduled posts therefore appear on the next deployment.

Set `tags` to a unique list of up to 12 short labels. Tags appear on post cards and article pages, are included in feeds and structured data, and provide SSR filters on `/blog`. The blog paginates SSR results in groups of 10. Search metadata is prerendered to `/blog/search.json`, but the browser only downloads it after the reader enters a search query.

Set the optional `updated` field to a timezone-qualified ISO timestamp when a published article changes. It must not be earlier than `published`. The article, post cards, Open Graph metadata, JSON-LD, sitemap, RSS, and Atom feeds expose the modification date, while the blog and home page remain ordered by the original publication date.

Put local media in `static/blog/<post-slug>/` and reference it from Markdown with a relative URL. Displayed JPEG, PNG, WebP, AVIF, and GIF images are automatically converted to responsive WebP variants up to 1440 pixels wide; SVG remains SVG. The generated markup includes intrinsic dimensions and mobile-friendly `srcset` data. Original raster files are published only when explicitly linked as downloads. Video, audio, terminal recordings, PDFs, and other linked post-local attachments are copied into the deployment with content-hashed names.

Reusable stickers live in `static/stickers/<sticker-pack>/` and are referenced with an absolute `/stickers/...` path. They use the same image optimization pipeline, but their generated asset keys are shared across posts instead of being nested below a post slug.

Every Markdown image needs meaningful alternative text, for example `![Terminal showing a successful build](build.png)`. The build rejects missing files, remote image sources, and empty Markdown alternatives. A `cover` requires `coverAlt`. Use local `socialImage` and `socialImageAlt` fields as a pair to override the automatically generated 1200×630 social card; the override is normalized to PNG.

Set the optional `comments` field to a public Mastodon status URL or Pleroma/Akkoma `/notice/` URL to use its replies as blog comments. Node and Cloudflare builds fetch comments server-side and degrade to a browser retry plus a link to the original thread if its API is unavailable.

Posts may import Svelte components, but components must support server rendering and provide useful portable HTML because RSS and Atom contain the complete article. Blog components can use the portable blog render context to emit a simpler feed representation while preserving their normal browser UI. Portable output should use basic elements such as paragraphs, blockquotes, links, images, figures, and code blocks.

Each feed entry exposes its generated social image as feed media metadata and as the first image in the full article HTML. This prevents feed readers that infer cover art from the first image from selecting a sticker or another inline illustration.

Asciinema recordings belong beside their post in `static/blog/<post-slug>/` and are referenced with a relative `.cast` path. The asset pipeline emits a local content-hashed recording. Normal article pages keep the inline player, while feeds link to `/blog/play_asciinema/?url=...`, which accepts only those local generated paths.

## Deployment targets

- `npm run build` — Node server in `build/`
- `npm run build:cloudflare` — Cloudflare Pages worker output in `.svelte-kit/cloudflare/`

Development, Node, and Cloudflare use the same local media preparation step. Every generated image, social card, sticker, recording, and attachment is included in the resulting deployment; no remote object storage, asset credentials, or external upload mode is used.

The Nix flake builds the Node target and its container image.

## TypeScript compatibility

TypeScript 6.0.3 is intentionally pinned because it is the newest release supported by both SvelteKit 2.69 and typescript-eslint 8. TypeScript 7 will be adopted once those upstream peer ranges support it.
