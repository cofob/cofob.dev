import type { Component } from "svelte";

export interface ResponsiveImageAsset {
	src: string;
	srcset: string;
	width: number;
	height: number;
	type: string;
	alt: string;
}

export interface SocialImageAsset {
	src: string;
	width: number;
	height: number;
	type: string;
	alt: string;
}

export interface PostMetadata {
	slug: string;
	title: string;
	description: string;
	published: string;
	updated?: string;
	lang: string;
	draft: boolean;
	cover?: ResponsiveImageAsset;
	socialImage?: SocialImageAsset;
	comments?: string;
	isPublic: boolean;
}

export type PostSummary = Omit<PostMetadata, "comments">;
export type PostComponent = Component;
