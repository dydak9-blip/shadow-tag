#!/usr/bin/env bash
# Copies the web game into the app's assets with libraries bundled locally.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$HERE/.."; OUT="$HERE/app/src/main/assets"; LIBS="$HERE/.libs"
mkdir -p "$OUT/lib" "$LIBS"
if [ ! -d "$LIBS/node_modules/jsqr" ]; then (cd "$LIBS" && npm i --silent three@0.128.0 qrcode-generator@1.4.4 peerjs@1.5.4 jsqr@1.4.0 >/dev/null); fi
cp "$LIBS/node_modules/three/build/three.min.js" "$OUT/lib/three.min.js"
cp "$LIBS/node_modules/qrcode-generator/qrcode.js" "$OUT/lib/qrcode.min.js"
cp "$LIBS/node_modules/peerjs/dist/peerjs.min.js" "$OUT/lib/peerjs.min.js"
cp "$LIBS/node_modules/jsqr/dist/jsQR.js" "$OUT/lib/jsQR.js"
sed -e 's#https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js#lib/three.min.js#' \
    -e 's#https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js#lib/qrcode.min.js#' \
    -e 's#https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js#lib/peerjs.min.js#' \
    -e 's#https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js#lib/jsQR.js#' \
    "$ROOT/play/index.html" > "$OUT/index.html"
grep -c 'src="lib/' "$OUT/index.html"
