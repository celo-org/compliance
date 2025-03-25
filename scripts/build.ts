import { BuildConfig } from "bun";
import { resolve } from "path";

const root = resolve(__dirname, "..");
const opts = {
  entrypoints: [resolve(root, "src")],
  sourcemap: "linked",
  splitting: true,
} as BuildConfig;

await Promise.all([
  Bun.build({
    ...opts,
    outdir: resolve(root, "lib/esm"),
    format: "esm",
  }),
  await Bun.build({
    ...opts,
    outdir: resolve(root, "lib/cjs"),
    format: "cjs",
  }),
]);

export {};
