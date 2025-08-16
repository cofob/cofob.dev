export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "text/plain",
	};

	return new Response(
		`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJsSKOtKRM9+bvCs6iioOrcayMdsdwaQN/lJAQJkXE+w
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG/9imD3CsThK+gD/j202AwS8dmpWqiCaQGNWeWl8oxY
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFg9JjdQH3neby5z1IWB8xlMzWtfnaWvTJX82+p+Qapp
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIN6b75A2O7+oEzlGFMtWp7HcicyThJZAgQTNs/QzmP3M`,
		{ headers: headers },
	);
}
