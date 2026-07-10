import { prepareBlogAssets } from "./blog-assets.js";

await prepareBlogAssets({ includePreviews: process.argv.includes("--include-previews") });
