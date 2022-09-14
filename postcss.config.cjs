module.exports = {
	plugins: {
		"postcss-import": {},
		"postcss-discard-comments": {
			removeAll: true,
		},
		tailwindcss: {},
		autoprefixer: {},
		cssnano: {
			preset: "advanced",
		},
	},
};
