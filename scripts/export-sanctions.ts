import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const DATA_PATH = join(__dirname, "data", "processed-urls.json");
const EXPORT_PATH = join(__dirname, "..", "ofac.sanctions.json");
const TYPESCRIPT_PATH = join(__dirname, "..", "src", "list.ts");

(async function main() {
  const processedURLs: Record<string, string[]> = JSON.parse(
    (await readFile(DATA_PATH)).toString()
  );
  const existingAddresses: string[] = JSON.parse(
    (await readFile(EXPORT_PATH)).toString()
  );

  const processedAddresses = Object.values(processedURLs).flat();

  const mergedList = [
    ...new Set(processedAddresses.concat(existingAddresses)),
  ].sort();

  const diff = mergedList.length - existingAddresses.length;
  if (diff > 0) {
    console.info("Updated ofac.sanctions.json with", diff, "new addresses");

    // NOTE: keep 2 indent for ease of diffing
    await writeFile(EXPORT_PATH, JSON.stringify(mergedList, null, 2) + "\n");
    await writeFile(
      TYPESCRIPT_PATH,
      `export const SANCTIONED_ADDRESSES = ${JSON.stringify(
        mergedList,
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
