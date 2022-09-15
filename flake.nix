{
  description = "Svelte-powered site";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    bp.url = "github:serokell/nix-npm-buildpackage";
    bp.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, bp, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        node = pkgs.nodejs-18_x;
        yarn18 = pkgs.yarn.overrideAttrs (old: { buildInputs = [ node ]; });
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            node
            yarn18
          ];
        };
        packages.default = bp.legacyPackages.x86_64-linux.buildYarnPackage {
          src = ./.;
          installPhase = ''
            yarn build
            rm -rf node_modules/
            cat <<-END >> .yarnrc
              yarn-offline-mirror "$PWD/yarn-cache"
              nodedir "${node}"
            END
            yarn install --production --cache-folder "$PWD/yarn-cache" || true
            cp -r build $out/
            cp -r node_modules $out/
            cp package.json $out/
            cp yarn.lock $out/
            mkdir $out/bin
            cat <<EOF > $out/bin/cofob-ru
            #!${pkgs.bash}/bin/bash
            cd $out
            ${node}/bin/node $out/index.js
            EOF
            chmod u+x $out/bin/cofob-ru
          '';
        };
      }
    );
}
