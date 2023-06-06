import { parseArgs, ParseArgsConfig } from "node:util";
import { Logger } from "./logger";
import { seedCore } from "../seed";

export const seed = async () => {
  const options = {
    debug: {
      type: "boolean",
      short: "d",
      default: false,
    },
  } satisfies ParseArgsConfig["options"];

  const args = parseArgs({
    options,
    allowPositionals: false,
  });

  await seedCore(args.values.debug).catch((error) => {
    Logger.error("Unhandled error", error);
    process.exit(1);
  });
};
