{ buildNpmPackage, importNpmLock, nodejs_24, bash }:

buildNpmPackage {
  pname = "cofob-dev";
  version = "0.1.0";

  src = ./.;

  nodejs = nodejs_24;
  npmDeps = importNpmLock {
    npmRoot = ./.;
  };
  npmConfigHook = importNpmLock.npmConfigHook;

  installPhase = ''
    runHook preInstall

    cp -r build $out
    cp -r node_modules $out/
    cp package.json $out/

    mkdir -p $out/bin
    cat <<EOF > $out/bin/cofob-dev
    #!${bash}/bin/bash
    exec ${nodejs_24}/bin/node $out/index.js
    EOF
    chmod +x $out/bin/cofob-dev

    runHook postInstall
  '';
}
