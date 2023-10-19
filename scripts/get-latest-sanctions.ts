import { writeFile, readFile } from "fs/promises";
import { join } from "path";

import Parser from "rss-parser";
import { JSDOM } from "jsdom";

const DATA_PATH = join(__dirname, "data/processed-urls.json");
const OFAC_RSS_URL = "https://ofac.treasury.gov/system/files/126/ofac.xml";
const parser = new Parser();

(async function main() {
  const feed = await parser.parseURL(OFAC_RSS_URL);

  const processedURLs: Record<string, string[]> = JSON.parse(
    (await readFile(DATA_PATH)).toString()
  );

  for (let { link } of feed.items) {
    if (!link) continue;
    if (link in processedURLs) continue;

    try {
      const body = await fetch(link).then((x) => x.text());
      const dom = new JSDOM(body);
      const text =
        dom.window.document.getElementById("block-ofac-content")?.textContent;
      if (!text) throw new Error("Couldn't find the right div");

      const RE = /(0x[a-fA-F0-9]{40})/g;
      const matches = text.matchAll(RE);
      if (!matches) {
        console.info("No ETH addresses were found");
        processedURLs[link] = [];
      } else {
        processedURLs[link] = [
          ...new Set([...matches].map(([, address]) => address.toLowerCase())),
        ];
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.info(
        "Processed",
        link,
        "Found",
        processedURLs[link].length,
        "addresses"
      );
    }
  }

  await writeFile(DATA_PATH, JSON.stringify(processedURLs, null, 2) + "\n");
})();
