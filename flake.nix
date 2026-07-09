{
  description = "Svelte-powered site";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs { inherit system; };
          cofob-dev = pkgs.callPackage ./package.nix { };
        in
        {
          devShells.default = pkgs.mkShell {
            packages = [ pkgs.nodejs_24 ];
          };

          packages.default = cofob-dev;
          packages.dockerImage = pkgs.dockerTools.buildLayeredImage {
            name = "cofob-dev";
            tag = "latest";
            contents = [ cofob-dev ];
            config = {
              Cmd = [ "${cofob-dev}/bin/cofob-dev" ];
              ExposedPorts = { "3000/tcp" = { }; };
            };
          };
        }
      );
}
