export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "text/plain",
	};

	return new Response(
		`-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

# cofob keys. signed at https://cofob.dev/keys.asc.
cert-authority,principals="cofob" sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29tAAAAIFkk/HM3VwWLs2Bj0bZjKahAuRmSznLlVDbYJR1Ir6pDAAAABHNzaDo= ssh+t1-user-ca@cofob.dev
cert-authority,principals="cofob" sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29tAAAAIM0uJGGZGNdIVOKjhwLwijt9SvXOw1ImgOahvtcU4wnvAAAABHNzaDo= ssh+t2-user-ca@cofob.dev
cert-authority,principals="cofob" sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29tAAAAIG2SADZzBLVHn+ZNwHJ900XeZx5zQXYvQZ/1K/rri7iNAAAABHNzaDo= ssh+t3-user-ca@cofob.dev
cert-authority,principals="cofob" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJBmxrYpB405augwB1OLZrAjuJ9keOOGEvaTC5IAlW29 ssh+gpg@cofob.dev
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJBmxrYpB405augwB1OLZrAjuJ9keOOGEvaTC5IAlW29 ssh+gpg@cofob.dev
-----BEGIN PGP SIGNATURE-----

iJEEARYKADkWIQTFu1dY97Sjh6Gs9JFEGSBODkCQ7gUCavT6OBsUgAAAAAAEAA5t
YW51MiwyLjUrMS4xMiwwLDMACgkQRBkgTg5AkO6wUgD8C082hjsXVpb/JbTRH7C8
T787vnWl4m8s7SwUtn8iGVUBAP32DUyrvgprtn2kYPEKfONbpyl14nZHoD+9h6oq
jWkI
=dn4f
-----END PGP SIGNATURE-----`,
		{ headers: headers },
	);
}
