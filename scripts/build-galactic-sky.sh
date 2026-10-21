#!/usr/bin/env bash
# Regenerates static/images/galactic-sky-4k.webp (background of the black hole view).
#
# Source: NASA SVS "Deep Star Maps 2020" (https://svs.gsfc.nasa.gov/4851/), galactic
# coordinates (Sgr A* at image centre, longitude increasing to the left).
# Credit: NASA/Goddard Space Flight Center Scientific Visualization Studio.
# Gaia DR2: ESA/Gaia/DPAC; Tycho-2: ESA/Hipparcos. Public domain (NASA).
#
# Encoding: v = (linear / 6.45)^0.4  ->  shader decodes linear = pow(v, 2.5) * 6.45
# Requires: curl, ImageMagick with OpenEXR + WebP support.
set -euo pipefail

OUT="$(dirname "$0")/../static/images/galactic-sky-4k.webp"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

curl -fL -o "$TMP/map.exr" \
  https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004851/starmap_2020_4k_gal.exr

magick "$TMP/map.exr" \
  -evaluate multiply 0.15503876 -evaluate pow 0.4 \
  -depth 8 -quality 80 "$OUT"

ls -la "$OUT"
