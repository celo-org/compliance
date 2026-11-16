import { join } from "path";
import { writeFile, readFile } from "fs/promises";

import { XMLParser } from "fast-xml-parser";
import { SDNList } from "./types";

const DATA_PATH = join(__dirname, "data/processed-urls.json");
const SDN_XML_URL =
  "https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML";

// Read the whole body in memory (~30 MB). Streaming it to disk via
// writeFile(Readable.fromWeb(...)) writes extra bytes on Bun >= 1.4.0.
const downloadFile = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error while downloading ${url}: HTTP ${res.status}`);
  }
  const file = Buffer.from(await res.arrayBuffer());

  const byteLength = parseInt(res.headers.get("content-length") ?? "", 10);
  if (!Number.isNaN(byteLength) && file.byteLength !== byteLength) {
    throw new Error(
      `Error while downloading the file, byteLength mismatch (online: ${byteLength} vs local: ${file.byteLength})`
    );
  }
  console.log(`Downloaded ${url} (size: ${(file.byteLength / 1024 / 1024).toFixed(2)}MB)`);

  return file;
};

const parser = new XMLParser({
  numberParseOptions: {
    hex: false,
    leadingZeros: false,
  },
});

(async function main() {
  const xmlFile = await downloadFile(SDN_XML_URL);
  const { sdnList } = (await parser.parse(xmlFile.toString())) as {
    sdnList: SDNList;
  };

  const allIdLists = sdnList.sdnEntry
    .filter((x) => x.idList)
    .flatMap((x) => (Array.isArray(x.idList.id) ? x.idList.id : [x.idList.id]));

  const allETHAddresses = new Set(
    allIdLists
      .filter(({ idType }) =>
        idType
          .toLowerCase()
          .startsWith("Digital Currency Address - ETH".toLowerCase())
      )
      .map(({ idNumber }) => idNumber.toLowerCase())
  );

  const processedPublications: Record<string, string[]> = JSON.parse(
    (await readFile(DATA_PATH)).toString() || "{}"
  );
  const existingAddresses = new Set(Object.values(processedPublications));

  const newAddresses = allETHAddresses.difference(existingAddresses);
  if (!newAddresses.size) {
    console.info("No ETH addresses were found");
    processedPublications[sdnList.publshInformation.Publish_Date] = [];
  } else {
    processedPublications[sdnList.publshInformation.Publish_Date] = [
      ...newAddresses,
    ];
  }

  console.info(
    "Processed",
    sdnList.publshInformation.Publish_Date,
    "Found",
    newAddresses.size,
    "addresses"
  );

  await writeFile(
    DATA_PATH,
    JSON.stringify(processedPublications, null, 2) + "\n"
  );
})();
