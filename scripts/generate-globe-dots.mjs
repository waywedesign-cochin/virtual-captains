// Build-time generator for the dotted globe in CrossCountry.tsx.
//
// Samples an evenly-spaced grid over the sphere, keeps the points that land on
// a continent, and writes them out as a plain array. Doing this ahead of time
// means the runtime ships no geo dependency at all — just numbers.
//
//   node scripts/generate-globe-dots.mjs
//
// Deps (devDependencies only): d3-geo, topojson-client, world-atlas.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { geoContains } from "d3-geo";
import * as topojson from "topojson-client";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const topo = JSON.parse(
  fs.readFileSync(path.join(root, "node_modules/world-atlas/land-110m.json"), "utf8"),
);
const land = topojson.feature(topo, topo.objects.land);

// Longitude samples per band scale with cos(latitude) so dots stay roughly
// equidistant on the sphere instead of bunching up towards the poles.
const LAT_STEP = 1.6;
const dots = [];

for (let lat = -84; lat <= 84; lat += LAT_STEP) {
  const count = Math.max(
    1,
    Math.round((360 / LAT_STEP) * Math.cos((lat * Math.PI) / 180)),
  );
  for (let i = 0; i < count; i++) {
    const lon = -180 + (360 * i) / count;
    if (geoContains(land, [lon, lat])) {
      dots.push([Math.round(lon * 10) / 10, Math.round(lat * 10) / 10]);
    }
  }
}

const out = `// GENERATED FILE — do not edit by hand.
// Run \`node scripts/generate-globe-dots.mjs\` to regenerate.
// Evenly-spaced land points on the sphere as [longitude, latitude] pairs.

export const LAND_DOTS: readonly (readonly [number, number])[] = ${JSON.stringify(dots)};
`;

const dest = path.join(root, "app/components/home/globeDots.ts");
fs.writeFileSync(dest, out);
console.log(
  `${dots.length} land dots -> ${path.relative(root, dest)} (${(out.length / 1024).toFixed(1)} KB)`,
);
