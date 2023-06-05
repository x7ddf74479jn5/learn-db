import process from "node:process";
import { Logger } from "./logger";
import { help } from "./help";
import { queryTable } from "./query-table";
import { seed } from "./seed";
import { query } from "./query";
import { loadCSV } from "./load-csv";

async function run(cmd: string) {
  switch (cmd) {
    case "seed": {
      await seed();
      break;
    }
    case "query": {
      await query();
      break;
    }
    case "query-table": {
      await queryTable();
      break;
    }
    case "load-csv": {
      await loadCSV();
      break;
    }
    case "help": {
      await help();
      break;
    }
    default: {
      Logger.error("Unknown command", cmd);
      await help();
      break;
    }
  }
}

const cmd = process.argv[2];

run(cmd).catch((e) => {
  console.error(Logger.error("Unhandled error", e));
  process.exit(1);
});
