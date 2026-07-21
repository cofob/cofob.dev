import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig(
	globalIgnores([
		".blog-build/**",
		".svelte-kit/**",
		".wrangler/**",
		"build/**",
		"node_modules/**",
		".pi-subagents/**",
		"playwright-report/**",
		"test-results/**",
		"result",
	]),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs["flat/recommended"],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	...svelte.configs["flat/prettier"],
	prettier,
);
