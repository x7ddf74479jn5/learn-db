import path from "node:path";
import fs from "node:fs";
import { parseArgs } from "node:util";

import { env } from "../utils/env.js";
import { JobLoadMetadata } from "@google-cloud/bigquery";
import { createBQClient } from "./bq-client.js";
import { Logger } from "./logger.js";

const { DEFAULT_DATASET_ID } = env;

async function exec({ datasetId, tableId, srcPath }: { datasetId: string; tableId: string; srcPath: string }) {
  const bigquery = createBQClient();
  const metadata: JobLoadMetadata = {
    sourceFormat: "CSV",
    autodetect: true,
  };

  const [job] = await bigquery.dataset(datasetId).table(tableId).load(srcPath, metadata);

  console.log(`Job ${job.id} completed.`);

  const errors = job.status?.errors;
  if (errors && errors.length > 0) {
    throw errors;
  }
}
export function loadCSV() {
  const args = parseArgs({
    options: {
      dataset: {
        type: "string",
        short: "d",
        default: DEFAULT_DATASET_ID,
      },
      table: {
        type: "string",
        short: "t",
      },
      src: {
        type: "string",
        short: "s",
        default: [],
        multiple: true,
      },
      debug: {
        type: "boolean",
        default: false,
        short: "d",
      },
    },
    allowPositionals: true,
  });

  const { debug, table: tableId, dataset: datasetId, src } = args.values;
  const positionals = args.positionals;

  if (debug) {
    Logger.debug({ tableId, datasetId, src: src?.join(", "), positionals: positionals.join(", ") });
  }

  if (!tableId) {
    Logger.error("Missing table id", '"--table or -t"');
    process.exit(1);
  }

  if (!datasetId) {
    Logger.error("Missing dataset id", '"--dataset or -d"');
    process.exit(1);
  }

  const entries = src ? src : positionals;

  const getCSVPaths = () => {
    const filePaths: string[] = [];
    const getFilePaths = (path: string[]) => {
      for (const entry of entries) {
        const stats = fs.statSync(entry);

        if (stats.isDirectory()) {
          getFilePaths(fs.readdirSync(entry));
        } else if (stats.isFile()) {
          filePaths.push(entry);
        }
      }
    };

    getFilePaths(entries);

    const csvPaths = filePaths.filter((f) => path.extname(f) === ".csv");

    return csvPaths;
  };

  const csvPaths = getCSVPaths();

  for (const srcPath of csvPaths) {
    exec({ datasetId, tableId, srcPath }).catch((e) => {
      Logger.error("Unhandled error", e);
      process.exit(1);
    });
  }
}
