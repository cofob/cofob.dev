declare global {
	namespace App {}

	interface ImportMetaEnv {
		readonly VITE_DOMAIN: string;
		readonly VITE_ANALYTICS: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {};
