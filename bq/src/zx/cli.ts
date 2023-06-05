import { $, fs, spinner, echo, argv } from "zx";

import { showHelp } from "./help.js";
import { Logger } from "./logger.js";
import { seed } from "./seed.js";
import { DEFAULT_GLOBAL_OPTIONS, GlobalOptions } from "../utils/option.js";

const BQ_COMMANDS = ["ls", "shell", "head", "show", "query", "version"];
const BQZX_COMMANDS = ["help", "sql", "seed"];
const SUPPORTED_COMMANDS = [...BQ_COMMANDS, ...BQZX_COMMANDS];
type SupportedCommands = (typeof SUPPORTED_COMMANDS)[number];

/**
 * execute original bq command
 */
export async function exec({
  globalOptions,
  cmd = "help",
  targets,
  subOptions,
  debug = false,
}: {
  globalOptions: GlobalOptions;
  cmd: SupportedCommands;
  targets?: string[];
  subOptions?: Record<string, string>;
  debug?: boolean;
}) {
  const [globalOptionsStrings, subOptionsStrings] = [globalOptions, subOptions]
    .filter((option): option is Record<string, string> => Boolean(option))
    .map((option) => Object.entries(option).map(([k, v]) => `--${k}=${v}`));

  if (debug) {
    Logger.debug("dryrun");
    console.log(`bq ${globalOptionsStrings} ${cmd} ${targets} ${subOptionsStrings}`);
    process.exit(0);
  }

  return await $`bq ${globalOptionsStrings} ${cmd} ${targets} ${subOptionsStrings}`;
}

export const getSQLfromFile = (sqlPath: string) => {
  if (!fs.existsSync(sqlPath)) {
    Logger.error("SQL file not found");
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, "utf-8");

  return `"${sql.trim()}"`;
};

const validateOptions = ({ targets, globalOptions }: { globalOptions: GlobalOptions; targets: string[] }) => {
  if (targets.some((t) => t.startsWith("--"))) {
    Logger.error("Cannot parse options after --");
    process.exit(1);
  }

  const mergedGlobalOptions = {
    api: globalOptions.api ?? DEFAULT_GLOBAL_OPTIONS.api,
    project_id: globalOptions.project_id ?? DEFAULT_GLOBAL_OPTIONS.project_id,
  };
  const missingOptions = Object.keys(mergedGlobalOptions).filter(
    (k) => globalOptions[k as keyof GlobalOptions] === undefined
  );

  if (missingOptions.length > 0) {
    Logger.error("Missing required options", missingOptions);
    process.exit(1);
  }

  return globalOptions;
};

const sql = async ({
  globalOptions,
  targets,
  subOptions,
  debug,
}: {
  globalOptions: GlobalOptions;
  targets: string[];
  subOptions: Record<any, string>;
  debug?: boolean;
}) => {
  if (targets.length !== 1) {
    Logger.error("Specify only a SQL file");
    process.exit(1);
  }

  const query = getSQLfromFile(targets[0]);

  if (debug) {
    Logger.log(query);
  }

  const output = await spinner("[bg-zx] Running...", () =>
    exec({ globalOptions, cmd: "query", targets: [query], subOptions, debug })
  );
  echo(output);
};

async function main() {
  // @see https://www.npmjs.com/package/minimist
  const { _, "--": __, api, project_id, debug, ...subOptions } = argv;

  const globalOptions: GlobalOptions = { api, project_id };
  const [cmd, ...targets] = __ ?? _;

  if (!SUPPORTED_COMMANDS.includes(cmd)) {
    Logger.error("Unsupported command", cmd);
    showHelp();
    process.exit(1);
  }

  if (cmd === "help") {
    showHelp();
    process.exit(0);
  }

  if (cmd === "seed") {
    await seed(debug);
    process.exit(0);
  }

  // ---------use bq commands-----------

  if (debug) {
    Logger.debug("args");
    console.table({ cmd, api, project_id, targets: targets.join(", "), subOptions });
  }

  const mergedGlobalOptions = validateOptions({ globalOptions, targets });

  if (cmd === "sql") {
    await sql({ globalOptions: mergedGlobalOptions, targets, subOptions, debug });
    process.exit(0);
  }

  // execute original bq commands
  const output = await spinner("[bg-zx] Running...", () =>
    exec({ globalOptions: mergedGlobalOptions, cmd, targets, subOptions, debug })
  );
  echo(output);
}

main().catch((e) => {
  Logger.error("Unhandled error", e);
  process.exit(1);
});
