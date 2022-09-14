{
  description = "Svelte-powered site";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        yarn18 = pkgs.yarn.overrideAttrs (old: { buildInputs = [ pkgs.nodejs-18_x ]; });
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs-18_x
            yarn18
          ];
        };
      }
    );
}
