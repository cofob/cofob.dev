export type RichTextNode =
	| { type: "text"; value: string }
	| { type: "break" }
	| { type: "emoji"; src: string; alt: string }
	| {
			type: "element";
			tag: "p" | "link" | "strong" | "em" | "code" | "blockquote" | "ul" | "ol" | "li";
			href?: string;
			children: RichTextNode[];
	  };

export interface FediverseAttachment {
	type: "image" | "gifv" | "video" | "audio" | "unknown";
	url: string;
	previewUrl?: string;
	description?: string;
}

export interface FediverseComment {
	id: string;
	inReplyToId?: string;
	url: string;
	createdAt: string;
	author: {
		name: string;
		acct: string;
		url: string;
		avatar?: string;
	};
	content: RichTextNode[];
	contentWarning?: string;
	sensitive: boolean;
	attachments: FediverseAttachment[];
	replies: FediverseComment[];
}

export type CommentsResult =
	| { state: "ready"; comments: FediverseComment[]; fetchedAt: string; stale?: boolean }
	| { state: "error"; message: string };
