import process from "node:process";
import { Logger } from "./logger.js";
import { help } from "./commands/help.js";
import { queryTable } from "./commands/query-table.js";
import { seed } from "./commands/seed.js";
import { query } from "./commands/query.js";
import { loadCSV } from "./commands/load-csv.js";

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
