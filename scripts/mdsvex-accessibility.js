export function rehypeAccessibleScrollableContent() {
	return (tree) => walk(tree);
}

function walk(node) {
	if (node && typeof node === "object") {
		if (node.type === "element" && (node.tagName === "pre" || node.tagName === "table")) {
			node.properties ??= {};
			node.properties.tabIndex = 0;
			node.properties.role = "region";
			node.properties.ariaLabel = node.tagName === "table" ? "Scrollable table" : "Scrollable code example";
		}
		if (Array.isArray(node.children)) {
			const children = [];
			for (const child of node.children) {
				if (child?.type === "element" && child.tagName === "table") {
					children.push({ type: "comment", value: "svelte-ignore a11y_no_noninteractive_tabindex" });
				}
				children.push(child);
				walk(child);
			}
			node.children = children;
		}
	}
}
