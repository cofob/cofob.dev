import type { PageLoad } from "./$types";
import { getAsciinemaPageData } from "$lib/blog/asciinema";

export const load: PageLoad = ({ url }) => getAsciinemaPageData(url);
