// the-poster-for-a-place-that-i-2-20261121 entry (Node 22, standard library only).
// The image sits beside this file; the program places an identical copy at
// /output/entry.png. Running it twice writes the same bytes twice.
// The image is a travel poster for LUMENARA, a place that does not exist:
// the floating isles where giant lantern jellyfish drift over glass lagoons
// at dusk, under a low gold sun.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
if (!existsSync(source)) {
  console.error("entry.png missing beside main.ts");
  process.exit(1);
}
const destDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
// Guard: fail early if the poster exceeds the competition caps
// (1024x1024 pixels, 1,048,576 bytes) instead of shipping a bad copy.
const png = readFileSync(source);
const MAX_BYTES = 1048576;
if (png.length > MAX_BYTES) {
  console.error(`entry.png is ${png.length} bytes, over the 1,048,576 byte cap`);
  process.exit(1);
}
if (png.length < 24 || png.readUInt32BE(12) !== 0x49484452) {
  console.error("entry.png is not a valid PNG");
  process.exit(1);
}
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  console.error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
  process.exit(1);
}
mkdirSync(destDir, { recursive: true });
const dest = join(destDir, "entry.png");
cpSync(source, dest);
// Verify the copy is byte-identical before reporting success.
const digest = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
if (digest(source) !== digest(dest)) {
  console.error("entry.png copy failed integrity check");
  process.exit(1);
}
console.log("wrote " + dest + " sha256:" + digest(dest));
