{ buildNpmPackage, importNpmLock, fetchurl, nodejs_24, bash }:

let
  cookieTarball = fetchurl {
    url = "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz";
    hash = "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==";
  };
  packageJson = builtins.fromJSON (builtins.readFile ./package.json);
  nixPackageJson = packageJson // {
    overrides = packageJson.overrides // {
      "@sveltejs/kit" = packageJson.overrides."@sveltejs/kit" // {
        cookie = "file:${cookieTarball}";
      };
    };
  };
in
buildNpmPackage {
  pname = "cofob-dev";
  version = "0.1.0";

  src = ./.;

  nodejs = nodejs_24;
  npmDeps = importNpmLock {
    npmRoot = ./.;
    package = nixPackageJson;
    packageSourceOverrides = {
      "node_modules/cookie" = cookieTarball;
    };
  };
  npmConfigHook = importNpmLock.npmConfigHook;

  installPhase = ''
    runHook preInstall

    cp -r build $out
    cp -r node_modules $out/
    cp ${./package.json} $out/package.json

    mkdir -p $out/bin
    cat <<EOF > $out/bin/cofob-dev
    #!${bash}/bin/bash
    exec ${nodejs_24}/bin/node $out/index.js
    EOF
    chmod +x $out/bin/cofob-dev

    runHook postInstall
  '';
}
