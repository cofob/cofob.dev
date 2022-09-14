/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
	interface ImportMetaEnv {
		VITE_DOMAIN: string;
		VITE_IPFS_ENDPOINT: string;
		VITE_ANALYTICS: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}
