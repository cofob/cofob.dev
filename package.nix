{ buildNpmPackage, nodejs, bash, gzip, brotli }:

buildNpmPackage {
  pname = "cofob-dev";
  version = "0.1.0";

  src = ./.;

  nodejs = nodejs;

  npmDepsHash = "sha256-LVCMhQ9h47H6u7yr5ihfqw2FoD2oFKclp1ooelq9SSU=";

  postBuild = ''
    # compress static
    find build/client/static -type f -print0 | xargs -0 -I{} \
      sh -c "${gzip}/bin/gzip -c --best {} > {}.gz && ${brotli}/bin/brotli -c --best {} > {}.br"
  '';

  installPhase = ''
    cp -r build $out
    cp -r node_modules $out/
    cp package.json $out/

    mkdir $out/bin
    cat <<EOF > $out/bin/cofob-dev
      #!${nodejs}/bin/node $out/index.js
    EOF
    chmod u+x $out/bin/cofob-dev
  '';
}
