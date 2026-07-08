import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, ".vercel", "output");
const staticDir = join(output, "static");
const entries = ["index.html", "css", "data", "js"];

await rm(output, { recursive: true, force: true });
await mkdir(staticDir, { recursive: true });

for (const entry of entries) {
  const source = join(root, entry);
  if (existsSync(source)) {
    await cp(source, join(staticDir, entry), { recursive: true });
  }
}

const publicDir = join(root, "public");
if (existsSync(publicDir)) {
  await cp(publicDir, staticDir, { recursive: true });
}

await writeFile(
  join(output, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index.html" },
      ],
    },
    null,
    2
  )
);
