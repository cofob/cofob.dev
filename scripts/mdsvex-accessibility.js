export function rehypeAccessibleScrollableContent() {
	return (tree) => walk(tree);
}

function walk(node) {
	if (node && typeof node === "object") {
		if (node.type === "element" && node.tagName === "pre") {
			node.properties ??= {};
			node.properties.tabIndex = 0;
			node.properties.role = "region";
			node.properties.ariaLabel = "Scrollable code example";
		}
		if (node.type === "element" && node.tagName === "table") {
			node.properties ??= {};
			node.properties.className = ["cf-table"];
		}
		if (Array.isArray(node.children)) {
			const children = [];
			for (const child of node.children) {
				walk(child);
				if (child?.type === "element" && child.tagName === "table") {
					children.push({
						type: "raw",
						value: "<!-- svelte-ignore a11y_no_noninteractive_tabindex -->",
					});
					children.push({
						type: "element",
						tagName: "div",
						properties: {
							className: ["cf-table-container"],
							tabIndex: 0,
							role: "region",
							ariaLabel: "Scrollable table",
						},
						children: [child],
					});
				} else {
					children.push(child);
				}
			}
			node.children = children;
		}
	}
}
