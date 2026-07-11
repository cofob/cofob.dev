import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { copyrightEmail, copyrightHolderName, siteLicenseUrl } from "./license";

describe("cofob.dev license", () => {
	it("identifies the holder and defines reusable covered material", async () => {
		const license = await readFile("LICENSE", "utf8");
		expect(license).toContain(copyrightHolderName);
		expect(license).toContain(copyrightEmail);
		expect(license).toContain("Canonical license text: https://cofob.dev/license/");
		expect(license).toContain("source code, software, documentation, website content");
		expect(license).toContain("non-commercial purposes");
		expect(license).toContain("may not use the covered material to train");
		expect(siteLicenseUrl).toBe("https://cofob.dev/license/");
	});

	it("uses the custom license in package metadata", async () => {
		const manifest = JSON.parse(await readFile("package.json", "utf8")) as { license: string };
		const lockfile = JSON.parse(await readFile("package-lock.json", "utf8")) as {
			packages: { "": { license: string } };
		};
		expect(manifest.license).toBe("SEE LICENSE IN LICENSE");
		expect(lockfile.packages[""].license).toBe("SEE LICENSE IN LICENSE");
	});
});
