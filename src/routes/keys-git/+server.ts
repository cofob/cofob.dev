export const prerender = process.env.DEPLOY_TARGET === "static";

export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "text/plain",
	};

	return new Response(
		`# cofob git signing keys. signed at https://cofob.dev/keys-git.asc.
ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBGWarSY0OHRUS3FQ3L+E5SV/cOJD5c3Cid5o4Irr7wwfELECwT5MiaHOFxyIocLtXMati3W1VmSmX2LxXsbzro4= cofob+mac-mini-m4-git-signing@riseup.net
ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBHYsX8P3eNriI+1rwbuPDzMlP/+x/lvBh2Sm4rAK2QcME191M7rmbxHSI2hYacs+BYhEspuGnc+yfa3+QoGTB0E= cofob+mac-air-m4-git-signing@riseup.net`,
		{ headers: headers },
	);
}
