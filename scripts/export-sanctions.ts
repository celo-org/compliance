import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const DATA_PATH = join(__dirname, "data", "processed-urls.json");
const EXPORT_PATH = join(__dirname, "..", "ofac.sanctions.json");
const TYPESCRIPT_PATH = join(__dirname, "..", "src", "ofac.sanctions.ts");

(async function main() {
  const processedURLs: Record<string, string[]> = JSON.parse(
    (await readFile(DATA_PATH)).toString()
  );
  const existingAddresses = new Set(
    JSON.parse((await readFile(EXPORT_PATH)).toString()) as string[]
  );

  const processedAddresses = new Set(Object.values(processedURLs).flat());

  const mergedList = processedAddresses.union(existingAddresses);
  const diff = mergedList.size - existingAddresses.size;
  if (diff > 0) {
    console.info("Updated ofac.sanctions.json with", diff, "new addresses");
    const output = [...mergedList].sort();

    // NOTE: keep 2 indent for ease of diffing
    await writeFile(EXPORT_PATH, JSON.stringify(output, null, 2) + "\n");
    await writeFile(
      TYPESCRIPT_PATH,
      `export const SANCTIONED_ADDRESSES = ${JSON.stringify(
        output,
        null,
        2
      )} as const;
`
    );
  } else {
    console.info(
      "No new addresses were found, ofac.sanctions.json wasn't updated"
    );
  }
})();
