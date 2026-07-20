{ buildNpmPackage, importNpmLock, fetchurl, nodejs_24, bash }:

let
  designSystemRelease = builtins.fetchGit {
    url = "https://github.com/cofob/design-system.git";
    rev = "2cd131bce788b27da18a038d7f00e6157f92e3f2";
  };
  designSystemPackages = buildNpmPackage {
    pname = "cofob-design-system-consumer-packages";
    version = "0.1.1";

    src = designSystemRelease;
    nodejs = nodejs_24;
    npmDeps = importNpmLock {
      npmRoot = designSystemRelease;
    };
    npmConfigHook = importNpmLock.npmConfigHook;

    buildPhase = ''
      runHook preBuild
      npm run build --workspace @cofob/design-system-css
      npm run build --workspace @cofob/design-system-svelte
      runHook postBuild
    '';

    installPhase = ''
      runHook preInstall
      mkdir -p $out/design-system-css $out/design-system-svelte
      cp -r packages/design-system-css/dist packages/design-system-css/src $out/design-system-css/
      cp packages/design-system-css/package.json packages/design-system-css/LICENSE packages/design-system-css/README.md $out/design-system-css/
      cp -r packages/design-system-css/LICENSES $out/design-system-css/
      cp -r packages/design-system-svelte/dist $out/design-system-svelte/
      cp packages/design-system-svelte/package.json packages/design-system-svelte/LICENSE packages/design-system-svelte/README.md $out/design-system-svelte/
      mkdir -p $out/node_modules/@cofob
      ln -s $out/design-system-css $out/node_modules/@cofob/design-system-css
      runHook postInstall
    '';
  };
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
      "node_modules/@cofob/design-system-css" = "${designSystemPackages}/design-system-css";
      "node_modules/@cofob/design-system-svelte" = "${designSystemPackages}/design-system-svelte";
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
