import { writeFile, readFile } from "fs/promises";
import { join } from "path";

import { JSDOM } from "jsdom";

const DATA_PATH = join(__dirname, "data/processed-urls.json");

/*
This script is not meant to be run on CI but is a ad hoc script to run locally
to verify if the saved datasets look correct, feel free to modify as needed.
*/

(async function main() {
  const processedURLs: Record<string, string[]> = JSON.parse(
    (await readFile(DATA_PATH)).toString()
  );

  for (let [link, savedAddresses] of Object.entries(processedURLs)) {
    try {
      const body = await fetch(link).then((x) => x.text());
      const dom = new JSDOM(body);
      const text =
        dom.window.document.getElementById("block-ofac-content")?.textContent;
      if (!text) throw new Error("Couldn't find the right div");

      const RE = /(0x[a-fA-F0-9]{40})/g;
      const matches = text.matchAll(RE);
      let newAddresses: string[] = [];
      if (!matches) {
        console.info("No ETH addresses were found");
        newAddresses = [];
      } else {
        newAddresses = [
          ...new Set([...matches].map(([, address]) => address.toLowerCase())),
        ];
      }

      const savedAddressesSet = new Set(...savedAddresses);
      const newAddressesSet = new Set(...newAddresses);
      if (
        savedAddressesSet.size !== newAddressesSet.size ||
        [...savedAddressesSet].some((x) => !newAddressesSet.has(x))
      ) {
        throw new Error(`DATA_SET at ${link} wrong`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  await writeFile(DATA_PATH, JSON.stringify(processedURLs, null, 2) + "\n");
})();
