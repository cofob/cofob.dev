export const prerender = process.env.DEPLOY_TARGET === "static";

export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "text/plain",
	};

	return new Response(
		`-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

cert-authority sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29tAAAAIFkk/HM3VwWLs2Bj0bZjKahAuRmSznLlVDbYJR1Ir6pDAAAABHNzaDo= ssh+t1-user-ca@cofob.dev
cert-authority sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29tAAAAIM0uJGGZGNdIVOKjhwLwijt9SvXOw1ImgOahvtcU4wnvAAAABHNzaDo= ssh+t2-user-ca@cofob.dev
cert-authority sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29tAAAAIG2SADZzBLVHn+ZNwHJ900XeZx5zQXYvQZ/1K/rri7iNAAAABHNzaDo= ssh+t3-user-ca@cofob.dev
cert-authoriry ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJBmxrYpB405augwB1OLZrAjuJ9keOOGEvaTC5IAlW29 ssh+gpg@cofob.dev
-----BEGIN PGP SIGNATURE-----

iJEEARYKADkWIQTFu1dY97Sjh6Gs9JFEGSBODkCQ7gUCakRkcxsUgAAAAAAEAA5t
YW51MiwyLjUrMS4xMiwwLDMACgkQRBkgTg5AkO5D7wD+MSVGUEvTFATM48X03g5O
DrQBqFckoN68FSFYq+BNR1kA/28PJxHV70VA5Xg/l+jic2jXnZ/9u9iHpQ+7Y8W/
ZmoP
=xyWl
-----END PGP SIGNATURE-----`,
		{ headers: headers },
	);
}
