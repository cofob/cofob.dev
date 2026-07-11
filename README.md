# cofob.dev

My personal website, built with SvelteKit.

## License

Original cofob.dev source code and website content owned by cofob are covered by the reusable custom [cofob.dev License](LICENSE), whose canonical public copy is available at [cofob.dev/license](https://cofob.dev/license/). It permits attributed non-commercial use, modification, and sharing, and expressly prohibits AI or machine-learning training, evaluation, and model improvement. Third-party materials, dependencies, and vendored software retain their own terms.

## Development

Node.js 24.11 or newer is required.

```sh
npm ci
npm run dev
```

Run the core validation suite with `npm test`. It performs Svelte type checking, formatting and lint checks, unit tests, Chromium accessibility checks at mobile and desktop widths, builds the Node adapter, and smoke-tests pages, endpoints, status codes, content types, and cache headers. Install the accessibility-test browser once with `npx playwright install chromium`. `npm run test:static` validates static artifacts, while `npm run test:cloudflare` starts a local Wrangler runtime and checks Cloudflare responses.

## Blog authoring

Blog posts live in `src/lib/blog/posts/` as MDsveX-flavoured Markdown. Copy `example-post.md` to a lower-kebab-case filename and update its frontmatter. A post is public only when `draft` is `false` and its `published` timestamp has passed at build time; scheduled static posts therefore appear on the next deployment.

Set `tags` to a unique list of up to 12 short labels. Tags appear on post cards and article pages, are included in feeds and structured data, and provide SSR filters on `/blog`. The blog paginates SSR results in groups of 10. Search metadata is prerendered to `/blog/search.json`, but the browser only downloads it after the reader enters a search query.

Set the optional `updated` field to a timezone-qualified ISO timestamp when a published article changes. It must not be earlier than `published`. The article, post cards, Open Graph metadata, JSON-LD, sitemap, RSS, and Atom feeds expose the modification date, while the blog and home page remain ordered by the original publication date.

Put local media in `static/blog/<post-slug>/` and reference it from Markdown with a relative URL. Displayed JPEG, PNG, WebP, AVIF, and GIF images are automatically converted to responsive WebP variants up to 1440 pixels wide; SVG remains SVG. The generated markup includes intrinsic dimensions and mobile-friendly `srcset` data. Original raster files are published only when explicitly linked as downloads. Video, audio, PDFs, and other linked post-local attachments are copied or uploaded without conversion.

Reusable stickers live in `static/stickers/<sticker-pack>/` and are referenced with an absolute `/stickers/...` path. They use the same image optimization pipeline, but their generated asset keys are shared across posts instead of being nested below a post slug.

Every Markdown image needs meaningful alternative text, for example `![Terminal showing a successful build](build.png)`. The build rejects missing files and empty Markdown alternatives. A `cover` requires `coverAlt`. Use optional `socialImage` and `socialImageAlt` fields as a pair to override the automatically generated 1200×630 social card. Local social overrides are normalized to PNG; absolute HTTPS overrides are expected to be 1200×630 and are used unchanged.

Set the optional `comments` field to a public Mastodon status URL or Pleroma/Akkoma `/notice/` URL to use its replies as blog comments. Node and Cloudflare builds fetch comments server-side; static builds ask the reader before contacting the remote instance. All modes degrade to a link to the original thread if its API is unavailable.

Posts may import Svelte components, but components must support server rendering and provide useful portable HTML because RSS and Atom contain the complete article. Blog components can use the portable blog render context to emit a simpler feed representation while preserving their normal browser UI. Portable output should use basic elements such as paragraphs, blockquotes, links, images, figures, and code blocks.

Each feed entry exposes its generated social image as feed media metadata and as the first image in the full article HTML. This prevents feed readers that infer cover art from the first image from selecting a sticker or another inline illustration.

Asciinema recordings must be hosted at `https://site-assets.cofob.dev`. Normal article pages keep the inline player, while feeds link to `/blog/play_asciinema/?url=...`, which validates the recording origin before loading it.

## Deployment targets

- `npm run build` — Node server in `build/`
- `npm run build:static` — prerendered site with IPFS fallback files and endpoint header metadata
- `npm run build:cloudflare` — Cloudflare Pages worker output in `.svelte-kit/cloudflare/`

All targets run the same media preparation step. Development, Node, static, and local Cloudflare builds default to `BLOG_ASSET_MODE=local`, producing a self-contained build without credentials. Setting `BLOG_ASSET_MODE=external` uploads generated media and attachments through the S3 API and omits the blog source media from the deployment bundle. Upload keys include a content hash, use immutable cache headers, and are never deleted automatically; objects not referenced by the current build are reported after synchronization.

### Cloudflare Pages and R2

Create an R2 bucket, attach the public custom domain `site-assets.cofob.dev`, and create bucket-scoped object read/write S3 credentials. In the Cloudflare Pages project settings, add these ordinary variables to both Production and Preview:

```text
BLOG_ASSET_MODE=external
BLOG_ASSET_S3_ENDPOINT=https://025464e503cbb7385dff88bd6d3c9128.r2.cloudflarestorage.com
BLOG_ASSET_S3_REGION=auto
BLOG_ASSET_S3_BUCKET=cofob-dev-assets
BLOG_ASSET_S3_FORCE_PATH_STYLE=false
BLOG_ASSET_PUBLIC_BASE_URL=https://site-assets.cofob.dev/
BLOG_ASSET_PREFIX=blog
```

Add these values as encrypted secrets in both environments:

```text
BLOG_ASSET_S3_ACCESS_KEY_ID
BLOG_ASSET_S3_SECRET_ACCESS_KEY
```

No runtime R2 binding or general Cloudflare API token is required. The upload happens during `npm run build:cloudflare`. Production and preview builds intentionally share the content-addressed bucket, so preview media can be publicly reachable before its branch is merged.

The Nix flake builds the Node target and its container image.

## TypeScript compatibility

TypeScript 6.0.3 is intentionally pinned because it is the newest release supported by both SvelteKit 2.69 and typescript-eslint 8. TypeScript 7 will be adopted once those upstream peer ranges support it.
