import { base } from "$app/paths";

export const terminalFontFamily = '"MesloLGS NF", monospace';

let fontLoad: Promise<void> | undefined;

/** Load each face before the player measures cells. Call only in the browser. */
export function loadTerminalFont(): Promise<void> {
	fontLoad ??= Promise.allSettled(
		[
			["regular", "400", "normal"],
			["bold", "700", "normal"],
			["italic", "400", "italic"],
			["bold-italic", "700", "italic"],
		].map(async ([file, weight, style]) => {
			const face = new FontFace("MesloLGS NF", `url("${base}/fonts/meslo/${file}.woff2") format("woff2")`, {
				weight,
				style,
			});
			await face.load();
			document.fonts.add(face);
		}),
	).then(() => undefined);
	return fontLoad;
}
