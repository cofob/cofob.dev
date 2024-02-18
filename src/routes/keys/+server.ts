export async function GET() {
	const headers = {
		"Cache-Control": "max-age=0, s-maxage=3600",
		"Content-Type": "text/plain",
	};

	return new Response(
		`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIETMEzhigdZelWae3V4tQ7/LXsub39SRG2X+jPMeoHMx cofob@riseup.net`,
		{ headers: headers },
	);
}
