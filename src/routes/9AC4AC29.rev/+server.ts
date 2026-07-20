export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "text/plain",
	};

	return new Response(
		`-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: This is a revocation certificate
Comment: Key is superseded
Comment: Replaced with 7E9D 200A 2BD4 BB7A 0E32  1B74 2F3F 5809 B8DD B818 key.
Comment: This revocation can be found at https://cofob.dev/9AC4AC29.rev.
Comment: New key can be found at https://cofob.dev/B8DDB818.asc.

iQE1BCAWCgDdFiEEBO7wujuFewZaMmBnNBo2kprErCkFAmpEZdi/HQFSZXBsYWNl
ZCB3aXRoIDdFOUQgMjAwQSAyQkQ0IEJCN0EgMEUzMiAgMUI3NCAyRjNGIDU4MDkg
QjhERCBCODE4IGtleS4gVGhpcyByZXZvY2F0aW9uIGNhbiBiZSBmb3VuZCBhdCBo
dHRwczovL2NvZm9iLmRldi85QUM0QUMyOS5yZXYuIE5ldyBrZXkgY2FuIGJlIGZv
dW5kIGF0IGh0dHBzOi8vY29mb2IuZGV2L0I4RERCODE4LmFzYy4ACgkQNBo2kprE
rCmrVAD+MKgTI69n+woyVmc+rZuxlZoSu3mc/SbVueKdZ0/g5CUA/jeXFJitQLr4
hhSqc9MIoo7KxeYf4iwNQngRBhDblMEF
=QQS2
-----END PGP PUBLIC KEY BLOCK-----`,
		{ headers: headers },
	);
}
