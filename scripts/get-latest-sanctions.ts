import { exists, mkdir } from "fs/promises";
import { Readable } from "stream";
import { join, resolve } from "path";
import { writeFile, readFile } from "fs/promises";

import { XMLParser } from "fast-xml-parser";
import { ReadableStream } from "stream/web";
import { SDNList } from "./types";
import { unlink } from "fs/promises";
import { stat } from "fs/promises";

const DATA_PATH = join(__dirname, "data/processed-urls.json");
const SDN_XML_URL =
  "https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML";

function printProgress(fileName: string) {
  let lastRun = 0;
  let lastProgress = 0;
  return (progress: number, total: number, startTime: number) => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    // Time calculations
    const ellapsedSinceStart = (Date.now() - startTime) / 1000;
    let ellapsedStr = `${ellapsedSinceStart.toFixed(2)}s`;
    if (ellapsedSinceStart > 60) {
      const m = Math.floor(ellapsedSinceStart / 60);
      const s = ellapsedSinceStart - m * 60;
      ellapsedStr = `${m}m${s.toFixed(0)}s`;
    }

    // Speed calculations
    const ellapsedSinceLastRun = (Date.now() - lastRun) / 1000;
    let bytesInEllapsed = progress - lastProgress;
    let speed = bytesInEllapsed / ellapsedSinceLastRun;
    let unit = "";
    if (speed > 1024) {
      speed /= 1024;
      unit = "K";
    }
    if (speed > 1024) {
      speed /= 1024;
      unit = "M";
    }

    // Percentage calculations
    const pct = ((progress / total) * 100).toFixed(2);

    process.stdout.write(
      `Downloading ${fileName}… ${pct}% - ${ellapsedStr} - ${speed.toFixed(
        2
      )} ${unit}B/s`
    );

    lastRun = Date.now();
    lastProgress = progress;
  };
}

const downloadFile = async (url: string, fileName: string) => {
  const res = await fetch(url);
  if (!(await exists("tmp"))) {
    await mkdir("tmp");
  }
  const destination = resolve("tmp", fileName);
  await unlink(destination).catch(() => {
    /* noop */
  });
  const fetchStream = Readable.fromWeb(res.body as ReadableStream);
  let start = Date.now();
  const byteLength = parseInt(res.headers.get("content-length")!, 10);

  let watcher: Timer | undefined;
  if (!process.env.CI) {
    const pp = printProgress(fileName);
    const watcher = setInterval(async () => {
      const downloadedBytes = (await stat(destination)).size;
      pp(downloadedBytes, byteLength, start);
    }, 500);
  }

  await writeFile(destination, fetchStream);

  if (watcher !== undefined) {
    clearInterval(watcher);
  }

  const file = await readFile(destination);

  if (file.byteLength !== byteLength) {
    throw new Error(
      `Error while downloading the file, byteLength mismatch (online: ${byteLength} vs local: ${file.byteLength}`
    );
  }
  console.log(
    `\nDownloaded ${fileName} to ${destination} (size: ${(
      byteLength /
      1024 /
      1024
    ).toFixed(2)}MB)`
  );

  return file;
};

const parser = new XMLParser({
  numberParseOptions: {
    hex: false,
    leadingZeros: false,
  },
});

(async function main() {
  const xmlFile = await downloadFile(SDN_XML_URL, "sdn.xml");
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
