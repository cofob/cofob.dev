<script lang="ts">
	import { Heading, Meta, Section } from "$lib/components";
	import { copyrightEmail } from "$lib/license";
</script>

<Meta
	title="License"
	description="License terms for original cofob.dev source code and website content."
	url="/license/"
/>

<Section>
	<article class="license">
		<Heading level={1}>cofob.dev License</Heading>

		<p class="application">
			Original cofob.dev source code and website content owned by cofob are licensed under these terms.
		</p>

		<p>Copyright © 2021-present cofob (Egor Ternovoi) · <a href={`mailto:${copyrightEmail}`}>{copyrightEmail}</a>.</p>

		<p>Canonical license text: <a href="https://cofob.dev/license/">https://cofob.dev/license/</a></p>

		<p>
			This license applies to any source code, software, documentation, website content, text, image, audio, video, or
			other material for which the copyright holder states that this license applies (the “covered material”).
		</p>

		<p>
			You may use, copy, share, modify, and distribute the covered material for non-commercial purposes if you credit
			cofob (Egor Ternovoi) and link to the original source.
		</p>

		<p>
			You may not use the covered material to train, fine-tune, evaluate, or otherwise improve an
			artificial-intelligence or machine-learning model, or include it in a dataset made for those purposes.
		</p>

		<p>
			Despite the non-commercial limit above, search indexing and user-requested AI processing by commercial services
			are allowed, provided that the covered material and the related request, response, and derived data are not used
			to train, fine-tune, evaluate, or otherwise improve a model.
		</p>

		<p>
			This license does not cover third-party materials, dependencies, or vendored software. Uses allowed by applicable
			law remain allowed. All other rights are reserved.
		</p>

		<p>The covered material is provided as-is, without warranty.</p>

		<p>
			For commercial use or AI-training permission, contact
			<a href={`mailto:${copyrightEmail}`}>{copyrightEmail}</a>.
		</p>
	</article>
</Section>

<style lang="postcss">
	@reference "../../lib/app.css";

	.license {
		@apply mx-auto max-w-2xl space-y-4;
	}

	a {
		@apply underline hover:no-underline;
	}

	.application {
		@apply font-semibold;
	}
</style>
