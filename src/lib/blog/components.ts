import { postComponents } from "virtual:blog-components";

export function getPostComponent(slug: string) {
	return postComponents[slug];
}
