import { parseArgs } from "node:util";

import { env } from "../utils/env.js";
import { Logger } from "./logger.js";
import { createBQClient } from "./bq-client.js";

const { DEFAULT_DATASET_ID } = env;

async function exec(datasetId: string, tableId: string) {
  const bigquery = createBQClient();

  const dataset = bigquery.dataset(datasetId);
  const [table] = await dataset.table(tableId).get();

  Logger.info("Table:");
  Logger.log(table.metadata.tableReference);
}

export function queryTable() {
  const args = parseArgs({
    options: {
      dataset: {
        type: "string",
        short: "d",
        default: DEFAULT_DATASET_ID,
      },
      input: {
        type: "string",
        short: "i",
      },
      debug: {
        type: "boolean",
        default: false,
        short: "d",
      },
    },
    allowPositionals: true,
  });

  const { debug, input, dataset: datasetId } = args.values;
  const positional = args.positionals[0];

  if (debug) {
    Logger.debug({ input, datasetId, positional });
  }

  const tableId = input || positional;

  if (!tableId) {
    Logger.error("Missing table id", '"--input or -i"');
    process.exit(1);
  }

  if (!datasetId) {
    Logger.error("Missing dataset id", '"--dataset or -d"');
    process.exit(1);
  }

  exec(datasetId, tableId).catch((e) => {
    Logger.error("Unhandled error", e);
    process.exit(1);
  });
}
