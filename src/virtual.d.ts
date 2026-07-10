declare module "virtual:blog-catalog" {
	export const buildTime: string;
	export const siteSocialImage: import("./lib/blog/types").SocialImageAsset | undefined;
	export const posts: import("./lib/blog/types").PostMetadata[];
}

declare module "virtual:blog-components" {
	export const postComponents: Record<string, import("./lib/blog/types").PostComponent>;
}

declare module "*.md" {
	const component: import("svelte").Component;
	export default component;
	export const metadata: Record<string, unknown>;
}
