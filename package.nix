{ buildNpmPackage, nodejs, bash }:

buildNpmPackage {
  pname = "cofob-dev";
  version = "0.1.0";

  src = ./.;

  nodejs = nodejs;

  npmDepsHash = "sha256-LVCMhQ9h47H6u7yr5ihfqw2FoD2oFKclp1ooelq9SSU=";

  installPhase = ''
    cp -r build $out
    cp -r node_modules $out/
    cp package.json $out/

    mkdir $out/bin
    cat <<EOF > $out/bin/cofob-dev
      #!${bash}/bin/bash
      ${nodejs}/bin/node $out/index.js
    EOF
    chmod u+x $out/bin/cofob-dev
  '';
}
