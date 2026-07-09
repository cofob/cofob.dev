export const prerender = process.env.DEPLOY_TARGET === "static";

export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "text/plain",
	};

	return new Response(
		`-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: 04EE F0BA 3B85 7B06 5A32  6067 341A 3692 9AC4 AC29
Comment: Egor Ternovoy <cofob@riseup.net>
Comment: THIS KEY IS REVOKED!
Comment: Replaced with 7E9D 200A 2BD4 BB7A 0E32  1B74 2F3F 5809 B8DD B818 key.

xjMEZlc4LBYJKwYBBAHaRw8BAQdATMUlFPUs3IEiPwYBd4B4ZQH50r695hWr4SD5
YHpkApTNIEVnb3IgVGVybm92b3kgPGNvZm9iQHJpc2V1cC5uZXQ+wsA5BBMWCgCh
AhsDBQkJZgGABQsJCAcCAiICBhUKCQgLAgQWAgMBAh4HAheAFiEEBO7wujuFewZa
MmBnNBo2kprErCkFAmZXOHYvFIAAAAAAEAAWcHJvb2ZAYXJpYWRuZS5pZGRuczpj
b2ZvYi5nYXk/dHlwZT1UWFQvFIAAAAAAEAAWcHJvb2ZAYXJpYWRuZS5pZGRuczpj
b2ZvYi5kZXY/dHlwZT1UWFQACgkQNBo2kprErCnAKgEAhNzHPyF7skLtYcpf3mIz
53nELbPARdZMLYm0IVlL9YEBAJh6LvrIcpIAPzSN3Y5drUHM8Q7MVeeFR7PKWy7V
rFgPzjMEZlc4mBYJKwYBBAHaRw8BAQdAmxIo60pEz35u8KzqKKg6txrIx2x3BpA3
+UkBAmRcT7DCfgQYFgoAJhYhBATu8Lo7hXsGWjJgZzQaNpKaxKwpBQJmVziYAhsg
BQkJZgGAAAoJEDQaNpKaxKwpteIA/iSGWlevCangJtIno3vo+nJLFPmnO4t3WB4T
+ems1wrEAQDVtgQUxmnQOL+n2KceDZmeiQKbzrN3sxzpWAULMnPcBM44BGZXOIcS
CisGAQQBl1UBBQEBB0BJdI9b+CYMc/PKPPPwJrUeMSPw0YWPvmNc9uhnslYmLgMB
CAfCfgQYFgoAJhYhBATu8Lo7hXsGWjJgZzQaNpKaxKwpBQJmVziHAhsMBQkJZgGA
AAoJEDQaNpKaxKwpZM8BAIdGfLk2X3uOkCtPHOPwQDw/ZcEm0Wfcemr9PzG8ffHN
AQCyXEBYNr49yJWsqHrVjFiswkl3IsJpvT1a5FYGOIfUBA==
=NHeW
-----END PGP PUBLIC KEY BLOCK-----

-----BEGIN PGP PUBLIC KEY BLOCK-----
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
