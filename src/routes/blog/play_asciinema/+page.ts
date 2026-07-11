import type { PageLoad } from "./$types";
import { getAsciinemaPageData } from "$lib/blog/asciinema";

export const ssr = process.env.DEPLOY_TARGET !== "static";
export const prerender = process.env.DEPLOY_TARGET === "static";

export const load: PageLoad = ({ url }) => getAsciinemaPageData(url);
