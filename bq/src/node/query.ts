import { parseArgs } from "node:util";
import fs from "node:fs";

import { Logger } from "./logger.js";
import { createBQClient } from "./bq-client.js";

const getSQLfromFile = (sqlPath: string) => {
  if (!fs.existsSync(sqlPath)) {
    Logger.error("SQL file not found");
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, "utf-8");

  return `"${sql.trim()}"`;
};

async function exec(sql: string) {
  const bigquery = createBQClient();

  const options = {
    query: sql,
    location: "US",
  };

  const [job] = await bigquery.createQueryJob(options);
  Logger.info(`Job ${job.id} started.`);

  const [rows] = await job.getQueryResults();

  Logger.info("Rows:");
  rows.forEach((row) => console.log(row));
}

export async function query() {
  const args = parseArgs({
    options: {
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

  const { input, debug } = args.values;
  const positional = args.positionals[0];

  if (debug) {
    Logger.debug({ input, positional });
  }

  const srcPath = input || positional;

  if (!srcPath) {
    Logger.error("Missing SQL file path");
    process.exit(1);
  }

  const sql = getSQLfromFile(srcPath);

  exec(sql).catch((e) => {
    Logger.error("Unhandled error", e);
    process.exit(1);
  });
}
