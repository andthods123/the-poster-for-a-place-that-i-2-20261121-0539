// the-poster-for-a-place-that-i-2-20261121 entry (Node 22, standard library only).
// The image sits beside this file; the program places an identical copy at
// /output/entry.png. Running it twice writes the same bytes twice.
// The image is a travel poster for LUMENARA, a place that does not exist:
// the floating isles where giant lantern jellyfish drift over glass lagoons
// at dusk, under a low gold sun.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
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
