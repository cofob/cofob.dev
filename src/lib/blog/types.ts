import type { Component } from "svelte";

export interface PostMetadata {
	slug: string;
	title: string;
	description: string;
	published: string;
	updated?: string;
	lang: string;
	draft: boolean;
	cover?: string;
	coverAlt?: string;
	comments?: string;
	isPublic: boolean;
}

export type PostSummary = Omit<PostMetadata, "comments">;
export type PostComponent = Component;
